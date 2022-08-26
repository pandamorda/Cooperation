document.getElementById("cnopka-nah").addEventListener("click",
    function (){
        let popup = document.querySelector(".--registration__popup");
        popup.classList.toggle("show-or-hide");
    }
)

document.querySelector(".popup-exit").addEventListener("click",
    function (){
        let popup_reg = document.querySelector(".--registration__popup");
        if(!popup_reg.classList.contains("show-or-hide")){
            popup_reg.classList.add("show-or-hide");
        }

        let popup_log = document.querySelector(".--login__popup");
        if(!popup_log.classList.contains("show-or-hide")){
            popup_log.classList.add("show-or-hide");
        }
    }
)

document.querySelector(".login-link").addEventListener("click",
    function (){
        let popup_reg = document.querySelector(".--registration__popup");
        let popup_log = document.querySelector(".--login__popup");
        popup_reg.classList.toggle("show-or-hide");
        popup_log.classList.toggle("show-or-hide");
    })

document.querySelector(".reg-link").addEventListener("click",
    function (){
        let popup_reg = document.querySelector(".--registration__popup");
        let popup_log = document.querySelector(".--login__popup");
        popup_reg.classList.toggle("show-or-hide");
        popup_log.classList.toggle("show-or-hide");
    })


const switchEle = document.querySelectorAll('.switch');
const containerEle = document.querySelector('.content');

switchEle.forEach(se => {
    se.addEventListener('click', ()=>{
        containerEle.classList.toggle('active')
    })
})

