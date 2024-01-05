import dotenv from "dotenv";
dotenv.config();

import scrapeWithPuppeteer from "./puppeteerScraper.js";

const testPuppeteer = async () => {
  try {
    const url = process.env.WIX_BLOG_URL;
    const content = await scrapeWithPuppeteer(url);

    console.log("Scraped content:", content);
  } catch (error) {
    console.error("Error in puppeteerTester:", error);
  }
};

testPuppeteer();
