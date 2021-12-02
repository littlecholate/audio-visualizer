var mic;
var fft;

function setup() {
    let cnv = createCanvas(windowWidth, windowHeight);
    cnv.style('display', 'block');
    angleMode(DEGREES);

    fft = new p5.FFT(0.3);
    mic = new p5.AudioIn();
    mic.start();
    fft.setInput(mic);
}

function draw() {
    clear();
    translate(width / 2, height / 2);
    rotate(-90);
    noFill();

    fft.analyze();
    amp = fft.getEnergy('bass');

    var wave = fft.waveform();

    // draw clock
    let secondAngle = map(second(), 0, 60, 0, 360);
    let minuteAngle = map(minute(), 0, 60, 0, 360) + map(secondAngle, 0, 360, 0, 6);
    let hourAngle = map(hour() % 12, 0, 12, 0, 360) + map(minuteAngle, 0, 360, 0, 30);

    push();
    rotate(secondAngle);
    stroke(211, 211, 211);
    line(0, 0, height / 3, 0);
    pop();

    push();
    rotate(minuteAngle);
    stroke(128, 128, 128);
    line(0, 0, height / 3.5, 0);
    pop();

    push();
    rotate(hourAngle);
    stroke(119, 136, 153);
    line(0, 0, height / 6, 0);
    pop();

    stroke(255);
    point(0, 0);

    // draw visualizer
    let alpha = map(amp, 0, 255, 160, 10);
    fill(0, alpha);

    amp > 10 ? stroke(random(200, 255), random(180, 230), random(180, 230)) : stroke(255);
    strokeWeight(3);
    for (let t = -1; t <= 1; t += 2) {
        beginShape();
        for (let i = 0; i <= 180; i += 0.5) {
            let index = floor(map(i, 0, 180, 0, wave.length - 1));
            let r = map(wave[index], -1, 1, height / 4, height / 2);
            let x = r * sin(i) * t;
            let y = r * cos(i);
            vertex(x, y);
        }
        endShape();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
