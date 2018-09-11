import * as fs from 'fs';
let styles = fs.readFileSync(__dirname + '/drawingcanvas.css');

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
        if(this.line.length > 0) {
            ctx.beginPath();

            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.lineWidth = this.width;
            ctx.strokeStyle = this.color;

            ctx.moveTo(this.line[0][0], this.line[0][1])
            for (var point in this.line) {
                ctx.lineTo(this.line[point][0], this.line[point][1])
            }

            //ctx.closePath();
            ctx.stroke();
        }
    }
}

export class DrawingCanvas extends HTMLElement {
    static get observedAttributes() {
        return ['text'];
    }

    constructor() {
        super();
        this.lines = [];
        this.drawcolor = "black";
        this.pensize = 12;

        let shadow = this.attachShadow({mode: 'open'});

        let canvas = document.createElement('canvas');
        canvas.width = 900;
        canvas.height = 600;
        canvas.addEventListener('mousedown', e => {
            this.lines.push(new LinePart(this.pensize, this.drawcolor))
            this.lines[this.lines.length-1].addPoint(e.clientX - this.offsetLeft, e.clientY - this.offsetTop);
            this.drawing = true;
            this.renderDrawing();
        });
        canvas.addEventListener('mouseup', e => {
            this.drawing = false;
            this.renderDrawing();
        });
        canvas.addEventListener('mousemove', e => {
            if(e.buttons == 0) {
                this.drawing = false;
            }
            if (this.drawing) {
                this.lines[this.lines.length-1].addPoint(e.clientX - this.offsetLeft, e.clientY - this.offsetTop);
                this.renderDrawing();
            }
        });
        this.ctx = canvas.getContext('2d');

        let style = document.createElement('style')
        style.textContent = styles;

        shadow.appendChild(style);
        shadow.appendChild(canvas);
    }

    connectedCallback() {
        //this.ctx.fillStyle = 'black';
        //this.ctx.fillText(this.getAttribute('text'), 10, 10);
    }

    renderDrawing() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        for (let part of this.lines) {
            part.draw(this.ctx);
        }
    }
}