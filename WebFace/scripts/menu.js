'use strict';

// Навешивание методов
['mlp', 'rbf'/*, 'cmac'*/].forEach(id => {
    document.querySelectorAll(`#${id}`).forEach(
      element => element.addEventListener('click', 
        changeNetwork.bind(null, id.toLocaleUpperCase())));
});

let menu = { // Добавить всё, что связано с интерфейсом нейросеток
  ['MLP'] : [document.querySelector('#MLP_top.container.l--page'), 
             document.querySelector('#MLP_main')],
  ['RBF'] : [document.querySelector('#RBF_top.container.l--page'),
             document.querySelector('#RBF_main')],
  // ['CMAC'] : [document.querySelector('#CMAC_top.container.l--page'),
  //             document.querySelector('#CMAC_main')],
};

let currentNetwork = 'MLP';

window.addEventListener('load', () => {
  changeNetwork('MLP');
  rePosBracket();
});

/**
 * Меняем нейронку
 * @param network - MLP | RBF | CMAC
 */
function changeNetwork(network) {
    // Удаляем лишнее
    killInterface(currentNetwork);
    currentNetwork = network;
    // Вставляем нужное
    for (let i = 0; i < menu[currentNetwork].length; i++) {
      menu[currentNetwork][i].setAttribute('style', 'display: content;');
    }
    // Остановить все процессы MLP. Можно просто ставить на паузу, а не уничтожать
    player.pause();
    playerRBF.pause();

//    switch (currentNetwork) {
//      case 'MLP': state.serialize(); break;
//      case 'RBF': stateRBF.serialize(); break;
//      default:
//        console.log('Что-то не так.')
//        break;
//    }

    // Меняем логику запуска [oneStep]

    // Также нужно менять State, однако, это уже нужно будет со значениями нейронки

}

/**
 * Удаляет весь интерфейс со страницы
 */
function killInterface() {
  ['MLP', 'RBF'/*, 'CMAC'*/].forEach(id => {
    for (let i = 0; i < menu[id].length; i++) {
      menu[id][i].setAttribute('style', 'display: none;');
    } 
  });
}