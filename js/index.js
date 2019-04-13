let data = null;
let xhr = new XMLHttpRequest();
xhr.open('GET', 'json/barrages.json', false);
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        data = JSON.parse(xhr.responseText);
    }
};
xhr.send(null);

let $ = document.querySelector.bind(document);
let canvas = $('#canvas');
let video = $('#video');

class Barrage {
    constructor(obj, ctx) {
        this.obj = obj;
        this.ctx = ctx;
        this.value = obj.value;
        this.time = obj.time;
    }

    init() {
        this.fontSize = this.obj.fontSize || this.ctx.fontSize;
        this.color = this.obj.color || this.ctx.color;
        this.opacity = this.obj.opacity || this.ctx.opacity;
        this.speed = this.obj.speed || this.ctx.speed;
        let span = document.createElement('span');
        span.innerText = this.value;
        span.style.font = this.fontSize + 'px "Microsoft YaHei"';
        span.style.position = 'absolute';
        document.body.appendChild(span);
        this.width = span.clientWidth;
        document.body.removeChild(span);
        this.x = this.ctx.canvas.width;
        this.y = this.ctx.canvas.height * Math.random();
        if (this.y < this.fontSize) {
            this.y = this.fontSize;
        }
        if (this.y > this.ctx.canvas.height - this.fontSize) {
            this.y = this.ctx.canvas.height - this.fontSize;
        }
    }

    render() {
        this.ctx.context.font = this.fontSize + 'px "Microsoft YaHei"';
        this.ctx.context.fillStyle = this.color;
        this.ctx.context.fillText(this.value, this.x, this.y);
    }
}

class CanvasBarrage {
    constructor(canvas, video, options = {}) {
        if (!canvas || !video) return;
        this.canvas = canvas;
        this.video = video;
        let defaultOptions = {
            fontSize: 20,
            color: '#ffffff',
            opacity: 0.8,
            speed: 2,
            data: []
        };
        Object.assign(this, defaultOptions, options);
        this.context = canvas.getContext('2d');
        this.canvas.width = video.clientWidth;
        this.canvas.height = video.clientHeight;
        this.isPaused = true;
        this.barrages = this.data.map(obj => new Barrage(obj, this));
        this.render();
    }

    render() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.renderBarrage();
        if (!this.isPaused) {
            requestAnimationFrame(this.render.bind(this));
        }
    }

    renderBarrage() {
        let time = this.video.currentTime;
        this.barrages.forEach(barrage => {
            if (!barrage.flag && time >= barrage.time) {
                if (!barrage.isInited) {
                    barrage.init();
                    barrage.isInited = true;
                }
                barrage.x -= barrage.speed;
                barrage.render();
                if (barrage.x < barrage.width * -1) {
                    barrage.flag = true;
                }
            }
        });
    }

    add(obj) {
        this.barrages.push(new Barrage(obj, this));
    }

    reset() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let time = this.video.currentTime;
        this.barrages.forEach(barrage => {
            barrage.flag = false;
            time <= barrage.time ? barrage.isInited = false : barrage.flag = true;
        });
    }
}

let canvasBarrage = new CanvasBarrage(canvas, video, {data});

video.addEventListener('play', function () {
    canvasBarrage.isPaused = false;
    canvasBarrage.render();
});

video.addEventListener('pause', function () {
    canvasBarrage.isPaused = true;
});

$('#add').addEventListener('click', function () {
    let value = $('#text').value;
    let time = video.currentTime;
    let fontSize = $('#range').value;
    let color = $('#color').value;
    let obj = {value, time, fontSize, color};
    canvasBarrage.add(obj);
});

video.addEventListener('seeked', function () {
    canvasBarrage.reset();
});