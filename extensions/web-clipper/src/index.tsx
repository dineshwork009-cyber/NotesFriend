import "../assets/16x16.png";
import "../assets/32x32.png";
import "../assets/48x48.png";
import "../assets/64x64.png";
import "../assets/128x128.png";
import "../assets/256x256.png";
import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";
import "./index.css";

declare let module: NodeModule & {
  hot?: { accept: () => void };
};
const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
if (module.hot) module.hot.accept();
