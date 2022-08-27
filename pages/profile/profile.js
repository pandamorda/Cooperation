///---Change name,password,etc.---///
//name
const chName = document.querySelector('.name');
const nameForm = document.querySelector('.change-name');
const saveName = document.querySelector('.savename');
const nameField = document.querySelector('.namefield');
const enterName = document.querySelector('.inputName');

chName.addEventListener('click', _handler =>{
    nameForm.classList.toggle('hidden');
});

saveName.addEventListener('click', _handler =>{
    nameField.textContent = enterName.value;
});


//password
const chPassword = document.querySelector('.password');
const PasswordForm = document.querySelector('.change-password');
const savePassword = document.querySelector('.savepassword');
const PasswordField = document.querySelector('.password-field');
const enterPassword = document.querySelector('.inputPassword');

chPassword.addEventListener('click', _handler =>{
   PasswordForm.classList.toggle('hidden');
});

savePassword.addEventListener('click', _handler =>{
    PasswordField.textContent = enterPassword.value;
});

//email
const chEmail = document.querySelector('.mail');
const EmailForm = document.querySelector('.change-mail');
const saveEmail = document.querySelector('.savemail');
const enterEmail = document.querySelector('.inputMail');
const EmailField = document.querySelector('.mail-field');

chEmail.addEventListener('click', _handler =>{
    EmailForm.classList.toggle('hidden');
});

saveEmail.addEventListener('click', _handler =>{
    EmailField.textContent = enterEmail.value;
});



































// var keyBox = document.search.key;

// // обработчик изменения текста
// function onchange(e){
//     // получаем элемент printBlock
//     var printBlock = document.getElementById("name");
//     // получаем новое значение
//     var val = e.target.value;
//     // установка значения
//     printBlock.textContent = val;
// }
// // обработка потери фокуса
// function onblur(e){

//     // получаем его значение и обрезаем все пробелы
//     var text = keyBox.value.trim();
//     if(text==="")
//         keyBox.style.borderColor = "red";
//     else
//         keyBox.style.borderColor = "green";
// }
// // получение фокуса
// function onfocus(e){

//     // установка цвета границ поля
//     keyBox.style.borderColor = "blue";
// }
// keyBox.addEventListener("change", onchange);
// keyBox.addEventListener("blur", onblur);
// keyBox.addEventListener("focus", onfocus);

