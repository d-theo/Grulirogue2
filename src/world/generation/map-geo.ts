export function pointsOfRect(rect) {
  return {
    A: { x: rect.x, y: rect.y },
    B: { x: rect.x + rect.width, y: rect.y },
    C: { x: rect.x + rect.width, y: rect.y + rect.height },
    D: { x: rect.x, y: rect.y + rect.height },
  };
}

export function randomSizeRect(
  x: number,
  y: number,
  width: number,
  height: number,
  fuzz: number,
  maxSizeW?: number,
  maxSizeH?: number
) {
  const rw = Math.floor(width * rand(-fuzz, fuzz));
  const rh = Math.floor(height * rand(-fuzz, fuzz));
  let w = width + rw;
  let h = height + rh;
  if (maxSizeH) {
    h = Math.min(h, maxSizeH);
  }
  if (maxSizeW) {
    w = Math.min(w, maxSizeW);
  }
  return {
    x,
    y,
    width: w,
    height: h,
  };
}

export function isOverlaping(r1, r2) {
  return require('rectangle-overlap')(r1, r2) != null;
}

export function randomPointOfEdge(rect, forceDirection?: string) {
  const { x, y, width, height } = rect;
  const forced = { N: 0, S: 1, E: 2, W: 3 };
  const dirs = ['N', 'S', 'E', 'W'];
  const points = [
    { x: rand(x + 1, x + width - 1), y: y },
    { x: rand(x + 1, x + width - 1), y: y + height },
    { x: x + width, y: rand(y + 1, y + height - 1) },
    { x: x, y: rand(y + 1, y + height - 1) },
  ];
  if (forceDirection) {
    return {
      direction: forceDirection,
      pos: points[forced[forceDirection]],
    };
  } else {
    const idx = rand(0, 3);
    return {
      direction: dirs[idx],
      pos: points[idx],
    };
  }
}

export function insideRect(rect) {
  function toPair(n) {
    if (n % 2 === 0) return n;
    return n - 1;
  }
  var width = toPair(rand(Math.floor(rect.width / 3) + 3, rect.width));
  var height = toPair(rand(Math.floor(rect.height / 3) + 3, rect.height));
  return {
    width: width,
    height: height,
    x: toPair(rand(rect.x, rect.width + rect.x - width)),
    y: toPair(rand(rect.y, rect.height + rect.y - height)),
  };
}
export function middleOfRect(rect) {
  return {
    x: Math.floor(rect.width / 2 + rect.x),
    y: Math.floor(rect.height / 2 + rect.y),
  };
}

export function getMiddlesOfRect(rect) {
  return {
    up: { x: rect.x + rect.width / 2, y: rect.y },
    right: { x: rect.x + rect.width, y: rect.y + rect.height / 2 },
    down: { x: rect.x + rect.width / 2, y: rect.y + rect.height },
    left: { x: rect.x, y: rect.y + rect.height / 2 },
  };
}
export function distanceBetween(p1, p2) {
  const dist = Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
  return dist;
}

export function pointInRect(point, rect) {
  const x1 = rect.x;
  const y1 = rect.y;
  const x2 = rect.x + rect.width;
  const y2 = rect.y + rect.height;
  const x = point.x;
  const y = point.y;
  if (x > x1 && x < x2 && y > y1 && y < y2) return true;
  return false;
}

export function lineIntersectRect(line, rect) {
  const points = pointsOfRect(rect);
  return (
    intersec(line.A, line.B, points.A, points.B) ||
    intersec(line.A, line.B, points.B, points.C) ||
    intersec(line.A, line.B, points.C, points.D) ||
    intersec(line.A, line.B, points.D, points.A)
  );
}

export function intersec(pos1, pos2, pos3, pos4) {
  return get_line_intersection(pos1.x, pos1.y, pos2.x, pos2.y, pos3.x, pos3.y, pos4.x, pos4.y);
}

// utils
export function reduceMin(obj, obj2) {
  if (obj.value > obj2.value) {
    return obj2;
  } else {
    return obj;
  }
}
export function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function get_line_intersection(p0_x, p0_y, p1_x, p1_y, p2_x, p2_y, p3_x, p3_y) {
  var s1_x, s1_y, s2_x, s2_y;
  s1_x = p1_x - p0_x;
  s1_y = p1_y - p0_y;
  s2_x = p3_x - p2_x;
  s2_y = p3_y - p2_y;

  var s, t;
  s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
  t = (s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);

  if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
    return {
      x: p0_x + t * s1_x,
      y: p0_y + t * s1_y,
    };
  }

  return 0; // No collision
}
