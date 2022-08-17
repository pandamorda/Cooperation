let profile = document.querySelector('.profile');
let buttons = document.querySelector('.buttons');
let arrow = document.querySelector('.arrow');

buttons.style.visibility = "hidden";

profile.addEventListener('click', handler => {
    profile.classList.add('profile-disappear');
    setTimeout(function() {
        profile.style.visibility = "hidden";
        buttons.style.visibility = "visible";
        buttons.classList.add('buttons-appear');
    }, 250);
    setTimeout(function() {
    profile.classList.remove('profile-disappear');
    buttons.classList.remove('buttons-appear');
    },1250);
});

arrow.addEventListener('click',handler =>{
    buttons.classList.add('buttons-disappear');
    setTimeout(function(){
        buttons.style.visibility = "hidden";
        profile.style.visibility = "visible";
        profile.classList.add('profile-appear');
    },250);
    setTimeout(function() {
        profile.classList.remove('profile-appear');
        buttons.classList.remove('buttons-disappear');
    },1250);
});
