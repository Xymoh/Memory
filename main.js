var sec = 0;
var timer = null;
var timeout = null;

function time() {
    sec++;
    if (sec > 0) {
        $('#time').html(sec);
    }
}

function getId(strId) {
    arr = new Array(2);
    arr[0] = strId.substring(3, strId.indexOf('_'));
    arr[1] = strId.substring(strId.indexOf('_') + 1, strId.length);
    return arr
}

function Picture(accept) {
    this.val;
    do {
        rand = Math.floor(Math.random() * accept.length);
    } while (accept[rand] == 2);
    accept[rand]++;
    this.val = rand;
}

function GameBoard(n, m) {
    this.n = n;
    this.m = m;

    var score = 0;
    var maxScore = (n * m) / 2;

    picBoard = new Array(n);
    lastClick = -1;

    canClickCells = true;

    accepTab = new Array(n * m / 2);
    for (var i = 0; i < accepTab.length; i++) {
        accepTab[i] = 0;
    }

    for (var i = 0; i < picBoard.length; i++) {
        picBoard[i] = new Array(m);
        for (var j = 0; j < picBoard[i].length; j++) {
            picBoard[i][j] = new Picture(accepTab);
        }
    }

    function getPicture(id) {
        return picBoard[id[0]][id[1]].val
    }

    function show(obj) {
        var val = getPicture(getId(obj.id));
        if (canClickCells && obj.isClickable) {
            $(obj).html(val);
            if (lastClick == -1) {
                obj.isClickable = false;
                lastClick = val;
                lastId = getId(obj.id);
            } else {    
                obj.isClickable = false;
                canClickCells = false;
                if (lastClick == val) {
                    $('#score').html(++score);
                    canClickCells = true;
                    if (maxScore == score) {
                        window.alert("Brawo, udało się zdobyć maksymalną ilość punktów!");
                        if (confirm("Czy chcesz odświeżyć stronę i zagrać jeszcze raz?")) {
                            window.location.reload();
                        }
                    }
                } else {
                    setTimeout(function () {
                        $(obj).html("X");
                        $(`#col${lastId[0]}_${lastId[1]}`).html("X");
                        obj.isClickable = true;
                        canClickCells = true;
                        document.getElementById(`col${lastId[0]}_${lastId[1]}`).isClickable = true;
                    }, 1000);
                }
                lastClick = -1;
            }
        }
    }

    let element;

    for (var i = 0; i < n; i++) {
        $("#board").append(`<div class=row id=row${i}>`);
        for (var j = 0; j < m; j++) {
            element = document.createElement("span");
            element.className = "col";
            element.id = `col${i}_${j}`;
            element.innerHTML = "X";
            element.isClickable = true;
            $("#board #row" + i).append(element);
            $("#col" + i + "_" + j).bind("click", function () {
                show(this);
            });
        }
    }
}

var board;

function PromptMessage() {
    var s = +document.getElementById("score").innerHTML;
    window.alert(`Czas się skończył! uzyskałeś wynik ${s}!`);
    if (confirm("Czy chcesz odświeżyć stronę i zagrać jeszcze raz?")) {
        window.location.reload();
    }
}

function start() {
    if (timer !== null) {
        sec = 0;
        clearInterval(timer);
        clearTimeout(timeout);
    }
    timer = setInterval(function () { time() }, 1000);
    var isEven = false;
    var n = +document.getElementById("rows").value;
    var m = +document.getElementById("cols").value;
    var t = +document.getElementById("timeGiven").value;

    if ((n * m) % 2 == 0) {
        isEven = true;
    }
    else {
        window.alert("Podaj taką wartość aby iloczyn kolumn i wierszy był parzysty");
    }

    if (isEven == true && n <= 20 && n >= 2 && m <= 30 && m >= 2) {
        board = new GameBoard(n, m);
        sec = 0;
        $("#start").unbind("click");
        var miliSeconds = t * 1000;
        timeout = setTimeout(function () {
            PromptMessage();
        }, miliSeconds);
    }
    else {
        window.alert("Podano zbyt małą bądź zbyt dużą wartość kolumny oraz/lub wiersza");
    }


    $("#start").attr("disabled", true);
    $("#start").removeClass("button");
    $("#start").toggleClass("buttonPressed");
}