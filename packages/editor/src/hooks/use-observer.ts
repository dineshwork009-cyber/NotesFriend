import { useState, useRef, useEffect, useCallback } from "react";

type ObserverType = {
  threshold: number;
  rootMargin?: string;
  once?: boolean;
};

export function useObserver<T extends Element = Element>({
  threshold,
  rootMargin = "0px",
  once = false
}: ObserverType) {
  const [inView, setInView] = useState<boolean>();
  const ref = useRef<T>(null);
  const observer = useRef<IntersectionObserver>();

  const updateInView = useCallback(
    (val: boolean) => {
      if (inView && once) {
        return;
      }
      setInView(val);
    },
    [inView, once]
  );

  useEffect(() => {
    if (!ref.current) return;

    const options = {
      root: ref.current.closest(".ms-container"),
      rootMargin: rootMargin
    };

    observer.current = new IntersectionObserver((entries) => {
      updateInView(entries[0].isIntersecting);
    }, options);

    observer.current.observe(ref.current);

    const reference = ref.current;

    return () => {
      if (reference) {
        observer.current?.unobserve(reference);
        observer.current?.disconnect();
      }
    };
  }, [rootMargin, threshold, updateInView]);

  return { inView, ref };
}
