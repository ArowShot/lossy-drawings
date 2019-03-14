// import Path from 'path-parser';
import '@webcomponents/webcomponentsjs/webcomponents-bundle.js'
import './native-shim';
import DrawingCanvas from './components/drawingcanvas/drawingcanvas';
import PalettePicker from './components/palettepicker/palettepicker';
import ColorPicker from './components/colorpicker/colorpicker';
import GameCanvas from './components/gamecanvas/gamecanvas';
import Summary from './components/summary/summary';
import GameSelect from './components/gameselect/gameselect';

customElements.define('drawing-canvas', DrawingCanvas);
customElements.define('palette-picker', PalettePicker);
customElements.define('color-picker', ColorPicker);
customElements.define('game-canvas', GameCanvas);
customElements.define('game-summary', Summary);
customElements.define('game-select', GameSelect);

const drawingPool = [
  'A one-eyed cat weilding two red lightsabers',
]

const gameManager = {
  restartGame() {
    if(this.currentScreen)
      this.currentScreen.parentNode.removeChild(this.currentScreen);

    window.history.replaceState({}, '', '/')
    
    let menu = document.createElement('game-select');

    menu.addEventListener('ready', (e) => {
      this.playerName = e.detail.playerName;
      this.roomName = e.detail.roomName;

      gameManager.startGame()
    })

    document.body.appendChild(menu);

    this.currentScreen = menu;
  },

  showSummary(drawing) {
    if(this.currentScreen)
      this.currentScreen.parentNode.removeChild(this.currentScreen);

    window.history.replaceState({}, '', `/${this.roomName}/summary`)

    let summary = document.createElement('game-summary');
    summary.setAttribute('drawing', drawing);

    summary.addEventListener('done', (e) => {
      gameManager.restartGame()
    })

    document.body.appendChild(summary);

    this.currentScreen = summary;
  },

  startGame() {
    if(this.currentScreen)
      this.currentScreen.parentNode.removeChild(this.currentScreen);

    window.history.replaceState({}, '', `/${this.roomName}/draw`)
    
    let gameCanvas = document.createElement('game-canvas');
    gameCanvas.setAttribute('drawing', drawingPool[Math.floor(Math.random()*drawingPool.length)]);

    document.body.appendChild(gameCanvas);

    gameCanvas.addEventListener('submitdrawing', (e) => {
      gameManager.showSummary(e.detail.drawing)
      /*let summary = document.createElement('game-summary');
      summary.setAttribute('drawing', e.detail.drawing);
      document.body.appendChild(summary);
      console.log(e);*/
    });

    this.currentScreen = gameCanvas;
  }
}

window.gameManager = gameManager

gameManager.restartGame();


// const gameRoute = new Path('/game/:gameid/');
// const drawRoute = new Path('/game/:gameid/draw');
function handleRouteChange() {
  // const route = window.location.pathname;
  // console.log(route, drawRoute.test(route));
}

window.onpopstate = handleRouteChange;
window.history.onpushstate = handleRouteChange;
handleRouteChange();
