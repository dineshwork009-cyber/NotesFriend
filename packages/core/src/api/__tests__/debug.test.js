import { Debug } from "../debug.ts";
import createFetchMock from "vitest-fetch-mock";
import { vi, test, expect } from "vitest";
const fetchMocker = createFetchMock(vi);

const SUCCESS_REPORT_RESPONSE = {
  url: "https://reported/"
};

test("reporting issue should return issue url", async () => {
  fetchMocker.enableMocks();

  fetch.mockResponseOnce(JSON.stringify(SUCCESS_REPORT_RESPONSE), {
    headers: { "Content-Type": "application/json" }
  });

  expect(
    await Debug.report({
      title: "I am title",
      body: "I am body",
      userId: "anything"
    })
  ).toBe(SUCCESS_REPORT_RESPONSE.url);

  fetchMocker.disableMocks();
});

test("reporting invalid issue should return undefined", async () => {
  fetchMocker.enableMocks();

  fetch.mockResponseOnce(
    JSON.stringify({
      error_description: "Invalid issue."
    }),
    { status: 400, headers: { "Content-Type": "application/json" } }
  );

  expect(await Debug.report({})).toBeUndefined();

  fetchMocker.disableMocks();
});
