module.exports = (perspective) => {
  console.log("hello world from perpsctive");
  if(!process.env.PERSPECTIVE_API_KEY) {
    throw new Error('Please set the PERSPECTIVE_API_KEY environment variable to use the toxic-comments plugin. Visit https://www.perspectiveapi.com/ to request API access.');
  }
}
