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

const convertBlogContentToRtf = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    const blogPosts = JSON.parse(data);

    return blogPosts.map((post) => {
      const contentfulRtf = convertHtmlToContentfulRtf(post.content);
      return {
        ...post,
        content: contentfulRtf,
      };
    });
  } catch (error) {
    console.error("Error occurred:", error);
    return [];
  }
};

const filePath = "./blogPosts.json";
const blogPostsInRtf = convertBlogContentToRtf(filePath);
console.log(JSON.stringify(blogPostsInRtf, null, 2));
