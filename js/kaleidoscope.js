let particles = [];
let numParticles = 300;
let angle = 0;
let rotationSpeed = 0.003;
let osc1, osc2;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  colorMode(HSB, 360, 100, 100, 255); // Use HSB for dynamic color changes
  
  // Initialize particles
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle(random(width), random(height)));
  }
  
  // Initialize oscillators
  osc1 = new p5.Oscillator('sine');
  osc1.freq(440);
  osc1.amp(0);
  osc1.start();
  
  osc2 = new p5.Oscillator('triangle');
  osc2.freq(220);
  osc2.amp(0);
  osc2.start();
}

function draw() {
  // White Background with low alpha for trails
  background(0, 0, 100, 30); // HSB: White with alpha 30
  blendMode(BLEND); // Use default blend mode to prevent color accumulation
  
  translate(width / 2, height / 2);
  
  // Responsive Rotation Speed based on mouseY
  let targetSpeed = map(mouseY, 0, height, 0.001, 0.01);
  rotationSpeed = lerp(rotationSpeed, targetSpeed, 0.05);
  
  // Draw kaleidoscope with interconnected particles
  for (let i = 0; i < 6; i++) {
    push();
    rotate(angle + (PI / 3) * i);
    for (let p of particles) {
      p.update();
      p.show();
    }
    pop();
  }
  
  // Draw connections
  drawConnections();
  
  angle += rotationSpeed; // Update rotation angle
}

function mousePressed() {
  // Trigger sound based on mouseX
  let freq1 = map(mouseX, 0, width, 200, 800);
  let freq2 = map(mouseX, 0, width, 800, 200);
  
  osc1.freq(freq1);
  osc1.amp(0.3, 0.05);
  osc1.amp(0, 0.5); // Fade out
  
  osc2.freq(freq2);
  osc2.amp(0.2, 0.05);
  osc2.amp(0, 0.5); // Fade out
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x - width / 2, y - height / 2);
    this.vel = p5.Vector.random2D().mult(random(0.2, 0.6)); // Reduced speed multiplier
    this.size = random(2, 6);
    this.hue = random(0, 360); // Start with a random hue
    this.prevPos = this.pos.copy();
  }

  update() {
    this.prevPos = this.pos.copy();
    this.pos.add(this.vel);
    this.hue = (this.hue + 0.5) % 360; // Gradually shift hue over time
    
    // Wrap around if out of bounds
    if (this.pos.mag() > width / 2) {
      this.pos = p5.Vector.random2D().mult(random(width / 4));
      this.prevPos = this.pos.copy();
    }
  }

  show() {
    // Adjust brightness to ensure visibility against white background
    let adjustedBrightness = 70 + sin(frameCount * 0.01 + this.hue) * 30; // Dynamic brightness between 40 and 100
    fill(this.hue, 80, adjustedBrightness, 200); // Increased opacity for better visibility
    ellipse(this.pos.x, this.pos.y, this.size);
    
    // Draw trail
    stroke(this.hue, 80, adjustedBrightness, 100); // Semi-transparent trail
    strokeWeight(1);
    line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
    noStroke();
  }
}

function drawConnections() {
  // Set a maximum distance for connections
  let maxDist = 100;
  stroke(0, 0, 0, 50); // Black lines with low opacity for subtle connections
  strokeWeight(0.5);
  
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let d = p5.Vector.dist(particles[i].pos, particles[j].pos);
      if (d < maxDist) {
        line(particles[i].pos.x, particles[i].pos.y, particles[j].pos.x, particles[j].pos.y);
      }
    }
  }
  
  noStroke();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Optional: Add smooth background transitions
function keyPressed() {
  if (key === 's' || key === 'S') {
    saveCanvas('kaleidoscope', 'png');
  }
}
