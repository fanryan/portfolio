/** A self-contained gallery. Each instance reads its own rendered photo links. */
class PhotoJournal extends HTMLElement {
  private cleanup?: () => void;

  connectedCallback() {
    if (this.cleanup) return;
    const strip = this.querySelector<HTMLElement>('.journal-strip');
    const dialog = this.querySelector<HTMLDialogElement>('dialog');
    const image = this.querySelector<HTMLImageElement>('[data-full-photo]');
    const caption = this.querySelector<HTMLElement>('[data-caption-text]');
    const counter = this.querySelector<HTMLElement>('[data-counter]');
    const links = [...this.querySelectorAll<HTMLAnchorElement>('[data-photo]')];
    if (!strip || !dialog || !image || !caption || !counter || !links.length)
      return;

    const controller = new AbortController();
    const options = { signal: controller.signal };
    let current = 0;
    let opener: HTMLAnchorElement | undefined;

    const show = (index: number) => {
      current = (index + links.length) % links.length;
      const link = links[current];
      image.src = link.href;
      image.alt = link.querySelector('img')?.alt ?? '';
      caption.textContent = link.dataset.caption ?? '';
      counter.textContent = `${current + 1} / ${links.length}`;
    };

    links.forEach((link, index) =>
      link.addEventListener(
        'click',
        (event) => {
          // Preserve browser gestures such as Cmd/Ctrl-click and the no-JS image link.
          if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
            return;
          event.preventDefault();
          opener = link;
          show(index);
          dialog.showModal();
          document.body.classList.add('viewer-open');
        },
        options,
      ),
    );

    this.querySelector('[data-close]')?.addEventListener(
      'click',
      () => dialog.close(),
      options,
    );
    this.querySelector('[data-prev]')?.addEventListener(
      'click',
      () => show(current - 1),
      options,
    );
    this.querySelector('[data-next]')?.addEventListener(
      'click',
      () => show(current + 1),
      options,
    );
    dialog.addEventListener(
      'keydown',
      (event) => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault();
          show(current + (event.key === 'ArrowLeft' ? -1 : 1));
        }
      },
      options,
    );
    dialog.addEventListener(
      'click',
      (event) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        )
          dialog.close();
      },
      options,
    );
    dialog.addEventListener(
      'close',
      () => {
        document.body.classList.remove('viewer-open');
        opener?.focus({ preventScroll: true });
      },
      options,
    );

    const buttons = [
      ...this.querySelectorAll<HTMLButtonElement>('[data-scroll]'),
    ];
    const updateArrows = () =>
      buttons.forEach((button) => {
        button.disabled =
          Number(button.dataset.scroll) < 0
            ? strip.scrollLeft <= 1
            : strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 2;
      });
    buttons.forEach((button) =>
      button.addEventListener(
        'click',
        () => {
          strip.scrollBy({
            left: Number(button.dataset.scroll) * strip.clientWidth * 0.8,
            behavior: matchMedia('(prefers-reduced-motion: reduce)').matches
              ? 'instant'
              : 'smooth',
          });
        },
        options,
      ),
    );
    strip.addEventListener('scroll', updateArrows, {
      ...options,
      passive: true,
    });
    const observer = new ResizeObserver(updateArrows);
    observer.observe(strip);
    updateArrows();
    this.cleanup = () => {
      if (dialog.open) dialog.close();
      document.body.classList.remove('viewer-open');
      observer.disconnect();
      controller.abort();
    };
  }

  disconnectedCallback() {
    this.cleanup?.();
    this.cleanup = undefined;
  }
}

if (!customElements.get('photo-journal'))
  customElements.define('photo-journal', PhotoJournal);
