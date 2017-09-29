const puppeteer = require('puppeteer');

// http://localhost:3000/embed/stream?asset_url=http%3A%2F%2Flocalhost%3A3000%2Fassets%2Ftitle%2Ftest-1090695766&initialWidth=500&childId=coralStreamEmbed&parentTitle=test%201090695766&parentUrl=http%3A%2F%2Flocalhost%3A3000%2Fassets%2Ftitle%2Ftest-1090695766

const url = "http://localhost:3000/embed/stream?asset_url=http%3A%2F%2Flocalhost%3A3000%2Fassets%2Ftitle%2Ftest-1090695766&initialWidth=500&childId=coralStreamEmbed&parentTitle=test%201090695766&parentUrl=http%3A%2F%2Flocalhost%3A3000%2Fassets%2Ftitle%2Ftest-1090695766";
puppeteer.launch({
    headless: false,
    slowMo: 200
}).then(async browser => {
  const page = await browser.newPage();

  try {
    await page.goto(url, {waitUntil: 'networkidle'});
    
    const body = await page.$('#talk-embed-stream-container li.talk-tab.talk-embed-stream-profile-tab > button');
    await body.click();

    // await page.click('');
    // await page.waitForSelector($.Stream.tabContent);
    
    // const notLoggedInMessage = await page.waitForSelector($.Stream.notLoggedInMessage);
    // expect(notLoggedInMessage).to.be.null;
    
    // const myCommentHistory = await page.waitForSelector($.MyProfile.myCommentHistory);
    // expect(myCommentHistory).to.not.null;

    console.log(body);
  } catch (err) {
    console.log(err);
  }

  await browser.close();
});