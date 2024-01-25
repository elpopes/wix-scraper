import dotenv from "dotenv";
import axios from "axios";
import { extractUniqueAuthors } from "./authorsExtractor.js";
import fs from "fs";

dotenv.config();

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const environmentId = "testing";

const addAuthorToContentful = async (authorName) => {
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

    return response.data.sys.id;
  } catch (error) {
    console.error("Error adding author:", error);
    return null;
  }
};

const addAllAuthors = async () => {
  const authors = extractUniqueAuthors();
  const authorIdMap = {};

  for (const author of authors) {
    const authorId = await addAuthorToContentful(author);
    if (authorId) {
      authorIdMap[author] = authorId;
    }
  }

  fs.writeFileSync("authorIdMap.json", JSON.stringify(authorIdMap, null, 2));
  console.log("Author ID mapping saved to authorIdMap.json");
};

addAllAuthors();
