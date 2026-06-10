let bgImg;
let imgBeach, imgBoardwalk, imgHotdog, imgIceCream, imgAquarium, imgRollercoaster;
let activeImg; 

let sndWaves, sndSteps, sndChomp, sndLick, sndBubbles, sndScream;
let allSounds = []; 

let confetti = [];
let ticketScale = 1;
let aspects = [
  { emoji: "🏖️", desc: "a tanning session at the beach", x: -150, y: -130, soundFile: 'waves.mp3' },
  { emoji: "🌅", desc: "a stroll down the historic riegelmann boardwalk", x: -90, y: -130, soundFile: 'steps.mp3' },
  { emoji: "🌭", desc: "a delicious steaming hot dog", x: -30, y: -130, soundFile: 'chomp.mp3' },
  { emoji: "🍦", desc: "a refreshing scoop of ice cream", x: 30, y: -130, soundFile: 'lick.mp3' },
  { emoji: "🦈", desc: "a walk through a tunnel of underwater life", x: 90, y: -130, soundFile: 'bubbles.mp3' },
  { emoji: "🎢", desc: "a shot of adrenaline in the form of a rollercoaster ride", x: 150, y: -130, soundFile: 'scream.mp3' }
];

let punched = [false, false, false, false, false, false]; 
let selectedAspect = null; 

function preload() {
  // Load local assets
  bgImg = loadImage('background.png');
  imgBeach = loadImage('beach.png');
  imgBoardwalk = loadImage('boardwalk.png');
  imgHotdog = loadImage('hotdog.png');
  imgIceCream = loadImage('icecream.png');
  imgAquarium = loadImage('aquarium.png');
  imgRollercoaster = loadImage('rollercoaster.png');

  sndWaves = loadSound(aspects[0].soundFile);
  sndSteps = loadSound(aspects[1].soundFile);
  sndChomp = loadSound(aspects[2].soundFile);
  sndLick = loadSound(aspects[3].soundFile);
  sndBubbles = loadSound(aspects[4].soundFile);
  sndScream = loadSound(aspects[5].soundFile);
}

function setup() {
  createCanvas(600, 700); 
  rectMode(CENTER);
  textAlign(CENTER, CENTER);

  userStartAudio();
  activeImg = bgImg;
  
  // Track arrays to handle clean audio state cut-offs
  allSounds = [sndWaves, sndSteps, sndChomp, sndLick, sndBubbles, sndScream];
}

function draw() {
  // Warm festive background gradient
  background(255, 205, 220);
  noStroke();
  for (let i = 0; i < height; i += 15) {
    let inter = map(i, 0, height, 0, 1);
    let c = lerpColor(color(255, 120, 160), color(110, 210, 255), inter);
    fill(c);
    rect(width/2, i + 7.5, width, 15);
  }
  
  // Dynamic scale physics on hover
  let d = dist(mouseX, mouseY, width/2, height/2);
  if (d < 300) {
    ticketScale = lerp(ticketScale, 1.02, 0.1);
  } else {
    ticketScale = lerp(ticketScale, 1.0, 0.1);
  }

  // --- VOUCHER CARD LAYOUT ---
  push();
  translate(width / 2, height / 2);
  scale(ticketScale);
  
  // Base shadow
  fill(0, 0, 0, 30);
  rect(8, 12, 460, 560, 15); 
  
  // Main Voucher Ticket Body (Premium Cardstock Cream)
  fill(255, 251, 235); 
  stroke(101, 67, 33);
  strokeWeight(5);
  rect(0, 0, 460, 560, 15);
  
  // Intricate vintage border details
  stroke(101, 67, 33, 90);
  strokeWeight(1);
  rect(0, 0, 442, 542, 12);
  rect(0, 0, 436, 536, 10);

  // Geometric Ticket Punch Side Notches
  fill(255, 150, 185); 
  stroke(101, 67, 33);
  strokeWeight(5);
  ellipse(-230, 0, 44, 44);
  ellipse(230, 0, 44, 44);
  noStroke();
  fill(255, 150, 185);
  ellipse(-235, 0, 40, 40);
  ellipse(235, 0, 40, 40);

  // Marginal Serial and Barcode Accents
  fill(101, 67, 33, 130);
  noStroke();
  textSize(9);
  textStyle(BOLD);
  push();
  translate(-210, 0); rotate(-HALF_PI);
  text("SERIES 2026 // ADMIT ONE GUEST", 0, 0);
  pop();
  push();
  translate(210, 0); rotate(HALF_PI);
  text("★ CONEY ISLAND SOUVENIR VOUCHER ★", 0, 0);
  pop();
  
  // --- FIXED STAR POSITIONING ---
  // Stars pushed significantly further outward away from the text
  textSize(14);
  fill(101, 67, 33, 180);
  text("★ ★", -185, -225);
  text("★ ★", 185, -225);

  // --- TYPOGRAPHY ---
  fill(101, 67, 33);
  textStyle(BOLD);
  textSize(15); 
  text("CONEY ISLAND ADVENTURE VOUCHER", 0, -225);
  
  // ALL CAPS Subtitle
  fill(255, 68, 102);
  textSize(24); 
  textStyle(BOLD);
  text("HAPPY BIRTHDAY ELLES", 0, -190);

  // --- UNDER-HEADER INLINE POP-UP TEXT ---
  if (selectedAspect) {
    noStroke();
    fill(101, 67, 33);
    textStyle(ITALIC);
    textSize(14);
    textWrap(WORD);
    text(selectedAspect.desc, -30, -80, 380, 35);
  }
  // --- INTERACTIVE EMOJI ROW ---
  let hoveringAny = false;
  for (let i = 0; i < aspects.length; i++) {
    let a = aspects[i];
    let actualX = width/2 + a.x * ticketScale;
    let actualY = height/2 + a.y * ticketScale;
    
    push();
    translate(a.x, a.y);
    
    // NEW: Emojis now have a distinct soft pink shaded background square
    stroke(101, 67, 33, 60);
    strokeWeight(1.5);
    fill(255, 215, 225); // Customized pink backdrop tone
    rect(0, 0, 50, 50, 6);
    
    // Zoom expansion physics on hover states
    if (dist(mouseX, mouseY, actualX, actualY) < 25) {
      scale(1.25);
      hoveringAny = true;
    }
    
    noStroke();
    textSize(28);
    text(a.emoji, 0, 0);
    pop();
  }

  // --- HORIZONTAL IMAGE CONTAINER ---
  push();
  translate(0, 45); 
  if (activeImg) {
    imageMode(CENTER);
    image(activeImg, 0, 0, 380, 190);
  }
  noFill();
  stroke(101, 67, 33);
  strokeWeight(4);
  rect(0, 0, 380, 190);
  pop();

  // --- NEW: CHILLING PINK PUNCH HOLE TRACKS (NO NUMBERS) ---
  let punchY = 200;
  let punchPositions = [-150, -90, -30, 30, 90, 150];
  
  stroke(101, 67, 33, 60);
  strokeWeight(1);
  line(-180, punchY, 180, punchY); 
  
  for (let i = 0; i < 6; i++) {
    let px = punchPositions[i];
    if (punched[i]) {
      // Punched State: Turns into a deep vibrant card-punched pink tone
      fill(255, 120, 160); 
      stroke(70, 40, 15);
      strokeWeight(2);
      ellipse(px, punchY, 22, 22);
    } else {
      // Unpunched State: Just completely chilling with a solid, clean pastel pink circle
      fill(255, 200, 215); 
      stroke(101, 67, 33);
      strokeWeight(2);
      ellipse(px, punchY, 22, 22);
    }
  }

  pop(); 

  // --- PARTICLE EMITTER LAYER ---
  for (let i = confetti.length - 1; i >= 0; i--) {
    confetti[i].update();
    confetti[i].display();
    if (confetti[i].isDead()) {
      confetti.splice(i, 1);
    }
  }
  
  if (hoveringAny) {
    cursor(HAND);
  } else {
    cursor(ARROW);
  }
}

// --- CONTROLLER: CLICK SELECTION MECHANICS ---
function mousePressed() {
  for (let i = 0; i < aspects.length; i++) {
    let a = aspects[i];
    let actualX = width/2 + a.x * ticketScale;
    let actualY = height/2 + a.y * ticketScale;
    
    if (dist(mouseX, mouseY, actualX, actualY) < 26) {
      selectedAspect = a; 
      punched[i] = true;  
      
      // Clear audio loops instantly when a new option is chosen
      for (let s = 0; s < allSounds.length; s++) {
        if (allSounds[s].isPlaying()) {
          allSounds[s].stop();
        }
      }

      // Handle asset routing and audio modes
      if (i === 0) { activeImg = imgBeach; sndWaves.play(); }
      if (i === 1) { activeImg = imgBoardwalk; sndSteps.play(); }
      if (i === 2) { activeImg = imgHotdog; sndChomp.loop(); } // Loops perfectly!
      if (i === 3) { activeImg = imgIceCream; sndLick.play(); }
      if (i === 4) { activeImg = imgAquarium; sndBubbles.play(); }
      if (i === 5) { activeImg = imgRollercoaster; sndScream.play(); }
      
      // Explode Confetti Spray Celebration
      for (let p = 0; p < 50; p++) {
        confetti.push(new Particle(mouseX, mouseY));
      }
      return; 
    }
  }
}

// Celebration Particle Class Physics
class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(3, 8));
    this.gravity = createVector(0, 0.2);
    this.color = color(random(['#ff4757', '#ff7f50', '#feca57', '#1e90ff', '#2ed573', '#fffa65']));
    this.size = random(6, 12);
    this.alpha = 255;
    this.rotation = random(TWO_PI);
    this.rotSpeed = random(-0.1, 0.1);
  }
  update() {
    this.vel.add(this.gravity);
    this.pos.add(this.vel);
    this.alpha -= 4;
    this.rotation += this.rotSpeed;
  }
  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.rotation);
    noStroke();
    let c = color(this.color);
    c.setAlpha(this.alpha);
    fill(c);
    rect(0, 0, this.size, this.size / 1.5);
    pop();
  }
  isDead() { return this.alpha <= 0; }
}
