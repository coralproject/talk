const puppeteer = require('puppeteer');

class Browser {
  constructor() {
    this.options = {};
    this.browser = {};

    this.test = this.test.bind(this);
  }

  async setUp(done) {
    try {
      this.browser = await puppeteer.launch(this.options);
      done();
    } catch (err) {
      throw err;
    }
  }

  setOptions(opts) {
    this.options = opts;
  }

  test(promise) {
    return (done) => {
      promise(this.browser, this.options)
        .then(() => {
          done();
        })
        .catch(() => {
          done();
        });
    };
  }
}

module.exports = new Browser();

