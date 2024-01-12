import fs from "fs";

function splitHtmlContent(htmlContent, chunkSize) {
  console.log("Starting to split HTML content into chunks...");
  const chunks = [];
  let startIndex = 0;
  let endIndex = 0;

  while (startIndex < htmlContent.length) {
    endIndex = startIndex + chunkSize;
    if (endIndex > htmlContent.length) {
      endIndex = htmlContent.length;
    } else {
      // Find the nearest end of the tag to avoid splitting in the middle of a tag
      const lastTagClose = htmlContent.lastIndexOf(">", endIndex);
      endIndex = lastTagClose + 1;
    }

    // Check if startIndex and endIndex are the same, which indicates no progress
    if (startIndex === endIndex) {
      console.log("No further chunks can be created. Breaking the loop.");
      break;
    }

    chunks.push(htmlContent.substring(startIndex, endIndex));
    startIndex = endIndex;
    console.log(`Chunk created: ${startIndex} to ${endIndex}`);
  }

  console.log("Completed splitting HTML content.");
  return chunks;
}

// Read the HTML file
const filePath = "./scrapedContent.html";
console.log(`Reading HTML file from ${filePath}...`);
const htmlContent = fs.readFileSync(filePath, "utf8");
console.log("File read successfully.");

// Split the content into chunks
const chunks = splitHtmlContent(htmlContent, 2500);

// Write each chunk to a new file
chunks.forEach((chunk, index) => {
  const chunkFilePath = `./chunk_${index + 1}.html`;
  console.log(`Writing Chunk ${index + 1} to file...`);
  fs.writeFileSync(chunkFilePath, chunk);
  console.log(`Chunk ${index + 1} written to ${chunkFilePath}`);
});

console.log("All chunks have been written to files.");
