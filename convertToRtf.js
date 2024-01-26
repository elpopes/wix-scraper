import fs from "fs";
import cheerio from "cheerio";

export const convertHtmlToContentfulRtf = (htmlContent) => {
  const $ = cheerio.load(htmlContent);
  const contentfulRtf = {
    nodeType: "document",
    data: {},
    content: [],
  };

  const processNode = (node) => {
    const processedContent = [];

    $(node)
      .contents()
      .each((_, child) => {
        if (child.type === "text" && $(child).text().trim()) {
          processedContent.push({
            nodeType: "text",
            value: $(child).text(),
            marks: [],
            data: {},
          });
        } else if (child.type === "tag") {
          if (child.tagName === "em" || child.tagName === "i") {
            processedContent.push({
              nodeType: "text",
              value: $(child).text(),
              marks: [{ type: "italic" }],
              data: {},
            });
          } else if (child.tagName === "strong" || child.tagName === "b") {
            processedContent.push({
              nodeType: "text",
              value: $(child).text(),
              marks: [{ type: "bold" }],
              data: {},
            });
          } else {
            processedContent.push(...processNode(child));
          }
        }
      });

    return processedContent;
  };

  $("body")
    .children("span")
    .each((_, elem) => {
      const paragraph = {
        nodeType: "paragraph",
        data: {},
        content: processNode(elem),
      };

      if (paragraph.content.length > 0) {
        contentfulRtf.content.push(paragraph);
      }
    });

  return contentfulRtf;
};

const authorIdMap = JSON.parse(fs.readFileSync("./authorIdMap.json", "utf8"));

const convertBlogContentToRtf = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    const blogPosts = JSON.parse(data);

    return blogPosts.map((post) => {
      // Convert the HTML content to Contentful's RTF format
      const contentfulRtf = convertHtmlToContentfulRtf(post.content);

      // Add author ID and migration tag
      return {
        fields: {
          title: {
            "en-US": post.title,
          },
          slug: {
            "en-US": post.title.toLowerCase().split(" ").join("-"),
          },
          date: {
            "en-US": post.date,
          },
          body: {
            "en-US": contentfulRtf,
          },
          person: {
            "en-US": [
              {
                sys: {
                  type: "Link",
                  linkType: "Entry",
                  id: authorIdMap[post.author],
                },
              },
            ],
          },
        },
        metadata: {
          tags: [
            {
              sys: {
                type: "Link",
                linkType: "Tag",
                id: "migration",
              },
            },
          ],
        },
      };
    });
  } catch (error) {
    console.error("Error occurred:", error);
    return [];
  }
};

const filePath = "./blogPosts.json";
const contentfulBlogPosts = convertBlogContentToRtf(filePath);
fs.writeFileSync(
  "contentfulBlogPosts.json",
  JSON.stringify(contentfulBlogPosts, null, 2)
);
console.log(
  "Transformed blog posts have been saved to contentfulBlogPosts.json"
);
