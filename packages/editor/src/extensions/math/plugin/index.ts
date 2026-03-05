/*---------------------------------------------------------
 *  Author: Benjamin R. Bray
 *  License: MIT (see LICENSE in project root for details)
 *--------------------------------------------------------*/

// core functionality
export { MathView, type ICursorPosObserver } from "./math-node-view.js";
export {
  mathPlugin,
  createMathView,
  type IMathPluginState
} from "./math-plugin.js";

// recommended plugins
export { mathBackspaceCmd } from "./plugins/math-backspace.js";

// optional / experimental plugins
export { mathSelectPlugin } from "./plugins/math-select.js";

// commands
export { insertMathNode } from "./commands/insert-math-node.js";

// utilities
export { mathSerializer } from "./utils/text-serializer.js";
export * from "./utils/types.js";
