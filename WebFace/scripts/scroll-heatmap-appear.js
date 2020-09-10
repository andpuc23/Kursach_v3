'use strict'

let btnMLP     =   document.querySelectorAll('#mlp');
let chsNetwork =  [document.querySelector('.chooseNetwork')
                 ]; //, document.querySelector('.chooseNetwork-RBF')
let toHide     =  [document.querySelector('#top-controls')
                 , document.querySelector('#MLP_main')];
let btmOutput  =   document.querySelector('#bottom-output');

document.addEventListener('wheel', raiseHeatMap);
chsNetwork.forEach(item => {
    item.addEventListener('click', (e) => {
        if(e.target == btnMLP[0] || e.target == btnMLP[1]) {
            document.addEventListener('wheel', raiseHeatMap);
        } else {
            document.removeEventListener('wheel', raiseHeatMap);
        }
    })
})

function raiseHeatMap(e) {
    if(e.deltaY > 0) {
        toHide.forEach((item) => {
            item.style.opacity = 0;
        });
        btmOutput.classList.add('shift');
    } else if(e.deltaY < 0) {
        toHide.forEach((item) => {
            item.style.opacity = 1;
        });
        btmOutput.classList.remove('shift');
    }
}