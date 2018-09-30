const slider = document.getElementById("myRange"),
    output = document.getElementById("demo"),
    gameBody = document.getElementById("game-body"),
    startBtn = document.getElementById("startbtn"),
    colors = ["#176BEF", "#FF3E30", "#F7B529", "#179C52"],
    tickRatio = 30
let speed, pause, dotarr, timecounter, dotId, windowWidth, score

function init() {
    speed = 10
    pause = true
    dotarr = []
    timecounter = 0
    dotId = -1
    score = 0
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
        startBtn.innerText = "Play!"
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
        let randX = Math.floor(Math.random() * (windowWidth - 200)) + 100,
            randWidth = Math.floor(Math.random() * 90) + 10
        dotId += 1
        let dot = {
            id: dotId,
            width: randWidth,
            top: -randWidth,
            x: randX,
            color: colors[Math.floor(Math.random() * 4)]
        }
        dotarr.push(dot)
        timecounter = 0
    } else {
        timecounter += 1
    }
    //move
    for (let i = 0; i < dotarr.length; i++) {
        dotarr[i].top += Math.ceil(speed/tickRatio)
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
    if (pause) return
    let audioEle = document.getElementById("beep"),
        addscore
    audioEle.currentTime = 0
    audioEle.play()
    for (let i = 0; i < dotarr.length; i++) {
        if (dotarr[i].id == ele.id){
            addscore = Math.ceil((100-dotarr[i].width)/9)
            dotarr.splice(i,1)
            break
        }
    }
    addScore(addscore)
    render()
}

function addScore(addscore){
    let scoreEle = document.querySelector(".score"),
        newStage = Math.ceil((score+addscore)/50)
    if(Math.ceil(score/50) !== newStage){
        checkStage(newStage)
    }
    score += addscore
    scoreEle.innerHTML = score + ""
    changeCharacter(newStage)
}

function checkStage(stage){
    let title = "",
        stageEle = document.querySelector(".stage")
    if(stage >= 9){
        title = "Ultimate Stage!!"
    }else{
        title = "Stage " + stage
    }
    stageEle.innerHTML = title
    stageEle.style.display = "block"
    setTimeout(function(){
        stageEle.style.display = "none"
    }, 1500)
}

function changeCharacter(stage){
    if(stage >= 9){
        gameBody.style.cursor = "url('./cursor9.png') 25 25, auto"
    }else if(stage > 1){
        gameBody.style.cursor = "url('./cursor" + stage + ".png') 25 25, auto"
    }
}

document.addEventListener("DOMContentLoaded", function () {
    output.innerHTML = slider.value
    windowWidth = window.innerWidth

    slider.oninput = function () {
        speed = parseInt(this.value)
        output.innerHTML = this.value
    }

    init()
})

window.onload = function(){
    document.querySelector(".preloader").classList.add("pre-clip")
    setTimeout(function(){
        start()
    }, 1000)
}