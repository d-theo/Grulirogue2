import { rand, insideRect, middleOfRect, getMiddlesOfRect, pointInRect, lineIntersectRect, distanceBetween, reduceMin } from "./map-geo";

export function generateRLMap(Params) {
    Params = Params || {
        Area: 50000, // min area of a room
        Fuzz: 0.25, // room size variation +-
        MinClusterSize: 2, // minimal cluster of room
        Width: 800,
        Height: 600,
        MinSubSize: 6, // subdivise into subcluster if cluster is bigger than MinSubSize
        canvasWidth: 1000,
        canvasHeight: 1000,
    }

    let G = createGraph();
    let ROOM_IDX = 0;
    generate();

    return {
        rooms: G.getRooms(),
        vertices: G.getVertices(),
        doors: G.getDoors(),
        links: G.getLinks()
    }

    function createMapPair() {
        const o = {};
        function set(a,b) {
            o[`${a}${b}`] = true;
            o[`${b}${a}`] = true;
        }
        function has(a,b) {
            return o[`${b}${a}`] === true;
        }
        return {
            set,
            has
        }
    }

    function createGraph () {
        let rooms = [];
        let links = [];
        let vertices = [];
        let doors = [];
        function setRooms(_rooms) {
            const p = createMapPair();
            for (let r of _rooms) {
                for (let adj of r.gameMetadata.adjacentRooms) {
                    const g1 = r.gameMetadata.groupId;
                    const g2 = adj.gameMetadata.groupId;
                    if (g1 !== g2) {
                        if (p.has(g1, g2)) continue;
                        links.push({
                            from: g1, 
                            to: g2
                        });
                        p.set(g1, g2);
                    }
                }
            }
            rooms = _rooms.map(m => {
                return {
                    roomId:m.gameMetadata.roomId,
                    groupId:m.gameMetadata.groupId,
                    rect: m.gameMetadata.rect,
                    isEntry: m.gameMetadata.isEntry,
                    isExit: m.gameMetadata.isExit
                }
            });
        }
        function addVertex(roomId1, roomId2, segs) {
            vertices.push({
                from: roomId1,
                to: roomId2,
                segments: segs
            });
        }
        function addDoor(roomId, zoneId, position, isOpen) {
            doors.push({
                roomId,
                position,
                isLocked: !isOpen,
                zoneId
            });
        }
        function getLinks() {
            return links;
        }
        function getRooms() {
            return rooms;
        }
        function getVertices() {
            return vertices;
        }
        function getDoors() {
            return doors;
        }
        function reset() {
            rooms = [];
            links = [];
            doors = [];
            vertices = [];
        }
        return {
            getLinks,
            getRooms,
            getDoors,
            getVertices,
            addDoor,
            setRooms,
            addVertex,
            reset,
        }
    }

    function createNode(depth, rect) {
        var left = null;
        var right = null;
        var area = rect.width * rect.height;
        var gameMetadata = {
            isEntry: false,
            isExit: false,
            doors: [],
            buttonIds: [],
            rect: null,
            adjacentRooms: [],
            roomId: ++ROOM_IDX,
            groupId: -1,
        };
        if (area > Params.Area) {
            if (depth % 2 === 0) {
                var w = rect.width;
                var fuzz = Math.floor(Params.Fuzz * w);
                var cut = Math.floor(w/2 + rand(-fuzz,fuzz));
                left = createNode(depth+1, {x:rect.x, y:rect.y, width: cut, height: rect.height});
                right = createNode(depth+1, {x:cut+rect.x, y:rect.y, width: w-cut, height: rect.height});
            } else {
                var h = rect.height;
                var fuzz = Math.floor(Params.Fuzz * h);
                var cut = Math.floor(h/2 + rand(-fuzz,fuzz));
                left = createNode(depth+1, {x:rect.x, y:rect.y, width: rect.width, height: cut});
                right = createNode(depth+1, {x:rect.x, y:cut+rect.y, width:rect.width, height: h-cut});
            }
        } else {
            gameMetadata.rect = insideRect(rect);
        }

        return {
            left,
            right,
            parent,
            depth,
            rect,
            gameMetadata,
        };
    }

    function getChildrenOfBinaryGraph(root) {
        var res = [];
        if (root.left) {
            var r = getChildrenOfBinaryGraph(root.left);
            res = res.concat(r);
        } else {
            return [root];
        }
        if (root.right) {
            var r = getChildrenOfBinaryGraph(root.right);
            res = res.concat(r);
        } else {
            return [root];
        }
        return res;
    }

    function sliceIntoSubArray(array, minSize) {
        var s = rand(minSize, array.length - minSize - 1);
        var first = array.slice(0, s);
        var last = array.slice(s, array.length);
        if(first.length === 1 || last.length === 1) {
            throw new Error('error generating sliceIntoSubArray')
        }
        return [first,last];
    }

    function subMapping(rooms) {
        var left;
        var right;
        var isLeaf = false;
        if (rooms.length > Params.MinSubSize) {
            var sliced = sliceIntoSubArray(rooms, Params.MinClusterSize);
            right = subMapping(sliced[0]);
            left = subMapping(sliced[1]);
        } else {
            isLeaf = true;
        }
        return {
            left,
            right,
            rooms,
            isLeaf,
        }
    }

    function linkRooms(r1, r2) {
        r1.gameMetadata.adjacentRooms.push(r2);
        r2.gameMetadata.adjacentRooms.push(r1);
    }

    function createConnectedGraph(rooms) {
        var groupId = rand(0,10000);
        for (var i = 0; i < rooms.length-1; i++) {
            linkRooms(rooms[i], rooms[i+1]);

            rooms[i].gameMetadata.groupId = groupId;
            rooms[i+1].gameMetadata.groupId = groupId;
        }
    }
    function createRoomGraph(rootSubMap) {
        if (rootSubMap.isLeaf) {
            createConnectedGraph(rootSubMap.rooms);
        } else {
            var roomsLeft = rootSubMap.left.rooms;
            var roomsRight = rootSubMap.right.rooms;
            //var roomLeftIdx = rand(0, roomsLeft.length-1);
            var roomLeftIdx = 0;
            //var roomRightIdx = rand(0, roomsRight.length-1);
            var roomRightIdx = 0;
            linkRooms(roomsLeft[roomLeftIdx], roomsRight[roomRightIdx]);
            createRoomGraph(rootSubMap.left);
            createRoomGraph(rootSubMap.right);
        }
    }

    function generate() {
        var ok = false;
        var cpt = 0;
        while(!ok) {
            if (cpt > 10000) {
                console.log('no entry =/');
                return;
            }
            try {
                var root = createNode(0, {x:10, y:10, width:Params.Width, height:Params.Height});
                var rooms = getChildrenOfBinaryGraph(root);
                var roomsLength = rooms.length;
                rooms[0].gameMetadata.isEntry = true;
                rooms[roomsLength-1].gameMetadata.isExit = true;
                var rootSubMap = subMapping(rooms);
                createRoomGraph(rootSubMap);
                G.setRooms(rooms);
                createHallsAndDoors(rooms);
                ok = true;
            } catch(e) {
                cpt ++;
                G.reset();
            }
        }
    }

    function createHallsAndDoors(rooms) {
        let pairs = {};
        for (var x = 0; x < rooms.length; x++) {
            var adjRooms = rooms[x].gameMetadata.adjacentRooms;
            const roomData = rooms[x].gameMetadata;
            //var center = middleOfRect(rooms[x].gameMetadata.rect);
            for (var y = 0; y < adjRooms.length; y++) {
                const currentRoomData = adjRooms[y].gameMetadata;
                if(pairs[`${roomData.roomId}${adjRooms[y].gameMetadata.roomId}`]) continue;
                pairs[`${roomData.roomId}${adjRooms[y].gameMetadata.roomId}`] = true;
                pairs[`${adjRooms[y].gameMetadata.roomId}${roomData.roomId}`] = true;

                var _center = middleOfRect(adjRooms[y].gameMetadata.rect);
                var middles = getMiddlesOfRect(roomData.rect);
                const direction = getSide(middles, _center).side;
                var id1 = roomData.groupId;
                var id2 = adjRooms[y].gameMetadata.groupId;
                var rid1 = roomData.roomId;
                var rid2 = adjRooms[y].gameMetadata.roomId;
                var point;
                var line;
                
                switch(direction) {
                    case 'up':
                    case 'down':
                        point = middles[direction];

                        if (point.x === _center.x + (currentRoomData.rect.width/2) || point.x === _center.x - (currentRoomData.rect.width/2) ) {
                            throw new Error('nope');
                        }
                        if (point.x === _center.x + (currentRoomData.rect.width/2) || point.x === _center.x - (currentRoomData.rect.width/2)) {
                            throw new Error('nope');
                        }

                        var X = Math.floor(point.x - _center.x < 0 ? (adjRooms[y].gameMetadata.rect.width/2) : -(adjRooms[y].gameMetadata.rect.width/2))
                        var Y = Math.floor(point.y - _center.y < 0 ? (adjRooms[y].gameMetadata.rect.height/2) : -(adjRooms[y].gameMetadata.rect.height/2))
                        line = {
                            A: {x: point.x, y:point.y},
                            B: {x: point.x, y: _center.y}
                        };
                        G.addDoor(rid1, id2, line.A, id1==id2);
                        if (!pointInRect(line.B, adjRooms[y].gameMetadata.rect)) {
                            checkValidHall(line, rooms, id1, id2, 1);
                            const firstSegment = line;
                            line = {
                                A: {x:_center.x-X, y:_center.y},
                                B: {x: point.x, y: _center.y}
                            };
                            checkValidHall(line, rooms, id1, id2, 2);
                            if (isInside(firstSegment, roomData.rect)) {
                                G.addVertex(rid1, rid2, [line]);
                            } else {
                                G.addVertex(rid1, rid2, [firstSegment, line]);
                            }
                            G.addVertex(rid1, rid2, [firstSegment, line]);
                            G.addDoor(rid1, id2, line.A, id1==id2);
                        } else {
                            checkValidHall(line, rooms, id1, id2, 2);
                            line.B.y -= Y;
                            G.addDoor(rid1, id2, line.B, id1==id2);
                            G.addVertex(rid1, rid2, [line]);
                        }
                        break;
                    case 'right':
                    case 'left':
                        point = middles[direction];

                        if (point.y === _center.y + (currentRoomData.rect.height/2) || point.y === _center.y - (currentRoomData.rect.height/2) ) {
                            throw new Error('nope');
                        }
                        if (point.y === _center.y + (currentRoomData.rect.height/2) || point.y === _center.y - (currentRoomData.rect.height/2)) {
                            throw new Error('nope');
                        }

                        var X = Math.floor(point.x - _center.x < 0 ? (adjRooms[y].gameMetadata.rect.width/2) : -(adjRooms[y].gameMetadata.rect.width/2))
                        var Y = Math.floor(point.y - _center.y < 0 ? (adjRooms[y].gameMetadata.rect.height/2) : -(adjRooms[y].gameMetadata.rect.height/2))
                        line = {
                            A: {x:point.x, y:point.y},
                            B: {x:_center.x, y:point.y}
                        }
                        
                        G.addDoor(rid1, id2, line.A, id1==id2);
                        if (!pointInRect(line.B, adjRooms[y].gameMetadata.rect)) {
                            checkValidHall(line, rooms, id1, id2, 1);
                            const firstSegment = line;
                            line = {
                                A:{x:_center.x, y:point.y},
                                B:{x:_center.x,y:_center.y-Y}
                            }
                            checkValidHall(line, rooms, id1, id2, 2);

                            if (isInside(firstSegment, roomData.rect)) {
                                G.addVertex(rid1, rid2, [line]);
                            } else {
                                G.addVertex(rid1, rid2, [firstSegment, line]);
                            }

                            G.addDoor(rid1, id2, line.B, id1==id2);
                        } else {
                            checkValidHall(line, rooms, id1, id2, 2);
                            line.B.x -= X;
                            G.addDoor(rid1, id2, line.B, id1==id2);
                            G.addVertex(rid1, rid2, [line]);
                        }
                        break;
                    
                }
            }
        }
    }

    function isInside(segment, rect) {
        return segment.A.x >= rect.x 
            && segment.A.x <= rect.x + rect.width 
            && segment.A.y >= rect.y 
            && segment.A.y <= rect.y + rect.height
            && segment.B.x >= rect.x 
            && segment.B.x <= rect.x + rect.width 
            && segment.B.y >= rect.y 
            && segment.B.y <= rect.y + rect.height
    }
    

    function checkValidHall(line, rooms, id1, id2, max) {
        let x = 0;
        for (let r of rooms) {
            var id = r.gameMetadata.groupId;
            var intersec = lineIntersectRect(line, r.gameMetadata.rect);
            if (intersec) {
                x++;
                if (x > max) throw new Error('nop')
                if (id !== id1 && id !== id2) {
                    throw new Error('nop')
                }
            }
        }
    }

    function getSide(positions1, positions2) {
        return [
            {side: 'up', value: distanceBetween(positions1.up, positions2)},
            {side: 'down', value: distanceBetween(positions1.down, positions2)},
            {side: 'left', value: distanceBetween(positions1.left, positions2)},
            {side: 'right', value: distanceBetween(positions1.right, positions2)}
        ].reduce(reduceMin, {value: Infinity});
    }
}