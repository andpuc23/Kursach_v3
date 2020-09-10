'use strict'
let divUINumHiddenLayers = document.querySelector('.ui-numHiddenLayers')
  , divBracket           = document.querySelector('.bracket')
  , coords
  , objNeurons
  , nLayers;

window.addEventListener('load',   rePosBracket);
window.addEventListener('resize', rePosBracket);
divUINumHiddenLayers.addEventListener('click', rePosBracket);

function rePosBracket(e) {
  coords     = [];
  objNeurons = [];
  nLayers    = document.querySelector('#num-layers').innerHTML; 

  let ret;
  let netw = document.querySelector('#network');
  for(let i = 0, len = netw.children.length; i < len; i++) {
      if(netw.children[i].getAttribute('id') && netw.children[i].getAttribute('id').match(/canvas-\d/g)) {
          objNeurons.push(netw.children[i]);
      } else if(!objNeurons.length) {
          ret = true;
      }
  }
  if(ret) {
    divBracket.style.display = 'none';
    return;
  };
  if(nLayers > 1) {
    coords.push(objNeurons[objNeurons.length - 1].getBoundingClientRect()); // первый нейрон
    coords.push(objNeurons[0].getBoundingClientRect()); // последний нейрон
    coords.push(objNeurons[0].getBoundingClientRect().x - objNeurons[objNeurons.length - 1].getBoundingClientRect().x); // промежуток между слоями

    divBracket.style.width = `${coords[2] + coords[0].width}px`;
  } else if(nLayers == 1) {
    divBracket.style.display = 'block';
    coords.push(objNeurons[objNeurons.length - 1].getBoundingClientRect()); // последний нейрон

    divBracket.style.width = `${coords[0].width}px`;
  }

  divBracket.style.top   = `${coords[0].y - 80 + window.scrollY}px`;
  divBracket.style.left  = `${coords[0].x}px`;
  if(this == divUINumHiddenLayers && !divBracket.style.transition) { divBracket.style.transition = '.5s'; }
}