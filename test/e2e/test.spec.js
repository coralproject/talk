const {test} = require('./browser');
const {murmur3} = require('murmurhash-js');
const uuid = require('uuid');
const {expect} = require('chai');
const {getEmbedStream} = require('./utils/frame');

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

  it('posts a comment', test(async (browser, {url}, typeDelay) => {
    const page = await browser.newPage();
    
    await page.goto(url, {
      waitUntil: 'networkidle'
    });

    const embedStream = await getEmbedStream(page.mainFrame());
    
    // Going to the embed stream url
    await page.goto(embedStream.url(), {
      waitUntil: 'networkidle'
    });

    await page.waitForSelector('#commentText');
    await page.focus('#commentText');
    await page.type('This is a test comment', {delay: typeDelay});
    
    // Posting Comment
    await page.click('.talk-plugin-commentbox-button');
  }));
});
