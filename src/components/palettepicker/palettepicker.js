import * as fs from 'fs';

const styles = fs.readFileSync(`${__dirname}/palettepicker.css`); // eslint-disable-line no-path-context, no-path-concat


export class PalettePicker extends HTMLElement {
  static get observedAttributes() {
    return ['palette'];
  }

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });
    this.shadow = shadow;

    const style = document.createElement('style');
    style.textContent = styles;

    //this.palette = this.generatePalette(['red', 'orange', 'yellow', 'lime', 'green', 'cyan', 'blue', 'purple', 'black']);

    shadow.appendChild(style);
    //shadow.appendChild(palette);
  }

  connectedCallback() {
    this.container = document.createElement('div');
    this.container.classList.add('palette');

    this.shadow.appendChild(this.container);

    this.generatePalette();
  }

  attributeChangedCallback(a, b, c) {
    if(!this.container) {
      return;
    }

    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }

    this.generatePalette();
  }

  generatePalette() {
    this.palette = this.getAttribute('palette').split(';');

    for(let i = 0; i < 32; i++) {
      const colorElement = document.createElement('div');

      let color = 'rgba(0,0,0,0)';
      if(this.palette[i]) {
        color = this.palette[i];

        colorElement.addEventListener('click', () => {
          if(this.selectedColorElement) {
            this.selectedColorElement.classList.remove('selected');
          }
          this.selectedcolor = color;
          this.selectedColorElement = colorElement;
          colorElement.classList.add('selected');
  
          this.dispatchEvent(new CustomEvent('selectcolor', {
            detail: {
              color,
            },
          }));
        });
      } else {
        colorElement.setAttribute('disabled', '');
      }

      colorElement.setAttribute('style', `background: ${color};`);
      colorElement.classList.add('color');

      if(this.selectedcolor === color) {
        this.selectedColorElement = colorElement;
        colorElement.classList.add('selected');
      }

      this.container.appendChild(colorElement);
    }
  }

  addColor(color) {
    this.palette = this.getAttribute('palette').split(';');
    
    this.palette = [color, ...this.palette].splice(0, 32);

    this.setAttribute('palette', this.palette.join(';'));
  }
}
