import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

// Function to perform the web scraping
async function scrapeLinks(query) {
    let driver = await new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options()).build();
    
    try {
        // Navigate to Google with the search query
        let searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        await driver.get(searchUrl);

        // Wait for the search results to load
        await driver.wait(until.elementLocated(By.css('div#search')), 10000);

        // Extract all the result links
        let links = await driver.findElements(By.css('div#search a'));
        let urls = [];
        
        for (let link of links) {
            let url = await link.getAttribute('href');
            urls.push(url);
        }

        // Output the extracted URLs
        console.log(`Links for the query "${query}":`);
        urls.forEach(url => console.log(url));

        // Scrape data from each extracted link
        for (let url of urls) {
            await scrapeDataFromLink(driver, url);
        }

    } catch (error) {
        console.error('Error occurred:', error);
    } finally {
        // Close the browser
        await driver.quit();
    }
}

// Function to scrape data from each link
async function scrapeDataFromLink(driver, url) {
    try {
        // Navigate to the URL
        await driver.get(url);
        
        // Wait for the page to load (you can adjust the selector as needed)
        await driver.wait(until.elementLocated(By.css('body')), 10000);
        
        // Example: Extract the title and some specific data
        let title = await driver.getTitle();
        let content = await driver.findElement(By.css('body')).getText(); // Extract all text for demonstration

        // Output the extracted data
        console.log(`Data from ${url}:`);
        console.log(`Title: ${title}`);
        console.log(`Content Preview: ${content.substring(0, 100)}...`); // Print first 200 characters

    } catch (error) {
        console.error(`Error scraping data from ${url}:`, error);
    }
}

// Execute the function with a specific search query
let query = 'cyber threats incidents site:nciipc.gov.in OR site:gov.in'; // Modify as needed
scrapeLinks(query);