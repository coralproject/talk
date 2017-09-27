const {test} = require('./browser');
const {murmur3} = require('murmurhash-js');
const uuid = require('uuid');

describe('Stream', () => {

  it('creates an user and logs in', test(async (browser, {url, typeDelay}) => {
    const rHash = murmur3(uuid.v4());
    const testData = {
      email: `test_${rHash}@test.test`,
      username: `test${rHash}`,
      password: `testpassword${rHash}`
    };

    const page = await browser.newPage();
    await page.goto(url, {waitUntil: 'networkidle'});

    // TODO (bc) handle the popup if possible
    // const frames = await page.frames();
    // const embedStreamIframe = frames.find((f) => f.name() === 'coralStreamEmbed_iframe');
  
    // const signInButton = await embedStreamIframe.$('#coralSignInButton');
    // signInButton.click();

    await page.goto('http://localhost:3000/embed/stream/login');
    await page.click('#coralRegister');
    await page.focus('#signInDialog #email');
    await page.type(testData.email, {delay: typeDelay});
    await page.focus('#signInDialog #username');
    await page.type(testData.username, {delay: typeDelay});
    await page.focus('#password');
    await page.type(testData.password, {delay: typeDelay});
    await page.focus('#confirmPassword');
    await page.type(testData.password, {delay: typeDelay});
    await page.click('#coralSignUpButton');
    await page.waitForSelector('#coralLogInButton');
    await page.click('#coralLogInButton');
  }));

  it('posts a comment', test(async (browser, {url}) => {
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: 'networkidle'});

    const embed = await getEmbed(page.mainFrame());

    function getEmbed(frame) {
      if (frame.name() !== 'coralStreamEmbed_iframe') {
        for (let child of frame.childFrames()) {
          getEmbed(child);
        }
      }
      return frame;
    }

    const myProfileTab = await embed.$('.talk-embed-stream-profile-tab');
    await myProfileTab.click();

    console.log(myProfileTab);

    embedStreamIframe.waitForSelector('.talk-embed-stream-profile-tab');
    console.log(embedStreamIframe);

    const myProfileTab = await embedStreamIframe.$('.talk-embed-stream-profile-tab');
    await myProfileTab.click();

    console.log(embedStreamIframe);

    await browser.close();
  

    // Focusing the comment box
    await embedStreamIframe.waitForSelector('#commentText');
    await embedStreamIframe.focus('#commentText');
    await embedStreamIframe.type('This is a test comment', {delay: typeDelay});
    expect(await embedStreamIframe.evaluate((result) => result)).toBe('This is a test comment');
    
    // Posting Comment
    await embedStreamIframe.click('.talk-plugin-commentbox-button');

  }));
});
