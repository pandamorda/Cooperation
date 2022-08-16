let animItem = document.querySelectorAll(".content-box");

animItem.forEach( e => {
    e.style.visibility ="hidden";
});

const animOnScroll = () =>{
    let windowPosition = (window.innerHeight) + window.scrollY;
    console.log(windowPosition);
    
    animItem.forEach((e, _index) =>{
        let scrollOffset = e.getBoundingClientRect().top - e.offsetHeight/5;
        if(windowPosition >= scrollOffset && e.getBoundingClientRect().top > -e.offsetHeight/4){
            e.style.visibility ="visible";
            if(_index % 2 == 0){
                e.classList.add('active-l');
            }
            else{
                e.classList.add('active-r');
            }
        }else{
            if(_index % 2 == 0){
                e.classList.remove('active-l');
            }
            else{
                e.classList.remove('active-r');
            }

            e.style.visibility ="hidden";
        }
    });
}

animOnScroll();
window.addEventListener('scroll', ()=>{
    animOnScroll();
});