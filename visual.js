var song;
var img;
var fft;
var particles = [];

class Particle {
    constructor() {
        this.pos = p5.Vector.random2D().mult(200);
        this.vel = createVector(0, 0);
        this.acc = this.pos.copy().mult(random(0.0001, 0.00001));

        this.w = random(2, 6);
        this.color = [random(200, 255), random(200, 255), random(200, 255)];
    }
    update(cond) {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        if (cond) {
            this.pos.add(this.vel);
            this.pos.add(this.vel);
            this.pos.add(this.vel);
        }
    }
    edges() {
        this.pos.x < -width / 2 || this.pos.x > width / 2 || this.pos.y < -height / 2 || this.pos.y > height / 2 ? true : false;
    }
    show() {
        noStroke();
        fill(this.color);
        ellipse(this.pos.x, this.pos.y, this.w);
    }
}

function preload() {
    song = loadSound('music.mp3');
    img = loadImage('bg.png');
}

function setup() {
    let cnv = createCanvas(windowWidth, windowHeight);
    cnv.style('display', 'block');
    angleMode(DEGREES);
    imageMode(CENTER);
    rectMode(CENTER);

    fft = new p5.FFT(0.3);
    img.filter(BLUR, 8);
}

function draw() {
    background(0);

    translate(width / 2, height / 2);

    fft.analyze();
    amp = fft.getEnergy(20, 200);
    //console.log(amp);

    push();
    if (amp > 210) {
        rotate(random(-0.5, 0.5));
    }
    image(img, 0, 0, width + 100, height + 100);
    pop();

    var alpha = map(amp, 0, 255, 180, 10);
    fill(0, alpha);
    noStroke();
    rect(0, 0, width, height);

    stroke(255);
    strokeWeight(3);
    noFill();

    var wave = fft.waveform();

    for (var t = -1; t <= 1; t += 2) {
        beginShape();
        for (var i = 0; i <= 180; i += 0.5) {
            var index = floor(map(i, 0, 180, 0, wave.length - 1));
            var r = map(wave[index], -1, 1, 80, 200);

            var x = r * sin(i) * t;
            var y = r * cos(i);
            vertex(x, y);
        }
        endShape();
    }

    var p = new Particle();
    particles.push(p);

    for (var i = particles.length - 1; i >= 0; i--) {
        if (!particles[i].edges()) {
            particles[i].update(amp > 210);
            particles[i].show();
        } else {
            particles.splice(i, 1);
        }
    }
}

function mouseClicked() {
    song.isPlaying() ? song.pause() : song.play();
}
