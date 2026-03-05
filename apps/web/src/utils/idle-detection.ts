export function startIdleDetection(ms: number, onTrigger: () => void) {
  console.log("starting idle detection", ms);
  let timeout = 0;
  function onEvent() {
    clearTimeout(timeout);
    timeout = setTimeout(onTrigger, ms) as unknown as number;
  }

  window.addEventListener("mousemove", onEvent);
  window.addEventListener("wheel", onEvent);
  window.addEventListener("keydown", onEvent);
  window.addEventListener("keydown", onEvent);
  window.addEventListener("scroll", onEvent);
  window.addEventListener("touchmove", onEvent);
  window.addEventListener("touchstart", onEvent);
  window.addEventListener("click", onEvent);
  window.addEventListener("focus", onEvent);
  window.addEventListener("blur", onEvent);

  return () => {
    clearTimeout(timeout);
    window.removeEventListener("mousemove", onEvent);
    window.removeEventListener("wheel", onEvent);
    window.removeEventListener("keydown", onEvent);
    window.removeEventListener("keydown", onEvent);
    window.removeEventListener("scroll", onEvent);
    window.removeEventListener("touchmove", onEvent);
    window.removeEventListener("touchstart", onEvent);
    window.removeEventListener("click", onEvent);
    window.removeEventListener("focus", onEvent);
    window.removeEventListener("blur", onEvent);
  };
}
