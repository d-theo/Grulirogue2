import GameScene from "./game.scene";

export enum Modes {
    Play = 'Play',
    SelectFire = 'SelectFire',
    SelectLocation = 'SelectLocation',
    SelectMovable = 'SelectMovable'
}

export abstract class State {
    protected gameContext: GameContext

    public abstract f();
    public abstract esc();
    public abstract z() ;
    public abstract arrow(direction: string);
    public abstract g();
    public abstract i();
    public abstract enter();
    public abstract w();
    public abstract stair();

    setContext(ctx: GameContext) {
        this.gameContext = ctx;
    }
}
export class GameContext {
    allStates = {
        [Modes.Play]: new PlayState(),
        [Modes.SelectFire]:  new SelectFireState(),
        [Modes.SelectLocation]:  new SelectLocationState(),
        [Modes.SelectMovable]: new SelectMovableState(),
    }
    private state: State;
    private currentStateName: Modes;

    gameScene: GameScene;
    constructor(gameScene: GameScene) {
        this.gameScene = gameScene;
        this.transitionTo(Modes.Play);
    }
    isOnState(stateName: Modes) {
        return this.currentStateName == stateName;
    }
    transitionTo(state: Modes) {
        this.state = this.allStates[state];
        this.currentStateName = state;
        this.state.setContext(this);
    }
    f() {
        this.state.f();
    }
    esc() {
        this.state.esc();
    }
    z() {
        this.state.z();
    }
    arrow(direction: string) {
        this.state.arrow(direction);
    }
    g() {
        this.state.g();
    }
    i() {
        this.state.i();
    }
    enter() {
        this.state.enter();
    }
    w() {
        this.state.w();
    }
    stair(){
        this.state.stair();
    }
}
export class PlayState extends State {
    f() {
        const ok = this.gameContext.gameScene.selectFire();
        if (ok)
            this.gameContext.transitionTo(Modes.SelectFire);
    }
    esc() {
        this.gameContext.gameScene.escape();
    }
    g() {
        this.gameContext.gameScene.displaySkill();
    }
    i() {
        this.gameContext.gameScene.displayInventory('useItem');
    }
    w() {
        this.gameContext.gameScene.waitATurn();
    }
    enter() {}
    z() {}
    arrow() {}
    stair(){
        this.gameContext.gameScene.tryStairs();
    }
}
export class SelectFireState extends State {
    f() {
        this.gameContext.gameScene.fire();
        this.gameContext.transitionTo(Modes.Play);
    }
    esc() {
        this.gameContext.gameScene.escape();
        this.gameContext.transitionTo(Modes.Play);
    }
    z() {
        this.gameContext.gameScene.nextTarget();
    }
    arrow(direction: string) {
        this.gameContext.gameScene.moveTargetToAttack(direction);
    }

    g() {}
    i() {}
    enter() {}
    w() {}
    stair(){}
}
export class SelectLocationState extends State {
    esc() {
        this.gameContext.gameScene.escape();
        this.gameContext.transitionTo(Modes.Play);
    }
    enter() {
        this.gameContext.gameScene.enterLocation();
        this.gameContext.transitionTo(Modes.Play);
    }
    arrow(direction: string) {
        this.gameContext.gameScene.moveTarget(direction);
    }

    z() {}
    g() {}
    i() {}
    f() {}
    w() {}
    stair(){}
    
}
export class SelectMovableState extends State {
    esc() {
        this.gameContext.gameScene.escape();
        this.gameContext.transitionTo(Modes.Play);
    }
    arrow(direction: string) {
        this.gameContext.gameScene.moveTarget(direction);
    }
    enter() {
        this.gameContext.gameScene.enterMovable();
        this.gameContext.transitionTo(Modes.Play);
    }

    f() {}
    g() {}
    i() {}
    z() {}
    w() {}
    stair(){}
}