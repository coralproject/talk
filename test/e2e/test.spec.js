const {test} = require('./browser');

describe('Stream', () => {
  it('post a comment', test(async (browser, {url}) => {
    const page = await browser.newPage();

    await page.goto(url);
    await page.screenshot({path: 'screenshot.png'});
    
    await browser.close();
  }));
});
