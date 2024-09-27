import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

// Function to perform the web scraping
async function scrapeLinks(query) {
    let driver = await new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options()).build();
    
    try {
        // Navigate to Google with the search query
        let searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        await driver.get(searchUrl);

        
        await driver.wait(until.elementLocated(By.css('div#search')), 10000);

        
        let links = await driver.findElements(By.css('div#search a'));
        let urls = [];
        
        for (let link of links) {
            let url = await link.getAttribute('href');
            urls.push(url);
        }

        // Output the extracted Links
        console.log(`Links for the query "${query}":`);
        urls.forEach(url => console.log(url));

        // Function call to extract data from links
        for (let url of urls) {
            await scrapeDataFromLink(driver, url);
        }

    } catch (error) {
        console.error('Error occurred:', error);
    } finally {
        
        await driver.quit();
    }
}

// Function to scrape data from each link
async function scrapeDataFromLink(driver, url) {
    try {
        
        await driver.get(url);
        
        await driver.wait(until.elementLocated(By.css('body')), 10000);
        
       
        let title = await driver.getTitle();
        let content = await driver.findElement(By.css('body')).getText(); 

       
        console.log(`Data from ${url}:`);
        console.log(`Title: ${title}`);
        console.log(`Content Preview: ${content.substring(0, 100)}...`); \

    } catch (error) {
        console.error(`Error scraping data from ${url}:`, error);
    }
}

// Function for runing query for specific results
let query = 'cyber threats incidents site:nciipc.gov.in OR site:gov.in'; 
scrapeLinks(query);
