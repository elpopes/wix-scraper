# Wix Scraper

## Overview

The `wix-scraper` project is designed to scrape a Wix blog and transfer its content into a structured JSON format. The ultimate goal is to upload this data to Contentful, facilitating content migration and website updates.

## Purpose

This tool is particularly useful for migrating content from Wix, which does not provide a native export feature for blog posts. By automating the scraping process and formatting the data for Contentful, this scraper streamlines the task of updating a website with existing content.

## Features

- Scrape blog posts from a Wix blog.
- Extract relevant information such as titles, authors, publication dates, and body content.
- Store extracted data in JSON format compatible with Contentful's content structure.
- Automate the process of content migration to Contentful.

## How to Use

1. Clone the repository to your local machine.
2. Install the dependencies with `npm install`.
3. Set up the `.env` file with the necessary Wix URL and Contentful credentials.
4. Run the scraper with `node scraper.js`.
5. The scraper will generate a `data.json` file with all the scraped content.
6. Use the Contentful Management API to upload the content to your Contentful space.

## Setup

1. **Clone the Repository**

   git clone https://github.com/elpopes/wix-scraper.git

   cd wix-scraper

2. **Install Dependencies**

   npm install

3. **Environment Variables**  
   Create a `.env` file in the root of the project and add the following variables:

   - WIX_BLOG_URL=your_wix_blog_url
   - CONTENTFUL_SPACE_ID=your_contentful_space_id
   - CONTENTFUL_DELIVERY_TOKEN=your_contentful_delivery_token

4. **Run the scraper**

   node scraper.js

## Requirements

- Node.js
- npm or yarn
- Access to a Wix blog
- A Contentful space

## Contributing

Contributions to the `wix-scraper` project are welcome. Please ensure that your code adheres to the existing style and that all tests pass before submitting a pull request.

## Contact

For support or contributions, please contact [Lorenzo Tijerina](mailto:lorenzotijerina@gmail.com).
