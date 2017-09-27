const puppeteer = require('puppeteer');
const selectors = require('./selectors');

class Browser {
  constructor() {
    this._data = {};
    this._options = {};
    this._browser = {};
    this._selectors = selectors;

    this.setData = this.setData.bind(this);
    this.test = this.test.bind(this);
  }

  setData(newData) {
    this._data = Object.assign({}, this._data, newData);
  }

  async setUp(done) {
    try {
      this.browser = await puppeteer.launch(this._options.puppeteer);

      const newPage = this.browser.newPage.bind(this.browser);

      this.browser.newPage = async function () {
        const page = await newPage();
        this.currentPage = page;
        
        return page;
      };

      done();
    } catch (err) {
      throw err;
    }
  }

  setOptions(options) {
    this._options = options;
  }

  test(promise) {
    return (done) => {
      const loaders = {
        opts: this._options,
        $: this._selectors,
        data: this._data
      };
  
      const context = {
        setData: this.setData
      };

      promise(this.browser, loaders, context)
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

