const Terrain = {
    Test:5,
    DoorOpen: 2,
    DoorLocked: 3,
    BlockGrey: 1,
    WallGrey: 0,
    BlockWater: 6
}

const params = {
    Area: 500, // min area of a room
    Fuzz: 0.25, // room size variation +-
    MinClusterSize: 5, // minimal cluster of room
    Width: 80,
    Height: 60,
    MinSubSize: 6, // subdivise into subcluster if cluster is bigger than MinSubSize
    canvasWidth: 100,
    canvasHeight: 100,
};
function createTileMap() {
    const map = generateRLMap(params);
    const tilemap = tile(map, params);
    return tilemap;
}

function displayTileMap(tilemap) {
    ctx.canvas.width  = 2000;
    ctx.canvas.height = 2000;
    for (let x = 0; x < params.canvasHeight; x++) {
        drawText(tilemap[x].join(' '), x);
    }
}

function tile(map, params) {
    const tilemap = Array(params.canvasHeight).fill(Terrain.WallGrey).map(()=>Array(params.canvasWidth).fill(Terrain.WallGrey));
    const rooms = map.rooms;
    for (var x = 0; x < rooms.length; x++) {
        makeRoomTile(rooms[x].rect, tilemap);
    }
    const vertices = map.vertices;
    for (let vertex of vertices) {
        for (let line of vertex.segments) {
            lineTile(line.A, line.B, tilemap, Terrain.BlockGrey);
        }
    }
    const doors = map.doors;
    for (let door of doors) {
        if (door.isLocked) {
            tilemap[door.position.x][door.position.y] = Terrain.DoorLocked;
        } else {
            tilemap[door.position.x][door.position.y] = Terrain.DoorOpen;
        }
    }
    return tilemap;
}

function makeRoomTile(rect, tilemap) {
    for (let x = rect.x; x < rect.x+rect.width; x++) {
        for (let y = rect.y; y < rect.y+rect.height; y++) {
            tilemap[x][y] = Terrain.BlockGrey;
        }
    }
    const points = pointsOfRect(rect);
    lineTile(points.A, points.B, tilemap, Terrain.Test)
    lineTile(points.C, points.B, tilemap, Terrain.Test)
    lineTile(points.C, points.D, tilemap, Terrain.Test)
    lineTile(points.A, points.D, tilemap, Terrain.Test)
}

function lineTile(A, B, tilemap, type) {
    var x0 = A.x, y0 = A.y, x1 = B.x, y1 = B.y;
    var dx = Math.abs(x1 - x0);
    var dy = Math.abs(y1 - y0);
    var sx = (x0 < x1) ? 1 : -1;
    var sy = (y0 < y1) ? 1 : -1;
    var err = dx - dy;
 
    while(true) {
       tilemap[x0][y0] = type;
       if (Math.abs(x0-x1) < 0.0001 && Math.abs(y0-y1) < 0.0001 ) break;
       var e2 = 2*err;
       if (e2 > -dy) { err -= dy; x0  += sx; }
       if (e2 < dx) { err += dx; y0  += sy; }
    }
 }