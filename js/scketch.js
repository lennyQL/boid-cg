let boids = []; 
let trash = [];
const NUM = 100; // boids number
const TNUM = 100; // trash number


// p5.js function setup()
setup = () => {
    createCanvas(windowWidth, windowHeight)

    const width = windowWidth;
    const height = windowHeight;

    let p = createVector(width / 2, height / 3);
    let d = createVector(random(0, 2 * PI), 3);
    boids[0] = new Boid(p, d, 100, 10);
    for (let i = 1; i < NUM; i++) {
        let pos = createVector(random(0, width), random(0, height));
        let dir = createVector(random(0, 2 * PI), 3);
        boids[i] = new Boid(pos, dir, 100, 10);
    }
    print(boids[0]);

    for (let i = 0; i < TNUM; i++) {
        let pos = createVector(random(0, width), random(0, height));
        let dir = createVector(0, 0);
        trash[i] = new Boid(pos, dir, 0, 1);
    }
}

// p5.js function draw()
draw = () => {
    background(255)

    /*/ //test one search
    //boids[0].pos.set(mouseX,mouseY); //test code
    for (let i=1; i<NUM; i++) {
        boids[0].sensor(boids[i]);
    }
    boids[0].showSensorRange();
    /*/ //All search
    for (let i = 0; i < NUM; i++) {
        for (let j = 0; j < NUM; j++) {
            if (i == j) continue;
            boids[i].sensor(boids[j]);
        }
        //boids[i].showSensorRange();
        //boids[i].showSensorLine();
    }
    //*/

    //boids[0].setDirc(atan2(mouseY-boids[0].pos.y, mouseX-boids[0].pos.x));
    //boids[0].pos.set(mouseX,mouseY);
    boids[0].showSensorRange();
    boids[0].showSensorLine();


    /* boidの描画 */
    for (let i = 0; i < NUM; i++) {
        boids[i].update();
        boids[i].show();
    }

    /* trashの描画 */
    for (let i = 0; i < TNUM; i++) {
        trash[i].update();
        trash[i].show();
    }
    
}