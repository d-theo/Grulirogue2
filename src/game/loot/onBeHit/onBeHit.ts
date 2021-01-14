import { Affect } from "../../effects/affects"

export const onBeHitAbsorb = {effect: new Affect('ac').turns(1).create(), name: 'of courage', description: 'Being hit makes your more resistant',  type:'onbehit'}
export const onBeHitHeal = {effect: new Affect('procChance').turns(1).params(0.05,'heal',1,).create(), name: 'of resilience', description: 'You have a small chance to heal yourself we wounded',  type:'onbehit'}
export const onBeHitReflect = {effect: new Affect('ac').turns(1).create(), name: 'of courage', description: 'Being hit makes your more resistant',  type:'onbehit'}
//export const onBeHitShock = {effect: new Affect('ac').turns(1).create(), name: 'of courage', description: 'Being hit makes your more resistant',  type:'onbehit'}
//export const onBeHitBurn = {effect: new Affect('ac').turns(1).create(), name: 'of courage', description: 'Being hit makes your more resistant',  type:'onbehit'}
//export const onBeHitBumpedBack = {effect: new Affect('ac').turns(1).create(), name: 'of courage', description: 'Being hit makes your more resistant',  type:'onbehit'}
//export const onBeHitTP = {effect: new Affect('procChance').turns(1).params(0.05,'tp',1,).create(), name: 'of cowardness', description: 'Being hit have a small chance to teleport you away',  type:'onbehit'}