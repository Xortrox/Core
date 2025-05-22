export class IdleOverlay {
  overlay: HTMLElement = document.createElement('div');

  constructor() {
    this.touchIdleOverlay();
    this.bindEvents();
  }

  private touchIdleOverlay() {
    this.overlay.className = 'highlite-idle-overlay';
    this.overlay.hidden = true;

    this.overlay.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
    this.overlay.style.position = 'fixed';
    this.overlay.style.pointerEvents = 'none';
    this.overlay.style.top = '0';
    this.overlay.style.left = '0';
    this.overlay.style.right = '0';
    this.overlay.style.bottom = '0';
    this.overlay.style.zIndex = '99999999';
  }

  private bindEvents() {
    window.addEventListener('focus', this.onClientInteraction);

    [
      'click',
      'keydown',
      /** Likely unwanted, at least not part of runelite as far as I'm aware */
      // 'mousemove',
      'touchstart',
      'pointerdown'
    ].forEach(eventType => {
      /**
       * We use passive: true for faster scroll handling/performance boost
       * */
      window.addEventListener(eventType, this.onClientInteraction, { passive: true });
    });
  }

  onClientInteraction() {
    this.hide();
  }

  show() {
    this.overlay.hidden = false;
  }

  hide() {
    this.overlay.hidden = true;
  }
}
