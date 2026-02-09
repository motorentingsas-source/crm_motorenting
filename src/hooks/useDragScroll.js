import { useRef } from 'react';

export function useDragScroll() {
  const ref = useRef(null);

  const onMouseDown = (e) => {
    const el = ref.current;
    if (!el) return;

    el.isDown = true;
    el.startX = e.pageX - el.offsetLeft;
    el.scrollLeftStart = el.scrollLeft;
    el.classList.add('cursor-grabbing');
  };

  const onMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.isDown = false;
    el.classList.remove('cursor-grabbing');
  };

  const onMouseUp = () => {
    const el = ref.current;
    if (!el) return;
    el.isDown = false;
    el.classList.remove('cursor-grabbing');
  };

  const onMouseMove = (e) => {
    const el = ref.current;
    if (!el || !el.isDown) return;

    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - el.startX) * 1.5;
    el.scrollLeft = el.scrollLeftStart - walk;
  };

  return { ref, onMouseDown, onMouseLeave, onMouseUp, onMouseMove };
}
