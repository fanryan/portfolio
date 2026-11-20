const carousel = document.querySelector<HTMLElement>('[data-project-carousel]');

if (carousel) {
  const viewport = carousel.querySelector<HTMLElement>('.project-viewport')!;
  const track = carousel.querySelector<HTMLElement>('.project-track')!;
  const originalSlides = Array.from(track.children) as HTMLElement[];
  const previous = carousel.querySelector<HTMLButtonElement>(
    '[data-project-previous]',
  )!;
  const next = carousel.querySelector<HTMLButtonElement>(
    '[data-project-next]',
  )!;
  const cloneSlide = (slide: HTMLElement) => {
    const clone = slide.cloneNode(true) as HTMLElement;
    clone.setAttribute('aria-hidden', 'true');
    clone.inert = true;
    return clone;
  };

  track.prepend(cloneSlide(originalSlides.at(-1)!));
  track.append(cloneSlide(originalSlides[0]));
  const slides = Array.from(track.children) as HTMLElement[];
  let position = 1;
  let pointerId: number | undefined;
  let startX = 0;
  let offsetX = 0;
  let dragged = false;
  let suppressClick = false;
  let transitioning = false;
  let transitionTimer = 0;

  const setPosition = (dragOffset = 0) => {
    const activeSlide = slides[position];
    const centeredOffset =
      activeSlide.offsetLeft -
      (viewport.clientWidth - activeSlide.offsetWidth) / 2;
    track.style.transform = `translateX(${-centeredOffset + dragOffset}px)`;
  };
  const setDepth = () => {
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === position);
      slide.classList.toggle('is-before', slideIndex === position - 1);
      slide.classList.toggle('is-after', slideIndex === position + 1);
    });
  };
  const render = () => {
    track.classList.remove('is-dragging');
    setPosition();
    setDepth();
  };
  const move = (direction: number) => {
    if (transitioning) return;
    position += direction;
    transitioning = true;
    render();
    window.clearTimeout(transitionTimer);
    transitionTimer = window.setTimeout(finishTransition, 650);
  };
  const release = () => {
    if (pointerId === undefined) return;

    if (viewport.hasPointerCapture(pointerId))
      viewport.releasePointerCapture(pointerId);
    if (Math.abs(offsetX) > 48) move(offsetX < 0 ? 1 : -1);
    else render();
    suppressClick = dragged;
    window.setTimeout(() => {
      suppressClick = false;
    });
    pointerId = undefined;
    offsetX = 0;
  };
  const resetLoop = () => {
    if (position !== 0 && position !== slides.length - 1) return;

    position = position === 0 ? originalSlides.length : 1;
    track.classList.add('is-jumping');
    render();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => track.classList.remove('is-jumping'));
    });
  };
  const finishTransition = () => {
    if (!transitioning) return;
    transitioning = false;
    window.clearTimeout(transitionTimer);
    resetLoop();
  };

  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  viewport.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      move(-1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      move(1);
    }
  });
  viewport.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    if (transitioning) return;
    pointerId = event.pointerId;
    startX = event.clientX;
    offsetX = 0;
    dragged = false;
    viewport.setPointerCapture(pointerId);
    track.classList.add('is-dragging');
  });
  viewport.addEventListener('dragstart', (event) => event.preventDefault());
  viewport.addEventListener('pointermove', (event) => {
    if (event.pointerId !== pointerId) return;
    offsetX = event.clientX - startX;
    dragged ||= Math.abs(offsetX) > 8;
    setPosition(offsetX);
  });
  viewport.addEventListener('pointerup', release);
  viewport.addEventListener('pointercancel', release);
  viewport.addEventListener(
    'click',
    (event) => {
      if (suppressClick) event.preventDefault();
    },
    true,
  );
  track.addEventListener('transitionend', (event) => {
    if (event.target !== track || event.propertyName !== 'transform') return;
    finishTransition();
  });
  window.addEventListener('resize', () => {
    track.classList.add('is-jumping');
    render();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => track.classList.remove('is-jumping'));
    });
  });
  track.classList.add('is-jumping');
  render();
  requestAnimationFrame(() => {
    requestAnimationFrame(() => track.classList.remove('is-jumping'));
  });
}
