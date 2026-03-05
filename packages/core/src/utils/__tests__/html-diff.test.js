import { isHTMLEqual } from "../html-diff.ts";
import { test, expect, describe } from "vitest";

const equalPairs = [
  [
    "ignore whitespace difference",
    `<div>hello   \n\n\n\n\n</div>\n\n\n\n\n\n`,
    `<div>hello</div>`
  ],
  ["ignore html structure", `<p><b>hello</b>world</p>`, "<p>helloworld</p>"],
  [
    "ignore attributes",
    `<p id="ignored"><b id="ignored">hello</b>world</p>`,
    "<p>helloworld</p>"
  ],
  [
    "ignore empty tags",
    "<div>helloworld</div><p></p>",
    "<div>helloworld</div>"
  ],
  ["ignore br", "<p>hello<br/>world</p><p><br/><br/></p>", "<p>helloworld</p>"],
  [
    "image with same src",
    `<img src="./img.jpeg" />`,
    `<img id="hello" class="diff" src="./img.jpeg" />`
  ],
  [
    "link with same href",
    `<a href="google.com" />`,
    `<a id="hello" class="diff" href="google.com" />`
  ]
];

describe("pairs should be equal", () => {
  test.each(equalPairs)("%s", (_id, one, two) => {
    expect(isHTMLEqual(one, two)).toBe(true);
  });
});

const inequalPairs = [
  [
    "textual difference",
    `<div>hello   \n\n\n\n\nworld</div>\n\n\n\n\n\n`,
    `<div>hello</div>`
  ],
  [
    "image with different src",
    `<img src="./img.jpeg" />`,
    `<img id="hello" class="diff" src="./img.png" />`
  ],
  [
    "link with different href",
    `<a href="brave.com" />`,
    `<a id="hello" class="diff" href="google.com" />`
  ],
  ["non-string", {}, {}]
];

describe("pairs should not be equal", () => {
  test.each(inequalPairs)("%s", (_id, one, two) => {
    expect(isHTMLEqual(one, two)).toBe(false);
  });
});
