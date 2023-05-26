
document.querySelector(".your-score-table>p").innerHTML = "<strong>Ваш счет</strong><br>" + localStorage.getItem("current") + ": " + localStorage.getItem("current-score");

let scores = document.querySelector(".score-table>p");

let scoreTable = JSON.parse(localStorage.getItem("score-table"));

let str = "<strong>Лучшие игроки:</strong>";
if(scoreTable != null){
    scoreTable.forEach(element => {
        str += "<br>" + element.nick + ": " + element.score;
    });
}
scores.innerHTML = str;
