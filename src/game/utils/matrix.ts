export function matrixMap<T,U>(c: T[][], f:(x: T) => U): U[][] {
    const res: U[][] = [];
    for (const i of c) {
        const line = [];
        for (const el of i) {
            line.push(f(el));
        }
        res.push(line)
    }
    return res;
}

export function matrixForEach<T>(c: T[][], f:(x: T) => void): void {
    for (const i of c) {
        for (const el of i) {
            f(el);
        }
    }
}

export function matrixFilter<T>(c: T[][], f:(x: T) => boolean): T[] {
    const res : T[] = [];
    for (const i of c) {
        for (const el of i) {
            if (f(el)) {
                res.push(el);
            }
        }
    }
    return res;
}

export function matrixFlatten<T>(c: T[][]): T[] {
    const res = [];
    for (let x = 0; x < c.length; x++) {
        for (let y = 0; y < c[0].length ; y++) {
            res.push(c[y][x]);
        }
    }
    return res;
}