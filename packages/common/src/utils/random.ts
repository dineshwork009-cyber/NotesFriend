function getRandom(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}

function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
export { getRandom, getRandomArbitrary };
