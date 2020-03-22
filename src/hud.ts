import { gameBus, playerMoved } from "./eventBus/game-bus";
import $ from 'jquery';

export function test() {
    $('#current-xp').width('0%');
    $('#current-hp-value').text('10 / 10');
    $('#current-xp-value').text('0 / 100');

    let i =0;
    gameBus.subscribe(playerMoved, event => {
        const hp = $('#hp');
        hp.text(''+i++);
    });
    /*setTimeout(() => {
        $('#current-hp').width('50%');
    }, 2000);*/
};