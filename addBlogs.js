import dotenv from "dotenv";
import axios from "axios";
import fs from "fs";

dotenv.config();

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const environmentId = "testing";

const addBlogPostToContentful = async (blogPost) => {
  const title = blogPost.fields.title["en-US"];
  console.log(`Blog Post Title: ${title}`);

  try {
    // Extracting the authorId from the person field
    const authorId = blogPost.fields.person["en-US"][0].sys.id;
    if (!authorId) {
      console.error(`Author ID not found in blog post: ${title}`);
      return;
    }

    const slug = blogPost.fields.slug["en-US"]; // Using the provided slug directly
    console.log(`Starting to add blog post: ${title}`);
    console.log(`Slug: ${slug}, Author ID: ${authorId}`);

    const blogData = {
      fields: {
        title: { "en-US": title },
        slug: { "en-US": slug },
        date: { "en-US": blogPost.fields.date["en-US"] },
        person: {
          "en-US": [{ sys: { type: "Link", linkType: "Entry", id: authorId } }],
        },
        body: blogPost.fields.body,
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

    console.log(`Blog post added successfully: ${title}`);
  } catch (error) {
    console.error(`Error adding blog post: ${title || "Unknown"}`, error);
  }
};

const addBlogsToContentful = async () => {
  const blogPosts = JSON.parse(
    fs.readFileSync("contentfulBlogPosts.json", "utf8")
  );

  for (const blogPost of blogPosts) {
    await addBlogPostToContentful(blogPost);
  }

  console.log("All blog posts have been added to Contentful");
};

addBlogsToContentful();
