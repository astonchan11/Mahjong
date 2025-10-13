let players = ['Player 1', 'Player 2', 'Player 3', 'Player 4'];

var 食糊人Selector;
var 出冲人Selector;
var 食乜糊Selector;
var 食番數Selector;
var alertElement;
var statTable;

// "番数": [出冲,自摸,包自摸]
const 番數Map = new Map([
    ['3', [32, 16, 48]],
    ['4', [64, 32, 96]],
    ['5', [96, 48, 144]],
    ['6', [128,64,192]],
    ['7', [192,96,288]],
    ['8', [256,128,384]],
    ['9', [384,192,576]],
    ['10', [512,256,768]],
    ['11', [768,384,1152]],
    ['12', [1024,512,1536]],
    ['13', [1536,768,2304]],
    ['14', [2048,1024,3072]],
    ['15', [3072,1536,4608]],
    ['16', [4096,2048,6144]],
    ['17', [6144,3072,9216]],
    ['18', [8192,4096,12288]]
]);

const 番數MapKeysArray = Array.from(番數Map.keys());
const 番數MapLastKey = 番數MapKeysArray[番數MapKeysArray.length - 1];


document.addEventListener("DOMContentLoaded", function(){

    // initialize globals
    食糊人Selector =document.getElementById("食糊人");
    出冲人Selector = document.getElementById("出冲人");
    食乜糊Selector = document.getElementById("食乜糊");
    食番數Selector = document.getElementById("食番數");
    statTable = document.getElementById("stat_table");

    alertElement = document.getElementById("alert");

    // Clear all selector
    handleClear();

    // Initialize the game
    document.getElementById("date").innerHTML = (new Date()).toLocaleDateString();

    document.getElementById('openCheatsheet').addEventListener('click', function(){
        let scoreDialog = document.getElementById("scoreDialog");
        scoreDialog.showModal();
    });

    // close button of dialog is pressed
    document.getElementsByClassName("close")[0].onclick = function() {
        document.getElementById("scoreDialog").close();
    }

    document.getElementById('submitBtn').addEventListener('click', function() {
        players[0] = document.getElementById('nameInput1').value;
        players[1] = document.getElementById('nameInput2').value;
        players[2] = document.getElementById('nameInput3').value;
        players[3] = document.getElementById('nameInput4').value;

        document.getElementById('Player1').innerHTML=players[0];
        document.getElementById('Player2').innerHTML=players[1];
        document.getElementById('Player3').innerHTML=players[2];
        document.getElementById('Player4').innerHTML=players[3];

        // setup 食糊人 selector
        setup食糊人Selector();

        // setupStatTableHeader
        setupStatTableHeader();

        hidePlayersPrompt();
    });

    // To trigger the custom prompt:
    showPlayersPrompt();

    // initialize 番数 selector
    init番数Selector();

    // initialize cheatsheet
    initCheatSheetTable();
});

function initCheatSheetTable() {
    let cheatsheetTable = document.getElementById("cheatSheetTable");

    番數Map.forEach (function(value, key) {
        var newRow = cheatsheetTable.insertRow();
        let 番数Cell = newRow.insertCell();
        let 出冲Cell = newRow.insertCell();
        let 自摸Cell = newRow.insertCell();
        let 包自摸Cell = newRow.insertCell();

        番数Cell.textContent = key + " " + "番";
        出冲Cell.textContent = value[0];
        自摸Cell.textContent = value[1];
        包自摸Cell.textContent = value[2];
    });
}

//
function init番数Selector(){
    // remove all options first
    食番數Selector.innerHTML = '';

    for (const key of 番數Map.keys()) {
        let opt = document.createElement("option");
        opt.value = key;
        opt.innerHTML = key + " " + "番";
        食番數Selector.append(opt);
    }

    // nothing is selected after update
    食番數Selector.selectedIndex = -1;
}

function setup食糊人Selector(){

    // remove all options first
    食糊人Selector.innerHTML='';
    players.map((name, i) => {
        let opt = document.createElement("option");
        opt.value = name;
        opt.innerHTML = name;
        食糊人Selector.append(opt);
    });

    // nothing is selected after update
    食糊人Selector.selectedIndex = -1;

    食糊人Selector.addEventListener("change", update食糊人Selector);
}

function setupStatTableHeader(){
    players.map((name, i) => {
        let ele = document.getElementById("stat_header_player"+(i+1));
        ele.innerHTML = name;
    });
}

function update食糊人Selector(e){
    // 出冲人 cannot be the same

    // remove all options first
    出冲人Selector.innerHTML='';

    var selected食糊人 = 食糊人Selector.value;

    players.forEach((name, index) => {
        if (name != selected食糊人) {
            let opt = document.createElement("option");
            opt.value = name;
            opt.innerHTML = name;
            出冲人Selector.append(opt);
        }
    });

    出冲人Selector.selectedIndex = -1;
}

function update出冲人Selector(食糊人, 食乜糊){
}

function update食乜糊Selector(e) {

    var selected食乜糊 = 食乜糊Selector.value;
    if (selected食乜糊 != "") {

        // 出冲
        is出冲 = (selected食乜糊 != "包自摸" && selected食乜糊.indexOf("自摸") > -1);
        出冲人Selector.disabled = is出冲;

        if (!is出冲) {
            出冲人Selector.value = "";
        }

        // 詐糊 must be highest 番
        var is詐糊 = (selected食乜糊.indexOf("詐糊") > -1);
        食番數Selector.disabled = is詐糊;

        if (is詐糊) {
            食番數Selector.value = 番數MapLastKey; // highest
        }
    }
}

function showPlayersPrompt() {
  document.getElementById('customPrompt').style.display = 'block';
}

function hidePlayersPrompt() {
  document.getElementById('customPrompt').style.display = 'none';
}

function handleClear() {
    食糊人Selector.selectedIndex = -1;
    出冲人Selector.selectedIndex = -1;
    食乜糊Selector.selectedIndex = -1;
    食番數Selector.selectedIndex = -1;
    alertMessage("");
}

// Validate selectors before updating
function selectorsValidator() {
    // 食糊人Selector must be selected
    if (食糊人Selector.value === "") {
        alertMessage("'食糊人' must be selected!");
        return false;
    }

    // 食乜糊Selector must be selected
    if (食乜糊Selector.value === "") {
        alertMessage("'食乜糊' must be selected!")
        return false;
    }

    //
    if ((食乜糊Selector.value === "包自摸" ||
        食乜糊Selector.value === "人打" ||
        食乜糊Selector.value === "出冲詐糊") && 出冲人Selector.value === '') {
        alertMessage("'出冲人' must be selected!");
        return false;
    }

    return true;
}

function getCurrentTimeHHMM() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();

    hours = String(hours).padStart(2, '0');
    minutes = String(minutes).padStart(2, '0');

    return `${hours}:${minutes}`;
}

function insertNewTableRow(scores, 食糊人, 食乜糊, 食番數, 出冲人) {

    var newRow = statTable.insertRow(1);

    var newHHMM = document.createElement("td");
    var newColPlayer1Score = document.createElement("td");
    var newColPlayer2Score = document.createElement("td");
    var newColPlayer3Score = document.createElement("td");
    var newColPlayer4Score = document.createElement("td");
    var newCol食糊人 = document.createElement("td");
    var newCol食乜糊 = document.createElement("td");
    var newCol番數 = document.createElement("td");
    var newCol出冲人 = document.createElement("td");

    newRow.appendChild(newHHMM);
    newRow.appendChild(newColPlayer1Score);
    newRow.appendChild(newColPlayer2Score);
    newRow.appendChild(newColPlayer3Score);
    newRow.appendChild(newColPlayer4Score);
    newRow.appendChild(newCol食糊人);
    newRow.appendChild(newCol食乜糊);
    newRow.appendChild(newCol番數);
    newRow.appendChild(newCol出冲人);

    // add values
    newHHMM.innerHTML = getCurrentTimeHHMM();
    newColPlayer1Score.innerHTML = scores[0];
    newColPlayer2Score.innerHTML = scores[1];
    newColPlayer3Score.innerHTML = scores[2];
    newColPlayer4Score.innerHTML = scores[3];

    newCol食糊人.innerHTML = 食糊人;
    newCol食乜糊.innerHTML = 食乜糊;
    newCol番數.innerHTML = 食番數;
    newCol出冲人.innerHTML = 出冲人;

    updateScores();
}

function handleUpdate() {
    alertMessage("");

    // true means all selectors validated
    if (selectorsValidator()) {
        var playersScore = [0, 0, 0, 0];

        var 食糊人 = 食糊人Selector.value;
        var 食乜糊 = 食乜糊Selector.value;
        var 出冲人 = 出冲人Selector.value;
        var 食番數 = 食番數Selector.value;
        var 幾多番Tuple = 番數Map.get(食番數); // [出冲,自摸,包自摸]

        var 食糊人Index = players.indexOf(食糊人);
        var 出冲人Index = players.indexOf(出冲人);

        switch (食乜糊) {
            case "自摸":
                出冲人 = '-';
                for (let i = 0; i < playersScore.length; i++) {
                    if (食糊人Index === i) {
                        playersScore[i] =  幾多番Tuple[1] * 3;
                    } else {
                        playersScore[i] = 幾多番Tuple[1] * -1;
                    }
                }
                break;
            case "人打":
                for (let i = 0; i < playersScore.length; i++) {
                    if (食糊人Index === i) {
                        playersScore[i] =  幾多番Tuple[0];
                    } else if (出冲人Index === i) {
                        playersScore[i] = 幾多番Tuple[0] * -1;
                    }
                }

                break;
            case "包自摸":
                for (let i = 0; i < playersScore.length; i++) {
                    if (食糊人Index === i) {
                        playersScore[i] =  幾多番Tuple[2];
                    } else if (出冲人Index === i) {
                        playersScore[i] = 幾多番Tuple[2] * -1;
                    }
                }
                break;
            case "自摸詐糊":
                for (let i = 0; i < playersScore.length; i++) {
                    if (食糊人Index === i) {
                        playersScore[i] =  幾多番Tuple[1] * -3;
                    } else {
                        playersScore[i] = 幾多番Tuple[1];
                    }
                }
                break;
            case "出冲詐糊":
                for (let i = 0; i < playersScore.length; i++) {
                    if (食糊人Index === i) {
                        playersScore[i] =  幾多番Tuple[0] * -1;
                    } else if (出冲人Index === i) {
                        playersScore[i] = 幾多番Tuple[1];
                    } else {
                        playersScore[i] = 幾多番Tuple[1] / 2;
                    }
                }
                break;
        }

        insertNewTableRow(playersScore, 食糊人, 食乜糊, 食番數, 出冲人);

        // clear controls
        handleClear();
    }
}

function handleUndo() {
    const lastRowIndex = statTable.rows.length - 1;

    // make sure we have something to delete
    if (lastRowIndex == 0) {
        alertMessage("Nothing to undo!");
    } else {
        var firstRow = statTable.rows[1];

        statTable.deleteRow(1); // always delete 1st row

        var msg = "Just undo : <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

        for (const item of firstRow.cells) {
            msg += item.textContent + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
        }

        alertMessage(msg);

        updateScores();
    }
}

function alertMessage(msg) {
    alertElement.innerHTML = msg;
}

function updateScores() {
    var sum = 0;

    let players_scoreId = ["player1_score", "player2_score", "player3_score", "player4_score"];

    players_scoreId.forEach((element, index) => {
        sum = 0;
        for (var i = 1; i < statTable.rows.length; i++) {
            var cell = statTable.rows[i].cells[index];
            var value = parseInt(cell.textContent);

            if (!isNaN(value)) {
                sum += value;
            }
        }

        document.getElementById(element).textContent = sum;
    });
}
