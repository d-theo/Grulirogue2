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