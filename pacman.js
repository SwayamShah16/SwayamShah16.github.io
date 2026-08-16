// Minimal Pac-Man-like game (canvas). Simple maze, pellets, one pacman, two ghosts.
// Controls: Arrow keys. This is intentionally small and dependency-free.

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const TILE = 16;
const C = {
  w: canvas.width,
  h: canvas.height,
  cols: Math.floor(canvas.width / TILE),
  rows: Math.floor(canvas.height / TILE)
};

const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const restartBtn = document.getElementById('restartBtn');
const scoreEl = document.getElementById('score');

let animationId = null;
let running = false;
let score = 0;

// Maze legend: 0 = wall, 1 = pellet, 2 = empty / tunnel
// Simple symmetric layout scaled to canvas size
const basicMap = [
"0000000000000000000000000000000000000000000000",
"0111111110011111111100111111111001111111111100",
"0100000010010000000100100000001001000000000100",
"0100000010010000000100100000001001000000000100",
"0111111110011111111100111111111001111111111100",
"0100000000000000000000000000000000000000000100",
"0100000011111111111111111111111111111111100100",
"0111111111000000000000000000000000000011111100",
"0000000001001111111111111111111111001000000000",
"0000000001001000000000000000000001001000000000",
"0000000001001001111111111111111001001000000000",
"0000000001001001000000000000001001001000000000",
"0111111111001001111111111111111001111111111100",
"0100000000001000000000000000000000000000000100",
"0111111111111111111111111111111111111111111100"
];

// Pad or trim map to canvas grid
let map = [];
(function buildMap(){
  // scale basicMap to match rows & cols if possible
  const rowsNeeded = C.rows;
  const colsNeeded = C.cols;
  // repeat/trim rows
  for(let r=0;r<rowsNeeded;r++){
    const row = basicMap[r % basicMap.length].slice(0, colsNeeded);
    // if shorter, pad with 0
    map.push(row.padEnd(colsNeeded,'0').split('').map(ch=>ch==='1'?1:(ch==='0'?0:2)));
  }
})();

// Helper: is wall
function isWall(r,c){
  if(r<0||c<0||r>=map.length||c>=map[0].length) return true;
  return map[r][c]===0;
}

// Pellet tracking set (row,col)
let pellets = new Set();
function buildPellets(){
  pellets.clear();
  for(let r=0;r<map.length;r++){
    for(let c=0;c<map[0].length;c++){
      if(map[r][c]===1) pellets.add(`${r},${c}`);
    }
  }
}

// Entities
const pac = {
  r: Math.floor(map.length/2)+2,
  c: Math.floor(map[0].length/2),
  dir: {r:0,c:0},
  nextDir: {r:0,c:0},
  radius: TILE/2 - 1,
  speed: 4 // pixels per frame
};

const ghosts = [
  {r:7,c:Math.floor(map[0].length/2)-4, color:'#ff6b6b', dir:{r:0,c:0}, step:0},
  {r:7,c:Math.floor(map[0].length/2)+4, color:'#6bc1ff', dir:{r:0,c:0}, step:0}
];

// convert row/col to pixel center
function rcToPos(r,c){
  return {x: c*TILE + TILE/2, y: r*TILE + TILE/2};
}

// Movement: simple grid-based movement with pixel offsets
function moveEntity(ent, pixels){
  // ent has r, c, and pixel offsets not stored separately. We'll make grid movement snap-based.
  // For pac: attempt to change direction at center of tile.
  // Determine if pac is centered -> can change direction
  // We'll track pac.subx/y for fine movement
  if(ent.subx===undefined){ ent.subx = 0; ent.suby = 0; }
  // set desired direction vector
  const dir = ent.nextDir && (ent===pac) ? ent.nextDir : ent.dir;
  if(ent === pac){
    // Attempt to turn if centered
    if(ent.subx % TILE === 0 && ent.suby % TILE === 0){
      // at center of tile
      const rr = ent.r + dir.r;
      const cc = ent.c + dir.c;
      if(!isWall(rr,cc)){
        ent.dir = {r:dir.r,c:dir.c};
      } else {
        // if facing wall, stop
        if(isWall(ent.r+ent.dir.r, ent.c+ent.dir.c)){
          ent.dir = {r:0,c:0};
        }
      }
    }
  }
  // apply movement
  const dx = ent.dir.c * (pixels/ (TILE));
  const dy = ent.dir.r * (pixels/ (TILE));
  ent.subx += dx * TILE;
  ent.suby += dy * TILE;
  // If we moved beyond one tile size, update r,c
  while(ent.subx >= TILE){ ent.c += 1; ent.subx -= TILE; }
  while(ent.subx <= -TILE){ ent.c -= 1; ent.subx += TILE; }
  while(ent.suby >= TILE){ ent.r += 1; ent.suby -= TILE; }
  while(ent.suby <= -TILE){ ent.r -= 1; ent.suby += TILE; }
  // teleport edges (optional)
  if(ent.c < 0) ent.c = map[0].length-1;
  if(ent.c >= map[0].length) ent.c = 0;
  if(ent.r < 0) ent.r = map.length-1;
  if(ent.r >= map.length) ent.r = 0;
}

function updatePelletCollision(){
  // pac center tile
  const pr = pac.r;
  const pc = pac.c;
  const key = `${pr},${pc}`;
  if(pellets.has(key)){
    pellets.delete(key);
    score += 10;
    scoreEl.textContent = score;
  }
}

function ghostStep(g){
  // very simple: random direction avoiding walls
  if(!g.step || Math.random() < 0.02){
    const dirs = [{r:-1,c:0},{r:1,c:0},{r:0,c:-1},{r:0,c:1}];
    // prefer not reversing
    let choices = dirs.filter(d=>!isWall(g.r+d.r,g.c+d.c));
    if(choices.length===0) choices = dirs;
    const pick = choices[Math.floor(Math.random()*choices.length)];
    g.dir = pick;
    g.step = 12 + Math.floor(Math.random()*30);
  }
  g.step--;
  moveEntity(g, 2); // slower
}

function draw(){
  // clear
  ctx.fillStyle = '#000';
  ctx.fillRect(0,0,C.w,C.h);
  // draw maze walls
  for(let r=0;r<map.length;r++){
    for(let c=0;c<map[0].length;c++){
      const x = c*TILE, y = r*TILE;
      if(isWall(r,c)){
        ctx.fillStyle = '#001f3f';
        ctx.fillRect(x,y,TILE,TILE);
        // hint lines
        ctx.fillStyle = '#022847';
        ctx.fillRect(x+2,y+2,TILE-4,TILE-4);
      } else {
        // dot/pellet
        if(pellets.has(`${r},${c}`)){
          ctx.fillStyle = '#ffd23f';
          const cx = x + TILE/2, cy = y + TILE/2;
          ctx.beginPath();
          ctx.arc(cx,cy,2.2,0,Math.PI*2);
          ctx.fill();
        }
      }
    }
  }
  // draw pacman
  const pacPos = rcToPos(pac.r,pac.c);
  const px = pacPos.x + (pac.subx||0), py = pacPos.y + (pac.suby||0);
  ctx.fillStyle = '#ffd23f';
  // mouth angle based on dir
  let angle = 0.25*Math.PI;
  let startAng = angle, endAng = 2*Math.PI - angle;
  // rotate based on direction
  if(pac.dir.c===1){ ctx.beginPath(); ctx.moveTo(px,py); ctx.arc(px,py, pac.radius, -angle, angle); ctx.lineTo(px,py); ctx.fill(); }
  else if(pac.dir.c===-1){ ctx.beginPath(); ctx.moveTo(px,py); ctx.arc(px,py, pac.radius, Math.PI-angle, Math.PI+angle); ctx.lineTo(px,py); ctx.fill(); }
  else if(pac.dir.r===1){ ctx.beginPath(); ctx.moveTo(px,py); ctx.arc(px,py, pac.radius, Math.PI/2 - angle, Math.PI/2 + angle); ctx.lineTo(px,py); ctx.fill(); }
  else if(pac.dir.r===-1){ ctx.beginPath(); ctx.moveTo(px,py); ctx.arc(px,py, pac.radius, -Math.PI/2 - angle, -Math.PI/2 + angle); ctx.lineTo(px,py); ctx.fill(); }
  else { ctx.beginPath(); ctx.arc(px,py,pac.radius,0,Math.PI*2); ctx.fill(); }

  // ghosts
  for(const g of ghosts){
    const pos = rcToPos(g.r,g.c);
    const gx = pos.x + (g.subx||0), gy = pos.y + (g.suby||0);
    // body
    ctx.fillStyle = g.color;
    ctx.beginPath();
    ctx.arc(gx, gy-4, TILE/2-1, Math.PI, 0, false);
    ctx.fill();
    ctx.fillRect(gx - (TILE/2-1), gy-4, TILE-2, TILE/2 + 2);
    // eyes (simple)
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(gx-4, gy-2, 3,0,Math.PI*2); ctx.arc(gx+4, gy-2,3,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.arc(gx-4, gy-2,1.2,0,Math.PI*2); ctx.arc(gx+4, gy-2,1.2,0,Math.PI*2); ctx.fill();
  }
}

function loop(){
  if(!running) return;
  // update
  moveEntity(pac, pac.speed);
  updatePelletCollision();
  for(const g of ghosts) ghostStep(g);
  // check collisions (very simple bounding)
  const ppos = rcToPos(pac.r,pac.c);
  for(const g of ghosts){
    const gpos = rcToPos(g.r,g.c);
    const dx = Math.abs(ppos.x - gpos.x);
    const dy = Math.abs(ppos.y - gpos.y);
    if(Math.hypot(dx,dy) < 12){
      // collision -> reset
      running = false;
      cancelAnimationFrame(animationId);
      alert('You were caught! Score: ' + score);
      return;
    }
  }
  // win?
  if(pellets.size === 0){
    running = false;
    cancelAnimationFrame(animationId);
    alert('You win! Score: ' + score);
    return;
  }
  draw();
  animationId = requestAnimationFrame(loop);
}

// keyboard
window.addEventListener('keydown',(e)=>{
  if(e.key.includes('Arrow')){
    e.preventDefault();
    const d = {r:0,c:0};
    if(e.key==='ArrowUp') d.r = -1;
    if(e.key==='ArrowDown') d.r = 1;
    if(e.key==='ArrowLeft') d.c = -1;
    if(e.key==='ArrowRight') d.c = 1;
    pac.nextDir = d;
  }
  if(e.key===' '){
    // space -> pause / resume
    togglePause();
  }
});

startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', togglePause);
restartBtn.addEventListener('click', resetGame);

function startGame(){
  if(running) return;
  if(pellets.size === 0) buildPellets();
  running = true;
  animationId = requestAnimationFrame(loop);
}

function togglePause(){
  if(!running){
    running = true;
    animationId = requestAnimationFrame(loop);
    return;
  }
  running = false;
  cancelAnimationFrame(animationId);
}

function resetGame(){
  running = false;
  cancelAnimationFrame(animationId);
  score = 0;
  scoreEl.textContent = score;
  pac.r = Math.floor(map.length/2)+2; pac.c = Math.floor(map[0].length/2); pac.dir={r:0,c:0}; pac.nextDir={r:0,c:0}; pac.subx=0; pac.suby=0;
  ghosts[0].r=7; ghosts[0].c=Math.floor(map[0].length/2)-4; ghosts[0].subx=0; ghosts[0].suby=0;
  ghosts[1].r=7; ghosts[1].c=Math.floor(map[0].length/2)+4; ghosts[1].subx=0; ghosts[1].suby=0;
  buildPellets();
  draw();
}

// init
buildPellets();
draw();
