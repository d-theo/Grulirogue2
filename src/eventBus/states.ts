import GameScene from "../scenes/game.scene";

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
    private state: State;
    gameScene: GameScene;
    constructor(gameScene: GameScene) {
        this.gameScene = gameScene;
        this.transitionTo(new PlayState());
    }
    transitionTo(state: State) {
        this.state = state;
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
    stair(){}
}
export class PlayState extends State {
    f() {
        const ok = this.gameContext.gameScene.selectFire();
        if (ok)
            this.gameContext.transitionTo(new SelectFireState());
    }
    esc() {
        this.gameContext.gameScene.escape();
    }
    g() {
        this.gameContext.gameScene.displaySkill();
    }
    i() {
        this.gameContext.gameScene.displayInventory();
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
        this.gameContext.transitionTo(new PlayState());
    }
    esc() {
        this.gameContext.gameScene.escape();
        this.gameContext.transitionTo(new PlayState());
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
        this.gameContext.transitionTo(new PlayState());
    }
    enter() {
        this.gameContext.gameScene.enterLocation();
        this.gameContext.transitionTo(new PlayState());
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
        this.gameContext.transitionTo(new PlayState());
    }
    arrow(direction: string) {
        this.gameContext.gameScene.moveTarget(direction);
    }
    enter() {
        this.gameContext.gameScene.enterMovable();
        this.gameContext.transitionTo(new PlayState());
    }

    f() {}
    g() {}
    i() {}
    z() {}
    w() {}
    stair(){}
}