import { useCallback, useEffect, useMemo, useRef } from "react";

type Slide = {
  index: number;
  node: HTMLElement;
  offset: number;
  width: number;
};

export default function useSlider({
  onSliding,
  onChange
}: {
  onSliding?: (
    e: Event,
    options: {
      lastSlide: Slide | null;
      lastPosition: number;
      position: number;
    }
  ) => void;
  onChange?: (
    e: Event,
    options: { position: number; slide: Slide; lastSlide: Slide | null }
  ) => void;
} = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const slides: Slide[] = useMemo(() => [], []);

  useEffect(() => {
    if (!ref.current) return;
    const slider = ref.current;
    let lastSlide: Slide | null = null;
    let lastPosition = 0;
    let last = 0;
    if (!slides.length) {
      for (const node of slider.childNodes) {
        if (
          !(node instanceof HTMLElement) ||
          node.classList.contains("ms-track-box")
        )
          continue;
        slides.push({
          index: slides.length,
          node,
          offset: last,
          width: node.scrollWidth
        });
        last += node.scrollWidth;
      }
    }

    function onScroll(e: Event) {
      const position =
        e.target && e.target instanceof HTMLElement ? e.target.scrollLeft : -1;
      if (onSliding) onSliding(e, { lastSlide, lastPosition, position });
      const slide = slides.find(
        (slide) => slide.offset === Math.round(position)
      );
      if (onChange && slide && lastSlide !== slide) {
        onChange(e, { position, slide, lastSlide });
        lastSlide = slide;
      }
      lastPosition = position;
    }

    slider.onscroll = onScroll;
    return () => {
      slider.onscroll = null;
    };
  }, [ref, slides, onSliding, onChange]);

  const slideToIndex = useCallback(
    (index: number) => {
      if (!slides || !ref.current || index >= slides.length) return;
      const slider = ref.current;
      setTimeout(() => {
        slider.scrollTo({
          left: slides[index].offset,
          behavior: "smooth"
        });
      }, 100);
    },
    [ref, slides]
  );

  return { ref, slideToIndex };
}
