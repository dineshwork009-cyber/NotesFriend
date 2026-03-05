export class SessionHistory extends Map {
  get(key: any) {
    let value = super.get(key);
    if (Date.now() - value > 5 * 60 * 1000) {
      value = Date.now();
      this.set(key, value);
    }
    return value;
  }
  newSession(noteId: string) {
    const value = Date.now();
    this.set(noteId, value);
    return value;
  }
  clearSession(noteId: string) {
    this.delete(noteId);
  }
}
