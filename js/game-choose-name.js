function handleFormSubmit(){
    let textBox = document.querySelector("input");
    localStorage.setItem("current", textBox.value);
}


document.getElementById("reg").addEventListener('submit', handleFormSubmit)