// import Path from 'path-parser';
import './native-shim';
import { DrawingCanvas } from './components/drawingcanvas/drawingcanvas';

customElements.define('drawing-canvas', DrawingCanvas);

const canvas = document.querySelector('drawing-canvas');
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
