let boxes = document.querySelectorAll(".box");
let turnX=true;
let winnerTxt = document.querySelector(".winnerTxt");
let menu = document.querySelector(".menu");
let containerB = document.querySelector(".container");
let restartBtn = document.querySelector("#restartBtn");
let resetBtn = document.querySelector("#resetBtn");
let optionsBar = document.querySelector(".optionsBar");

const winPattern = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
];

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

        checkWinner();
        checkDraw();
    })
})

const checkDraw = () => {
    let allFilled = true;
    for(let box of boxes){
        if(box.innerHTML == ""){
            allFilled = false;
            break;
        }
    }
    if(allFilled == true){
        winnerTxt.innerHTML = `Oops! There is a Draw`;
        containerB.style.display = "none";
        optionsBar.style.display = "none";
        menu.style.display = "flex";
    }
}

const checkWinner = () => {
    for(let pattern of winPattern){
        let posVal1 = boxes[pattern[0]].innerHTML;
        let posVal2 = boxes[pattern[1]].innerHTML;
        let posVal3 = boxes[pattern[2]].innerHTML;

        if(posVal1!="" && posVal2!="" && posVal3!=""){
            if(posVal1==posVal2 && posVal2==posVal3){
                winnerTxt.innerHTML = `Congratulations! Winner is ${posVal1} player`;
                containerB.style.display = "none";
                optionsBar.style.display = "none";
                menu.style.display = "flex";
            }
        }
    }
}   

let enableBoxes = () => {
    for(let box of boxes){
        box.disabled = false;
        box.innerHTML="";
    }
}

const resetGame = () => {
    turnX=true;
    enableBoxes();
    containerB.style.display = "flex";
    optionsBar.style.display = "block";
    menu.style.display = "none";
}

restartBtn.addEventListener("click",resetGame);
resetBtn.addEventListener("click",resetGame);