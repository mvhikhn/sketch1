const COLORS = {
  background: "#1d1d1b",
  border: "#090909",
  palette: ["#180161", "#4F1787", "#EB3678", "#FB773C"]
};

const SETTINGS = {
  animationSpeed: 0.05,
  maxDepth: 5,
  minModuleSize: 40,
  subdivideChance: 0.5
};

let grid = {
  columns: 0,
  rows: 0,
  moduleSize: 0,
  seed: 0,
  depth: 0
};

function setup() {
  createCanvas(700, 600);  
  strokeJoin(ROUND);

  grid.columns = floor(random(5, 8));
  grid.moduleSize = width / grid.columns;
  grid.rows = ceil(height / grid.moduleSize);
  grid.seed = random(1000);

  stroke(COLORS.border);
  strokeWeight(2);
  frameRate(60);
}

function draw() {
  background(COLORS.background);
  randomSeed(grid.seed);

  const movement = getMovement();
  grid.depth = 0;

  drawGrid(0, 0, grid.columns, grid.rows, width, movement);
}

function getMovement() {
  return (sin(frameCount * SETTINGS.animationSpeed) + 1) / 2;
}

function drawGrid(x, y, cols, rows, size, movement) {
  const cellSize = size / cols;
  const colorCache = new Map();
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const posX = x + col * cellSize;
      const posY = y + row * cellSize;

      const colorIndex = getColorIndex(col, row, colorCache);

      drawCell(posX, posY, cellSize, movement, colorIndex);
    }
  }
}

function getColorIndex(col, row, cache) {
  const key = `${col},${row}`;
  if (!cache.has(key)) {
    cache.set(key, (col + row + floor(random(0, 4))) % COLORS.palette.length);
  }
  return cache.get(key);
}

function drawCell(x, y, size, movement, colorIndex) {
  fill(COLORS.palette[colorIndex]);
  rect(x, y, size, size);

  if (shouldSubdivide(size)) {
    grid.depth++;
    drawGrid(x, y, 2, 2, size, movement); 
    grid.depth--;
    return;
  }

  fill(COLORS.palette[(colorIndex + 1) % COLORS.palette.length]);
  drawFractal(x, y, size, movement);
}

function shouldSubdivide(size) {
  return random() < SETTINGS.subdivideChance && 
         grid.depth < SETTINGS.maxDepth && 
         size > SETTINGS.minModuleSize;
}

function drawFractal(x, y, size, movement) {
  if (size < 10) return;

  const nextSize = size / 2;
  const offset = size * 0.25;
  const phase = sin(frameCount * SETTINGS.animationSpeed * 2);
  const modOffset = offset + phase * 5;

  const placements = [
    {x: x + modOffset, y: y + modOffset},
    {x: x + modOffset, y: y + nextSize + modOffset},
    {x: x + nextSize + modOffset, y: y + modOffset},
    {x: x + nextSize + modOffset, y: y + nextSize + modOffset}
  ];

  placements.forEach(({x, y}) => rect(x, y, nextSize, nextSize));

  if (random() < SETTINGS.subdivideChance && nextSize >= SETTINGS.minModuleSize) {
    placements.forEach(({x, y}) => drawFractal(x, y, nextSize, movement));
  }
}

