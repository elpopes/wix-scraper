import cheerio from "cheerio";

export const cleanContent = (htmlContent) => {
  const $ = cheerio.load(htmlContent);

  // Remove all style and script tags
  $("style, script").remove();

  // Iterate over each element and process accordingly
  $("*").each(function () {
    const element = $(this);

    // Convert specific style spans to <em>
    if (
      element.is("span") &&
      element.attr("style") &&
      element.attr("style").includes("font-style: italic")
    ) {
      element.replaceWith($("<em>").html(element.html()));
    }

    // Remove style and class attributes
    element.removeAttr("style");
    element.removeAttr("class");

    // Other specific processing can be added here
  });

  // Return the cleaned HTML
  return $("body").html() || "";
};
