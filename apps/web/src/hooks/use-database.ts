import { initializeDatabase } from "../common/db";

let isDatabaseLoaded: false | Promise<any> = false;
export function loadDatabase(persistence: "db" | "memory" = "db") {
  isDatabaseLoaded = isDatabaseLoaded || initializeDatabase(persistence);
  return isDatabaseLoaded;
}
