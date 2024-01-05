import("dotenv").then((dotenv) => dotenv.config());

import { launch } from "puppeteer";

const testPuppeteer = async () => {
  const browser = await launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(process.env.WIX_BLOG_URL, { waitUntil: "networkidle0" });

  // Close the browser after a delay
  setTimeout(async () => {
    await browser.close();
  }, 10000);
};

testPuppeteer().catch((error) => {
  console.error("Error in puppeteerTester:", error);
  process.exit(1);
});

export default testPuppeteer;
