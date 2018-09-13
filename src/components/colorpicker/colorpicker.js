import * as fs from 'fs';

const styles = fs.readFileSync(`${__dirname}/colorpicker.css`); // eslint-disable-line no-path-context, no-path-concat


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

    this.hue = 0;
    const hSlider = document.createElement('div');
    hSlider.classList.add('hslider');

    const hSliderThumb = document.createElement('div');
    hSliderThumb.classList.add('thumb');
    hSliderThumb.addEventListener('mousedown', (e) => {
      e.preventDefault();
      const picker = this;
      document.addEventListener('mousemove', function moveListener(movee) {
        const rect = hSlider.getBoundingClientRect();
        let percentage = (movee.clientY - rect.top - (rect.width / 2)) / (rect.height - rect.width);
        percentage = Math.min(Math.max(percentage, 0), 1);
        hSliderThumb.setAttribute('style', `top:${percentage * (rect.height - rect.width)}px;`);
        picker.hue = percentage * 360;

        if (movee.buttons === 0) {
          document.removeEventListener('mousemove', moveListener);
        }
      });
    });
    hSlider.appendChild(hSliderThumb);

    this.sat = 100;
    this.sSlider = document.createElement('div');
    this.sSlider.classList.add('sslider');

    this.lit = 50;
    this.lSlider = document.createElement('div');
    this.lSlider.classList.add('lslider');

    const outColor = document.createElement('div');
    outColor.classList.add('outcolor');
    outColor.addEventListener('mousedown', (e) => {
      e.preventDefault();

      this.dispatchEvent(new CustomEvent('addcolor', {
        detail: {
          color: `hsl(${this.hue}, 100%, 50%)`,
        },
      }));
    });

    sliders.appendChild(hSlider);
    sliders.appendChild(this.sSlider);
    sliders.appendChild(this.lSlider);

    colorPicker.appendChild(sliders);
    colorPicker.appendChild(outColor);

    shadow.appendChild(style);
    shadow.appendChild(colorPicker);
  }
}
