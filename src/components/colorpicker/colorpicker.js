import * as fs from 'fs';

const styles = fs.readFileSync(`${__dirname}/colorpicker.css`); // eslint-disable-line no-path-context, no-path-concat


export class ColorPicker extends HTMLElement {

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = styles;


    const container = document.createElement('div');
    container.classList.add('palette');

    shadow.appendChild(style);
    shadow.appendChild(container);
  }
}
