import { insideRect } from "./map-geo";

const canvas = document.getElementById('canvas');
const ctx: any = (canvas as any).getContext('2d');

function displayTileMap(tilemap) {
    ctx.canvas.width  = 2000;
    ctx.canvas.height = 2000;
    for (let x = 0; x < ctx.canvas.height; x++) {
        drawText(tilemap[x].join(' '), x, null);
    }
}
export function paint(map, width, height) {
    ctx.canvas.width  = width;
    ctx.canvas.height = height;
    const rooms = map.rooms;
    for (var x = 0; x < rooms.length; x++) {
        fillRect(rooms[x].rect, null);
        if (rooms[x].isEntry) {
            fillRect(insideRect(rooms[x].rect), 'red');
        } else if (rooms[x].isExit) {
            fillRect(insideRect(rooms[x].rect),'blue');
        }
    }

    const doors = map.doors;
    for (let door of doors) {
        if (door.isLocked) {
            drawCircle(door.position, 'orange', null);
        } else {
            drawCircle(door.position, 'blue', null);
        }
    }

    const vertices = map.vertices;
    for (let vertex of vertices) {
        for (let line of vertex.segments) {
            traceLine(line.A, line.B, null);
        }
    }
}

function drawText(text, lineNb, color) {
    ctx.font = "13px Arial";
    ctx.fillText(text, 10, 16*lineNb); 
}

function drawCircle(pos, color, range) {
    ctx.beginPath();
    color && (ctx.fillStyle = color)
    ctx.arc(pos.x, pos.y, (range || 4), 0, Math.PI * 2, 1);
    ctx.fill();
}
function traceLine(pos1, pos2, color) {
    ctx.beginPath();
    if (color) {
        ctx.strokeStyle = color;
    } else {
        ctx.strokeStyle = 'black';
    }
    ctx.moveTo(pos1.x, pos1.y);
    ctx.lineTo(pos2.x, pos2.y);
    ctx.stroke();
}

function fillRect(rect, color) {
    if (color) {
        ctx.fillStyle = color;
    } else {
        ctx.fillStyle = '#'+Math.random().toString(16).substr(2,6);
    }
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
}