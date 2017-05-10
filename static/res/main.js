var username = "";

var nameField;
var gongElement;

var storedUname = localStorage.getItem("username");

function init(){
    gongElement = document.getElementById("gongen");
    nameField = document.getElementById("name");

    if(storedUname != null){
        setUsername(storedUname);
    }

    gongElement.addEventListener("click", function(e){
        console.log("GONG!");
        setUsername(nameField.value);
        if(username == ""){
            username = "Anonym fyllik";
        }
        else {
            saveUsername();
        }   
        gong();
    }, false)

    getGong();
}

function setUsername(name){
    nameField.value = name;
    username = name;
};

function saveUsername(){
    localStorage.setItem("username", username);
}

function gong(){
    var gongtext = document.getElementById("teksten");
    var lyd = document.getElementById("lyden");
    lyd.currentTime = 0;
    lyd.play();
    gongtext.className = "shown";
    setTimeout(function() {
        gongtext.className = "";
    }, 2000);

    navigator.geolocation.getCurrentPosition(function (pos) {
       sendGong(pos.coords.latitude, pos.coords.longitude, username);
    }, function (error){
        
    }, {
        enableHighAccuracy: true,
        timeout: 10000
    });
    console.log("Gong!");
}

function sendGong(lat, lon, username){
    var req = new XMLHttpRequest();
    req.open("post", "/gong/gong");
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify({
        name: username,
        loc: {
            latitude: lat,
            longitude: lon
        }
    }));
    req.onreadystatechange = getGong;
}

function getGong(){
    var outp = document.getElementById("lastgong");
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if(req.readyState === XMLHttpRequest.DONE && req.status === 200) {
            var res = JSON.parse(req.responseText);
            outp.innerHTML = "Siste gong: " + res.name + ", " + new Date(res.timestamp).toLocaleString();
            outp.href = "https://maps.google.com/maps?q=loc:"+res.location.latitude+","+res.location.longitude;
        }
    }
    req.open("get", "/gong/gong");
    req.send()
}


