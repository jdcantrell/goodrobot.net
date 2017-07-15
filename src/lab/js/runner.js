/* exported Runner */
class Runner {
  constructor() {
    this.onTickFn = () => {};
  }

  run() {
    this.onTickFn();
    window.requestAnimationFrame(() => { this.run(); });
  }

  onTick(onTickFn) {
    this.onTickFn = onTickFn;
  }
}
