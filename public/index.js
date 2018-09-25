const slider = document.getElementById("myRange"),
    output = document.getElementById("demo"),
    gameBody = document.getElementById("game-body"),
    startBtn = document.getElementById("startbtn"),
    tickRatio = 5
let speed, pause, dotarr, timecounter, dotId

function init() {
    speed = 10
    pause = true
    dotarr = []
    timecounter = 0
    dotId = -1
    render()
}

function renderTemplate(template, data) {
    var patt = /\{([^}]+)\}/g; // matches {key}
    return template.replace(patt, function (_, key) {
        return data[key];
    });
}

function render() {
    gameBody.innerHTML = ""
    let template = document.getElementById('template').innerHTML,
        htmlStr = ""
    for (let i = 0; i < dotarr.length; i++) {
        htmlStr += renderTemplate(template, dotarr[i])
    }
    gameBody.innerHTML = htmlStr
}

function start() {
    if (!pause) {
        pause = true
        startBtn.innerText = "Start"
    } else {
        pause = false
        startBtn.innerText = "Pause"
        timeTick()
    }
}

function timeTick() {
    if (pause) return
    let gameBodyH = gameBody.clientHeight
    //add new
    if (timecounter == tickRatio) {
        let randX = Math.floor(Math.random() * 200) + 100,
            randWidth = Math.floor(Math.random() * 90) + 10
        dotId += 1
        let dot = {
            id: dotId,
            width: randWidth,
            top: -randWidth,
            x: randX
        }
        dotarr.push(dot)
        timecounter = 0
    } else {
        timecounter += 1
    }
    //move
    for (let i = 0; i < dotarr.length; i++) {
        dotarr[i].top += Math.floor(speed/tickRatio)
    }
    //clean up
    var i
    for (i = 0; i < dotarr.length; i++) {
        if (dotarr[i].top <= gameBodyH) {
            break
        }
    }
    dotarr = dotarr.slice(i)
    render()
    setTimeout(timeTick, 1000/tickRatio)
}

function handleDotClick(ele){
    let score
    for (i = 0; i < dotarr.length; i++) {
        if (dotarr[i].id == ele.id){
            score = Math.ceil((100-dotarr[i].width)/9)
            dotarr.splice(i,1)
            break
        }
    }
    addScore(score)
    render()
}

function addScore(score){
    let scoreEle = document.querySelector(".score")
    scoreEle.innerHTML = parseInt(scoreEle.innerHTML)+score + ""
}

document.addEventListener("DOMContentLoaded", function () {
    output.innerHTML = slider.value

    slider.oninput = function () {
        speed = parseInt(this.value)
        output.innerHTML = this.value
    }

    init()
})