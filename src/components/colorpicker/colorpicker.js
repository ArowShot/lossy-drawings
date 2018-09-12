import * as fs from 'fs';

const styles = fs.readFileSync(`${__dirname}/colorpicker.css`); // eslint-disable-line no-path-context, no-path-concat


export class ColorPicker extends HTMLElement {

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = styles;

    const container = document.createElement('div');
    container.classList.add('colorpicker');

    const hSlider = document.createElement('div');
    hSlider.classList.add('hslider');
    const sSlider = document.createElement('div');
    sSlider.classList.add('sslider');
    const lSlider = document.createElement('div');
    lSlider.classList.add('lslider');

    container.appendChild(hSlider);
    container.appendChild(sSlider);
    container.appendChild(lSlider);

    shadow.appendChild(style);
    shadow.appendChild(container);
  }
}
