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
    const postElements = $(".cD_92h.nMLWs_.UitnHM");

    postElements.each((i, elem) => {
      const title = $(elem).find("h2.blog-post-title-font.blog-post-title-color").text().trim();
      const author = $(elem).siblings().find("span.user-name").text().trim();
      const date = $(elem).siblings().find("span.time-ago").text().trim();

      // Capture the full HTML for the post
        let fullPostHtml = "";
        if (i + 1 < postElements.length) {
            fullPostHtml = htmlContent.substring(
            htmlContent.indexOf($.html(elem)),
            htmlContent.indexOf($.html(postElements[i + 1]))
            );
        } else {
            fullPostHtml = htmlContent.substring(htmlContent.indexOf($.html(elem)));
        }

        const $postHtml = cheerio.load(fullPostHtml);
        $postHtml('*').removeAttr('style'); // Remove all inline styles
        $postHtml('script, style').remove(); // Remove script and style tags

        // Extract text from each paragraph tag and concatenate them with line breaks
        let content = '';
        $postHtml('.post-content__body p').each(function () {
        content += $postHtml(this).text() + '\n'; // Append text with a line break
        });

        content = content.trim() || "Content not found";
        
        console.log(`--- Post ${i + 1} Start ---`);
        console.log("Title:", title);
        console.log("Author:", author);
        console.log("Date:", date);
        console.log("Content:", content);
        console.log(`--- Post ${i + 1} End ---\n`);

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