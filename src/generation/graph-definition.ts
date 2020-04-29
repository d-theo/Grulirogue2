import { MapGraph } from "./map_definition";
import { Coordinate } from "../game/utils/coordinate";
import { Rect } from "../game/utils/rectangle";
import {rand, randomPointOfEdge } from "./map-geo";
import { MapParamCreation } from "../map/map-generator";
import * as _ from 'lodash';

type Room = {
    roomId: number;
    groupId: number;
    rect: Rect
    isEntry: boolean
    isExit: boolean;
}

export function generatePirateMap(params: MapParamCreation) {
    params.Height = 30;
    params.Width = 90;
    const graph = createGraph();
    const rooms = [];

    const north = {
        x: 10,
        y: 10,
        width: 60,
        height: 10
    };
    const south = {
        x: 10,
        y: 24,
        width: 60,
        height: 10
    };
    const hallway = {
        x: 10,
        y: 20,
        width: 60,
        height: 4
    };

    graph.addRoom({
        roomId: 1,
        groupId: rand(0, 999),
        rect: hallway,
        isEntry: false,
        isExit: false
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
            const double =  cutRect(array[0], 'horizontal', 0);
            makeDoubleRoom(double[0], double[1], graph, dir);
        } else {
            makeRoom(array[0], graph, dir);
        }
    }
    if (array[1].width > 12) {
        recursiveCut(array[1], graph, dir);
    } else {
        if (array[1].width >= 9 && Math.random() > 0.3) {
            const double =  cutRect(array[1], 'horizontal', 0);
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
        isExit: false
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
        isExit: false
    };
    const newRoomSouth = {
        roomId: rand(0, 99999),
        groupId: rand(0, 999),
        rect: south,
        isEntry: false,
        isExit: false
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

export function cutRect(rect: Rect, cutDirection:'horizontal'|'vertical', fuzz: number) {
    if (cutDirection === 'vertical') {
        var w = rect.width;
        var f = Math.floor(fuzz * w);
        var cut = Math.floor(w/2 + rand(-f,f));
        return [{x:rect.x, y:rect.y, width: cut, height: rect.height},
                {x:cut+rect.x, y:rect.y, width: w-cut, height: rect.height}]
    } else {
        var h = rect.height;
        var f = Math.floor(fuzz* h);
        var cut = Math.floor(h/2 + rand(-f,f));
        return [{x:rect.x, y:rect.y, width: rect.width, height: cut},
        {x:rect.x, y:cut+rect.y, width:rect.width, height: h-cut}]
    }
}

export function createGraph() {
    const doors = [];
    const vertices = [];
    const rooms = [];
    const links = [];
    const graph: {[s: number]: number[]} = {};

    function connect(rid1: number, rid2: number) {
        graph[rid1] = graph[rid1] ? graph[rid1].concat([rid2]) : [rid2];
        graph[rid2] = graph[rid2] ? graph[rid2].concat([rid1]) : [rid1];
    }

    function addDoor(arg: {
        roomId: number,
        position: Coordinate
        isLocked: boolean,
        zoneId: number
    }) {
        doors.push(arg);
    }

    function addVertice(arg:{
        from: number,
        to: number,
        segments: {
            A: Coordinate,
            B: Coordinate
        }
    }) {
        vertices.push(arg);
    }
    function getRooms() : Room[]{
        return rooms;
    }
    function getRoom(id: number) {
        for (const r of rooms) {
            if (r.roomId === id) {
                return r;
            }
        }
    }
    function addRoom(arg:Room) {
        rooms.push(arg);
    }
    function addLink(arg:{
        from: Coordinate, 
        to: Coordinate
    }) {
        links.push(arg);
    }
    function generate(): MapGraph {
        _.sample(rooms).isEntry = true;
        _.sample(rooms).isExit = true;

        let res: MapGraph = {
            doors,
            vertices,
            rooms,
            links,
            connexions: graph,
        }

        for (const k of Object.keys(graph)) {
            const v = graph[k];
            if (v.length === 1) {
                const r = getRoom(+k);
                if (r.isExit || r.isEntry) continue;
                if (r.rect.width * r.rect.height > 40) {
                    if (!res.bossRoom) {
                        res.bossRoom = r.roomId;
                    } else {
                        res.specialRoom = r.roomId;
                    }
                } else {
                    res.miniRoom = r.roomId;
                }
            }
        }

        return res;
    }
    return {
        addDoor,
        addLink,
        addRoom,
        addVertice,
        connect,
        getRooms,
        generate
    }
}