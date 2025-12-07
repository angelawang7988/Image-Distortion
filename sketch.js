// let img;
// let tiles = [];

// function preload() {
//   img = loadImage('S.jpg');   // your historical building image
// }

// function setup() {
//   img.resize(600, 0);         // scale image to 600px width, keep aspect ratio
//   createCanvas(img.width, img.height);

//   imageMode(CORNER);          // draw from top-left for our tiles

//   makeTiles();                // build all the glass blocks
//   noLoop();                   // draw once (remove this if you want it to re-randomize)
// }

// function makeTiles() {
//   tiles = [];

//   let minBlockSize = 25;
//   let maxBlockSize = 80;
//   let wander = 80;            // how far reflections can “pull” from

//   let x = 0;
//   while (x < width) {
//     let w = random(minBlockSize, maxBlockSize);
//     if (x + w > width) w = width - x;  // clamp at right edge

//     let y = 0;
//     while (y < height) {
//       let h = random(minBlockSize, maxBlockSize);
//       if (y + h > height) h = height - y;  // clamp at bottom edge

//       // ----- LENS-STRETCH SOURCE SIZE -----
//       // source area can be 70–140% of tile size
//       let srcW = w * random(0.7, 1.4);
//       let srcH = h * random(0.7, 1.4);

//       // keep valid, at least a few pixels
//       srcW = constrain(srcW, 5, img.width);
//       srcH = constrain(srcH, 5, img.height);

//       // choose a source position, biased near tile position for local distortion
//       let sx = constrain(x + random(-wander, wander), 0, img.width - srcW);
//       let sy = constrain(y + random(-wander, wander), 0, img.height - srcH);

//       // grab that (possibly larger/smaller) piece
//       let piece = img.get(sx, sy, srcW, srcH);

//       // ----- RANDOM BLUR ON SOME TILES -----
//       if (random() < 0.35) {        // ~45% tiles blurred
//         let blurAmt = random(0.2, 2.0);
//         piece.filter(BLUR, blurAmt);
//       }

//       // store with the ORIGINAL tile position & size
//       tiles.push({ x: x, y: y, w: w, h: h, piece: piece });

//       y += h;
//     }

//     x += w;
//   }
// }

// function draw() {
//   background(220);

//   for (let t of tiles) {
//     // draw the distorted patch, stretched/compressed into the tile
//     image(t.piece, t.x, t.y, t.w, t.h);

//     // draw the glass frame
//     noFill();
//     stroke(0, 80);
//     rect(t.x, t.y, t.w, t.h);
//   }
// }

let img;
let tiles = [];

function preload() {
  img = loadImage('S.jpg');
}

function setup() {
  img.resize(600, 0);
  createCanvas(img.width, img.height);

  imageMode(CORNER);
  makeTiles();
}

function makeTiles() {
  tiles = [];

  let minBlockSize = 25;
  let maxBlockSize = 80;
  let wander = 80;

  let x = 0;
  while (x < width) {
    let w = random(minBlockSize, maxBlockSize);
    if (x + w > width) w = width - x;

    let y = 0;
    while (y < height) {
      let h = random(minBlockSize, maxBlockSize);
      if (y + h > height) h = height - y;

      // lens stretch
      let srcW = w * random(0.7, 1.4);
      let srcH = h * random(0.7, 1.4);
      srcW = constrain(srcW, 5, img.width);
      srcH = constrain(srcH, 5, img.height);

      let sx = constrain(x + random(-wander, wander), 0, img.width - srcW);
      let sy = constrain(y + random(-wander, wander), 0, img.height - srcH);

      let piece = img.get(sx, sy, srcW, srcH);

      // random blur
      if (random() < 0.45) {
        let blurAmt = random(0.2, 2.0);
        piece.filter(BLUR, blurAmt);
      }

      tiles.push({ x: x, y: y, w: w, h: h, piece: piece });
      y += h;
    }
    x += w;
  }
}

function draw() {
  background(220);

  // mouse left = only distorted
  // mouse right = only clean original
  let amt = constrain(1 - mouseX / width+ 0.1, 0, 1);

  // ① first draw distorted, fading OUT as mouse→right
  push();
  tint(255, 255 * amt);
  for (let t of tiles) {
    image(t.piece, t.x, t.y, t.w, t.h);

    // border also fades out | no black line on original!
    stroke(255, 50 * amt);
    noFill();
    rect(t.x, t.y, t.w, t.h);
  }
  pop();

  // ② then draw original image fading IN
  push();
  tint(255, 255 * (1 - amt));
  image(img, 0, 0);
  pop();
}
