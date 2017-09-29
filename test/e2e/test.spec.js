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

    // Assertions
    // Test the asset title?
  }));

  it('goes to the embed iframe',  test(async (browser, _, context) => {
    const page = browser.currentPage;
    const embedStream = await getEmbedStream(page.mainFrame());

    // Set the embedStream
    const embedStreamUrl = embedStream.url();
    context.setData({embedStreamUrl});
    
    // TODO: (bc) CHANGE WHEN THIS ISSUE IS SOLVED: https://github.com/GoogleChrome/puppeteer/issues/684
    // Going to the embed stream url
    await page.goto(embedStreamUrl, {waitUntil: 'networkidle'});
    
    // Assertions
    expect(page.url()).to.equal(embedStreamUrl);
  }));

  it('not logged in user clicks my profile tab', test(async (browser, {$}) => {
    const page = browser.currentPage;

    const profileTab = await page.$($.Stream.myProfileTab);
    expect(profileTab).to.not.equal(null);
    await profileTab.click();

    await page.waitForSelector($.Stream.tabContent);

    const notLoggedInMessage = await page.waitForSelector($.Stream.notLoggedInMessage);
    expect(notLoggedInMessage).to.be.undefined;
  }));

  it('creates an user and user logs in', test(async (browser, {opts: {url, typeDelay}, $, data}) => {
    const rHash = murmur3(uuid.v4());

    const formData = {
      email: `test_${rHash}@test.test`,
      username: `test${rHash}`,
      password: `testpassword${rHash}`
    };

    const page = await browser.currentPage;

    await page.goto('http://localhost:3000/embed/stream/login', {waitUntil: 'networkidle'});
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
    await page.waitForNavigation({waitUntil: 'networkidle'});

    await page.goto(data.embedStreamUrl, {waitUntil: 'networkidle', networkIdleTimeout: 3000});

    const userBoxEl = await page.waitForSelector($.Stream.authUserboxUsername);
    expect(userBoxEl).to.not.equal(null);
  }));

  it('user posts a comment', test(async (browser, {opts: {typeDelay}}) => {
    const page = await browser.currentPage;

    await page.waitForSelector('#commentText');
    await page.focus('#commentText');
    await page.type('This is a test comment', {delay: typeDelay});
    
    // Posting Comment
    await page.click('.talk-plugin-commentbox-button');
    await page.waitForNavigation({waitUntil: 'networkidle'});

    // Assertions
  }));

  it('signed in user sees comment history', test(async (browser, {$, data}) => {
    const page = await browser.currentPage;
    await page.click($.Stream.myProfileTab);
    await page.waitForNavigation({waitUntil: 'networkidle'});
    await page.waitForSelector('#talk-embed-stream-tab-content');

    const myCommentHistory = await page.$($.MyProfile.myCommentHistory);

    expect(myCommentHistory).to.not.equal(null);
  }));

  it('user sees replies and reactions to comments', test(async (browser, {$}) => {
    const page = await browser.currentPage;

    await page.waitForSelector($.MyProfile.myCommentHistory);

    // Check for Reactions
    const reactions = await page.$($.MyProfile.myCommentHistoryReactions);
    expect(reactions).to.not.equal(null);

    // Check for Reactions Count
    const reactionsCountHandle = await page.$($.MyProfile.myCommentHistoryReactionCount);
    expect(reactionsCountHandle).to.not.equal(null);

    // Check number of Reactions
    const reactionsCount = await page.evaluate(el => el.innerText, reactionsCountHandle);
    expect(reactionsCount).to.equal('0');
  }));

  it('user goes to the stream and replies and reacts to comment', test(async (browser, {$}) => {
    const page = await browser.currentPage;

    await page.click($.Stream.streamTab);
    await page.waitForNavigation({waitUntil: 'networkidle'});
    await page.waitForSelector('#talk-embed-stream-tab-content');
    
    // Like first comment
    const likeButton = await page.$($.Stream.likeButton);
    expect(likeButton).to.not.equal(null);
    likeButton.click();

    // Go to the profile Tab
    await page.click($.Stream.myProfileTab);
    await page.waitForNavigation({waitUntil: 'networkidle'});
    await page.waitForSelector('#talk-embed-stream-tab-content');

    const myCommentHistory = await page.$($.MyProfile.myCommentHistory);

  }));

  // it('user can visit story link', test(async (browser, {opts: {typeDelay}}) => {
  //   const page = await browser.currentPage;
  // }));

  // it('user can view a conversation', test(async (browser, {opts: {typeDelay}}) => {
  //   const page = await browser.currentPage;
  // }));
});
