var music = new Audio();
music.addEventListener("ended", function () {
    music.pause();
    music.currentTime = 0;
}, false);

var stopMotion = false;

function getList(){
    var url = document.getElementById("url").value;
    document.getElementById("btAction").disabled = true;
    $.ajax({
        type: 'POST',
        url: 'player.py',
        async: true,
        dataType: 'json',
        timeout: 10000,
        data: {
            dir: url
        },
    })
    .done(function(data) {
        if (data["status"] == "success")
        {
            var selection = document.getElementById("selection");
            while(selection.lastChild)
            {
                selection.removeChild(selection.lastChild);
            }
            var option = document.createElement("option");
            option.text = "..";
            option.value = "..";
            selection.appendChild(option);
            for(i=0; i<data["files"].length; i++){
                var option = document.createElement("option");
                option.text = data["files"][i];
                option.value = data["files"][i];
                selection.appendChild(option);
            }
        }
        else
        {
            alert(data["description"]);
        }
    })
    .fail(function(XMLHttpRequest, status, e) {
        alert("アクセス時にエラーが発生しました。")
        console.log(XMLHttpRequest.responseText, status, e);
    })
    .always(function(){
        document.getElementById("btAction").disabled = false;
    });
    return false;
}

function checkFile(){
    var value = document.getElementById("selection").value.slice( 0, 1 );
    if (value == "D"){
        document.getElementById("btAction").value = "Expand"
        document.getElementById("btAction").onclick = expand;
    }
    else if (value == "F"){
        document.getElementById("btAction").value = "Play"
        document.getElementById("btAction").onclick = playSound;
    }
    else
    {
        document.getElementById("btAction").value = "Select"
        document.getElementById("btAction").onclick = expand;
    }
}

function expand(){
    url = document.getElementById("url").value;
    baseUrl = url;
    selection = document.getElementById("selection").value;
    if (selection == ".."){
        if (url.slice(-1) == "/")
        {
            url = url.slice(0, -1);
        }
        url = url.slice(0, url.lastIndexOf("/"));
        if (url == "")
        {
            url = "/";
        }
    }
    else if (url.slice(-1) == "/"){
        url = url + selection.slice(2);
    }
    else
    {
        url = url + "/" + selection.slice(2);
    }
    document.getElementById("url").value = url;
    getList();
}

function playSound(){
    url = document.getElementById("url").value;
    if (url.slice(0, 1) != "/")
    {
        url = "/" + url
    }
    if (url.slice(-1) != "/")
    {
        url = url + "/";
    }
    selection = document.getElementById("selection").value;
    url = DAVURL + url + selection.slice(2);
    music.pause();
    music.src = url;
    music.load();
    music.currentTime = 0;
    music.addEventListener('loadedmetadata', function() {
        document.getElementById("range").max = music.duration;
        music.play();
    });
    document.getElementById("range").value = 0;
}


function resume(){
    music.play();
}

function pause(){
    music.pause();
}


window.onload = function(){
    setInterval("showTime()", 1);
}

function showTime(){
    var time = music.currentTime;
    if (!stopMotion){
        document.getElementById("range").value = time;
    }
}

function changeTime(){
    music.currentTime = document.getElementById("range").value
}

function onDown(){
    stopMotion = true;
}

function onUp(){
    music.currentTime = document.getElementById("range").value;
    stopMotion = false;
}
