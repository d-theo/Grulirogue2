import { gameBus, playerMoved, gameStarted, logPublished, playerTookDammage, playerHealed, xpHasChanged } from "./eventBus/game-bus";
import $ from 'jquery';

export function test() {
    gameBus.subscribe(gameStarted, event => {
        $('#hud').show();
        $('#log').show();
    });
    gameBus.subscribe(logPublished, event => {
        const txt = $('#log-txt').text();
        $('#log-txt').text(event.payload.data+'\n'+txt);
    });
    gameBus.subscribe(playerTookDammage, event => {
        const curr = event.payload.currentHp * 100 / event.payload.baseHp;
        $('#current-hp').width(curr+'%');
        $('#current-hp-value').text(`${event.payload.currentHp} / ${event.payload.baseHp}`);
    });
    gameBus.subscribe(playerHealed, event => {
        const curr = event.payload.currentHp * 100 / event.payload.baseHp;
        $('#current-hp').width(curr+'%');
        $('#current-hp-value').text(`${event.payload.currentHp} / ${event.payload.baseHp}`);
    });

    gameBus.subscribe(xpHasChanged, event => {
        const curr = (event.payload.current * 100) / event.payload.total;
        $('#current-xp').width(curr+'%');
        if (event.payload.status === 'level_up') {
            $('#current-level').text(parseInt($('#current-level').text())+1);
        }
    });
    $('#current-xp').width('0%');
    let i =0;
    gameBus.subscribe(playerMoved, event => {
        const hp = $('#hp');
        hp.text(''+i++);
    });
};