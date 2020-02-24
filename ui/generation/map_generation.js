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

function fillRect(rect) {
    ctx.fillStyle = '#'+Math.random().toString(16).substr(2,6);
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
        rect: null
    };
    if (area > 90000) {
        if (depth % 2 === 0) {
            var w = rect.width;
            var fuzz = Math.floor(0.25 * w);
            var cut = w/2 + rand(-fuzz,fuzz);
            left = createNode(depth+1, {x:rect.x, y:rect.y, width: cut, height: rect.height});
            right = createNode(depth+1, {x:cut+rect.x, y:rect.y, width: w-cut, height: rect.height});
        } else {
            var h = rect.height;
            var fuzz = Math.floor(0.25 * h);
            var cut = h/2 + rand(-fuzz,fuzz);
            left = createNode(depth+1, {x:rect.x, y:rect.y, width: rect.width, height: cut});
            right = createNode(depth+1, {x:rect.x, y:cut+rect.y, width:rect.width, height: h-cut});
        }
    } else {
        gameMetadata.rect = insideRect(rect);
        fillRect(gameMetadata.rect);
    }

    function joinChidren() {
        if (left && right) {
            var rcx = Math.floor(right.rect.width / 2 + right.rect.x);
            var rcy = Math.floor(right.rect.height / 2 + right.rect.y);
            var lcx = Math.floor(left.rect.width / 2 + left.rect.x);
            var lcy = Math.floor(left.rect.height / 2 + left.rect.y);
            fillRect({
                x:rcx,
                y:rcy,
                width: rcx-lcx,
                height: rcy-lcy,
            });
            ctx.beginPath();
            ctx.moveTo(rcx, rcy);
            ctx.lineTo(lcx, lcy);
            ctx.closePath();
            ctx.stroke();
            left.joinChidren();
            right.joinChidren();
        }
    }

    return {
        left,
        right,
        parent,
        depth,
        rect,
        gameMetadata,
        joinChidren
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
    var last = array.slice(s, array.lenght);
    return [first,last];
}

function subMapping(rooms) {
    var left;
    var right;
    var isLeaf = false;
    if (rooms.lenght <= 4) {
        var sliced = sliceIntoSubArray(nodes, 2);
        right = createMapNode(sliced[0]);
        left = createMapNode(sliced[1]);
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

var root = createNode(0, {x:10, y:10, width:800, height:600});
var rooms = getChildrenOfBinaryGraph(root);
var roomsLength = rooms.length;
rooms[0].gameMetadata.isEntry = true;
rooms[roomsLength-1].gameMetadata.isExit = true;
var gameStructure = subMapping(rooms);