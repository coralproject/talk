/* global lunr */
/* eslint-env browser */

// Sourced from https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// Sourced from https://github.com/hexojs/site/blob/8e8ed4901769abbf76263125f82832df76ced58b/themes/navy/source/js/plugins.js.
(function() {
  'use strict';

  var elements = document.getElementsByClassName('plugin');
  var $count = document.getElementById('plugin-list-count');
  var $input = document.getElementById('plugin-search-input');
  var elementLen = elements.length;
  var index = lunr.Index.load(window.SEARCH_INDEX);

  function updateCount(count) {
    $count.innerHTML = count + (count === 1 ? ' plugin' : ' plugins');
  }

  function addClass(elem, className) {
    var classList = elem.classList;

    if (!classList.contains(className)) {
      classList.add(className);
    }
  }

  function removeClass(elem, className) {
    var classList = elem.classList;

    if (classList.contains(className)) {
      classList.remove(className);
    }
  }

  function search(value) {
    var result = index.search('*' + value + '* ' + value);
    var len = result.length;
    var selected = {};
    var i = 0;

    for (i = 0; i < len; i++) {
      selected[result[i].ref] = true;
    }

    for (i = 0; i < elementLen; i++) {
      if (selected[i]) {
        addClass(elements[i], 'd-block');
      } else {
        removeClass(elements[i], 'd-block');
      }
    }

    updateCount(len);
  }

  function displayAll() {
    for (var i = 0; i < elementLen; i++) {
      addClass(elements[i], 'd-block');
    }

    updateCount(elements.length);
  }

  var searchParam = getParameterByName('q');
  if (searchParam && searchParam.length > 0) {
    $input.value = searchParam;
    search(searchParam);
  }

  $input.addEventListener('input', function() {
    var value = this.value;

    if (!value) return displayAll();
    search(value);
  });
})();
