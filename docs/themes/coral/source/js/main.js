/* global $:true, hljs: true, Clipboard:true, docsearch:true, Coral:true */
/* eslint-env browser */

$(document).ready(function() {
  // Setup the highlighting.
  hljs.initHighlighting();

  // Setup code copying.
  $('pre:not(.no-copy)').each(function() {
    var button = $(
      '<button type="button" class="copy-to-clipboard" aria-hidden="true">Copy</button>'
    );
    $(this).prepend(button);
  });

  // Setup the clipboard links.
  var clipboard = new Clipboard('.copy-to-clipboard', {
    text: function(t) {
      return t.nextElementSibling.innerText;
    },
  });
  clipboard.on('success', function(target) {
    target.clearSelection(),
      (target.trigger.textContent = 'Copied to clipboard'),
      setTimeout(function() {
        target.trigger.textContent = 'Copy';
      }, 2e3);
  });

  // Setup the menu controls.
  $('a.sidebar__header:not(.sidebar__header__link)').on('click', function(e) {
    e.preventDefault();
    $('.sidebar__section.toggled').removeClass('toggled');
    $(this)
      .parents('.sidebar__section')
      .addClass('toggled');
  });
  $('#sidebar-toggle, .sidebar__backdrop').on('click', function(e) {
    e.preventDefault();
    $('body, .sidebar').toggleClass('sidebar--toggled');
  });

  // Setup header controls for the search bar.
  $('#search-input').on('focus', function() {
    $('.header').addClass('header--toggled');
  });
  $('#search-input').on('blur', function() {
    $('.header').removeClass('header--toggled');
  });

  // Setup the search control.
  docsearch({
    apiKey: '259b9f08146e7407341fa04498544ad6',
    indexName: 'coralproject',
    inputSelector: '#search-input',
    debug: false,
  });

  if ($('.demo').length > 0) {
    var embedScriptLoaded = false;
    function loadEmbedScript(callback) {
      if (!embedScriptLoaded) {
        $.getScript({
          url: 'http://127.0.0.1:3000/embed.js',
          dataType: 'script',
        })
          .done(function() {
            embedScriptLoaded = true;
            callback();
          })
          .fail(function(err) {
            callback(err);
          });
      }

      return null;
    }

    var embed = null;
    function loadEmbed() {
      if (embedScriptLoaded && embed === null) {
        // Unhide the mount.
        $('.demo .mount').show();

        var el = $('.demo .mount')[0];

        embed = Coral.Talk.render(el, { talk: 'http://127.0.0.1:3000/' });

        $('.demo .alert')
          .show()
          .html(
            'Demo is running below from your local Talk installation running at <a href="http://127.0.0.1:3000/" target="_blank">http://127.0.0.1:3000/</a>. Go ahead and comment!'
          )
          .removeClass('alert-warning alert-info')
          .addClass('alert-success');
        $('.demo button')
          .off('click')
          .on('click', removeEmbed)
          .text('Stop Demo');
      }
    }

    function removeEmbed() {
      if (embed !== null) {
        embed.remove();
        embed = null;
        $('.demo .mount').hide();
        $('.demo .alert').hide();
        $('.demo button')
          .off('click')
          .text('Start Demo')
          .on('click', loadEmbed);
      }
    }

    function demoCycle(firstRun) {
      loadEmbedScript(function(err) {
        if (err) {
          if (firstRun !== true) {
            $('.demo .alert')
              .show()
              .html(
                'Can\'t load your embed.js script from  your local Talk installation running at <a href="http://127.0.0.1:3000/" target="_blank">http://127.0.0.1:3000/</a>, ensure the server is running and try again.'
              )
              .addClass('alert-warning');
          }
          return;
        }

        if (firstRun === true) {
          $('.demo .alert')
            .show()
            .html(
              'We\'ve loaded your embed.js from your local Talk installation running at <a href="http://127.0.0.1:3000/" target="_blank">http://127.0.0.1:3000/</a>, click Start Demo to embed Talk on the page from your local instance.'
            )
            .removeClass('alert-warning')
            .addClass('alert-info');
          $('.demo button')
            .off('click')
            .text('Start Demo')
            .on('click', loadEmbed);
        } else {
          $('.demo button').off('click');
          loadEmbed();
        }
      });
    }

    // // Run the cycle now.
    // demoCycle(true);

    // Initially bind the loadEmbedScript handler. We'll replace this with the
    // loadEmbed handler when the script is loaded.
    $('.demo button').on('click', demoCycle);
  }

  $('table').addClass('table table-striped');
});
