export type BuffDefinition = {
    start: Function | null;
    tick?: Function;
    end: Function;
    turns: number,
    isStackable: boolean,
    isTemp: boolean,
    tags: string,
    source?: string|null;
};