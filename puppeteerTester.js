import dotenv from "dotenv";
import fs from "fs";
import scrapeWithPuppeteer from "./puppeteerScraper.js";
dotenv.config();

const testPuppeteer = async () => {
  try {
    const url = process.env.WIX_BLOG_URL;
    const content = await scrapeWithPuppeteer(url);

    fs.writeFileSync("scrapedContent.html", content);
    console.log("Scraped content has been saved to scrapedContent.html");
  } catch (error) {
    console.error("Error in puppeteerTester:", error);
  }
};

testPuppeteer();
