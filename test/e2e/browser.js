const puppeteer = require('puppeteer');

class Browser {
  constructor() {
    this.options = {};
    this.browser = {};

    this.test = this.test.bind(this);
  }

  async setUp(done) {
    try {
      this.browser = await puppeteer.launch(this.options.puppeteer);
      done();
    } catch (err) {
      throw err;
    }
  }

  setOptions(options) {
    this.options = options;
  }

  test(promise) {
    return (done) => {
      promise(this.browser, this.options)
        .then(() => {
          done();
        })
        .catch((err) => {
          done(err);
        });
    };
  }
}

module.exports = new Browser();

