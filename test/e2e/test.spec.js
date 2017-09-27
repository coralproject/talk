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
    await browser.close();
  }));
});
