const LERP = 0.18;
const FRAME = 1000 / 60;
const MIN_DELTA = 40;

const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const maxY = () => document.documentElement.scrollHeight - innerHeight;
const clamp = (y: number) => Math.min(Math.max(y, 0), maxY());

function canScrollInside(el: EventTarget | null, dy: number) {
  for (
    let node = el as HTMLElement | null;
    node && node !== document.body;
    node = node.parentElement
  ) {
    const { overflowY } = getComputedStyle(node);
    if (!/(auto|scroll)/.test(overflowY) || node.scrollHeight <= node.clientHeight) continue;
    if (dy < 0 ? node.scrollTop > 0 : node.scrollTop + node.clientHeight < node.scrollHeight) {
      return true;
    }
  }
  return false;
}

export interface SmoothScroll {
  scrollTo(y: number, cb?: () => void): void;
  destroy(): void;
}

export function smoothScroll(): SmoothScroll {
  let target = scrollY;
  let current = scrollY;
  let raf = 0;
  let last = 0;
  let done: (() => void) | null = null;

  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };

  const tick = (now: number) => {
    const k = 1 - Math.pow(1 - LERP, (now - last) / FRAME);
    last = now;
    current += (target - current) * k;
    if (Math.abs(target - current) < 0.5) {
      current = target;
      scrollTo(0, current);
      raf = 0;
      const cb = done;
      done = null;
      cb?.();
      return;
    }
    scrollTo(0, current);
    raf = requestAnimationFrame(tick);
  };

  const start = () => {
    if (raf) return;
    current = scrollY;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  };

  const onWheel = (e: WheelEvent) => {
    if (e.defaultPrevented || e.ctrlKey || reduced() || document.querySelector('[role="dialog"]')) {
      return;
    }
    const d =
      e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * innerHeight : e.deltaY;
    if (canScrollInside(e.target, d)) return;
    if (Math.abs(d) < MIN_DELTA) {
      if (raf) stop();
      return;
    }
    e.preventDefault();
    if (!raf) target = scrollY;
    target = clamp(target + d);
    start();
  };

  const onScroll = () => {
    if (!raf) target = current = scrollY;
  };

  addEventListener("wheel", onWheel, { passive: false });
  addEventListener("scroll", onScroll, { passive: true });

  return {
    scrollTo(y, cb) {
      done = null;
      target = clamp(y);
      if (reduced()) {
        stop();
        scrollTo(0, target);
        cb?.();
        return;
      }
      done = cb ?? null;
      start();
    },
    destroy() {
      stop();
      removeEventListener("wheel", onWheel);
      removeEventListener("scroll", onScroll);
    },
  };
}
