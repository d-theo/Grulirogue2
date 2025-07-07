import * as _ from 'lodash';
import { createGraph } from '../map_definition';
import { rand, randomPointOfEdge } from '../map-geo';
import { Rect } from '../../../utils/rectangle';

export function generatePirateMap() {
  const height = 30;
  const width = 90;
  const graph = createGraph();

  const north = {
    x: 10,
    y: 10,
    width: 60,
    height: 10,
  };
  const south = {
    x: 10,
    y: 24,
    width: 60,
    height: 10,
  };
  const hallway = {
    x: 10,
    y: 20,
    width: 60,
    height: 4,
  };

  graph.addRoom({
    roomId: 1,
    groupId: rand(0, 999),
    rect: hallway,
    isEntry: false,
    isExit: false,
  });

  recursiveCut(north, graph, 'S');
  recursiveCut(south, graph, 'N');

  return graph.generate();
}

function recursiveCut(r: Rect, graph, dir) {
  const array = cutRect(r, 'vertical', 0.2);
  if (array[0].width > 12) {
    recursiveCut(array[0], graph, dir);
  } else {
    if (array[0].width >= 9 && Math.random() > 0) {
      const double = cutRect(array[0], 'horizontal', 0);
      makeDoubleRoom(double[0], double[1], graph, dir);
    } else {
      makeRoom(array[0], graph, dir);
    }
  }
  if (array[1].width > 12) {
    recursiveCut(array[1], graph, dir);
  } else {
    if (array[1].width >= 9 && Math.random() > 0.3) {
      const double = cutRect(array[1], 'horizontal', 0);
      makeDoubleRoom(double[0], double[1], graph, dir);
    } else {
      makeRoom(array[1], graph, dir);
    }
  }
}

function makeRoom(r, graph, dir) {
  const newRoom = {
    roomId: rand(0, 99999),
    groupId: rand(0, 999),
    rect: r,
    isEntry: false,
    isExit: false,
  };
  graph.addRoom(newRoom);
  const door = randomPointOfEdge(r, dir);
  graph.addDoor({
    roomId: newRoom.roomId,
    position: door.pos,
    isLocked: false,
    zoneId: rand(0, 999),
  });
  graph.connect(newRoom.roomId, 1);
}
function makeDoubleRoom(north, south, graph, dir) {
  const newRoomNorth = {
    roomId: rand(0, 99999),
    groupId: rand(0, 999),
    rect: north,
    isEntry: false,
    isExit: false,
  };
  const newRoomSouth = {
    roomId: rand(0, 99999),
    groupId: rand(0, 999),
    rect: south,
    isEntry: false,
    isExit: false,
  };

  graph.addRoom(newRoomNorth);
  graph.addRoom(newRoomSouth);

  if (dir === 'S') {
    const doorHall = randomPointOfEdge(south, 'N');
    const doorRoom = randomPointOfEdge(south, 'S');
    graph.addDoor({
      roomId: newRoomSouth.roomId,
      position: doorHall.pos,
      isLocked: false,
      zoneId: rand(0, 999),
    });
    graph.addDoor({
      roomId: newRoomSouth.roomId,
      position: doorRoom.pos,
      isLocked: false,
      zoneId: rand(0, 999),
    });
    graph.connect(newRoomSouth.roomId, 1);
    graph.connect(newRoomSouth.roomId, newRoomNorth.roomId);
  } else if (dir === 'N') {
    const doorHall = randomPointOfEdge(north, 'N');
    const doorRoom = randomPointOfEdge(north, 'S');
    graph.addDoor({
      roomId: newRoomNorth.roomId,
      position: doorHall.pos,
      isLocked: false,
      zoneId: rand(0, 999),
    });
    graph.addDoor({
      roomId: newRoomNorth.roomId,
      position: doorRoom.pos,
      isLocked: false,
      zoneId: rand(0, 999),
    });
    graph.connect(newRoomNorth.roomId, 1);
    graph.connect(newRoomSouth.roomId, newRoomNorth.roomId);
  }
}

export function cutRect(rect: Rect, cutDirection: 'horizontal' | 'vertical', fuzz: number) {
  if (cutDirection === 'vertical') {
    var w = rect.width;
    var f = Math.floor(fuzz * w);
    var cut = Math.floor(w / 2 + rand(-f, f));
    return [
      { x: rect.x, y: rect.y, width: cut, height: rect.height },
      { x: cut + rect.x, y: rect.y, width: w - cut, height: rect.height },
    ];
  } else {
    var h = rect.height;
    var f = Math.floor(fuzz * h);
    var cut = Math.floor(h / 2 + rand(-f, f));
    return [
      { x: rect.x, y: rect.y, width: rect.width, height: cut },
      { x: rect.x, y: cut + rect.y, width: rect.width, height: h - cut },
    ];
  }
}
