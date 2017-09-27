const {test} = require('./browser');
const {murmur3} = require('murmurhash-js');
const uuid = require('uuid');
const {getEmbedStream} = require('./utils/frame');
const {expect} = require('chai');

describe('Stream', () => {

  it('creates a new asset', test(async (browser, {opts: {url}}) => {
    const rHash = murmur3(uuid.v4());
    const page = await browser.newPage();
    await page.goto(`${url}/assets/title/test-${rHash}`, {waitUntil: 'networkidle'});
  }));

  it('goes to the embed iframe',  test(async (browser, _, context) => {
    const page = browser.currentPage;
    const embedStream = await getEmbedStream(page.mainFrame());

    // Set the embedStream
    const embedStreamUrl = embedStream.url();
    context.setData({embedStreamUrl});
    
    // TODO: (bc) CHANGE WHEN THIS ISSUE IS SOLVED: https://github.com/GoogleChrome/puppeteer/issues/684
    // Going to the embed stream url
    await page.goto(embedStreamUrl, {
      waitUntil: 'networkidle'
    });

    expect(page.url()).to.equal(embedStreamUrl);
  }));

  it('not logged in user clicks my profile tab', test(async (browser, {$}) => {
    const page = browser.currentPage;

    await page.click($.Stream.myProfileTab);
    await page.waitForSelector($.Stream.tabContent);
    const notLoggedInMessage = await page.waitForSelector($.Stream.notLoggedInMessage);

    expect(notLoggedInMessage).to.be.undefined;
  }));

  it('creates an user and logs in', test(async (browser, {opts: {url, typeDelay}, $, data}) => {
    const rHash = murmur3(uuid.v4());

    const formData = {
      email: `test_${rHash}@test.test`,
      username: `test${rHash}`,
      password: `testpassword${rHash}`
    };

    const page = await browser.currentPage;
    await page.goto(url, {waitUntil: 'networkidle'});

    await page.goto('http://localhost:3000/embed/stream/login');
    await page.click('#coralRegister');
    await page.focus('#signInDialog #email');
    await page.type(formData.email, {delay: typeDelay});
    await page.focus('#signInDialog #username');
    await page.type(formData.username, {delay: typeDelay});
    await page.focus('#password');
    await page.type(formData.password, {delay: typeDelay});
    await page.focus('#confirmPassword');
    await page.type(formData.password, {delay: typeDelay});
    await page.click('#coralSignUpButton');
    await page.waitForSelector('#coralLogInButton');
    await page.click('#coralLogInButton');
    
    await page.goto(data.embedStreamUrl, {waitUntil: 'networkidle'});

    const username = await page.waitForSelector($.Stream.authUserboxUsername);
    expect(username).to.equal(formData.username);
  }));

  it('posts a comment', test(async (browser, {opts: {typeDelay}}) => {
    const page = await browser.currentPage;

    await page.waitForSelector('#commentText');
    await page.focus('#commentText');
    await page.type('This is a test comment', {delay: typeDelay});
    
    // Posting Comment
    await page.click('.talk-plugin-commentbox-button');
  }));
});
