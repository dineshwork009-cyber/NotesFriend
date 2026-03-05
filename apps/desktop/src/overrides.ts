import { app } from "electron";
import path from "path";

const customVersion = process.env.CUSTOM_APP_VERSION;
if (customVersion) {
  app.getVersion = () => customVersion;
  console.log("setting custom version:", customVersion);
}

if (process.env.CUSTOM_USER_DATA_DIR) {
  app.setPath(
    "appData",
    path.join(process.env.CUSTOM_USER_DATA_DIR, "AppData")
  );
  app.setPath(
    "userData",
    path.join(process.env.CUSTOM_USER_DATA_DIR, "UserData")
  );
  app.setPath(
    "documents",
    path.join(process.env.CUSTOM_USER_DATA_DIR, "Documents")
  );
}
