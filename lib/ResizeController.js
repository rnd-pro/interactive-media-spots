export class ResizeController {

  static #map = new Map();
  static #timeout;

  /** @type {ResizeObserver} */
  static #observer = new ResizeObserver((entries) => {
    if (this.#timeout) {
      window.clearTimeout(this.#timeout);
    }
    this.#timeout = window.setTimeout(() => {
      [...this.#map.values()].forEach((cb) => {
        cb?.();
      });
    }, 400);
  });

  static add(target, callback) {
    if (!this.#map.has(target)) {
      this.#observer.observe(target);
      this.#map.set(target, callback);
    }
  }

  static remove(target) {
    this.#observer.unobserve(target);
    this.#map.delete(target);
  }

}