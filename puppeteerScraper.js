import puppeteer from "puppeteer";

const scrapeSegment = async (page, maxNoChangeAttempts) => {
  return await page.evaluate(async (maxAttempts) => {
    const delay = (duration) =>
      new Promise((resolve) => setTimeout(resolve, duration));
    const distance = 1000;
    let attempts = 0;
    let lastHeight = 0,
      newHeight = 0;

    while (true) {
      lastHeight = document.body.scrollHeight;
      window.scrollBy(0, distance);
      await delay(1000);
      newHeight = document.body.scrollHeight;

      if (newHeight > lastHeight) {
        attempts = 0;
      } else {
        if (++attempts >= maxAttempts) break;
      }
    }

    return document.body.innerHTML;
  }, maxNoChangeAttempts);
};

const scrapeWithPuppeteer = async (url, maxNoChangeAttempts = 20) => {
  const browser = await puppeteer.launch({
    headless: false,
    timeout: 0,
    protocolTimeout: 0,
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(600000);
  await page.goto(url, { waitUntil: "networkidle0" });

  const content = await scrapeSegment(page, maxNoChangeAttempts);

  await browser.close();
  return content;
};

export default scrapeWithPuppeteer;
