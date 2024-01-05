const puppeteer = require("puppeteer");

const scrapeWithPuppeteer = async (url) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle0" });

  const delay = (duration) =>
    new Promise((resolve) => setTimeout(resolve, duration));

  await delay(3000); // Initial delay for page load

  await page.evaluate(async () => {
    await new Promise((resolve) => {
      var totalHeight = 0;
      var distance = 200; // Increased scrolling distance
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 500); // Slower interval for scrolling
    });
  });

  await delay(10000); // Additional delay after scrolling to ensure all posts are loaded

  const content = await page.content();
  await browser.close();
  return content;
};

module.exports = scrapeWithPuppeteer;
