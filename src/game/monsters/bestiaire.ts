import { Affect } from "../effects/affects";

export const Bestiaire = {
    Misc: {
        Cat:{
            kind: "Cat",
            danger: 30,
            hp: '10-15',
            damage: '3-5',
            range: 1,
            dodge: 0.40,
        }
    },
    Greece: {
        Snake:{
            kind: "Snake",
            danger: 10,
            hp: '5-7',
            damage: '2-3',
            range: 1,
            dodge: 0.20,
            onHit: {chance: 0.3, target: 'target', effect: new Affect('poison').turns(5).create()}
        },
        SnakeKing: {
            kind: "Snake King",
            danger: 30,
            hp: '25-30',
            damage: '6-10',
            range: 1,
            dodge: 0.20,
            onHit: {chance: 1, target: 'target', effect: new Affect('poison').turns(5).create()}
        },
        Rat: {
            kind: "Rat",
            danger: 2,
            hp: '1-3',
            damage: '1-2',
            range: 1,
            dodge: 0.05
        },
        Bat: {
            kind: "Bat",
            danger: 5,
            hp: '2-4',
            damage: '1-1',
            range: 1,
            dodge: 0.10,
            speed: 2
        },
        Boar: {
            kind: "Boar",
            danger: 15,
            hp: '15-20',
            damage: '2-4',
            range: 1,
            dodge: 0.20
        },
        Centaurus:{
            kind: "Centaurus",
            danger: 20,
            hp: '10-15',
            damage: '3-5',
            range: 6,
            dodge: 0.10
        }
    },
    Pirate: {
        PirateBoss: {
            kind: 'Pirate King',
            danger: 50,
            hp: '40-45',
            damage: '10-20',
            range: 4,
            dodge: 0.0
        },
        Rat:{
            kind: "Rat",
            danger: 10,
            hp: '5-10',
            damage: '3-4',
            range: 1,
            dodge: 0.05
        },
        Crab: {
            kind: "Crab",
            danger: 15,
            damage: '7-8',
            hp: '10-15',
            dodge: 0.05,
            range: 1,
        },
        CrabBoss: {
            kind: "Crab King",
            danger: 20,
            damage: '4-5',
            hp: '40-55',
            dodge: 0.05,
            range: 1,
        },
        Sailor:{
            kind: "Sailor",
            danger: 20,
            hp: '30-35',
            damage: '9-14',
            range: 1,
            dodge: 0.0,
        },
        Pirate: {
            kind: "Pirate",
            danger: 30,
            hp: '25-30',
            damage: '6-10',
            range: 1,
            dodge: 0.20,
            onHit: {chance: 0.1, target: 'target', effect: new Affect('bleed').turns(3).create()}
        }
    },
    Rogue: {
        SkeletonWarrior: {
            kind: "Skeleton",
            danger: 30,
            hp: '2',
            damage: '0',
            range: 1,
            dodge: 0.00,
        },
        Wizard: {
            kind: "Wizard",
            danger: 30,
            hp: '1',
            damage: '0',
            range: 1,
            dodge: 0.00,
        },
        Orc: {
            kind: "Orc",
            danger: 30,
            hp: '1',
            damage: '0',
            range: 1,
            dodge: 0.0,
        }
    }
}