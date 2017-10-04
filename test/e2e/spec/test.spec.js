const {test} = require('../browser');
const uuid = require('uuid');
const {murmur3} = require('murmurhash-js');
const {getEmbedStream} = require('../utils/frame');
const {expect} = require('chai');

describe('Embed Stream', () => {

  it('creates a new asset', test(async (browser, {opts: {url}}) => {
    const rHash = murmur3(uuid.v4());
    const page = await browser.newPage();
    const assetTitle = `test@${rHash}`;
    await page.goto(`${url}/assets/title/${assetTitle}`, {waitUntil: 'networkidle'});

    // Checking asset title
    const pageTitle = await page.title();
    expect(pageTitle).to.equal(assetTitle);
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
    
    // The URLs should match
    expect(page.url()).to.equal(embedStreamUrl);
  }));

  it('not logged in user clicks my profile tab', test(async (browser, {$}) => {
    const page = browser.currentPage;

    // Clicking profile tab
    const profileTab = await page.$($.Stream.myProfileTab);
    expect(profileTab).to.not.equal(null);
    await profileTab.click();

    await page.waitForSelector($.Stream.tabContent);

    // Not signed in users should get not-logged-in messages
    const notLoggedInMessage = await page.waitForSelector($.Stream.notLoggedInMessage);
    expect(notLoggedInMessage).to.not.equal(null);
  }));

  it('creates an user and user logs in', test(async (browser, {opts: {url, typeDelay}, $, data}) => {
    const page = await browser.currentPage;
    const rHash = murmur3(uuid.v4());
    const formData = {
      email: `test_${rHash}@test.test`,
      username: `test${rHash}`,
      password: `testpassword${rHash}`
    };

    // Go to Login View
    await page.goto(`${url}/embed/stream/login`, {waitUntil: 'networkidle'});
    
    // Click Register
    await page.click($.Login.register);
    await page.focus($.Login.emailField);

    // Filling the form
    await page.type(formData.email, {delay: typeDelay});
    await page.focus($.Login.usernameField);
    await page.type(formData.username, {delay: typeDelay});
    await page.focus($.Login.passwordField);
    await page.type(formData.password, {delay: typeDelay});
    await page.focus($.Login.confirmPasswordField);
    await page.type(formData.password, {delay: typeDelay});

    // Clicking Sign-Up
    await page.click($.Login.signUpButton);

    // Clicking Login
    await page.waitForSelector($.Login.loginButton);
    await page.click($.Login.loginButton);
    await page.waitForNavigation({waitUntil: 'networkidle'});

    // Going to the Embed Stream
    await page.goto(data.embedStreamUrl, {waitUntil: 'networkidle', networkIdleTimeout: 3000});

    // Checking logged-in Username
    const userBoxEl = await page.waitForSelector($.Stream.authUserboxUsername);
    const username = await page.evaluate((el) => el.textContent, userBoxEl);
    expect(userBoxEl).to.not.equal(null);
    expect(username).to.equal(formData.username);
  }));

  it('user posts a comment', test(async (browser, {opts: {typeDelay}, $}) => {
    const page = await browser.currentPage;
    const testData = {body: 'This is a test comment'};

    await page.waitForSelector($.Stream.commentBoxTextarea);
    await page.focus($.Stream.commentBoxTextarea);
    await page.type(testData.body, {delay: typeDelay});
    
    // Posting Comment
    await page.click($.Stream.commentBoxPostButton);
    await page.waitForNavigation({waitUntil: 'networkidle'});

    // Check if comment was posted
    const firstCommentHandle = await page.$($.Stream.firstCommentContent);
    expect(firstCommentHandle).to.not.equal(null);

    const firstCommentContent = await page.evaluate((el) => el.textContent, firstCommentHandle);
    expect(firstCommentContent).to.equal(testData.body);
  }));

  it('signed in user sees comment history', test(async (browser, {$}) => {
    const page = await browser.currentPage;
    await page.click($.Stream.myProfileTab);
    await page.waitForNavigation({waitUntil: 'networkidle'});
    await page.waitForSelector($.Stream.tabContent);
    const testData = {body: 'This is a test comment'};

    // Checking if Comment History exists
    const myCommentHistory = await page.$($.MyProfile.myCommentHistory);
    expect(myCommentHistory).to.not.equal(null);
    
    // Checking if the body of the comment matches
    const firstCommentHandle = await page.$($.MyProfile.myCommentHistoryComment);
    const firstCommentContent = await page.evaluate((el) => el.textContent, firstCommentHandle);
    expect(firstCommentContent).to.equal(testData.body);
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
    const reactionsCount = await page.evaluate((el) => el.innerText, reactionsCountHandle);
    expect(reactionsCount).to.equal('0');
  }));

  it('user goes to the stream and replies and reacts to comment', test(async (browser, {$}) => {
    const page = await browser.currentPage;

    await page.click($.Stream.streamTab);
    await page.waitForNavigation({waitUntil: 'networkidle'});
    await page.waitForSelector($.Stream.tabContent);
    
    // Like first comment
    const likeButton = await page.$($.Stream.likeButton);
    expect(likeButton).to.not.equal(null);
    likeButton.click();

    // Go to the profile Tab
    await page.click($.Stream.myProfileTab);
    await page.waitForNavigation({waitUntil: 'networkidle'});
    await page.waitForSelector($.Stream.tabContent);

    // Check my Comment history
    const myCommentHistory = await page.$($.MyProfile.myCommentHistory);
    expect(myCommentHistory).to.not.equal(null);
    
    // Check for Reactions
    const reactions = await page.$($.MyProfile.myCommentHistoryReactions);
    expect(reactions).to.not.equal(null);

    // Check for Reactions Count
    const reactionsCountHandle = await page.$($.MyProfile.myCommentHistoryReactionCount);
    expect(reactionsCountHandle).to.not.equal(null);

    // Check number of Reactions
    const reactionsCount = await page.evaluate((el) => el.innerText, reactionsCountHandle);
    expect(reactionsCount).to.equal('1');

  }));
});
