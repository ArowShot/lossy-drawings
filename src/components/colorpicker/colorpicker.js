import * as fs from 'fs';

const styles = fs.readFileSync(`${__dirname}/colorpicker.css`); // eslint-disable-line no-path-context, no-path-concat

// TODO: this code can be cleaned up a lot
export default class ColorPicker extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = styles;


    const colorPicker = document.createElement('div');
    colorPicker.classList.add('colorpicker');

    const sliders = document.createElement('div');
    sliders.classList.add('sliders');

    // HUE
    this.hue = 0;
    this.hSlider = document.createElement('div');

    const hSliderThumb = document.createElement('div');
    hSliderThumb.classList.add('thumb');
    hSliderThumb.style.top = `${0 * (428)}px`;
    this.hSlider.addEventListener('mousedown', (e) => {
      e.preventDefault();

      let updatevalue = (movee) => {
        if (movee.buttons === 0) {
          document.removeEventListener('mousemove', updatevalue);
          return;
        }

        const rect = this.hSlider.getBoundingClientRect();
        let percentage = (movee.clientY - rect.top - (rect.width / 2)) / (rect.height - rect.width);
        percentage = Math.min(Math.max(percentage, 0), 1);
        hSliderThumb.style.top = `${percentage * (rect.height - rect.width)}px`;
        this.hue = percentage * 360;
        
        this.updateColors();
      }

      document.addEventListener('mousemove', updatevalue);
      updatevalue(e);
    });
    this.hSlider.appendChild(hSliderThumb);

    // SAT
    this.sat = 100;
    this.sSlider = document.createElement('div');

    const sSliderThumb = document.createElement('div');
    sSliderThumb.classList.add('thumb');
    sSliderThumb.style.top = `${1 * (428)}px`;
    this.sSlider.addEventListener('mousedown', (e) => {
      e.preventDefault();

      let updatevalue = (movee) => {
        if (movee.buttons === 0) {
          document.removeEventListener('mousemove', updatevalue);
          return;
        }

        const rect = this.sSlider.getBoundingClientRect();
        let percentage = (movee.clientY - rect.top - (rect.width / 2)) / (rect.height - rect.width);
        percentage = Math.min(Math.max(percentage, 0), 1);
        sSliderThumb.style.top = `${percentage * (428)}px`;
        this.sat = percentage * 100;
        
        this.updateColors();
      }

      document.addEventListener('mousemove', updatevalue);
      updatevalue(e);
    });
    this.sSlider.appendChild(sSliderThumb);

    // LIGHT
    this.lit = 50;
    this.lSlider = document.createElement('div');
    
    const lSliderThumb = document.createElement('div');
    lSliderThumb.classList.add('thumb');
    lSliderThumb.style.top = `${0.5 * (428)}px`;
    this.lSlider.addEventListener('mousedown', (e) => {
      e.preventDefault();

      let updatevalue = (movee) => {
        if (movee.buttons === 0) {
          document.removeEventListener('mousemove', updatevalue);
          return;
        }

        const rect = this.lSlider.getBoundingClientRect();
        let percentage = (movee.clientY - rect.top - (rect.width / 2)) / (rect.height - rect.width);
        percentage = Math.min(Math.max(percentage, 0), 1);
        lSliderThumb.style.top = `${percentage * (rect.height - rect.width)}px`;
        this.lit = percentage * 100;
        
        this.updateColors();
      }

      document.addEventListener('mousemove', updatevalue);
      updatevalue(e);
    });
    this.lSlider.appendChild(lSliderThumb);


    this.outColor = document.createElement('div');
    this.outColor.classList.add('outcolor');
    this.outColor.addEventListener('mousedown', (e) => {
      e.preventDefault();

      this.dispatchEvent(new CustomEvent('addcolor', {
        detail: {
          color: `hsl(${this.hue}, ${this.sat}%, ${this.lit}%)`,
        },
      }));
    });

    this.updateColors();

    sliders.appendChild(this.hSlider);
    sliders.appendChild(this.sSlider);
    sliders.appendChild(this.lSlider);

    colorPicker.appendChild(sliders);
    colorPicker.appendChild(this.outColor);

    shadow.appendChild(style);
    shadow.appendChild(colorPicker);
  }

  updateColors() {
    let hueBg = 'linear-gradient(to bottom, ';
    for(let i = 0; i <= 8; i++) {
      // hueBg += `hsl(${(360 / 8) * i}, ${this.sat}%, ${this.lit}%) ${(100 / 8) * i}%`
      hueBg += `hsl(${(360 / 8) * i}, 100%, 50%) ${(100 / 8) * i}%`
      if(i != 8) {
        hueBg += ', ';
      }
    }
    hueBg += ')';
    this.hSlider.style.background = hueBg;

    // let satBg = `linear-gradient(to bottom, hsl(${this.hue}, 0%, ${this.lit}%) 0%, hsl(${this.hue}, 100%, ${this.lit}%) 100%)`;
    let satBg = `linear-gradient(to bottom, hsl(${this.hue}, 0%, 50%) 0%, hsl(${this.hue}, 100%, 50%) 100%)`;
    this.sSlider.style.background = satBg;

    let litBg = `linear-gradient(to bottom, hsl(0, 0%, 0%) 0%, hsl(${this.hue}, ${this.sat}%, 50%) 20%, hsl(0, 0%, 100%) 100%)`;
    this.lSlider.style.background = litBg;
    this.lSlider.setAttribute('bs', satBg);

    this.outColor.style.background = `hsl(${this.hue}, ${this.sat}%, ${this.lit}%)`;
  }
}
