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
    return response.data.sys.id;
  } catch (error) {
    console.error("Error adding author:", error);
    return null;
  }
};

const addAllAuthors = async () => {
  const authors = extractUniqueAuthors();
  const authorIdMapping = {};

  for (const author of authors) {
    const authorId = await addAuthorToContentful(author);
    if (authorId) {
      authorIdMapping[author] = authorId;
    }
  }

  console.log("Author-ID mapping:", authorIdMapping);
  return authorIdMapping;
};

addAllAuthors();
