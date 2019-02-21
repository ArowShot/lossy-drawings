import * as fs from 'fs';

const styles = fs.readFileSync(`${__dirname}/gamecanvas.css`); // eslint-disable-line no-path-context, no-path-concat

// TODO: this code can be cleaned up a lot
export default class ColorPicker extends HTMLElement {
  static get observedAttributes() {
    return ['drawing'];
  }

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = styles;

    const canvas = document.createElement('drawing-canvas');

    const title = document.createElement('h2');
    title.textContent = 'You must draw';

    const drawingString = document.createElement('h1');
    drawingString.textContent = this.getAttribute('drawing');
    this.drawingString = drawingString;

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';
    submitButton.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('submitdrawing', {
        detail: {
          drawing: canvas.toDataURL(),
        },
      }));
    });

    shadow.appendChild(style);
    shadow.appendChild(title);
    shadow.appendChild(drawingString);
    shadow.appendChild(canvas);
    shadow.appendChild(submitButton);
  }

  connectedCallback() {
    this.drawingString.textContent = this.getAttribute('drawing');
  }
}
