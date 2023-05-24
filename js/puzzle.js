let area = document.getElementById("puzzle-area");
let bounds = area.getBoundingClientRect();
let wintext = document.getElementById("win_text");

let zombies = ["LadderZombie.png", "FlagZombie.png"];
let plants = ["sunflower.png", "peashooter.png"];

let x = area.getBoundingClientRect().x;
let y = area.getBoundingClientRect().y;

let offsetX = 0;
let offsetY = 0;

window.addEventListener("mousemove", mousemove);
document.getElementById("shuffle_btn").addEventListener("click", randomize);

zombies.forEach(element => {
    let t = document.createElement("div");
    t.classList.add("piece");
    t.style.backgroundImage = `url("img/${element}")`;
    t.draggable = true;
    t.style.transform = "rotate(0deg)";
    area.appendChild(t);

    t.classList.add("zombie");
});

plants.forEach(element => {
    let t = document.createElement("div");
    t.classList.add("piece");
    t.style.backgroundImage = `url("img/${element}")`;
    t.draggable = true;
    t.style.transform = "rotate(0deg)";
    area.appendChild(t);

    t.classList.add("plant");
});

let plantElements = document.querySelectorAll(".plant");
let zombieElements = document.querySelectorAll(".zombie");

plantElements.forEach(element => {
    element.addEventListener("dragstart", dragstart);
    element.addEventListener("dragend", dragend);
    element.addEventListener("click", elementClick);
});

zombieElements.forEach(element => {
    element.addEventListener("dragstart", dragstart);
    element.addEventListener("dragend", dragend);
    element.addEventListener("click", elementClick);
});

randomize();

function setElementPosition(posX, posY, element){
    let elBounds = element.getBoundingClientRect();

    let newX = posX - offsetX - bounds.x;
    let newY = posY - offsetY - bounds.y;

    if(newX < 0)
        newX = 0;
    if(newY < 0)
        newY = 0;
    if(newX > bounds.width - elBounds.width)
        newX = bounds.width - elBounds.width;
    if(newY > bounds.height - elBounds.height)
        newY = bounds.height - elBounds.height;
        

    element.style.left = newX + "px";
    element.style.top = newY + "px";
}


function dragstart(e){
    setTimeout(() => e.target.classList.add("piece--hidden"), 0);
    offsetX = x - e.target.getBoundingClientRect().x;
    offsetY = y - e.target.getBoundingClientRect().y;
}

function dragend(e){
    setTimeout(() => {
        e.target.classList.remove("piece--hidden");
        setElementPosition(x, y, e.target);
        tryComplete();
    }, 100);
}

function mousemove(event){
    x = event.pageX;
    y = event.pageY;
}

function elementClick(e){
    let curRot = e.target.style.transform.replaceAll(/\D/g, "") / 90;
    curRot = (curRot +3) % 4 * 90;
    e.target.style.transform = `rotate(${curRot}deg)`;
    tryComplete();
}

function randomize(){
    zombieElements.forEach(element => {
        let rot = Math.floor(Math.random() * 4) * 90;
        element.style.transform = `rotate(${rot}deg)`;
        setElementPosition(
            Math.floor(Math.random() * bounds.width) + bounds.x,
            Math.floor(Math.random() * bounds.height) + bounds.y,
            element
        )
    });
    plantElements.forEach(element => {
        let rot = Math.floor(Math.random() * 4) * 90;
        element.style.transform = `rotate(${rot}deg)`;
        setElementPosition(
            Math.floor(Math.random() * bounds.width) + bounds.x,
            Math.floor(Math.random() * bounds.height) + bounds.y,
            element
        )
    });
    if(tryComplete())
        randomize();
}

function tryComplete(){
    let won = check();
    wintext.style.display = won ? "block" : "none";
    return won;    
}

function check(){
    let sizeX = plantElements[0].getBoundingClientRect().width;
    let sizeY = plantElements[0].getBoundingClientRect().height;

    let minX = plantElements[0].getBoundingClientRect().x;
    let minY = plantElements[0].getBoundingClientRect().y;
    let maxX = plantElements[0].getBoundingClientRect().x;
    let maxY = plantElements[0].getBoundingClientRect().y;

    let rotFailed = false;
    let onRoad = false;

    plantElements.forEach(element => {
        if(!checkRotation(element)){
            rotFailed = true;
            return false;
        }
        rect = element.getBoundingClientRect();
        if(rect.x > 500){
            onRoad = true;
            return false;
    }

        if(rect.x < minX)
            minX = rect.x;
        if(rect.x > maxX)
            maxX = rect.x;
        if(rect.y < minY)
            minY = rect.y;
        if(rect.y > maxY)
            maxY = rect.y;
    });

    if(maxX - minX > sizeX || maxY - minY > sizeY || rotFailed || onRoad)
        return false;
    
    let plantMinX = minX;
    let plantMinY = minY;
    let plantMaxX = maxX;
    let plantMaxY = maxY;

    minX = zombieElements[0].getBoundingClientRect().x;
    minY = zombieElements[0].getBoundingClientRect().y;
    maxX = zombieElements[0].getBoundingClientRect().x;
    maxY = zombieElements[0].getBoundingClientRect().y;

    zombieElements.forEach(element => {
        if(!checkRotation(element)){
            rotFailed = true;
            return false;
        }
        rect = element.getBoundingClientRect();
        if(rect.x < minX)
            minX = rect.x;
        if(rect.x > maxX)
            maxX = rect.x;
        if(rect.y < minY)
            minY = rect.y;
        if(rect.y > maxY)
            maxY = rect.y;
    });

    if(maxX - minX > sizeX || maxY - minY > sizeY || rotFailed)
        return false;

    minX = Math.min(minX, plantMinX);
    maxX = Math.max(maxX, plantMaxX);
    minY = Math.min(minY, plantMinY);
    maxY = Math.max(maxY, plantMaxY);

    if(maxX - minX <= 2 * sizeX && maxY - minY <= 2 * sizeY)
        return false;
    return true;
}

function checkRotation(element){
    let angle = element.style.transform.replaceAll(/\D/g, "");
    return angle == 0;
}