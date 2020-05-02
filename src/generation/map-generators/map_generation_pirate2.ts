import * as _ from 'lodash';
import { createGraph } from '../map_definition';
import { rand, randomPointOfEdge } from '../map-geo';
import { Rect } from '../../game/utils/rectangle';

let _id = 10;
const id = () => {
    return _id++
}

export function generatePirateMap2() {
    const height = 30;
    const width = 90;
    const graph = createGraph();

    /// left
    const leftExit = {
        x: 5,
        y: 20,
        width: 5,
        height: 4
    };
    const north = {
        x: 10,
        y: 10,
        width: 20,
        height: 10
    };
    const south = {
        x: 10,
        y: 24,
        width: 20,
        height: 10
    };
    const hallway = {
        x: 10,
        y: 20,
        width: 20,
        height: 4
    };

    //// mid x=30
    const midBoss = {
        x: 30,
        y: 10,
        width: 10,
        height: 20
    }

    ///// right x=40
    const north2 = {
        x: 40,
        y: 10,
        width: 20,
        height: 10
    };
    const south2 = {
        x: 40,
        y: 24,
        width: 20,
        height: 10
    };
    const hallway2 = {
        x: 40,
        y: 20,
        width: 20,
        height: 4
    };
    const rightEntry = {
        x: 60,
        y: 20,
        width: 5,
        height: 4
    };
    ///// 
    graph.addRoom({
        roomId: 1,
        groupId: rand(0, 999),
        rect: hallway,
        isEntry: false,
        isExit: false
    });
    const doorExitPoint = randomPointOfEdge(hallway, 'W');
    const doorBossRightPoint = randomPointOfEdge(hallway, 'E');

    const doorEntryPoint = randomPointOfEdge(hallway2, 'E');
    const doorBossLeft = randomPointOfEdge(hallway2, 'W');

    graph.addRoom({
        roomId: 2,
        groupId: rand(0, 99999),
        rect: hallway2,
        isEntry: false,
        isExit: false
    });

    graph.addRoom({
        roomId: 3,
        groupId: rand(0, 99999),
        rect: midBoss,
        isEntry: false,
        isExit: false
    });
    graph.addRoom({
        roomId: 4,
        groupId: rand(0, 99999),
        rect: leftExit,
        isEntry: false,
        isExit: true
    });
    graph.addRoom({
        roomId: 5,
        groupId: rand(0, 99999),
        rect: rightEntry,
        isEntry: true,
        isExit: false
    });

    graph.addDoor({
        roomId: 1,
        position: doorExitPoint.pos,
        isLocked: false,
        zoneId: rand(0, 99999),
    });
    graph.addDoor({
        roomId: 1,
        position: doorBossRightPoint.pos,
        isLocked: false,
        zoneId: rand(0, 99999),
    });
    graph.addDoor({
        roomId: 2,
        position: doorEntryPoint.pos,
        isLocked: false,
        zoneId: rand(0, 99999),
    });
    graph.addDoor({
        roomId: 2,
        position: doorBossLeft.pos,
        isLocked: false,
        zoneId: rand(0, 99999),
    });
    graph.connect(4, 1);
    graph.connect(3, 1);
    graph.connect(3, 2);
    graph.connect(5, 2);


    recursiveCut(north, graph, 'S');
    recursiveCut(south, graph, 'N');

    recursiveCut(north2, graph, 'S');
    recursiveCut(south2, graph, 'N');
    
    const g = graph.generate(false);
    g.bossRoom = 3;
    return g;
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
        roomId: id(),
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
        roomId: id(),
        groupId: rand(0, 999),
        rect: north,
        isEntry: false,
        isExit: false
    };
    const newRoomSouth = {
        roomId: id(),
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
            zoneId: rand(0, 99999),
        });
        graph.addDoor({
            roomId: newRoomSouth.roomId,
            position: doorRoom.pos,
            isLocked: false,
            zoneId: rand(0, 99999),
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
            zoneId: rand(0, 99999),
        });
        graph.addDoor({
            roomId: newRoomNorth.roomId,
            position: doorRoom.pos,
            isLocked: false,
            zoneId: rand(0, 99999),
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