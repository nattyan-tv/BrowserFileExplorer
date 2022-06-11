function getList(){
    var url = document.getElementById("url").value;
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
        console.log(data);
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
        alert("エラーが発生しました。\n" + e)
        console.log(XMLHttpRequest.responseText, status, e);
    })
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
        document.getElementById("btAction").value = "Expand"
        document.getElementById("btAction").onclick = expand;
    }
}

function expand(){
    url = document.getElementById("url").value;
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
    return
}
