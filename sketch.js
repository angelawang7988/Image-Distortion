let img;
let srcImg;       // abstracted source made from repeated slices
let tiles = [];

function preload() {
  img = loadImage('E.jpg');   // Eiffel image
}

function setup() {
  // keep overall canvas size
  img.resize(600, 0);                 // width = 600, keep aspect ratio
  createCanvas(img.width, img.height);
  imageMode(CORNER);

  makeSourceImage();                  // 1) slice + repeat to abstract image
  makeTiles();                        // 2) build distorted glass blocks
  // noLoop();                        // <-- remove this so mouse interaction works
}

// build an abstract source image from 3–4 vertical slices, copied & rearranged
function makeSourceImage() {
  srcImg = createGraphics(img.width, img.height);

  let parts = 4;                      // divide into 3–4 pieces
  let partW = img.width / parts;
  let slices = [];

  // cut vertical slices from the original Eiffel image
  for (let i = 0; i < parts; i++) {
    let sx = i * partW;
    let slice = img.get(sx, 0, partW, img.height);
    slices.push(slice);
  }

  // fill the whole width with randomly chosen slices,
  // scaled a bit so they don't line up perfectly
  let x = 0;
  while (x < srcImg.width) {
    let s = random(slices);
    let targetW = random(partW * 0.5, partW * 1.2);   // vary width
    if (x + targetW > srcImg.width) targetW = srcImg.width - x;

    srcImg.image(s, x, 0, targetW, srcImg.height);
    x += targetW;
  }
}

function makeTiles() {
  tiles = [];

  // narrow vertical panels, like reference
  let minBlockW = 10;
  let maxBlockW = 40;
  let minBlockH = 40;
  let maxBlockH = 130;

  let wanderX = 25;      // small sideways shift
  let wanderY = 100;      // vertical wobble

  let x = 0;
  while (x < width) {
    let w = random(minBlockW, maxBlockW);
    if (x + w > width) w = width - x;   // clamp at right edge

    // per-column wave for big curves
    let colNorm = x / width;
    let waveAmp = random(20, 50);
    let waveFreq = random(0.8, 1.8);
    let wavePhase = random(TWO_PI);

    let y = 0;
    while (y < height) {
      let h = random(minBlockH, maxBlockH);
      if (y + h > height) h = height - y;

      // source size → stretch / compress
      let srcW = w * random(0.7, 1.3);
      let srcH = h * random(0.9, 1.8);

      srcW = constrain(srcW, 5, srcImg.width);
      srcH = constrain(srcH, 5, srcImg.height);

      // base source position near this column
      let sx = constrain(x + random(-wanderX, wanderX),
                         0, srcImg.width - srcW);

      let baseSy = y + random(-wanderY, wanderY);
      let wave = sin(colNorm * waveFreq * TWO_PI + wavePhase) * waveAmp;
      let sy = constrain(baseSy + wave, 0, srcImg.height - srcH);

      // get piece from the abstracted source image (not original!)
      let piece = srcImg.get(sx, sy, srcW, srcH);

      // random blur for glass softness
      if (random() < 0.55) {
        let blurAmt = random(0.6, 2.5);
        piece.filter(BLUR, blurAmt);
      }

      tiles.push({ x, y, w, h, piece });
      y += h;
    }
    x += w;
  }
}

function draw() {
  

  // mouse left = only distorted
  // mouse right = only clean original
  let amt = constrain(1 - mouseX / width + 0.1, 0, 1);

  // ① draw distorted layer, fading OUT as mouse → right
  push();
  tint(255, 255 * amt);
  for (let t of tiles) {
    image(t.piece, t.x, t.y, t.w, t.h);

    // borders fade together with tiles
    noFill();
    stroke(0, 0 * amt);
    rect(t.x, t.y, t.w, t.h);
  }
  pop();

  // ② draw original Eiffel image, fading IN
  push();
  tint(255, 255 * (1 - amt));
  image(img, 0, 0);
  pop();
}
