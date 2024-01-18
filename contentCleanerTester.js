import fs from "fs";
import { cleanContent } from "./contentCleaner.js";

const testContentCleaner = () => {
  try {
    console.log("Reading blog posts...");

    // Read the blogPosts.json file
    const blogPostsData = fs.readFileSync("blogPosts.json", "utf8");
    const blogPosts = JSON.parse(blogPostsData);

    console.log("Processing blog posts...");

    // Process each blog post through the content cleaner
    blogPosts.forEach((post, index) => {
      // Debugging: Log the type of post.content
      console.log(
        `Processing post ${index + 1}, type of content: ${typeof post.content}`
      );

      post.content = cleanContent(post.content);
    });

    console.log("Outputting cleaned content...");

    // Output the cleaned content
    console.log(blogPosts);

    // Optionally, write to a new file
    // fs.writeFileSync('cleanedBlogPosts.json', JSON.stringify(blogPosts, null, 2));
  } catch (error) {
    console.error("Error occurred:", error);
  }
};

testContentCleaner();
