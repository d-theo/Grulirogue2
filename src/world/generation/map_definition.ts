import * as _ from 'lodash';
import { Coordinate } from '../../game/utils/coordinate';
import { Rect } from '../../game/utils/rectangle';

export interface MapGraph {
    doors: {
        roomId: number,
        position: Coordinate
        isLocked: boolean,
        zoneId: number
    }[],
    vertices: {
        from: number,
        to: number,
        segments: {
            A: Coordinate,
            B: Coordinate
        }[]
    }[],
    rooms: Room[],
    links : {
        from: Coordinate, 
        to: Coordinate
    }[],
    connexions?: any;
    bossRoom?: number;
    miniRoom?: number;
    specialRoom?: number;
}

type Room = {
    roomId: number;
    groupId: number;
    rect: Rect
    isEntry: boolean
    isExit: boolean;
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
    function generate(randomStair:boolean = true): MapGraph {
        if (randomStair === true) {
            _.sample(rooms).isEntry = true;
            _.sample(rooms).isExit = true;
        }

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
                        console.log('bossroom available');
                    } else {
                        res.specialRoom = r.roomId;
                        console.log('specialroom available');
                    }
                } else {
                    res.miniRoom = r.roomId;
                    console.log('miniroom available');
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