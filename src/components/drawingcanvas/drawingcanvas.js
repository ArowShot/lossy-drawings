import * as fs from 'fs';
import imageURL from '../../../assets/transparency.png'

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

  draw(ctx, bgColor, transparencyTexture) {
    if (this.line.length > 0) {
      ctx.save();
      ctx.beginPath();

      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.lineWidth = this.width;
      ctx.strokeStyle = this.color === 'background' ? bgColor : this.color;

      if(ctx.strokeStyle === 'rgba(0, 0, 0, 0)') {
        ctx.strokeStyle = transparencyTexture;
        ctx.globalCompositeOperation = 'destination-out';
      }

      ctx.moveTo(this.line[0][0], this.line[0][1]);
      this.line.forEach((point) => {
        ctx.lineTo(point[0], point[1]);
      });

      ctx.stroke();
      ctx.restore();
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


export default class DrawingCanvas extends HTMLElement {
  static get observedAttributes() {
    return ['bgcolor'];
  }

  constructor() {
    super();
    this.undoHistory = [];
    this.redoHistory = [];
    this.layers = [[], [], [], []];
    this.layerCanvases = [];
    for(let i = 0; i < this.layers.length; i += 1) {
      let layerCanvas = document.createElement('canvas');
      layerCanvas.width = 512;
      layerCanvas.height = 512;
      layerCanvas.style.background = `url(${imageURL})`;
      layerCanvas.style.backgroundSize = `8px`;
      this.layerCanvases.push(layerCanvas.getContext('2d'));
    }
    this.currentLayer = 3;
    //this.lines = [];
    this.drawColor = 'black';
    this.penSize = 12;

    const shadow = this.attachShadow({ mode: 'open' });

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    this.canvas = canvas;

    canvas.addEventListener('contextmenu', (e) => {
      if (!e.ctrlKey) {
        e.preventDefault();
      }
    });
    canvas.addEventListener('mousewheel', (e) => {
      e.preventDefault();
      const multiplier = e.ctrlKey ? -80 : -4;
      this.penSize += multiplier * (e.deltaY / 100);
      this.penSize = Math.max(0, this.penSize);
      this.renderDrawing({});
    });
    canvas.addEventListener('mousedown', (e) => {
      e.preventDefault();
      this.drawing = true;
      if (e.button === 2) {
        this.startLine('background');
      } else {
        this.startLine();
      }
    });
    canvas.addEventListener('mouseup', () => {
      this.drawing = false;
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'z' && e.ctrlKey) {
        this.drawing = false;
        this.undoLine();
      } else if (e.key === 'y' && e.ctrlKey) {
        this.drawing = false;
        this.redoLine();
      }
    });

    // todo: add on connect; remove on disconnect
    this.moveListener = document.addEventListener('mousemove', (e) => {
      const { x, y } = getMousePos(this.ctx.canvas, e);
      this.mouseX = x;
      this.mouseY = y;

      if (e.buttons === 0) {
        this.drawing = false;
      }
      if (this.drawing) {
        this.continueLine();
      }

      this.renderDrawing({});
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

    const palette = document.createElement('palette-picker');
    palette.setAttribute('palette', ['red', 'orange', 'yellow', 'lime', 'green', 'cyan', 'blue', 'purple', 'pink', 'black', 'gray', 'white'].join(';'));
    palette.addEventListener('selectcolor', (e) => {
      this.drawColor = e.detail.color;
    });
    palette.addEventListener('selectbgcolor', (e) => {
      this.bgColor = e.detail.color;
    });
    window.p = palette;

    const picker = document.createElement('color-picker');
    picker.addEventListener('addcolor', (e) => {
      palette.selectedColor = e.detail.color;
      palette.addColor(e.detail.color);
      this.drawColor = e.detail.color;
    });
    window.pi = picker;

    const layers = document.createElement('div');
    layers.classList.add('layers');
    for(let i = 0; i < this.layers.length; i += 1) {
      let canvas = this.layerCanvases[i].canvas;
      canvas.addEventListener('mousedown', (e) => {
        e.preventDefault();
        if (e.ctrlKey) {
          let currentLayer = this.layers[this.currentLayer]
          let thisLayer = this.layers[i]

          this.layers[this.currentLayer] = thisLayer
          this.layers[i] = currentLayer

          this.currentLayer = i;

          this.renderDrawing({});
        }
        this.currentLayer = i;
        this.layerCanvases.forEach((ctx) => ctx.canvas.classList.remove('selected'));
        canvas.classList.add('selected');
      })
      if(this.currentLayer === i) {
        canvas.classList.add('selected');
      }
      layers.appendChild(canvas);
    }

    shadow.appendChild(style);
    shadow.appendChild(palette);
    shadow.appendChild(picker);
    shadow.appendChild(layers);
    shadow.appendChild(canvas);
    shadow.appendChild(button);
  }

  get bgColor() {
    if (this.hasAttribute('bgcolor')) {
      return this.getAttribute('bgcolor');
    }
    return 'white';
  }

  set bgColor(color) {
    this.setAttribute('bgcolor', color);
  }

  connectedCallback() {
    this.transparencyPattern = 'white';
    let img = new Image();
    img.src = imageURL;
    img.onload = () => {
      this.transparencyPattern = this.ctx.createPattern(img, 'repeat')
    };
  }

  attributeChangedCallback() {
    this.renderDrawing({});
  }

  startLine(color) {
    const lines = this.layers[this.currentLayer];
    lines.push(new LinePart(this.penSize || 1, color || this.drawColor));
    this.undoHistory.push([this.currentLayer, lines.length-1]);
    this.continueLine();
  }

  continueLine() {
    const lines = this.layers[this.currentLayer];
    lines[lines.length - 1].addPoint(
      this.mouseX,
      this.mouseY,
    );
    this.renderDrawing({});
  }

  undoLine() {
    let undo = this.undoHistory.pop();
    if(undo) {
      let undoLine = this.layers[undo[0]].splice(undo[1], 1);

      this.redoHistory.push([undo[0], ...undoLine]);

      this.renderDrawing({});
    }
  }
  
  redoLine() {
    let redo = this.redoHistory.pop();
    if(redo) {
      this.layers[redo[0]].push(redo[1]);

      this.undoHistory.push([redo[0], this.layers[redo[0]].length - 1]);

      this.renderDrawing({});
    }
  }

  renderDrawing({ctx, bgColor, hideCursor}) {
    let target = ctx || this.ctx;
    target.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    target.fillStyle = bgColor || this.bgColor || 'white';
    target.rect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    target.fill();
    for(let i = this.layers.length - 1; i >= 0; i -= 1) {
      let lines = this.layers[i];
      let layerTarget = this.layerCanvases[i]

      layerTarget.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      lines.forEach((part) => {
        part.draw(layerTarget, 'transparent', this.transparencyPattern);
      });

      target.drawImage(layerTarget.canvas, 0, 0);
    }

    if (!hideCursor) {
      target.lineWidth = 1;

      target.strokeStyle = 'black';
      target.beginPath();
      target.arc(this.mouseX, this.mouseY, (this.penSize / 2) + 1, 0, 2 * Math.PI);
      target.stroke();

      target.strokeStyle = 'white';
      target.beginPath();
      target.arc(this.mouseX, this.mouseY, (this.penSize / 2), 0, 2 * Math.PI);
      target.stroke();
    }
  }
}
