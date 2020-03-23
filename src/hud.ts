import { gameBus, playerMoved, gameStarted, logPublished, playerTookDammage } from "./eventBus/game-bus";
import $ from 'jquery';

export function test() {
    gameBus.subscribe(gameStarted, event => {
        $('#hud').show();
        $('#log').show();
    });
    gameBus.subscribe(logPublished, event => {
        $('#log-txt').text(event.payload.data);
    });
    gameBus.subscribe(playerTookDammage, event => {
        const curr = event.payload.currentHp * 100 / event.payload.baseHp;
        $('#current-hp').width(curr+'%');
        $('#current-hp-value').text(`${event.payload.currentHp} / ${event.payload.baseHp}`);
    });

    $('#current-xp').width('0%');
    $('#current-xp-value').text('0 / 100');

    let i =0;
    gameBus.subscribe(playerMoved, event => {
        const hp = $('#hp');
        hp.text(''+i++);
    });
    /*setTimeout(() => {
        
    }, 2000);*/
};