import { Affect } from "../../effects/affects";
import { pickInRange } from "../../utils/random";

export const wearWet = {effect: new Affect('wet').turns(Infinity).create(), name: 'of moist', description: 'This armour is strangely wet',  type:'onwear'};
export const wearMoreDodge = {effect: new Affect('dodge').turns(Infinity).params(0.05).isStackable(true).create(), name: 'of illusion', description: 'This armour looks strange and make ennemies miss more often',  type: 'onwear'};
export const wearMoreRegen = {effect: new Affect('health').turns(Infinity).params(2, 0.01).isStackable(true).create(), name: 'of life', description: 'This armour is pulsing sometimes like it\'s alive',  type: 'onwear'};
export const wearMoveBrave = {effect: new Affect('brave').turns(Infinity).create(), name: 'of braveness', description: 'This armour shines only when you need it',  type: 'onwear'};
export const wearMoreSpeed = {effect: new Affect('procChance').turns(Infinity).params('speed', 0.01, 5).create(), name: 'of speed', description: 'This armour weight nothing',  type: 'onwear'};
export const wearMoreHp = {effect: new Affect('hp').params(pickInRange('5-15')).isStackable(true).turns(Infinity).create(), name: 'of vitality', description: 'this weapon grants you more vitality',  type: 'onwear'};
export const wearAccuracy = {effect: new Affect('precision').params(0.1).isStackable(true).turns(Infinity).create(), name: 'of precision', description: 'this weapon is very accurate'};
export const wearAc = {effect: new Affect('ac').turns(Infinity).params(1).isStackable(true).create(), name: 'of resistance', description: 'your item makes you more resistant'};