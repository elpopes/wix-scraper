import fs from "fs";

export const extractUniqueAuthors = () => {
  try {
    const data = fs.readFileSync("blogPosts.json", "utf8");
    const blogPosts = JSON.parse(data);
    const uniqueAuthors = new Set();
    blogPosts.forEach((post) => {
      if (post.author) {
        uniqueAuthors.add(post.author);
      }
    });

    return Array.from(uniqueAuthors);
  } catch (error) {
    console.error("Error occurred:", error);
    return [];
  }
};

const authors = extractUniqueAuthors();
console.log(authors);
