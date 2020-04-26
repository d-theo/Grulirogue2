import { EffectMaker, Effects } from "../effects/effect";

export const Bestiaire = {
    Greece: {
        Snake:{
            kind: "Snake",
            danger: 10,
            hp: '5-7',
            damage: '2-3',
            range: 1,
            dodge: 0.20,
            onHit: {chance: 0.5, target: 'target', effect: EffectMaker.create(Effects.Poison)}
        },
        SnakeKing: {
            kind: "Snake King",
            danger: 30,
            hp: '25-30',
            damage: '6-10',
            range: 1,
            dodge: 0.20,
            onHit: {chance: 1, target: 'target', effect: EffectMaker.create(Effects.Poison)}
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
            damage: '5-7',
            range: 6,
            dodge: 0.10
        }
    }
}