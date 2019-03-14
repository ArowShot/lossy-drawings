import * as fs from 'fs';

const styles = fs.readFileSync(`${__dirname}/summary.css`); // eslint-disable-line no-path-context, no-path-concat

// TODO: this code can be cleaned up a lot
export default class Summary extends HTMLElement {
  static get observedAttributes() {
    return ['drawing'];
  }

  attributeChangedCallback() {
    if (!this.image) {
      return;
    }

    this.image.setAttribute('src', this.getAttribute('drawing'))
  }

  connectedCallback() {
    this.image.setAttribute('src', this.getAttribute('drawing'))
  }

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = styles;

    const image = document.createElement('img');
    image.setAttribute('src', this.getAttribute('drawing'))
    this.image = image;

    const title = document.createElement('h1');
    title.textContent = 'Game Over';

    const drawerDtring = document.createElement('h2');
    drawerDtring.textContent = `${gameManager.playerName}'s drawing:`;
    this.drawingString = drawerDtring;

    const done = document.createElement('button');
    done.textContent = 'Done';
    done.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('done'));
    });

    shadow.appendChild(style);
    shadow.appendChild(title);
    shadow.appendChild(drawerDtring);
    shadow.appendChild(image);
    shadow.appendChild(done);
  }
}
