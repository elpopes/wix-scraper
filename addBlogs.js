import dotenv from "dotenv";
import axios from "axios";
import fs from "fs";

dotenv.config();

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const environmentId = "testing";

const addBlogPostToContentful = async (blogPost, authorIdMap) => {
  try {
    const slug = blogPost.title.toLowerCase().split(" ").join("-");
    const authorId = authorIdMap[blogPost.author];

    const blogData = {
      fields: {
        title: { "en-US": blogPost.title },
        slug: { "en-US": slug },
        date: { "en-US": blogPost.date },
        person: {
          "en-US": [{ sys: { type: "Link", linkType: "Entry", id: authorId } }],
        },
        body: { "en-US": blogPost.content },
      },
      metadata: {
        tags: [{ sys: { type: "Link", linkType: "Tag", id: "migration" } }],
      },
    };

    const response = await axios.post(
      `https://api.contentful.com/spaces/${spaceId}/environments/${environmentId}/entries`,
      blogData,
      {
        headers: {
          Authorization: `Bearer ${managementToken}`,
          "Content-Type": "application/vnd.contentful.management.v1+json",
          "X-Contentful-Content-Type": "article",
        },
      }
    );

    console.log(`Blog post added: ${blogPost.title}`);
  } catch (error) {
    console.error(`Error adding blog post: ${blogPost.title}`, error);
  }
};

const addBlogsToContentful = async () => {
  const authorIdMap = JSON.parse(fs.readFileSync("authorIdMap.json", "utf8"));
  const blogPosts = JSON.parse(
    fs.readFileSync("contentfulBlogPosts.json", "utf8")
  );

  for (const blogPost of blogPosts) {
    await addBlogPostToContentful(blogPost, authorIdMap);
  }

  console.log("All blog posts have been added to Contentful");
};

addBlogsToContentful();
