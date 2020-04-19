import { MapGraph } from "./map_definition";
import { Coordinate } from "../game/utils/coordinate";
import { Rect } from "../game/utils/rectangle";
import { randomSizeRect, rand, randomPointOfEdge, isOverlaping } from "./map-geo";
import { MapParamCreation } from "../map/map-generator";
import * as _ from 'lodash';

export function generateOlMap(params: MapParamCreation) {
    params.canvasWidth = 50;
    params.canvasHeight = 50;
    params.Height = 30;
    params.Width = 30;
    const graph = createMapOlDefinition();
    const size = Math.floor(Math.sqrt(params.Area)/2);
    const rooms = [];
    const randRect = (x,y) => randomSizeRect(x,y, 10, 10, 0.4, rand(9,12), rand(9,12));
    
    rooms.push({
        roomId: rand(0, 99099),
        groupId: rand(0, 999),
        rect: randRect(rand(0, params.Width), rand(0, params.Height)),
        isEntry: false,
        isExit: false
    });

    let area = 0;
    let maxArea = params.Width * params.Height;
    let x = 0;
    while (true) {
        x++;
        if (x > 1000 || area/maxArea > 0.90) {break;} 
        const _startingRoom = _.sample(rooms);
        const startingRoom = _startingRoom.rect;
        const door = randomPointOfEdge(startingRoom);
        const adjRoom = randRect(door.pos.x, door.pos.y);
        translateRoom(adjRoom, startingRoom, door.direction);
        if (fits(adjRoom, startingRoom, rooms.map(r => r.rect), params)) {
            const newRoom = {
                roomId: rand(0, 99999),
                groupId: rand(0, 999),
                rect: adjRoom,
                isEntry: false,
                isExit: false
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
    rooms.forEach(r => {
        graph.addRoom(r);
    });
    return graph.generate();
}

function fits(room, startingRoom, rooms, params) {
    if (room.x < 0) return false;
    if (room.x+room.width >= params.canvasWidth) return false;
    if (room.y < 0) return false;
    if (room.y+room.height >= params.canvasHeight) return false;
    for (const r of rooms) {
        if (r === startingRoom) continue;
        if (isOverlaping(room, r)) {
            return false;
        }
    }
    return true;
}

function translateRoom(r: Rect, rInit: Rect, d) {
    switch(d) {
        case 'N': 
            r.y -= r.height;
            r.x -= rand(1, r.width-1);
            break;
        case 'S':
            r.x -= rand(1, r.width-1);
            break;
        case 'E':
            r.y -= rand(1, r.height-1);
            break;
        case 'W': 
            r.x -= r.width;
            r.y -= rand(1, r.height-1);   
            break;
    }
}

function createMapOlDefinition() {
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

    function getRoom(id: number) {
        for (const r of rooms) {
            if (r.roomId === id) {
                return r;
            }
        }
    }
    function addRoom(arg:{
        roomId: number,
        groupId: number,
        rect: Rect,
        isEntry: boolean,
        isExit: boolean
    }) {
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
        generate
    }
}