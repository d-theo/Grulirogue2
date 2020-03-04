const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.canvas.width  = 1000;
ctx.canvas.height = 1000;
const d1 = new Date().getTime();
const map = generateRLMap();
console.log(`generation time ${new Date().getTime() -d1} ms`)
paint(map);

function paint(map) {
    const rooms = map.rooms;
    for (var x = 0; x < rooms.length; x++) {
        fillRect(rooms[x].rect);
        if (rooms[x].isEntry) {
            fillRect(insideRect(rooms[x].rect), 'red');
        } else if (rooms[x].isExit) {
            fillRect(insideRect(rooms[x].rect),'blue');
        }
    }

    const doors = map.doors;
    for (let door of doors) {
        if (door.isLocked) {
            drawCircle(door.position, 'orange');
        } else {
            drawCircle(door.position, 'blue');
        }
    }

    const vertices = map.vertices;
    for (let vertex of vertices) {
        for (let line of vertex.segments) {
            traceLine(line.A, line.B);
        }
    }
}

function generateRLMap(Params) {
    Params = Params || {
        Area: 50000, // min area of a room
        Fuzz: 0.25, // room size variation +-
        MinClusterSize: 2, // minimal cluster of room
        Width: 800,
        Height: 600,
        MinSubSize: 6 // subdivise into subcluster if cluster is bigger than MinSubSize
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
        o = {};
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
            rooms = [];
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

    function createVertex(from, to, lines) {
        return {
            from: from,
            to: to,
            lines: lines
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
                var cut = w/2 + rand(-fuzz,fuzz);
                left = createNode(depth+1, {x:rect.x, y:rect.y, width: cut, height: rect.height});
                right = createNode(depth+1, {x:cut+rect.x, y:rect.y, width: w-cut, height: rect.height});
            } else {
                var h = rect.height;
                var fuzz = Math.floor(Params.Fuzz * h);
                var cut = h/2 + rand(-fuzz,fuzz);
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
        var c = ctx.fillStyle = '#'+Math.random().toString(16).substr(2,6);
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
            if (cpt > 1000) {
                console.log('nothing')
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
                ctx.clearRect(0, 0, Params.Width*2, Params.Height*2);
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
                //traceLine({x: middles.up.x, y:middles.up.y},{x: _center.x, y: _center.y}, 'red')
                switch(direction) {
                    case 'up':
                    case 'down':
                        point = middles[direction]; 
                        line = {
                            A: {x: point.x, y:point.y},
                            B: {x: point.x, y: _center.y}
                        };
                        checkValidHall(line, rooms, id1, id2, rid1);
                        if (!pointInRect(line.B, adjRooms[y].gameMetadata.rect)) {
                            const firstSegment = line;
                            line = {
                                A: {x:_center.x, y:_center.y},
                                B: {x: point.x, y: _center.y}
                            };
                            checkValidHall(line, rooms, id1, id2, rid1);
                            G.addVertex(rid1, rid2, [firstSegment, line]);
                        } else {
                            G.addVertex(rid1, rid2, [line]);
                        }
                        break;
                    case 'right':
                    case 'left':
                        point = middles[direction];
                        line = {
                            A: {x:point.x, y:point.y},
                            B: {x:_center.x, y:point.y}
                        }
                        checkValidHall(line, rooms, id1, id2, rid1);
                        if (!pointInRect(line.B, adjRooms[y].gameMetadata.rect)) {
                            const firstSegment = line;
                            line = {
                                A:{x:_center.x, y:point.y},
                                B:{x:_center.x,y:_center.y}
                            }
                            checkValidHall(line, rooms, id1, id2, rid1);
                            G.addVertex(rid1, rid2, [firstSegment, line]);
                        } else {
                            G.addVertex(rid1, rid2, [line]);
                        }
                        break;
                    
                }
            }
        }
    }

    function checkValidHall(line, rooms, id1, id2) {
        let eqId = id1 === id2;
        let x = 0;
        for (let r of rooms) {
            var id = r.gameMetadata.groupId;
            var intersec = lineIntersectRect(line, r.gameMetadata.rect);
            if (intersec) {
                if (!eqId) {
                    x++;
                    if (x > 2) throw new Error('nop')
                }
                if (id !== id1 && id !== id2) {
                    throw new Error('nop')
                }
                G.addDoor(r.gameMetadata.roomId, id2, intersec, eqId);
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
// PAint utils
function drawCircle(pos, color) {
    ctx.beginPath();
    color && (ctx.fillStyle = color)
    ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2, 1);
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

// GEO utils
function pointsOfRect(rect) {
    return {
        A:{x: rect.x, y:rect.y},
        B:{x: rect.x+rect.width, y: rect.y},
        C:{x: rect.x+rect.width, y: rect.y+rect.height},
        D:{x: rect.x, y: rect.y+rect.height}
    }
}
function insideRect(rect) {
    var width = rand(Math.floor(rect.width/3), rect.width);
    var height = rand(Math.floor(rect.height/3), rect.height);
    return {
        width:width,
        height:height,
        x:rand(rect.x, (rect.width + rect.x) - width),
        y:rand(rect.y, (rect.height + rect.y) - height)
    };
}
function middleOfRect(rect) {
    return {
        x: Math.floor(rect.width/2 + rect.x),
        y: Math.floor(rect.height/2 + rect.y)
    };
}

function getMiddlesOfRect(rect) {
    return {
        up: {x: rect.x + (rect.width / 2), y: rect.y},
        right: {x: rect.x + rect.width, y: rect.y + (rect.height / 2)},
        down: {x: rect.x + (rect.width / 2), y: rect.y + rect.height},
        left: {x: rect.x, y: rect.y + (rect.height / 2)}
    }
}
function distanceBetween(p1,p2) {
    const dist = Math.sqrt( ((p1.x - p2.x) * (p1.x - p2.x)) + ((p1.y - p2.y) * (p1.y - p2.y)) );
    return dist;
}

function pointInRect(point, rect) {
    const x1 = rect.x;
    const y1 = rect.y;
    const x2 = rect.x + rect.width; 
    const y2 = rect.y + rect.height;
    const x  = point.x;
    const y  = point.y;
    if (x > x1 && x < x2 && y > y1 && y < y2)
        return true; 
    return false;
}

function lineIntersectRect(line, rect) {
    const points = pointsOfRect(rect);
    return intersec(line.A, line.B, points.A, points.B)
    || intersec(line.A, line.B, points.B, points.C)
    || intersec(line.A, line.B, points.C, points.D)
    || intersec(line.A, line.B, points.D, points.A);
}

function intersec(pos1, pos2, pos3, pos4) {
    return get_line_intersection(pos1.x, pos1.y, pos2.x, pos2.y, pos3.x, pos3.y, pos4.x, pos4.y);
}

// utils
function reduceMin(obj, obj2) {
    if (obj.value > obj2.value) {
        return obj2;
    } else {
        return obj;
    }
}
function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function get_line_intersection(p0_x, p0_y, p1_x, p1_y, p2_x, p2_y, p3_x, p3_y)
{
    var s1_x, s1_y, s2_x, s2_y;
    s1_x = p1_x - p0_x;     s1_y = p1_y - p0_y;
    s2_x = p3_x - p2_x;     s2_y = p3_y - p2_y;

    var s, t;
    s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
    t = ( s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1)
    {
        return {
            x: p0_x + (t * s1_x),
            y: p0_y + (t * s1_y)
        };
    }

    return 0; // No collision
}