import cheerio from "cheerio";

export const convertHtmlToContentfulRtf = (htmlContent) => {
  const $ = cheerio.load(htmlContent)();
  const contentfulRtf = {
    nodeType: "document",
    data: {},
    content: [],
  };

  $("body")
    .children()
    .each((_, elem) => {
      if (elem.tagName === "p") {
        const paragraph = {
          nodeType: "paragraph",
          data: {},
          content: [],
        };

        $(elem)
          .contents()
          .each((_, child) => {
            if (child.type === "text") {
              paragraph.content.push({
                nodeType: "text",
                value: $(child).text(),
                marks: [],
                data: {},
              });
            } else if (child.tagName === "em" || child.tagName === "i") {
              paragraph.content.push({
                nodeType: "text",
                value: $(child).text(),
                marks: [{ type: "italic" }],
                data: {},
              });
            } // Add more conditions for other tags like 'strong', 'a', etc.
          });

        contentfulRtf.content.push(paragraph);
      }
      // Add more conditions for other container tags like 'ul', 'ol', 'h1', etc.
    });

  return contentfulRtf;
};
