const Params = {
    Area: 50000,
    Fuzz: 0.25,
    MinClusterSize: 2,
    Width: 800,
    Height: 600,
    MinSubSize: 6
}
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.canvas.width  = 1000;
ctx.canvas.height = 1000;

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
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

function fillRect(rect, color) {
    if (color) {
        ctx.fillStyle = color;
    } else {
        ctx.fillStyle = '#'+Math.random().toString(16).substr(2,6);
    }
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
}

function createNode(depth, rect) {
    var left = null;
    var right = null;
    var area = rect.width * rect.height;
    var gameMetadata = {
        isEntry: false,
        isExit: false,
        monsters: 'none',
        item: 'none',
        doorsIds: [],
        buttonIds: [],
        rect: null,
        adjacentRooms: []
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
    for (var i = 0; i < rooms.length-1; i++) {
        linkRooms(rooms[i], rooms[i+1])
        
        fillRect(rooms[i].gameMetadata.rect, c);
        fillRect(rooms[i+1].gameMetadata.rect, c);
    }
}
function createRoomGraph(rootSubMap) {
    if (rootSubMap.isLeaf) {
        createConnectedGraph(rootSubMap.rooms);
    } else {
        var roomsLeft = rootSubMap.left.rooms;
        var roomsRight = rootSubMap.right.rooms;
        var roomLeftIdx = rand(0, roomsLeft.length-1);
        var roomRightIdx = rand(0, roomsRight.length-1);
        linkRooms(roomsLeft[roomLeftIdx], roomsRight[roomRightIdx]);
        
        createRoomGraph(rootSubMap.left);
        createRoomGraph(rootSubMap.right);
    }
}

var root = createNode(0, {x:10, y:10, width:Params.Width, height:Params.Height});
var rooms = getChildrenOfBinaryGraph(root);
var roomsLength = rooms.length;
rooms[0].gameMetadata.isEntry = true;
rooms[roomsLength-1].gameMetadata.isExit = true;
var rootSubMap = subMapping(rooms);
createRoomGraph(rootSubMap);
paintMap(rooms);

function middleOfRect(rect) {
    return {
        x: Math.floor(rect.width/2 + rect.x),
        y: Math.floor(rect.height/2 + rect.y)
    };
}

function paintMap(rooms) {
    for (var x = 0; x < rooms.length; x++) {
        if (rooms[x].gameMetadata.isEntry) {
            fillRect(insideRect(rooms[x].gameMetadata.rect), 'red');
        } else if (rooms[x].gameMetadata.isExit) {
            fillRect(insideRect(rooms[x].gameMetadata.rect),'blue');
        }
    }
    for (var x = 0; x < rooms.length; x++) {
        var adjRooms = rooms[x].gameMetadata.adjacentRooms;
        var center = middleOfRect(rooms[x].gameMetadata.rect);
        for (var y = 0; y < adjRooms.length; y++) {
            var _center = middleOfRect(adjRooms[y].gameMetadata.rect);
            const d = getSide(rooms[x].gameMetadata.rect, adjRooms[y].gameMetadata.rect).side;
            ctx.beginPath();
            ctx.moveTo(_center.x, _center.y);
            ctx.lineTo(center.x, center.y);
            if(d === 'up' || d==='down') {
                ctx.strokeStyle = '#EB9401';
            } else {
                ctx.strokeStyle = '#000000';
            }
            ctx.stroke();
        }
    }
}

function getSide(rect1, rect2) {
    const positions1 = getMiddlesOfRect(rect1);
    const positions2 = middleOfRect(rect2);

    return [
        {side: 'up', value: distanceBetween(positions1.up, positions2)},
        {side: 'down', value: distanceBetween(positions1.down, positions2)},
        {side: 'left', value: distanceBetween(positions1.left, positions2)},
        {side: 'right', value: distanceBetween(positions1.right, positions2)}
    ].reduce(reduceMin, {value: Infinity});
}

function reduceMin(obj, obj2) {
    if (obj.value > obj2.value) {
        return obj2;
    } else {
        return obj;
    }
}

function distanceBetween(p1,p2) {
    const dist = Math.sqrt( ((p1.x - p2.x) * (p1.x - p2.x)) + ((p1.y - p2.y) * (p1.y - p2.y)) );
    return dist;
}

function getMiddlesOfRect(rect) {
    return {
        up: {x: (rect.x + rect.width) / 2, y: rect.y},
        right: {x: (rect.x + rect.width), y: (rect.y + rect.height) / 2},
        down: {x: (rect.x + rect.width) / 2, y: rect.y + rect.height},
        left: {x: rect.x, y: (rect.y + rect.height) / 2}
    }
}