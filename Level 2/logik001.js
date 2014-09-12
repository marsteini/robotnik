var GAME_VERSION="ver 0.00001 - 28.8.14, 18:00";

var stage, background, waste, box, boxOpen, key, door, queue, loaded = "", backgroundMusic, ventil;
var wasteSND, lockedDoorSND, ventilSND, unlockSND;
// game logic 
var isWasteCleared=false;
var isBoxOpen=false;
var isDoorLocked=true;
var isDoorOpen=false;

// important for key drag and drop
var isDraggingKey=false;
    
const BOX_X=640,BOX_Y=205;
const X_CLEARED= 640;

const KEY_X=BOX_X+65, KEY_Y=BOX_Y+50;
const DOOR_X=815,DOOR_Y=525;
var FX_VOLUME = 0.6, MUSIC_VOLUME = 0.8;

function preloadAssets() {
    queue = new createjs.LoadQueue();
    
        
    // enables local development: deactivate for web Build - felix
    queue.setUseXHR(false);
    
    queue.installPlugin(createjs.Sound);
    queue.addEventListener("fileload", handleFileLoad);
    queue.addEventListener("fileprogress", updateProgress);
    queue.addEventListener("complete", handleComplete);
    queue.addEventListener("error", handleError);
    
    queue.loadManifest([
        {id:"background", src:"assets/background.png"},
        {id:"waste", src:"assets/waste.png"},
        {id:"boxOpen", src:"assets/boxOpen.png"},
        {id:"boxClosed", src:"assets/boxClosed.png"},
        {id:"key", src: "assets/schluessel.png"},
        {id:"door", src: "assets/door.png"},
        {id:"music", src:"assets/Music.mp3"},
        {id:"doorOpens", src:"assets/openDoor.wav"},
        {id:"doorCloses", src:"assets/shutDoor.mp3"},
        {id:"keySound", src: "assets/keySound.mp3"},
        {id:"ventil", src: "assets/ventil.png"},
                        
        {id:"lockedDoorSND", src: "assets/lockedDoor.wav"},
        {id:"wasteSND", src: "assets/moveDebris.wav"},
        {id:"ventilSND", src: "assets/ventil.wav"},
        {id:"unlockSND", src: "assets/unlock.wav"}

    ]);
}
function updateProgress(event) {
    document.getElementById("loadStatus").innerHTML = Math.round(event.progress*100,2) + "% loaded";
    //showMessage(Math.round(event.progress*100,2) + "% loaded", "load");
}
function handleFileLoad(event) {
    console.log("Loading " + event.item.id + " of type " + event.item.type);
    
    // beautiful switch-case for our loader - Felix
    
   switch(event.item.id){
       case "background":
           background = new createjs.Bitmap( event.result ); break;
       case "waste":
           waste = new createjs.Bitmap(event.result); break;
       case "boxOpen":
           boxOpen = new createjs.Bitmap(event.result);break;
       case "boxClosed":
           box = new createjs.Bitmap(event.result);break;
       case "key":
           key = new createjs.Bitmap(event.result);break;
       case"door":
           door = new createjs.Bitmap(event.result);break;
       case "ventil":
           ventil = new createjs.Bitmap(event.result);break;
           
    }
       
    loaded += "Asset [" + event.item.id + "] of type [" + event.item.type + "]"+"<br>";
    showMessage(loaded, "load");
}

function handleError(event) {
    console.error("There was an error loading " + event.item.id + " [type: "+event.item.type+"]");
}

function handleComplete() {
    document.getElementById("loadStatus").innerHTML = "All assets loaded successfully!";
    hideMessage();
    init();
}

function init() {
    initializeObjects();
    backgroundMusic = createjs.Sound.play("music",{loop:-1});
    backgroundMusic.setVolume(MUSIC_VOLUME);
    
    document.getElementById("music").value = MUSIC_VOLUME*100;
    document.getElementById("fx").value = FX_VOLUME*100;
    
    

    box.on("click", function(evt){
                
        if(isWasteCleared) {                   
            if(!isBoxOpen){                      
                openBox();              
            }               
        }              
        else {                 
            //showMessage("Oh no, the door is blocked by some waste. Clean up first!<br>-.-", "error"); 
            wobbleBox();
            

            
        } 
    
    });
    
    function wobbleBox() {
        createjs.Sound.play("wasteSND").setVolume(FX_VOLUME);
        
            newX = waste.x - 10;
            oldX = waste.x;
            console.log(waste.x + "-"+newX + "-" + oldX);

            createjs.Tween.get(waste)
                .to({x: newX},150)
                .wait(50)
                .to({x: oldX}, 150);
    
    
    boxOpen.on("click", function(evt){        
        if(isBoxOpen)closeBox();        
    })
    
    //
    // key
    
    
    key.on("pressmove",function(evt){
        evt.currentTarget.x=evt.stageX;
        evt.currentTarget.y=evt.stageY;
    })
    
    key.on("pressup",function(evt){        
        if(door.hitTest(evt.X,evt.Y)) unlockDoor();
        else returnKey();    
    })
    
    //
    // waste
    
    waste.on("mousedown",function(evt){
        createjs.Sound.play("wasteSND").setVolume(FX_VOLUME);
    })
    
    waste.on("pressmove",function(evt) {
 
        
            if(!isWasteCleared){                
                evt.currentTarget.x = evt.stageX;
                    if(evt.stageX < 600)        
                    evt.currentTarget.x = 600;
            
                if(evt.stageX > 730)
                evt.currentTarget.x = 730;
            //evt.currentTarget.y = evt.stageY;
   
    
            //stop dragging, when box is clear
                //Brauchen wir das wirklich? -steini
            if(evt.currentTarget.x<X_CLEARED){
                
                isWasteCleared=true;
            }
            }});
    
    waste.on("pressup", function() {
        if(!isWasteCleared) {
            wobbleBox();
        }
    });
    
    
    door.on("click",function(evt){
        if(isDoorLocked)        createjs.Sound.play("lockedDoorSND").setVolume(FX_VOLUME);
        else openDoor();}
        )
    
    ventil.on("click",function(evt){
        createjs.Sound.play("ventilSND").setVolume(FX_VOLUME);
    })
    
    
    
    
}

//
// initializers - graphic
//
function initializeObjects(){
    initializeStage();
    initializeBoxes();
    initializeWaste();
    initializeKey();
    initializeDoor();
    
    initializeVentil();
    
    stage.addChild(background,box,waste,door,ventil);
}


function initializeStage(){
    stage = new createjs.Stage(document.getElementById("canvas"));
    createjs.Ticker.addEventListener("tick", tick);
    createjs.Ticker.setFPS(60);
    createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCED;
}

function initializeBoxes(){
    //box = new createjs.Bitmap("assets/boxClosed.png");
    box.x = BOX_X;
    box.y = BOX_Y;
                   
    //boxOpen = new createjs.Bitmap("assets/boxOpen.png");              
    boxOpen.x=BOX_X;               
    boxOpen.y=BOX_Y;
}

function initializeWaste(){
    //waste = new createjs.Bitmap("assets/waste.png");
    waste.x = 720;
    waste.y = 287;
    waste.regX = 60;
    waste.regY = 42;
  
}

function initializeKey(){
    //key=new createjs.Bitmap("assets/schluessel.png");
    //Added regX, regY to center the key on dragging -steini
    key.regX = 8;
    key.regY = 25;
    key.x=KEY_X;
    key.y=KEY_Y;
}

function initializeDoor(){
    //door=new createjs.Bitmap("assets/door.png");
    door.x=DOOR_X;
    door.y=DOOR_Y;
    
}

function initializeVentil(){
    ventil.x=576;
    ventil.y=444,5;
}

//
// game functions
//

function openBox(){     
    createjs.Sound.play("doorOpens").setVolume(FX_VOLUME);
    stage.removeChild(box);    
    stage.addChild(boxOpen); 
    stage.addChild(key);
    isBoxOpen=true;
}

function closeBox(){    
    createjs.Sound.play("doorCloses").setVolume(FX_VOLUME);
    stage.removeChild(boxOpen);
    stage.removeChild(key);
    stage.addChild(box);
    isBoxOpen=false;
}
    
    function openDoor(){
        createjs.Sound.play("doorOpens").setVolume(FX_VOLUME);
    }

function unlockDoor(){
    createjs.Sound.play("unlockSND").setVolume(FX_VOLUME);
    isDoorLocked=false;
}

function returnKey(){
    createjs.Sound.play("keySound").setVolume(FX_VOLUME);
    createjs.Tween.get(key)
        .to({x:KEY_X, y:KEY_Y},500,createjs.Ease.backInOut)
        .call(closeBox); 
}
    
    
//
// utilities
//



//
//
//
    

function tick(event) {
    stage.update();
    debug();
}

function debug() {
    document.getElementById("FPS").innerHTML = "Debug-Information:<br>"+Math.round(createjs.Ticker.getMeasuredFPS(),2)+"FPS";
    
}

function removeDebug() {
    document.getElementById("debug").style.visibility = "hidden";
    console.log("Debug-Information is hidden now!");
}

function showMessage(message,type) {
    document.getElementById("overlayMessage").style.visibility = "visible";
    document.getElementById("overlayMessage").style.width = screen.width;
    if(type == "error")
        document.getElementById("overlayMessage").style.backgroundColor = "#c84205";
    else if(type == "info")
        document.getElementById("overlayMessage").style.backgroundColor = "#079b00";
    else if(type == "load")
        document.getElementById("overlayMessage").style.backgroundColor = "#D8E7FF";    
    console.log(screen.width);
    document.getElementById("overlayMessage").innerHTML = message;
}

function hideMessage() {
    document.getElementById("overlayMessage").style.visibility = "hidden";
}

function changeMusicVolume() {
    volume = document.getElementById("music").value*0.01;
    
    MUSIC_VOLUME = volume;
    backgroundMusic.setVolume(volume);
}

function changeFXVolume() {
    volume = document.getElementById("fx").value*0.01;
    
    FX_VOLUME = volume;
    console.log(FX_VOLUME);
}
