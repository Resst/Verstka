const latin = [
    "Почему курица полетела в космос?",
    "Сможет ли курица выжить в космосе?",
    "А существуют ли скидки?",
    "Ну что?"
];
const ru = [
    "Потому что это круто!",
    "С нами - да!",
    "Для студентов и преподавателей - скидка 50%",
    "По коням!"
];

const createButton = document.getElementById('create_button');
const colorButton = document.getElementById('color_button');
const aside = document.getElementById('latin_ru_aside');

let ol = document.createElement('ol');
aside.append(ol);

let i = 0;

createButton.addEventListener('click', () =>{
    if(i >= latin.length){
        alert("Фразы закончились");
        return;
    }
    
    let olLi = document.createElement('li');
    let ul = document.createElement('ul');
    let ulLi = document.createElement('li');

    let classN = "class" + (2 - ((i + 1) % 2));

    ol.append(olLi);
    olLi.className = classN;
    olLi.textContent = '"' + latin[i] + '"';

    ol.append(ul);

    ul.append(ulLi);
    ulLi.className = classN;
    ulLi.textContent = '"' + ru[i] + '"';
    aside.append(ol);
    i++;
});

colorButton.addEventListener('click', () =>{
    let toBeBold = document.querySelectorAll('.class2');

    toBeBold.forEach(e => {
        if(!e.classList.contains("bold_list"))
            e.classList.add("bold_list");
        else
            e.classList.remove("bold_list");
    });
})