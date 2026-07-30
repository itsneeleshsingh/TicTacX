let boxes = document.querySelectorAll(".box");
let turnX=true;
let winnerTxt = document.querySelector(".winnerTxt");
let menu = document.querySelector(".menu");
let containerB = document.querySelector(".container");
let restartBtn = document.querySelector("#restartBtn");
let resetBtn = document.querySelector("#resetBtn");
let optionsBar = document.querySelector(".optionsBar");

let isMute = false;
let muteBtn = document.querySelector("#muteBtn");
let boxClickS = new Audio("sounds/boxClick.mp3");
let drawS = new Audio("sounds/drawSound.mp3");
let winS = new Audio("sounds/winSound.mp3");

let toggleDarkBtn = document.querySelector("#toggleThemeBtn");

let infoBtn = document.querySelector("#infoBtn");
let shortcutsModal = document.querySelector("#shortcutsModal");
let closeModalBtn = document.querySelector("#closeModalBtn");

let vsCpuBtn = document.querySelector("#vsCpuBtn");
let vsPvpBtn = document.querySelector("#vsPvpBtn");
let cpuMode=true;

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
        if(!isMute){
            boxClickS.currentTime=0;
            boxClickS.play();
        }

        if(turnX){
            box.innerHTML = "X";
            box.setAttribute("data-player","X");
            turnX=false;
        }else{
            box.innerHTML = "O";
            box.setAttribute("data-player","O");
            turnX=true;
        }
        box.disabled = true;

        if(!checkWinner()){
            checkDraw();
        }

        if(cpuMode && !turnX){
            triggerComputerMove();
        }
        
    })
});

const triggerComputerMove = () => {
    setTimeout(() => {
        let bestMoveIndex = getBestMove();
        if (bestMoveIndex !== null && boxes[bestMoveIndex].innerHTML === "") {
            boxes[bestMoveIndex].click(); 
        }
    },500);
};

const checkDraw = () => {
    let allFilled = true;
    for(let box of boxes){
        if(box.innerHTML == ""){
            allFilled = false;
            break;
        }
    }
    if(allFilled == true){
        if(!isMute){
            drawS.currentTime=0;
            drawS.play();
        }
        winnerTxt.innerHTML = `Oops! There is a Draw`;
        optionsBar.style.display = "none";
        menu.style.display = "flex";
        disableBoxes();
    }
}

const checkWinner = () => {
    for(let pattern of winPattern){
        let posVal1 = boxes[pattern[0]].innerHTML;
        let posVal2 = boxes[pattern[1]].innerHTML;
        let posVal3 = boxes[pattern[2]].innerHTML;

        if(posVal1!="" && posVal2!="" && posVal3!=""){
            if(posVal1==posVal2 && posVal2==posVal3){
                if(!isMute){
                    winS.currentTime=0;
                    winS.play();
                }
                boxes[pattern[0]].classList.add("winBoxPulse");
                boxes[pattern[1]].classList.add("winBoxPulse");
                boxes[pattern[2]].classList.add("winBoxPulse");
                winnerTxt.innerHTML = `Congratulations! Winner is ${posVal1} player`;
                optionsBar.style.display = "none";
                menu.style.display = "flex";
                disableBoxes();
                return true;
            }
        }
    }
    return false;
};

let enableBoxes = () => {
    for(let box of boxes){
        box.disabled = false;   
        box.removeAttribute("data-player");
        box.classList.remove("winBoxPulse");
        box.innerHTML="";
    }
}

let disableBoxes = () => {
    for(let box of boxes){
        box.disabled = true;   
    }
}

const resetGame = () => {
    turnX=true;
    enableBoxes();
    optionsBar.style.display = "block";
    menu.style.display = "none";
}

restartBtn.addEventListener("click",resetGame);
resetBtn.addEventListener("click",resetGame);


// Dark Theme
toggleDarkBtn.addEventListener("click",() => {
    let currentTheme = document.body.getAttribute("data-theme");
    if(currentTheme === "light"){
        document.body.removeAttribute("data-theme");
    }else document.body.setAttribute("data-theme","light");
});


//Mute Button
muteBtn.addEventListener("click",() => {
    if(!isMute){
        muteBtn.classList.add("muteBtnX");
        isMute=true;
    }else{
        muteBtn.classList.remove("muteBtnX");
        isMute=false;
    }
});


//keyboard shortcuts
document.addEventListener("keydown",(event) => {
    if(event.key >= "1" && event.key <= "9"){
        let index = parseInt(event.key)-1;
        if(boxes[index] && !boxes[index].disabled){
            boxes[index].click();
        }
    }
    if(event.key.toLowerCase() === "r"){
        resetGame();
    }
});

//keyboard info
infoBtn.addEventListener("click",() => {
    shortcutsModal.style.display = "flex";
});

closeModalBtn.addEventListener("click",() => {
    shortcutsModal.style.display = "none";
});

document.addEventListener("click", (event) => {
    if(event.target === shortcutsModal){
        shortcutsModal.style.display = "none";
    }
});

//Computer mode
vsPvpBtn.addEventListener("click",() => {
    cpuMode=false;
    vsPvpBtn.classList.toggle("active");
    vsCpuBtn.classList.toggle("active");
});

vsCpuBtn.addEventListener("click",() => {
    cpuMode=true;
    vsCpuBtn.classList.toggle("active");
    vsPvpBtn.classList.toggle("active");
});

const getBestMove = () => {
    let bestScore=-Infinity;
    let bestMove = null;

    for(let i=0;i<boxes.length;i++){
        if(boxes[i].innerHTML === ""){
            boxes[i].innerHTML = "O";
            let score = minimax(boxes,0,false);
            boxes[i].innerHTML = "";

            if(score>bestScore){
                bestScore = score;
                bestMove = i;
            }
        }
    }
    return bestMove;
};

const minimax = (currentBoxes,depth,isMaximising) => {
    if(checkWinForPlayer("O")) return 10-depth;
    if(checkWinForPlayer("X")) return depth-10;
    if(isBoardFull()) return 0;

    if(isMaximising){
        let maxScore = -Infinity;
        for(let i=0;i<currentBoxes.length;i++){
            if(currentBoxes[i].innerHTML === ""){
                currentBoxes[i].innerHTML = "O";
                let score = minimax(currentBoxes,depth+1,false);
                currentBoxes[i].innerHTML = "";
                maxScore = Math.max(maxScore,score);
            }
        }
        return maxScore;
    }else{
        let minScore = Infinity;
        for(let i=0;i<currentBoxes.length;i++){
            if(currentBoxes[i].innerHTML === ""){
                currentBoxes[i].innerHTML = "X";
                let score = minimax(currentBoxes,depth+1,true);
                currentBoxes[i].innerHTML = "";
                minScore = Math.min(minScore,score);
            }
        }
        return minScore;
    }
};

const checkWinForPlayer = (player) => {
    for (let pattern of winPattern) {
        let posVal1 = boxes[pattern[0]].innerHTML;
        let posVal2 = boxes[pattern[1]].innerHTML;
        let posVal3 = boxes[pattern[2]].innerHTML;

        if (posVal1 === player && posVal2 === player && posVal3 === player) {
            return true;
        }
    }
    return false;
};

const isBoardFull = () => {
    for (let box of boxes) {
        if (box.innerHTML === "") {
            return false;
        }
    }
    return true;
};