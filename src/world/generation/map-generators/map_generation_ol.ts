import * as _ from 'lodash';
import { createGraph } from '../map_definition';
import { randomSizeRect, rand, randomPointOfEdge, isOverlaping } from '../map-geo';
import { Rect } from '../../../utils/rectangle';

const params = {
  canvasWidth: 50,
  canvasHeight: 50,
  Height: 30,
  Width: 30,
  Area: 250,
};

export function generateOlMap() {
  params.canvasWidth = 50;
  params.canvasHeight = 50;
  params.Height = 30;
  params.Width = 30;
  const graph = createGraph();
  const size = Math.floor(Math.sqrt(params.Area) / 2);
  const rooms = [];
  const randRect = (x, y) => randomSizeRect(x, y, 10, 10, 0.4, rand(9, 12), rand(9, 12));

  rooms.push({
    roomId: rand(0, 99099),
    groupId: rand(0, 999),
    rect: randRect(rand(0, params.Width), rand(0, params.Height)),
    isEntry: false,
    isExit: false,
  });

  let area = 0;
  let maxArea = params.Width * params.Height;
  let x = 0;
  while (true) {
    x++;
    if (x > 1000 || area / maxArea > 0.9) {
      break;
    }
    const _startingRoom = _.sample(rooms);
    const startingRoom = _startingRoom.rect;
    const door = randomPointOfEdge(startingRoom);
    const adjRoom = randRect(door.pos.x, door.pos.y);
    translateRoom(adjRoom, startingRoom, door.direction);
    if (
      fits(
        adjRoom,
        startingRoom,
        rooms.map((r) => r.rect),
        params
      )
    ) {
      const newRoom = {
        roomId: rand(0, 99999),
        groupId: rand(0, 999),
        rect: adjRoom,
        isEntry: false,
        isExit: false,
      };
      rooms.push(newRoom);
      area += adjRoom.width * adjRoom.height;

      graph.addDoor({
        roomId: newRoom.roomId,
        position: door.pos,
        isLocked: false,
        zoneId: rand(0, 999),
      });

      graph.connect(_startingRoom.roomId, newRoom.roomId);
    }
  }
  rooms.forEach((r) => {
    graph.addRoom(r);
  });
  return graph.generate();
}

function fits(room, startingRoom, rooms, params) {
  if (room.x < 0) return false;
  if (room.x + room.width >= params.canvasWidth) return false;
  if (room.y < 0) return false;
  if (room.y + room.height >= params.canvasHeight) return false;
  for (const r of rooms) {
    if (r === startingRoom) continue;
    if (isOverlaping(room, r)) {
      return false;
    }
  }
  return true;
}

function translateRoom(r: Rect, rInit: Rect, d) {
  switch (d) {
    case 'N':
      r.y -= r.height;
      r.x -= rand(1, r.width - 1);
      break;
    case 'S':
      r.x -= rand(1, r.width - 1);
      break;
    case 'E':
      r.y -= rand(1, r.height - 1);
      break;
    case 'W':
      r.x -= r.width;
      r.y -= rand(1, r.height - 1);
      break;
  }
}
