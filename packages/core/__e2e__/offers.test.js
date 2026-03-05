import hosts from "../src/utils/constants.ts";
import { Offers } from "../src/api/offers.ts";
import { test, expect } from "vitest";

test("get offer code", async () => {
  hosts.SUBSCRIPTIONS_HOST = "https://subscriptions.notesfriend.app";
  expect(await Offers.getCode("TESTOFFER", "android")).toMatchSnapshot(
    "offer-code"
  );
});

test("get invalid offer code", async () => {
  hosts.SUBSCRIPTIONS_HOST = "https://subscriptions.notesfriend.app";
  await expect(Offers.getCode("INVALIDOFFER", "android")).rejects.toThrow(
    /Request failed with status code: 404./i
  );
});
