import dotenv from "dotenv";
import axios from "axios";
import { extractUniqueAuthors } from "./authorsExtractor.js";

dotenv.config();

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const environmentId = "testing";

export const addAuthorToContentful = async (authorName) => {
  try {
    const slug = authorName.toLowerCase().split(" ").join("-");
    const authorData = {
      fields: {
        title: { "en-US": authorName },
        slug: { "en-US": slug },
      },
      metadata: {
        tags: [{ sys: { type: "Link", linkType: "Tag", id: "migration" } }],
      },
    };

    const response = await axios.post(
      `https://api.contentful.com/spaces/${spaceId}/environments/${environmentId}/entries`,
      authorData,
      {
        headers: {
          Authorization: `Bearer ${managementToken}`,
          "Content-Type": "application/vnd.contentful.management.v1+json",
          "X-Contentful-Content-Type": "person",
        },
      }
    );

    console.log("Author added:", response.data);
  } catch (error) {
    console.error("Error adding author:", error);
  }
};

const addAllAuthors = async () => {
  const authors = extractUniqueAuthors();
  for (const author of authors) {
    await addAuthorToContentful(author);
  }
};

addAllAuthors();
