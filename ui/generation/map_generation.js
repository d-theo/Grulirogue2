const Params = {
    Area: 50000,
    Fuzz: 0.25,
    MinClusterSize: 2,
    Width: 800,
    Height: 600,
    MinSubSize: 6
}
let ROOM_IDX = 0;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.canvas.width  = 1000;
ctx.canvas.height = 1000;

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
        fillRect(gameMetadata.rect);
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
        console.log("error")
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
        
        fillRect(rooms[i].gameMetadata.rect, c);
        fillRect(rooms[i+1].gameMetadata.rect, c);

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
generate();
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
            paintMap(rooms);
            ok = true;
            console.log(cpt);
        } catch(e) {
            console.log(e)
            cpt ++;
            ctx.clearRect(0, 0, Params.Width*2, Params.Height*2);
        }
    }
}

function paintMap(rooms) {
    for (var x = 0; x < rooms.length; x++) {
        if (rooms[x].gameMetadata.isEntry) {
            fillRect(insideRect(rooms[x].gameMetadata.rect), 'red');
        } else if (rooms[x].gameMetadata.isExit) {
            fillRect(insideRect(rooms[x].gameMetadata.rect),'blue');
        }
    }


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
            var middles = getMiddlesOfRect(rooms[x].gameMetadata.rect);
            const direction = getSide(middles, _center).side;
            var id1 = roomData.groupId;
            var id2 = adjRooms[y].gameMetadata.groupId;
            var point;
            var line;
            //traceLine({x: middles.up.x, y:middles.up.y},{x: _center.x, y: _center.y}, 'red')
            switch(direction) {
                case 'up':
                    point = middles.up; 
                    line = {
                        A: {x: point.x, y:point.y},
                        B: {x: point.x, y: _center.y}
                    };
                    checkValidHall(line, rooms, id1, id2);
                    traceLine({x: point.x, y:point.y},{x: point.x, y: _center.y});
                    if (!pointInRect({x:point.x, y:_center.y}, adjRooms[y].gameMetadata.rect)) {
                        line = {
                            A: {x:_center.x, y:_center.y},
                            B: {x: point.x, y: _center.y}
                        };
                        checkValidHall(line, rooms, id1, id2);
                        traceLine({x: point.x, y: _center.y}, {x:_center.x, y:_center.y});
                    }
                    break;
                case 'down':
                    point = middles.down;

                    line = {
                        A: {x: point.x, y:point.y},
                        B: {x: point.x, y: _center.y}
                    };
                    checkValidHall(line, rooms, id1, id2);
                    traceLine({x: point.x, y:point.y},{x: point.x, y: _center.y});
                    if (!pointInRect({x:point.x, y:_center.y}, adjRooms[y].gameMetadata.rect)) {
                        line = {
                            A: {x:_center.x, y:_center.y},
                            B: {x: point.x, y: _center.y}
                        };
                        checkValidHall(line, rooms, id1, id2);
                        traceLine({x: point.x, y: _center.y}, {x:_center.x, y:_center.y});
                    }
                    break;
                case 'right':
                    point = middles.right;
                    line = {
                        A: {x:point.x, y:point.y},
                        B: {x:_center.x, y:point.y}
                    }
                    checkValidHall(line, rooms, id1, id2);
                    traceLine(line.A,line.B);
                    if (!pointInRect({x:_center.x, y:point.y}, adjRooms[y].gameMetadata.rect)) {
                        line = {
                            A:{x:_center.x, y:point.y},
                            B:{x:_center.x,y:_center.y}
                        }
                        checkValidHall(line, rooms, id1, id2);
                        traceLine(line.A,line.B);
                    }
                    break;
                case 'left':
                    point = middles.left;
                    line = {
                        A: {x:point.x, y:point.y},
                        B: {x:_center.x, y:point.y}
                    }
                    checkValidHall(line, rooms, id1, id2);
                    traceLine(line.A,line.B);
                    if (!pointInRect({x:_center.x, y:point.y}, adjRooms[y].gameMetadata.rect)) {
                        line = {
                            A:{x:_center.x, y:point.y},
                            B:{x:_center.x,y:_center.y}
                        }
                        checkValidHall(line, rooms, id1, id2);
                        traceLine(line.A,line.B);
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
        if (lineIntersectRect(line, r.rect)) {
            if (!eqId) {
                x++;
                if (x > 2) throw new Error('nop')
            }
            if (id !== id1 && id !== id2) {
                traceLine(line.A, line.B, 'red');
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
// PAint utils

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
    return intersect(pos1.x, pos1.y, pos2.x, pos2.y, pos3.x, pos3.y, pos4.x, pos4.y);
}

// line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
// Determine the intersection point of two line segments
// Return FALSE if the lines don't intersect
function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
    // Check if none of the lines are of length 0
      if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
          return false
      }
  
      denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))
  
    // Lines are parallel
      if (denominator === 0) {
          return false
      }
  
      let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
      let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator
  
    // is the intersection along the segments
      if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
          return false
      }
  
    // Return a object with the x and y coordinates of the intersection
      let x = x1 + ua * (x2 - x1)
      let y = y1 + ua * (y2 - y1)
      
      return {x, y};
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
