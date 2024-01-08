import puppeteer from "puppeteer";

const scrapeSegment = async (page, lastScrollHeight) => {
  const segmentContent = await page.evaluate(async (lastHeight) => {
    const delay = (duration) =>
      new Promise((resolve) => setTimeout(resolve, duration));
    const distance = 1000;
    const maxAttempts = 5;
    let attempts = 0;
    let newScrollHeight = 0;

    while (attempts < maxAttempts) {
      window.scrollBy(0, distance);
      await delay(1000);
      newScrollHeight = document.body.scrollHeight;
      if (newScrollHeight === lastHeight) {
        attempts++;
      } else {
        attempts = 0;
      }
      lastHeight = newScrollHeight;
    }
    return document.body.innerHTML;
  }, lastScrollHeight);

  return segmentContent;
};

const scrapeWithPuppeteer = async (url) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  page.setDefaultTimeout(600000);
  await page.goto(url, { waitUntil: "networkidle0" });

  let lastScrollHeight = 0;
  let segments = [];
  let keepScraping = true;

  while (keepScraping) {
    const content = await scrapeSegment(page, lastScrollHeight);
    if (content) {
      segments.push(content);
      lastScrollHeight = await page.evaluate(() => document.body.scrollHeight);
    } else {
      keepScraping = false;
    }
  }

  await browser.close();
  return segments.join("");
};

export default scrapeWithPuppeteer;
