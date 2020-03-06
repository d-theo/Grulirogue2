const params = {
    Area: 500, // min area of a room
    Fuzz: 0.25, // room size variation +-
    MinClusterSize: 2, // minimal cluster of room
    Width: 80,
    Height: 60,
    MinSubSize: 6, // subdivise into subcluster if cluster is bigger than MinSubSize
    canvasWidth: 100,
    canvasHeight: 100,
};
const map = generateRLMap(params);
const tilemap = tile(map, params);  
console.log(tilemap);
function tile(map, params) {
    const tilemap = Array(params.canvasHeight).fill(1).map(()=>Array(params.canvasWidth).fill(1));
    const rooms = map.rooms;
    for (var x = 0; x < rooms.length; x++) {
        makeRoomTile(rooms[x].rect, tilemap);
    }
    const doors = map.doors;
    for (let door of doors) {
        if (door.isLocked) {
            tilemap[]door.position, 'orange');
            drawCircle(door.position, 'orange');
        } else {
            drawCircle(door.position, 'blue');
        }
    }

    const vertices = map.vertices;
    for (let vertex of vertices) {
        for (let line of vertex.segments) {
            lineTile(line.A, line.B, tilemap);
        }
    }
    return tilemap;
}

function makeRoomTile(rect, tilemap) {
    for (let x = rect.x; x < rect.x+rect.width; x++) {
        for (let y = rect.y; y < rect.y+rect.height; y++) {
            tilemap[x][y] = 0;
        }
    }
}

function lineTile(A, B, tilemap) {
    var x0 = A.x, y0 = A.y, x1 = B.x, y1 = B.y;
    var dx = Math.abs(x1 - x0);
    var dy = Math.abs(y1 - y0);
    var sx = (x0 < x1) ? 1 : -1;
    var sy = (y0 < y1) ? 1 : -1;
    var err = dx - dy;
 
    while(true) {
       tilemap[x0][y0] = 0;
       if (Math.abs(x0-x1) < 0.0001 && Math.abs(y0-y1) < 0.0001 ) break;
       var e2 = 2*err;
       if (e2 > -dy) { err -= dy; x0  += sx; }
       if (e2 < dx) { err += dx; y0  += sy; }
    }
 }