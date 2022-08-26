var keyBox = document.search.key;

// обработчик изменения текста
function onchange(e){
    // получаем элемент printBlock
    var printBlock = document.getElementById("name");
    // получаем новое значение
    var val = e.target.value;
    // установка значения
    printBlock.textContent = val;
}
// обработка потери фокуса
function onblur(e){

    // получаем его значение и обрезаем все пробелы
    var text = keyBox.value.trim();
    if(text==="")
        keyBox.style.borderColor = "red";
    else
        keyBox.style.borderColor = "green";
}
// получение фокуса
function onfocus(e){

    // установка цвета границ поля
    keyBox.style.borderColor = "blue";
}
keyBox.addEventListener("change", onchange);
keyBox.addEventListener("blur", onblur);
keyBox.addEventListener("focus", onfocus);