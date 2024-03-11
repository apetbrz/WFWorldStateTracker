const corsproxy = "https://corsproxy.org/?";
const worldstatefileurl = 'http://content.warframe.com/dynamic/worldState.php';

const currenttimetext = document.getElementById("time");
const refreshtimetext = document.getElementById("refresh");

var e = document.getElementById("li1");
e.innerHTML = "script working";

e = null;

function setCurrentTime(){
    currenttimetext.innerHTML = "LOCAL TIME: " + new Date().toLocaleTimeString();
}

setCurrentTime();
setInterval(setCurrentTime,1000);

function refresh(){
    let xhttp = new XMLHttpRequest();
    
    xhttp.onload = function(){
        console.log("data loaded at " + Date.now());
        let wfdata = JSON.parse(this.responseText);
        refreshtimetext.innerHTML = "WORLDSTATE TIME: " + new Date(wfdata.Time * 1000).toLocaleTimeString();
        populatePage(wfdata);
    }
    xhttp.open("GET",corsproxy+worldstatefileurl);
    xhttp.send();
}

function populatePage(data){
    let date = new Date();
    e = document.getElementById("li2");
    e.innerHTML = data == null ? "requestfailed":"data got!";

    e = document.getElementById("li3");
    e.innerHTML = "data validation: " + (data.ActiveMissions[0].MissionType == null ? "failed" : "success");

    e = document.getElementById("li4");
    e.innerHTML = "Checking for CAPTURE fissure:\t\t";
    e.innerHTML += checkForFissure(data, "MT_CAPTURE");

    e = document.getElementById("li5");
    e.innerHTML = "Checking for EXTERMINATE fissure:\t";
    e.innerHTML += checkForFissure(data, "MT_EXTERMINATE");

    e = document.getElementById("li6");
    e.innerHTML = "Checking for DISRUPTION fissure:\t";
    e.innerHTML += checkForFissure(data, "MT_ARTIFACT");

    e = document.getElementById("li7");
    e.innerHTML = "Checking for SURVIVAL fissure:\t\t";
    e.innerHTML += checkForFissure(data, "MT_SURVIVAL");
}

function checkForFissure(data, missionType){
    let fissures = data.ActiveMissions;
    let output = "no fissure active";
    
    fissures.forEach(mission => {
        if(mission.MissionType == missionType){
            let expirationTime = Number(mission.Expiry.$date.$numberLong);

            if(expirationTime > Date.now()){
                output = "FISSURE ACTIVE! until: " + (new Date(Number(mission.Expiry.$date.$numberLong)).toLocaleTimeString());
            }else{
                output = "fissure ended! :(";
            }
        }
    });

    return output;
}

refresh();
setInterval(refresh, 15000)