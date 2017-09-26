const {test} = require('./browser');

describe('Stream', () => {
  it('post a comment', test(async (browser) => {
    const page = await browser.newPage();

    await page.goto('https://coralproject.net');
    await page.screenshot({path: 'screenshot.png'});
    
    await browser.close();
  }));
});
