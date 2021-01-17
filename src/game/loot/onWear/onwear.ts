import { Magic } from "../../entitybase/magic";

export const wearWet = new Magic({wet: true, name: 'of moist', description: 'This armour is strangely wet'});
export const wearMoreDodge = new Magic({dodge: 0.05, name: 'of illusion', description: 'This armour looks strange and make ennemies miss more often'});
export const wearMoreRegen = new Magic({hpRegen:1, name: 'of life', description: 'This armour is pulsing sometimes like it\'s alive'});
export const wearMoveBrave = new Magic({ac: 1, maxhp: 5, name: 'of braveness', description: 'This armour shines only when you need it'});

// todo
export const wearMoreSpeed = new Magic({onTurn: () => ({}), name: 'of speed', description: 'This armour weight nothing'});
export const wearMoreHp = new Magic({maxhp: 10, name: 'of vitality', description: 'this weapon grants you more vitality'});
export const wearAccuracy = new Magic({precision: 0.1, name: 'of precision', description: 'this weapon is very accurate'});
export const acMinor = new Magic({ac: 1, name: 'of minor resistance', description: 'your item makes you more resistant'});
export const ac = new Magic({ac: 2, name: 'of resistance', description: 'your item makes you more resistant'});
export const acMajor = new Magic({ac: 3, name: 'of major resistance', description: 'your item makes you more resistant'});