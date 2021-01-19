export enum EffectTarget { 
    Location = 'location',
    AoE = 'AoE',
    Armour =  'armour',
    Item = 'item',
    Weapon = 'weapon',
    Movable = 'movable',
    Hero = 'hero',
    None = '',
};

export interface IEffect {
    type: EffectTarget;
    cast: Function;
    turns?: number;
}