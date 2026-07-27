let boxes = document.querySelectorAll(".box");
let turnX=true;

boxes.forEach((box) => {
    box.addEventListener("click",() => {
        if(turnX){
            box.innerHTML = "X";
            turnX=false;
        }else{
            box.innerHTML = "O";
            turnX=true;
        }
        box.disabled = true;
    })
})