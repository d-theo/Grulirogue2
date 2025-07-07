export class Keyboard {
  public pressed = {
    up: false,
    down: false,
    left: false,
    right: false,
  };
  private listening = true;
  public pause() {
    this.listening = false;
    this.downReleased();
    this.upReleased();
    this.leftReleased();
    this.rightReleased();
  }
  public resume() {
    this.listening = true;
  }
  public keyPressed(arrow: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight') {
    if (!this.listening) return;

    switch (arrow) {
      case 'ArrowDown':
        return this.downPressed();
      case 'ArrowLeft':
        return this.leftPressed();
      case 'ArrowUp':
        return this.upPressed();
      case 'ArrowRight':
        return this.rightPressed();
      default:
        return;
    }
  }
  public keyReleased(arrow: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight') {
    switch (arrow) {
      case 'ArrowDown':
        return this.downReleased();
      case 'ArrowLeft':
        return this.leftReleased();
      case 'ArrowUp':
        return this.upReleased();
      case 'ArrowRight':
        return this.rightReleased();
      default:
        return;
    }
  }
  private upPressed() {
    this.pressed.up = true;
  }
  private upReleased() {
    this.pressed.up = false;
  }
  private downPressed() {
    this.pressed.down = true;
  }
  private downReleased() {
    this.pressed.down = false;
  }
  private leftPressed() {
    this.pressed.left = true;
  }
  private leftReleased() {
    this.pressed.left = false;
  }
  private rightPressed() {
    this.pressed.right = true;
  }
  private rightReleased() {
    this.pressed.right = false;
  }
}
