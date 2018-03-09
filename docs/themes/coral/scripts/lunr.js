/* global hexo */

const lunr = require('lunr');
const { sortBy, assign } = require('lodash');

// Based on https://github.com/hexojs/site/blob/8e8ed4901769abbf76263125f82832df76ced58b/scripts/helpers.js#L121-L134
hexo.extend.helper.register('lunr_index', data => {
  const index = lunr(function() {
    this.field('name', { boost: 10 });
    this.field('description');
    this.field('tags', { boost: 50 });
    this.ref('id');

    sortBy(data, 'name').forEach((item, i) => {
      this.add(assign({ id: i }, item));
    });
  });

  return JSON.stringify(index);
});
