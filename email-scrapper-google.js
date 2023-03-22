const puppeteer = require("puppeteer");

async function searchGoogle(query) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(`https://www.google.com/search?q=${query}`);

  const MAX_PAGES = 5;
  let pageCounter = 1;
  const emails = new Set();

  while (pageCounter <= MAX_PAGES) {
    await page.waitForTimeout(5000);

    // Parse email addresses from the search results
    const emailNodes = await page.$x(
      '//a[starts-with(@href, "mailto:")]/text()'
    );
    for (const node of emailNodes) {
      const email = await node.evaluate((el) => el.textContent.trim());
      if (email !== "") {
        emails.add(email.toLowerCase());
      }
    }

    const nextButton = await page.$("#pnnext");
    if (nextButton) {
      await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle0" }),
        nextButton.click(),
      ]);
      pageCounter++;
    } else {
      break;
    }
  }

  await browser.close();

  // Convert the set of emails to an array and return it
  return Array.from(emails);
}

searchGoogle("Nodejs web scraping")
  .then((emails) => {
    console.log("Parsed emails:");
    console.log(emails);
  })
  .catch((error) => console.error(error));
