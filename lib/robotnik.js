function debug() {
    document.getElementById("FPS").innerHTML = "Debug-Information:<br>"+Math.round(createjs.Ticker.getMeasuredFPS(),2)+"FPS";
    
}

function removeDebug() {
    document.getElementById("debug").style.visibility = "hidden";
    console.log("Debug-Information is hidden now!");
}

function showMessage(message,type) {
    document.getElementById("overlayMessage").style.visibility = "visible";
    document.getElementById("overlayMessage").style.fontFamily = "Ubuntu";
    document.getElementById("overlayMessage").style.width = screen.width;
    if(type == "error")
        document.getElementById("overlayMessage").style.backgroundColor = "#c84205";
    else if(type == "info")
        document.getElementById("overlayMessage").style.backgroundColor = "#079b00";
    else if(type == "load")
        document.getElementById("overlayMessage").style.backgroundColor = "#D8E7FF"; 
    else if(type == "changelog"){
        document.getElementById("overlayMessage").style.backgroundColor = "white";
        document.getElementById("overlayMessage").style.fontFamily = "Monospace";
    }
        
    document.getElementById("overlayMessage").innerHTML = message;
}

function scrollOlMessage() {
    theOverlay = document.getElementById("overlayMessage");
    console.log("Height of overlay: " + theOverlay.scrollHeight);
    scrPos = theOverlay.scrollHeight + 100;
    theOverlay.scrollTop = scrPos;
    console.log("New Pos: " + scrPos);
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

function setGameVersion() {
    document.getElementById("footer").innerHTML = "Release: <br>"+ GAME_VERSION + "<br><button>Show ChangeLog.txt</button>";
}

function showChangeLog() {
    showMessage(GAME_VERSION+'<br><iframe src="changeLog.txt" data="text/html" width="90%" height="260px" scrolling="yes" charset="UTF-8"></iframe>', "changelog");
    
    /*
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            
            showMessage(xmlhttp.responseText, "changelog");
        }
    }
    xmlhttp.open("GET","changeLog.txt",true);
    xmlhttp.send();
    */
}