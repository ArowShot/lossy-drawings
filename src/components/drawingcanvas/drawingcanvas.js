import * as fs from 'fs';

const styles = fs.readFileSync(`${__dirname}/drawingcanvas.css`); // eslint-disable-line no-path-context, no-path-concat

export class DrawingPart {
  constructor(width, color) {
    this.width = width;
    this.color = color;
  }
}

export class LinePart extends DrawingPart {
  constructor(width, color) {
    super(width, color);

    this.line = [];
  }

  addPoint(x, y) {
    this.line.push([x, y]);
  }

  draw(ctx) {
    if (this.line.length > 0) {
      ctx.beginPath();

      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.lineWidth = this.width;
      ctx.strokeStyle = this.color;

      ctx.moveTo(this.line[0][0], this.line[0][1]);
      this.line.forEach((point) => {
        ctx.lineTo(point[0], point[1]);
      });

      // ctx.closePath();
      ctx.stroke();
    }
  }
}

function getMousePos(canvas, evt) {
  const rect = canvas.getBoundingClientRect(); // abs. size of element
  const scaleX = canvas.width / rect.width; // relationship bitmap vs. element for X
  const scaleY = canvas.height / rect.height; // relationship bitmap vs. element for Y

  return {
    x: (evt.clientX - rect.left) * scaleX, // scale mouse coordinates after they have
    y: (evt.clientY - rect.top) * scaleY, // been adjusted to be relative to element
  };
}


export class DrawingCanvas extends HTMLElement {
  static get observedAttributes() {
    return ['text'];
  }

  constructor() {
    super();
    this.lines = [];
    this.drawcolor = 'black';
    this.pensize = 12;

    const shadow = this.attachShadow({ mode: 'open' });

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    this.canvas = canvas;

    canvas.addEventListener('mousedown', (e) => {
      this.drawing = true;
      this.startLine(e);
      this.renderDrawing();
    });
    canvas.addEventListener('mouseup', () => {
      this.drawing = false;
    });
    document.addEventListener('mousemove', (e) => {
      if (e.buttons === 0) {
        this.drawing = false;
      }
      if (this.drawing) {
        this.continueLine(e);
        this.renderDrawing();
      }
    });
    this.ctx = canvas.getContext('2d');

    const style = document.createElement('style');
    style.textContent = styles;

    const button = document.createElement('button');
    button.textContent = 'Submit';
    button.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('submitdrawing', {
        detail: {
          drawing: canvas.toDataURL(),
        },
      }));
    });

    const palette = this.generatePalette(['red', 'orange', 'yellow', 'lime', 'green', 'cyan', 'blue', 'purple', 'black']);

    shadow.appendChild(style);
    shadow.appendChild(palette);
    shadow.appendChild(canvas);
    shadow.appendChild(button);
  }

  // connectedCallback() {
  //   this.ctx.fillStyle = 'black';
  //   this.ctx.fillText(this.getAttribute('text'), 10, 10);
  // }

  startLine(e) {
    const { x, y } = getMousePos(this.ctx.canvas, e);
    this.lines.push(new LinePart(this.pensize, this.drawcolor));
    this.lines[this.lines.length - 1].addPoint(
      x,
      y,
    );
  }

  continueLine(e) {
    const { x, y } = getMousePos(this.ctx.canvas, e);
    this.lines[this.lines.length - 1].addPoint(
      x,
      y,
    );
  }

  renderDrawing() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.lines.forEach((part) => {
      part.draw(this.ctx);
    });
  }

  generatePalette(colors) {
    const container = document.createElement('div');
    container.classList.add('palette');

    colors.forEach((color) => {
      const colorElement = document.createElement('div');
      colorElement.setAttribute('style', `width: 20px;height: 20px;background: ${color};`);
      colorElement.classList.add('color');

      colorElement.addEventListener('click', () => {
        this.drawcolor = color;
      });

      container.appendChild(colorElement);
    });

    return container;
  }
}
