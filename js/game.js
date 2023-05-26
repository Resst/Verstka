class PufferfishGame{
    constructor(){
        minecraftMusic.play();
        this.gz = document.getElementById("game-zone");
        this.gz.classList.add("pf-game-zone");
        this.roundStarted = false;
        this.jumped = true;

        this.score = 0;

        this.pf = [
            document.createElement("div"),
            document.createElement("div"),
            document.createElement("div")
        ];
        this.pf[0].classList.add("pufferfish");
        this.pf[0].id = "pufferfish1";
        this.gz.appendChild(this.pf[0]);
        this.pf[1].classList.add("pufferfish");
        this.pf[1].id = "pufferfish2";
        this.gz.appendChild(this.pf[1]);
        this.pf[2].classList.add("pufferfish");
        this.pf[2].id = "pufferfish3";
        this.gz.appendChild(this.pf[2]);
        
        this.savedTime = Date.now();
        this.interval = 0;
        new Audio("sound/pufferfish.mp3");
        this.onClickFunc = () => {
            if(!this.jumped){
                this.pfJump(2);
                this.jumped = true;
                adjustScore(Math.floor((1000 - Math.floor(Math.abs(Date.now() - this.savedTime - 2 * this.interval))) / 10));
            }
            else if(!this.roundStarted)
                this.playRound();
        };
        this.gz.addEventListener("click", this.onClickFunc);
        this.count = 0;
    }
    
    playRound(){
        if(this.roundStarted && !this.jumped)
            adjustScore(-100);
        if(this.count >= 5){
            this.dispose();
            return;
        }
        this.count++;
        this.roundStarted = true;
        this.jumped = false;
        this.interval = Math.random() * (2500 - this.score) + 500;
        this.savedTime = Date.now();
        this.pfJump(0);
        setTimeout(() => this.pfJump(1), this.interval);
        setTimeout(()=>{this.playRound();}, Math.max(this.interval * 3, 3000));
    }


    pfJump(pfIndex){
        this.pf[pfIndex].classList.remove("jumping");
        setTimeout(() => this.pf[pfIndex].classList.add("jumping"), 100);
        setTimeout(this.playPfSound, 700);
    }
    
    playPfSound(){
        let pfa = new Audio("sound/pufferfish.ogg");
        pfa.volume = .3;
        pfa.play();
    }

    dispose(){
        this.gz.classList.remove("pf-game-zone");
        this.gz.removeEventListener("click", this.onClickFunc);
        this.pf[0].remove();
        this.pf[1].remove();
        this.pf[2].remove();
        resetScore();
        inter2();
    }
}

class RunGame{
    constructor(){
        minecraftMusic.pause();
        giornoMusic.play();
        this.gz = document.getElementById("game-zone");
        this.scores = document.getElementById("scores");
        this.elapText = document.createElement("p");
        this.helpText = "Подождите, пока фугу закончит движение, затем зажмите ЛКМ и попытайтесь продержать столько времени, сколько занял путь";
        this.elapText.textContent = this.helpText;
        this.elapText.classList.add("help-text");

        this.scores.prepend(this.elapText);

        this.mouseDown = () =>{
            this.savedTime = Date.now();
        }
        this.mouseDown = this.mouseDown.bind(this);

        this.mouseUp = () => {
            let elapsedTime = Date.now() - this.savedTime;
            if(elapsedTime < 1000)
                this.notEnoughHold();
            else
                this.enoughHold(elapsedTime);
        }
        this.mouseUp = this.mouseUp.bind(this);

        this.start1();
    }

    playerInput(){
        this.mouseUp.bind(this);
        this.mouseDown.bind(this);
        this.gz.addEventListener("mousedown", this.mouseDown);
        this.gz.addEventListener("mouseup", this.mouseUp);
    }

    notEnoughHold(){
        if(document.querySelectorAll(".error-text").length == 0){
            let temp = document.createElement("p");
            temp.classList.add("error-text");
            temp.textContent = "Удерживайте дольше!";
            this.scores.append(temp);
            setTimeout(() => temp.remove(), 1000);
        }
    }

    enoughHold(elapsedTime){
        let timeMillis = this.time * 1000;
        let dif = Math.abs(elapsedTime - timeMillis);
        let newScore;
        if(dif > (timeMillis)){
            newScore = -200;
        }else{
            newScore = Math.floor(200 - (400 * dif / timeMillis));
        }
        adjustScore(newScore);

        this.gz.removeEventListener("mousedown", this.mouseDown);
        this.gz.removeEventListener("mouseup", this.mouseUp);
        this.end();
        this.next();
    }

    start1(){
        this.time = 5;
        this.gz.classList.add("river1");
        this.pf = document.createElement("div");
        this.pf.classList.add("pufferfish"); 
        this.pf.style.animation = "pf-swim-river1 " + this.time + "s linear";
        this.gz.appendChild(this.pf);
        this.pf.addEventListener("animationend", () => {this.playerInput(); this.pf.remove();});
        this.end = this.end1;
        this.next = this.start2;
    }

    end1(){
        this.gz.classList.remove("river1");
    }

    start2(){
        this.time = 10;
        this.gz.classList.add("river2");
        this.pf = document.createElement("div");
        this.pf.classList.add("pufferfish"); 
        this.pf.style.animation = "pf-swim-river2 " + this.time + "s linear";
        this.gz.appendChild(this.pf);
        this.pf.addEventListener("animationend", () => {this.playerInput(); this.pf.remove();});
        this.end = this.end2;
        this.next = this.start3;
    }
    end2(){
        this.gz.classList.remove("river2");
    }
    start3(){
        this.time = 10;
        this.gz.classList.add("river3");
        this.pf = document.createElement("div");
        this.pf.classList.add("pufferfish"); 
        this.pf.style.animation = "pf-swim-river3 " + this.time + "s linear";
        this.gz.appendChild(this.pf);
        this.pf.addEventListener("animationend", () => {this.playerInput(); this.pf.remove();});
        this.end = this.end3;
        this.next = ()=>{};
    }
    end3(){
        this.gz.classList.remove("river3");
        this.dispose();
    }
    dispose(){
        this.pf.remove();
        this.gz.removeEventListener("mousedown", this.mouseDown);
        this.gz.removeEventListener("mouseup", this.mouseUp);
        
        this.elapText.remove();
        resetScore();
        inter3();
    }
}

class ClickGame{
    constructor(){
        this.disposed = false;
        this.spawned = 0;

        this.tileSize = 100;

        this.otherClasses = ["wrong1", "wrong2", "wrong3"];

        this.gz = document.getElementById("game-zone");
        this.gz.classList.add("click-game-zone");
        this.scores = document.getElementById("scores");

        this.carrot = document.createElement("div");
        this.carrot.classList.add("carrot", "clickable-game");

        this.carrot.addEventListener("click", this.carrotClick.bind(this));

        this.gz.append(this.carrot);

        this.speed = 5000;
        this.summonCarrot();
        this.summonOther();
    }

    summonCarrot(){
        if(this.spawned >= 20){
            this.dispose();
            return;
        }

        this.spawned++;
        this.randomizeItem(this.carrot);
        this.gz.append(this.carrot);
        setTimeout((() => {
            if(this.gz.contains(this.carrot)){
                this.carrot.remove();
                this.carrotMiss();
            }
        }).bind(this), this.speed / 2);

        setTimeout((() =>{
            this.summonCarrot();
        }).bind(this), this.speed);
    }
    summonOther(){
        if(this.disposed)
            return;
        let sp = this.speed / 5;
        let tmp = document.createElement("div");
        tmp.classList.add(this.otherClasses[Math.floor( Math.random() * (this.otherClasses.length))], "clickable-game");
        tmp.addEventListener("click", this.otherClick);
        this.randomizeItem(tmp);
        this.gz.appendChild(tmp);

        setTimeout((() =>{
            tmp.remove();
        }).bind(this), Math.floor( Math.random() * (this.speed) + this.speed / 2 ));

        setTimeout((() => {
            this.summonOther();
        }).bind(this), sp);
    }

    randomizeItem(item){
        item.style.left = Math.floor( Math.random() *  (screenWidth - this.tileSize)) + "px";
        item.style.top = Math.floor( Math.random() *  (screenHeight - this.tileSize)) + "px";
    }
    
    carrotClick(){
        this.speed -= 200;
        this.carrot.remove();
        adjustScore(300);
        
    }

    carrotMiss(){
        adjustScore(-300);
    }

    otherClick(){
        this.remove();
        adjustScore(-300);
    }

    dispose(){
        this.disposed = true;
        this.gz.classList.remove("click-game-zone");
        this.carrot.remove();
        [].slice.call(this.gz.children).forEach(element => {
            if(element.classList.remove("clickable-game"))
                element.remove();
        });
        resetScore();
        inter4();
    }
}

function adjustScore(value){
    score += value;
    scoreText.textContent = "Счет: " + score;
    
    totalScore += value;
    localStorage.setItem("current-score", totalScore);
    totalScoreText.textContent = "Общий счет: " + totalScore;
}

function resetScore(){
    score = 0;
    scoreText.textContent = "Счет: " + score;
}
function inter(textToAdd, gameClass){
    scoreText.style.display = "none";
    totalScoreText.style.display = "none";
    gz.classList.add("inter-game-zone");
    let container = document.createElement("div");
    container.classList.add("inter");
    gz.appendChild(container);
    let text = document.createElement("p");
    text.innerHTML = textToAdd;
    container.appendChild(text);
    let nextBtn = document.createElement("div");
    container.appendChild(nextBtn);
    nextBtn.addEventListener("click", () => {
        gz.classList.remove("inter-game-zone");
        container.remove();
        scoreText.style.display = "";
        totalScoreText.style.display = "";
        new gameClass();
    })
}
function inter1(){
    inter("Вы простая рыба фугу,<br>Однако!!!<br>У вас есть мечта!<br>Вы хотите выбраться из пруда<br>Ваш путь лежит в далекую морковную пещеру.<br>Ваши братья согласились помочь вам выбраться.<br><span>Просто старайтесь кликать в такт!</span>",
        PufferfishGame);
}

function inter2(){
    inter("Вам удалось выбраться из пруда!<br>Теперь осталось только добраться до самой пещеры.<br>Для этого нужно правильно расчитать свои силы.<br><span>Подождите, пока фугу закончит движение,<br> затем зажмите ЛКМ и попытайтесь продержать столько времени,<br> сколько занял путь</span>",
        RunGame);
}

function inter3(){
    inter("Вы добрались до залежей моркови. <br>Осталось только не съесть ничего лишнего.<br><span>Кликайте по моркови, но не по другим объектам</span>",
        ClickGame);
}

function inter4(){

    let nick = localStorage.getItem("current");
    let scoreTable = JSON.parse(localStorage.getItem("score-table"));

    if(scoreTable == null){
        scoreTable = [{nick: nick, score: totalScore}];
    }else{
        scoreTable.push({nick:nick, score: totalScore});
        scoreTable.sort((a, b) => {
            if (a.score < b.score) {
              return 1;
            }
            if (a.score > b.score) {
              return -1;
            }
            return 0;
        });

        if(scoreTable.length > 10){
            scoreTable.splice(10, 1);
        }
    }
    localStorage.setItem("score-table", JSON.stringify(scoreTable));
    localStorage.setItem("current-score", totalScore);
    window.location.replace("win.html");
}

let giornoMusic = new Audio("sound/giorno.ogg");
giornoMusic.loop = true;
giornoMusic.volume = 0.2;

let minecraftMusic = new Audio("sound/minecraft.ogg");
minecraftMusic.loop = true;



let gz = document.getElementById("game-zone");

let screenWidth = 1400;
let screenHeight = 800;

let score = 0;
let totalScore = 0;

let scoreText = document.getElementById("score");
let totalScoreText = document.getElementById("total-score");


adjustScore(0);

inter1();