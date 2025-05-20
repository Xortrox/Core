import { StyleInject } from '../../helpers/StyleInject.ts';

export class IdleOverlay {
  overlay: HTMLElement = document.createElement('div');

  constructor() {
    this.touchIdleOverlay();
    this.bindEvents();
  }

  private touchIdleOverlay() {
    this.overlay.className = 'highlite-idle-overlay';
    this.overlay.hidden = true;

    StyleInject.inject(`
    .highlite-idle-overlay {
      background-color: rgba(255, 0, 0, 0.3);
      position: fixed;
      pointer-events: none;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 99999999;
    }
    `);
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
