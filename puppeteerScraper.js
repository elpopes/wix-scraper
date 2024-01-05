const puppeteer = require("puppeteer");

const scrapeWithPuppeteer = async (url) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle0" });

  const delay = (duration) =>
    new Promise((resolve) => setTimeout(resolve, duration));

  await delay(3000); // 3 seconds delay

  // Function to auto-scroll
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 200);
    });
  });

  const content = await page.content();
  await browser.close();
  return content;
};

module.exports = scrapeWithPuppeteer;
