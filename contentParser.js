import dotenv from "dotenv";
import fs from "fs";
import cheerio from "cheerio";
import scrapeWithPuppeteer from "./puppeteerScraper.js";

dotenv.config();

const parseBlogPostsToJson = async (url) => {
  try {
    const htmlContent = await scrapeWithPuppeteer(url);
    const $ = cheerio.load(htmlContent);
    const posts = [];

    $(".cD_92h.nMLWs_.UitnHM").each((i, elem) => {
      const title = $(elem)
        .find("h2.blog-post-title-font.blog-post-title-color")
        .text()
        .trim();
      console.log("Title:", title); // Logs the title

      const surroundingHtml = $(elem).parent().html();
      console.log("Surrounding HTML:", surroundingHtml); // Logs the HTML structure around the title

      const author = $(elem).siblings().find("span.user-name").text().trim();
      console.log("Author:", author); // Logs the author

      const date = $(elem).siblings().find("span.time-ago").text().trim();
      console.log("Date:", date); // Logs the date

      const content = $(elem).siblings().find(".fTEXDR.A2sIZ4.QEEfz0").html();
      console.log("Content:", content); // Logs the content

      posts.push({ title, author, date, content });
    });

    return posts;
  } catch (error) {
    console.error("Error in parseBlogPostsToJson:", error);
    return [];
  }
};

const WIX_BLOG_URL = process.env.WIX_BLOG_URL;

async function run() {
  const blogPosts = await parseBlogPostsToJson(WIX_BLOG_URL);
  fs.writeFileSync("blogPosts.json", JSON.stringify(blogPosts, null, 2));
  console.log("Blog posts have been parsed and saved to blogPosts.json");
}

run();
