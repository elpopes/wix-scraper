export const cleanContent = (htmlContent) => {
  // Remove all style and script tags
  htmlContent = htmlContent.replace(/<style.*?>.*?<\/style>/gis, "");
  htmlContent = htmlContent.replace(/<script.*?>.*?<\/script>/gis, "");

  // Convert spans with italic styling to <em>
  htmlContent = htmlContent.replace(
    /<span[^>]*style=["'][^"']*font-style:\s*italic[^"']*["'][^>]*>((.|\n)*?)<\/span>/gis,
    "<em>$1</em>"
  );

  // Remove nested <span> tags within <em> tags
  htmlContent = htmlContent.replace(
    /<em>((.|\n)*?)<\/span><\/em>/gis,
    "<em>$1</em>"
  );

  // Remove inline styles and class attributes
  htmlContent = htmlContent.replace(
    /<span[^>]*style=["'][^"']*["'][^>]*>((.|\n)*?)<\/span>/gis,
    "$1"
  );
  htmlContent = htmlContent.replace(
    /<span[^>]*class=["'][^"']*["'][^>]*>((.|\n)*?)<\/span>/gis,
    "$1"
  );

  // Remove all remaining span tags but keep their content
  htmlContent = htmlContent.replace(/<span[^>]*>((.|\n)*?)<\/span>/gis, "$1");

  // Optionally, convert HTML entities like &nbsp; to regular spaces
  htmlContent = htmlContent.replace(/&nbsp;/gi, " ");

  return htmlContent;
};
