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
        .find(".blog-post-title-font.blog-post-title-color")
        .text()
        .trim();
      const author = $(elem).find(".tQ0Q1A.user-name.dlINDG").text().trim();
      const date = $(elem).find(".post-metadata__date.time-ago").text().trim();
      const content = $(elem).find(".post-content__body.stSKMK, .k5bj-").html();

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
