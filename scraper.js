const axios = require("axios");
const cheerio = require("cheerio");
require("dotenv").config();

const WIX_BLOG_URL = "https://www.brooklynaikikai.com/blog";

async function scrapeData() {
  try {
    const response = await axios.get(WIX_BLOG_URL);
    const $ = cheerio.load(response.data);

    // Scraping logic here...
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

scrapeData();
