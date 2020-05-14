import { gameBus, playerMoved, gameStarted, logPublished, playerTookDammage, playerHealed, xpHasChanged, itemEquiped, enchantChanged } from "./eventBus/game-bus";
import $ from 'jquery';

export function hud() {
    gameBus.subscribe(gameStarted, event => {
        $('#hud').show();
        $('#log').show();
        $('#howto').show();
        
    });
    gameBus.subscribe(logPublished, event => {
        const {data, level} = event.payload;
        const logLevel = level ? level : 'neutral';
        $('#log-txt').prepend(`<span class="${logLevel} mb-sm">${data}</span>`);
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

    gameBus.subscribe(itemEquiped, event => {
        const {weapon, armour} = event.payload;
        if (weapon) $('#weapon1').text(weapon.name);
        if (armour) $('#armour').text(armour.baseAbsorb);
        if (armour) $('#armour-name').text(armour.name);
    });
    gameBus.subscribe(enchantChanged, event => {
        const e = event.payload.report;
        $('#enchants').text(e);
    });
    $('#current-xp').width('0%');
    let i =0;
    gameBus.subscribe(playerMoved, event => {
        const hp = $('#hp');
        hp.text(''+i++);
    });
};