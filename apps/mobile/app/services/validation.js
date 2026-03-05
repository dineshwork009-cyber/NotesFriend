import { strings } from "@notesfriend/intl";
import isEmail from "validator/lib/isEmail";

export function validateEmail(email) {
  if (email && email.length > 0) {
    return isEmail(email);
  } else {
    return false;
  }
}

export const ERRORS_LIST = {
  SHORT_PASS: strings.passTooShort()
};

export function validatePass(password) {
  let errors = {
    SHORT_PASS: false
  };

  if (password?.length < 8) {
    errors.SHORT_PASS = true;
  } else {
    errors.SHORT_PASS = false;
  }

  return errors;
}

export function validateUsername(username) {
  let regex = /^[a-z0-9_-]{3,200}$/gim;
  if (username && username.length > 0) {
    return regex.test(username);
  } else {
    return false;
  }
}
