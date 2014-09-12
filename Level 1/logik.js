var GAME_VERSION="ver 0.0001 - 4.9.14, 17:00, last edited by Felix";

var stage, background, loaded;

//sounds
var sheetSND, switchSND, electricSND,ventSND, backgroundMusic;
var FX_VOLUME = 0.6, MUSIC_VOLUME = 0.8;


//objects
var book, page1,page2,page3,page4,page5,notePaper,notePaperBig;

var boxClosed,boxOpen, boxGUI,box_X=305,box_Y=278,boxGUI_X=500,boxGUI_Y=200;
var swL1,swL2,swL3,swVentilator,swDoor, switch_X=200,switch_Y_init=200,switch_Height=200;


//shadows
var shLeft,shMid,shRight, darkMid,darkRight,darkLeft;

//gameVars
var isLightOn=false,hasOpenendBook=false,hasNotePaper=false, isUnlocked=false, isUnderVoltage=true, isBoxOpen=false;

//positions
const bookX=519,bookY=70,notePaperX=1000,notePaperY=0;




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
		{id:"shLeft", src:"assets/shadowLeft.png"},
		{id:"shMid", src:"assets/shadowMid.png"},
		{id:"shRight", src:"assets/shadowRight.png"},
		{id:"darkMid", src:"assets/darkMid.png"},
		{id:"darkRight", src:"assets/darkRight.png"},
		{id:"darkLeft", src:"assets/darkLeft.png"},
        {id:"book", src:"assets/book.png"},
        
                
        {id:"page1", src:"assets/page1.png"},
        {id:"page2", src:"assets/page2.png"},
        {id:"page3", src:"assets/page3.png"},
        {id:"page4", src:"assets/page4.png"},
        {id:"page5", src:"assets/page5.png"},
        {id:"notePaper", src:"assets/notePaper.png"},
        {id:"notePaperBig", src:"assets/notePaperBig.png"},
		
		{id:"boxClosed", src:"assets/boxShut.png"},
		{id:"boxOpen", src:"assets/boxOpen.png"},
		
		{id:"music", src:"assets/background.wav"},
		{id:"boxOpen", src:"assets/boxOpen.png"},
		{id:"boxOpen", src:"assets/boxOpen.png"},
		{id:"boxOpen", src:"assets/boxOpen.png"},
		{id:"boxOpen", src:"assets/boxOpen.png"},		
		
		


        
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
		
		case "shLeft": 
			shLeft=new createjs.Bitmap( event.result ); break;
		
		case "shMid":
			shMid=new createjs.Bitmap( event.result ); break;
		
		case "shRight":
			shRight=new createjs.Bitmap( event.result ); break;
				
		case "darkMid":			
		darkMid=new createjs.Bitmap( event.result ); break;
			
		case "darkRight":		
		darkRight=new createjs.Bitmap( event.result ); break;
		case "darkLeft":		
		darkLeft=new createjs.Bitmap( event.result ); break;
		case "book":		
		book=new createjs.Bitmap( event.result ); break;
        
        case "page1":		
		page1=new createjs.Bitmap( event.result ); break;
		
        case "page2":		
		page2=new createjs.Bitmap( event.result ); break;
		
        case "page3":		
		page3=new createjs.Bitmap( event.result ); break;
		
        case "page4":		
		page4=new createjs.Bitmap( event.result ); break;
		
        case "page5":		
		page5=new createjs.Bitmap( event.result ); break;
		
        case "notePaper":		
		notePaper=new createjs.Bitmap( event.result ); break;
		
        case "notePaperBig":		
		notePaperBig=new createjs.Bitmap( event.result ); break;
		
		case "boxClosed":		
		boxClosed=new createjs.Bitmap( event.result ); break;
		
		case "boxOpen":		
		boxOpen=new createjs.Bitmap( event.result ); break;
		
           
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
	initializeSounds();
    setGameVersion();
		
    document.getElementById("music").value = MUSIC_VOLUME*100;
    document.getElementById("fx").value = FX_VOLUME*100;
		
	       
        
		
		book.on("click",function(evt){
            if (!hasOpenendBook){
            openBook();
            hasOpenendBook=true;
		
			sheetSND = createjs.Sound.play("assets/paper.wav");				
            }
        })
		
		// Bookpages
        
        page1.on("click",function(evt){
            stage.removeChild(page1);
		
			playSheetSound();
        })
        
                
        page2.on("click",function(evt){
            stage.removeChild(page2);
		
			playSheetSound();			
        })
        
                
        page3.on("click",function(evt){
            stage.removeChild(page3);
			
			playSheetSound();			
        })
        
                
        page4.on("click",function(evt){
            stage.removeChild(page4);
		
			playSheetSound();
			
        })
		
		//
        
        notePaper.on("click",function(evt){
            stage.removeChild(notePaper);

			playSheetSound();
		
            hasNotePaper=true;
            stage.addChild(notePaperBig);
            closeBook();
        })
		
				
		background.on("click",function(evt){
			switchLights();
			switchSND= createjs.Sound.play("assets/switch.wav").setVolume(FX_VOLUME);
		})
		
		
		
}

//
// initializers - graphic
//
function initializeObjects(){
    initializeStage();  
	initializeShadowLights();
    initializeDark();
	initializeGameObjects();
	initializeBox();
    
        
    //add Basic
	stage.addChild(background);
        stage.addChild(book,boxClosed);
	

	//add dark blends	
        stage.addChild(shLeft,shMid,shRight);
        stage.addChild(darkMid,darkRight);
}
		function initializeSounds(){
			backgroundMusic = createjs.Sound.play("music",{loop:-1});
		    backgroundMusic.setVolume(MUSIC_VOLUME);
			electricSND = createjs.Sound.play("assets/electric.wav",{loop:-1});
			electricSND.setVolume(FX_VOLUME);
			//ventSND = createjs.Sound.play("assets/ventilator.wav",{loop:-1});
		
			
		}



		function initializeStage(){    
		stage = new createjs.Stage(document.getElementById("canvas"));    
		createjs.Ticker.addEventListener("tick", tick);    
		createjs.Ticker.setFPS(60);    
		createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCED;
		}
		


		function initializeShadowLights(){
		shLeft.x=42;shLeft.y=82;
		shMid.x=353;shMid.y=94;
		shRight.x=657;shRight.y=126;
		}
		
		function initializeDark(){
		darkMid.x=shMid.x;
		darkMid.y=shMid.y;
		
		darkRight.x=shRight.x;
		darkRight.y=shRight.y;
		
		darkLeft.x=shLeft.x;
		darkLeft.y=shLeft.y;
		}
        
        function initializeGameObjects(){
        book.x=300;
        book.y=215;
        
        page1.x=bookX-4;page1.y=bookY+10;
        page2.x=bookX+4;page2.y=bookY-4;
        page3.x=bookX-10;page3.y=bookY+8;
        page4.x=bookX+2;page4.y=bookY-2;
        page5.x=bookX-11;page5.y=bookY+9;
        
        notePaper.x=bookX;notePaper.y=bookY;
        notePaperBig.x=notePaperX,notePaperBig.y=notePaperY;
        
        }
		
		function initializeBox(){

		boxClosed.x=box_X;boxClosed.y=box_Y;
		boxOpen.x=box_X,boxOpen.Y=box_Y;
		
		//boxClosed.rotation=120;
		}
    
//
// game functions
//
		
		function playSheetSound(){
			sheetSND.stop();			
			sheetSND.play();	
		}

        function openBook(){
        stage.addChild(page5,notePaper,page4,page3,page2,page1);
        stage.removeChild(book);
        }
        
        function closeBook(){
        stage.removeChild(page5);
        }
        
		function switchLights(){
		if(isLightOn){
		isLightOn=false;
		stage.addChild(darkMid,darkRight);
		}
		else{
		isLightOn=true;
		stage.removeChild(darkMid,darkRight);
		}
		}


//
//
//
    

function tick(event) {
    stage.update();
    debug();
}


		