const corsproxy = "https://corsproxy.io/?";
const worldstatefileurl = encodeURIComponent("http://content.warframe.com/dynamic/worldState.php");
const solnodesdata = 'https://api.warframestat.us/solNodes/';

const currenttimetext = document.getElementById("time");
const refreshtimetext = document.getElementById("refresh");

let xhttp = new XMLHttpRequest();
var solNodes;

xhttp.onload = function(){
    solNodes = JSON.parse(this.responseText);
    console.log("SOLNODES LOAD: " + (solNodes != null ? "SUCCESS" : "FAILURE"));
    xhttp = null;
}
xhttp.open("GET",solnodesdata);
xhttp.send();

var e = document.getElementById("li1");
e.innerHTML = "script working";

e = null;

function setCurrentTime(){
    currenttimetext.innerHTML = "LOCAL TIME: " + new Date().toLocaleTimeString();
}

setCurrentTime();
setInterval(setCurrentTime,1000);

async function refresh(){
    let response = await fetch(corsproxy + worldstatefileurl);
    let wfdata = await response.json();
    let worldstatetime = new Date(wfdata.Time * 1000).toLocaleTimeString()

    refreshtimetext.innerHTML = "WORLDSTATE TIME: " + worldstatetime;

    console.log("data loaded at " + new Date().toLocaleTimeString() + " : worldstate time = " + worldstatetime);

    populatePage(wfdata);
}

function populatePage(data){
    e = document.getElementById("li2");
    e.innerHTML = data == null ? "requestfailed":"data got!";

    e = document.getElementById("li3");
    e.innerHTML = "data validation: " + (data.ActiveMissions[0].MissionType == null ? "failed" : "success");

    e = document.getElementById("li4");
    e.innerHTML = "Checking for CAPTURE fissure:\t\t";
    e.innerHTML += checkForFissure(data, "MT_CAPTURE");

    e = document.getElementById("li5");
    e.innerHTML = "Checking for EXTERMINATE fissure:\t";
    e.innerHTML += checkForFissure(data, "MT_EXTERMINATION");

    e = document.getElementById("li6");
    e.innerHTML = "Checking for DISRUPTION fissure:\t";
    e.innerHTML += checkForFissure(data, "MT_ARTIFACT");

    e = document.getElementById("li7");
    e.innerHTML = "Checking for SURVIVAL fissure:\t\t";
    e.innerHTML += checkForFissure(data, "MT_SURVIVAL");

    e = document.getElementById("li8");
    e.innerHTML = "Checking for RESCUE fissure:\t\t";
    e.innerHTML += checkForFissure(data, "MT_RESCUE");
}

function regionToPlanet(region){
    switch(region){
        case 0: return "Unknown";
        case 1: return "Mercury";
        case 2: return "Venus";
        case 3: return "Earth";
        case 4: return "Mars";
        case 5: return "Jupiter";
        case 6: return "Saturn";
        case 7: return "Uranus";
        case 8: return "Neptune";
        case 9: return "Pluto";
        case 10: return "Ceres";
        case 11: return "Eris";
        case 12: return "Sedna";
        case 13: return "Europa";
        case 14: return "Clan Dojo";
        case 15: return "Void";
        case 16: return "Phobos";
        case 17: return "Deimos";
        case 18: return "Lua";
        case 19: return "Kuva Fortress";

    }
}

function nodeToFaction(node){
    if(solNodes[node] == null) return "";
    return solNodes[node].enemy;
}

function checkForFissure(data, missionType){
    let fissures = data.ActiveMissions;
    let output = "";
    
    fissures.forEach(mission => {
        if(mission.MissionType === missionType){
            let expirationTime = Number(mission.Expiry.$date.$numberLong);

            if(expirationTime > Date.now()){
                if(output === "") output = "FISSURE ACTIVE!";
                output += "<br><br>relic: " + mission.Modifier;
                output += "<br>planet: " + regionToPlanet(mission.Region);
                output += "<br>steelpath: " + (mission.Hard != null ? "yes" : "no");
                output += "<br>faction: " + nodeToFaction(mission.Node);
                output += "<br>until: " + (new Date(Number(mission.Expiry.$date.$numberLong)).toLocaleTimeString());
            }
        }
    });

    if(output === "") output = "no fissure active";
    return output;
}

refresh()
setInterval(refresh, 15000)