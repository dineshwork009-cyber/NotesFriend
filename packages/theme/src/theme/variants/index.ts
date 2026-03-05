import { buttonVariants } from "./button.js";
import { inputVariants } from "./input.js";
import { textVariants } from "./text.js";
import { createFlexVariants } from "./flex.js";

export const variants = {
  buttons: buttonVariants,
  forms: inputVariants,
  text: textVariants,
  variants: {
    ...createFlexVariants("row"),
    ...createFlexVariants("column")
  }
};
