export function exitFullscreen() {
  if (!document.fullscreenElement) return;
  document.exitFullscreen();
}
