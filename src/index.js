// import Path from 'path-parser';
import '@webcomponents/webcomponentsjs/webcomponents-bundle.js'
import './native-shim';
import DrawingCanvas from './components/drawingcanvas/drawingcanvas';
import PalettePicker from './components/palettepicker/palettepicker';
import ColorPicker from './components/colorpicker/colorpicker';
import GameCanvas from './components/gamecanvas/gamecanvas';

customElements.define('drawing-canvas', DrawingCanvas);
customElements.define('palette-picker', PalettePicker);
customElements.define('color-picker', ColorPicker);
customElements.define('game-canvas', GameCanvas);

const canvas = document.querySelector('game-canvas');
canvas.addEventListener('submitdrawing', (e) => {
  console.log(e);
});

// const gameRoute = new Path('/game/:gameid/');
// const drawRoute = new Path('/game/:gameid/draw');
function handleRouteChange() {
  // const route = window.location.pathname;
  // console.log(route, drawRoute.test(route));
}

window.onpopstate = handleRouteChange;
window.history.onpushstate = handleRouteChange;
handleRouteChange();
