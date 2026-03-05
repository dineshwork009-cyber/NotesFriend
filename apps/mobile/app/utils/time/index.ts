export const sleep = (duration: number) =>
  new Promise((resolve) => setTimeout(() => resolve(true), duration));
