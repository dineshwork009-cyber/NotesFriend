import { test, Page, expect } from "@playwright/test";
import { USER } from "./utils";
import { AppModel } from "./models/app.model";
import { PriceItem } from "./models/types";

test.setTimeout(45 * 1000);
test.describe.configure({ mode: "serial" });

let page: Page;
let app: AppModel;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  app = new AppModel(page);
  await app.auth.goto();
  await app.auth.login(USER.CURRENT);
});

test.afterAll(async () => {
  await page.close();
});

test.afterEach(async () => {
  await app.goto(true);
});

function roundOffPrices(prices: PriceItem[]) {
  return prices
    .map((p) => {
      const price = p.value.replace(/(\d+)\.(\d+)/gm, (_, whole, decimal) => {
        const stabalizePrice =
          Math.max(
            0,
            Math.ceil(Math.log10(parseFloat(`${whole}.${decimal}`)))
          ) * 100;
        return `${stabalizePrice}`;
      });
      return `${p.label}: ${price}`;
    })
    .join("\n");
}

test.skip("change plans", async () => {
  await app.checkout.goto();
  const plans = await app.checkout.getPlans();

  const titles: string[] = [];
  for (const plan of plans) {
    const pricing = await plan.open();
    const title = await pricing.getTitle();
    if (title) titles.push(title);
    await pricing.changePlan();
  }

  expect(titles).toHaveLength(2);
  expect(titles.join("").length).toBeGreaterThan(0);
});

test.skip("confirm plan prices", async () => {
  await app.checkout.goto();
  const plans = await app.checkout.getPlans();

  const planPrices: Record<string, string> = {};
  for (const plan of plans) {
    const pricing = await plan.open();
    const title = await pricing.getTitle();
    if (!title) continue;

    planPrices[title.toLowerCase()] = roundOffPrices(await pricing.getPrices());
    await pricing.changePlan();
  }

  for (const key in planPrices) {
    expect(planPrices[key]).toMatchSnapshot(`checkout-${key}-prices.txt`);
  }
});

test.skip("changing locale should show localized prices", async () => {
  await app.checkout.goto();
  const plans = await app.checkout.getPlans();

  const planPrices: Record<string, string> = {};
  for (const plan of plans) {
    const pricing = await plan.open();
    const title = await pricing.getTitle();
    if (!title) continue;
    await pricing.changeCountry("IN", 110001);

    planPrices[title.toLowerCase()] = roundOffPrices(await pricing.getPrices());
    await pricing.changePlan();
  }

  for (const key in planPrices) {
    expect(planPrices[key]).toMatchSnapshot(`checkout-${key}-IN-prices.txt`);
  }
});

test.skip("applying coupon should change discount & total price", async () => {
  await app.checkout.goto();
  const plans = await app.checkout.getPlans();

  const planPrices: Record<string, string> = {};
  for (const plan of plans) {
    const pricing = await plan.open();
    const title = await pricing.getTitle();
    if (!title) continue;
    await pricing.waitForPaddleFrame();
    await pricing.applyCoupon("INTRO50");

    planPrices[title.toLowerCase()] = roundOffPrices(await pricing.getPrices());
    await pricing.changePlan();
  }

  for (const key in planPrices) {
    expect(planPrices[key]).toMatchSnapshot(
      `checkout-${key}-discounted-prices.txt`
    );
  }
});

test.skip("apply coupon through url", async () => {
  const planPrices: Record<string, string> = {};
  for (const plan of ["monthly", "yearly"] as const) {
    await app.checkout.goto(plan, "INTRO50");
    const pricing = await app.checkout.getPricing();
    await pricing.waitForPaddleFrame();
    await pricing.waitForCoupon();

    planPrices[plan] = roundOffPrices(await pricing.getPrices());

    await app.goto(true);
  }

  for (const key in planPrices) {
    expect(planPrices[key]).toMatchSnapshot(
      `checkout-${key}-discounted-prices.txt`
    );
  }
});

test.skip("apply coupon after changing country", async () => {
  await app.checkout.goto();
  const plans = await app.checkout.getPlans();

  const planPrices: Record<string, string> = {};
  for (const plan of plans) {
    const pricing = await plan.open();
    const title = await pricing.getTitle();
    if (!title) continue;
    await pricing.waitForPaddleFrame();
    await pricing.changeCountry("IN", 110001);
    await pricing.applyCoupon("INTRO50");

    planPrices[title.toLowerCase()] = roundOffPrices(await pricing.getPrices());
    await pricing.changePlan();
  }

  for (const key in planPrices) {
    expect(planPrices[key]).toMatchSnapshot(
      `checkout-${key}-IN-discounted-prices.txt`
    );
  }
});
