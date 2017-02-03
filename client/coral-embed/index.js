/* eslint-disable no-var, prefer-template */
/**
 * @file Exposes the main 'window.Coral.Talk' API that developers can use to
 * render Talk streams in their webpages
 * @todo Currently implemented to be included directly via <script> tag
 * (including copypasta dependencies like pym.js), but later there will be a
 * build step and this code may use import statements 
 */
// using umd.js (https://github.com/umdjs/umd/blob/master/templates/returnExports.js)
(function (root, factory) {
  /* eslint-disable */
  if (typeof define === 'function' && define.amd) {

    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {

    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {

    // Browser globals (root is window)
    root.Coral = factory();
  }
  /* eslint-enable */
}(this, function () {

  // This function should return value of window.Coral
  var pym = requirePym();
  var Coral = {};
  var Talk = Coral.Talk = {};

  /**
   * Render a Talk stream
   * @param {HTMLElement} el - Element to render the stream in
   * @param {Object} opts - Configuration options for talk
   * @param {String} opts.talk - Talk base URL
   * @param {String} [opts.title] - Title of Stream (rendered in iframe)
   * @param {String} [opts.asset] - parent Asset ID or URL. Comments in the
   * stream will replies to this asset
   */
  Talk.render = function (el, opts) {
    if ( ! el) {
      throw new Error('Please provide Coral.Talk.render() the HTMLElement you want to render Talk in.');
    }
    if (typeof el !== 'object') {
      throw new Error('Coral.Talk.render() expected HTMLElement but got ' + el + ' (' + typeof el + ')');
    }
    opts = opts || {};

    // @todo infer this URL without explicit user input (if possible, may have to be added at build/render time of this script)
    if (! opts.talk) {
      throw new Error('Coral.Talk.render() expects opts.talk as the Talk Base URL');
    }

    // ensure el has an id, as pym can't directly accept the HTMLElement
    if ( ! el.id) {el.id = '_' + String(Math.random());}
    var asset = opts.asset || window.location;
    var pymParent = new pym.Parent(
      el.id,
      buildStreamIframeUrl(opts.talk, asset),
      {
        title: opts.title,
        asset_url: asset,
        id: el.id + '_iframe',
        name: el.id + '_iframe'
      }
    );

    configurePymParent(pymParent, asset);
  };

  return Coral;

  // build the URL to load in the pym iframe
  function buildStreamIframeUrl(talkBaseUrl, asset) {
    var iframeUrl = [
      talkBaseUrl,
      (talkBaseUrl.match(/\/$/) ? '' : '/'), // make sure no double-'/' if opts.talk already ends with '/'
      'embed/stream?asset_url=',
      encodeURIComponent(asset)
    ].join('');
    return iframeUrl;
  }

  // Set up postMessage listeners/handlers on the pymParent
  // e.g. to resize the iframe, and navigate the host page
  function configurePymParent(pymParent, assetUrl) {
    var notificationOffset = 200;
    var ready = false;

    // Resize parent iframe height when child height changes
    pymParent.onMessage('height', function(height) {

      // TODO: In local testing, this is firing nonstop. Maybe there's a bug on the inside?
      // Or it's by design of pym... but that's very wasteful of CPU and DOM reflows (jank)
      pymParent.el.querySelector('iframe').height = height + 'px';
    });

    // Helps child show notifications at the right scrollTop
    pymParent.onMessage('getPosition', function() {
      var position = viewport().height + document.body.scrollTop;

      if (position > notificationOffset) {
        position = position - notificationOffset;
      }

      pymParent.sendMessage('position', position);
    });

    // Tell child when parent's DOMContentLoaded
    pymParent.onMessage('childReady', function () {
      var interval = setInterval(function () {
        if (ready) {
          window.clearInterval(interval);

          // @todo - It's weird to me that this is sent here in addition to the iframe URL. Could it just be in one place?
          pymParent.sendMessage('DOMContentLoaded', assetUrl);
        }
      }, 100);
    });

    // When end-user clicks link in iframe, open it in parent context
    pymParent.onMessage('navigate', function (url) {
      window.open(url, '_blank').focus();
    });

    // wait till images and other iframes are loaded before scrolling the page.
    // or do we want to be more aggressive and scroll when we hit DOM ready?
    document.addEventListener('DOMContentLoaded', function () {
      ready = true;
    });

    // get dimensions of viewport
    function viewport() {
      var e = window, a = 'inner';
      if ( !( 'innerWidth' in window ) ){
        a = 'client';
        e = document.documentElement || document.body;
      }
      return {
        width : e[a + 'Width'],
        height : e[a + 'Height']
      };
    }
  }

  // return a reference to pym.js
  function requirePym() {
    var pym;

    // fake AMD `define` so that the pym.js copypasta doesn't create a global
    function define(createPym) {
      pym = createPym();
    }
    define.amd = true;

    /* eslint-disable */
    /*! pym.js - v1.1.2 - 2016-10-25 */
    !function(a){"function"==typeof define&&define.amd?define(a):"undefined"!=typeof module&&module.exports?module.exports=a():window.pym=a.call(this)}(function(){var a="xPYMx",b={},c=function(a){var b=new RegExp("[\\?&]"+a.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]")+"=([^&#]*)"),c=b.exec(location.search);return null===c?"":decodeURIComponent(c[1].replace(/\+/g," "))},d=function(a,b){if("*"===b.xdomain||a.origin.match(new RegExp(b.xdomain+"$")))return!0},e=function(b,c,d){var e=["pym",b,c,d];return e.join(a)},f=function(b){var c=["pym",b,"(\\S+)","(.*)"];return new RegExp("^"+c.join(a)+"$")},g=function(){for(var a=b.autoInitInstances.length,c=a-1;c>=0;c--){var d=b.autoInitInstances[c];d.el.getElementsByTagName("iframe").length&&d.el.getElementsByTagName("iframe")[0].contentWindow||b.autoInitInstances.splice(c,1)}};return b.autoInitInstances=[],b.autoInit=function(){var a=document.querySelectorAll("[data-pym-src]:not([data-pym-auto-initialized])"),c=a.length;g();for(var d=0;d<c;++d){var e=a[d];e.setAttribute("data-pym-auto-initialized",""),""===e.id&&(e.id="pym-"+d);var f=e.getAttribute("data-pym-src"),h={xdomain:"string",title:"string",name:"string",id:"string",sandbox:"string",allowfullscreen:"boolean"},i={};for(var j in h)if(null!==e.getAttribute("data-pym-"+j))switch(h[j]){case"boolean":i[j]=!("false"===e.getAttribute("data-pym-"+j));break;case"string":i[j]=e.getAttribute("data-pym-"+j);break;default:console.err("unrecognized attribute type")}var k=new b.Parent(e.id,f,i);b.autoInitInstances.push(k)}return b.autoInitInstances},b.Parent=function(a,b,c){this.id=a,this.url=b,this.el=document.getElementById(a),this.iframe=null,this.settings={xdomain:"*"},this.messageRegex=f(this.id),this.messageHandlers={},c=c||{},this._constructIframe=function(){var a=this.el.offsetWidth.toString();this.iframe=document.createElement("iframe");var b="",c=this.url.indexOf("#");for(c>-1&&(b=this.url.substring(c,this.url.length),this.url=this.url.substring(0,c)),this.url.indexOf("?")<0?this.url+="?":this.url+="&",this.iframe.src=this.url+"initialWidth="+a+"&childId="+this.id+"&parentTitle="+encodeURIComponent(document.title)+"&parentUrl="+encodeURIComponent(window.location.href)+b,this.iframe.setAttribute("width","100%"),this.iframe.setAttribute("scrolling","no"),this.iframe.setAttribute("marginheight","0"),this.iframe.setAttribute("frameborder","0"),this.settings.title&&this.iframe.setAttribute("title",this.settings.title),void 0!==this.settings.allowfullscreen&&this.settings.allowfullscreen!==!1&&this.iframe.setAttribute("allowfullscreen",""),void 0!==this.settings.sandbox&&"string"==typeof this.settings.sandbox&&this.iframe.setAttribute("sandbox",this.settings.sandbox),this.settings.id&&(document.getElementById(this.settings.id)||this.iframe.setAttribute("id",this.settings.id)),this.settings.name&&this.iframe.setAttribute("name",this.settings.name);this.el.firstChild;)this.el.removeChild(this.el.firstChild);this.el.appendChild(this.iframe),window.addEventListener("resize",this._onResize)},this._onResize=function(){this.sendWidth()}.bind(this),this._fire=function(a,b){if(a in this.messageHandlers)for(var c=0;c<this.messageHandlers[a].length;c++)this.messageHandlers[a][c].call(this,b)},this.remove=function(){window.removeEventListener("message",this._processMessage),window.removeEventListener("resize",this._onResize),this.el.removeChild(this.iframe),g()},this._processMessage=function(a){if(d(a,this.settings)&&"string"==typeof a.data){var b=a.data.match(this.messageRegex);if(!b||3!==b.length)return!1;var c=b[1],e=b[2];this._fire(c,e)}}.bind(this),this._onHeightMessage=function(a){var b=parseInt(a);this.iframe.setAttribute("height",b+"px")},this._onNavigateToMessage=function(a){document.location.href=a},this._onScrollToChildPosMessage=function(a){var b=document.getElementById(this.id).getBoundingClientRect().top+window.pageYOffset,c=b+parseInt(a);window.scrollTo(0,c)},this.onMessage=function(a,b){a in this.messageHandlers||(this.messageHandlers[a]=[]),this.messageHandlers[a].push(b)},this.sendMessage=function(a,b){this.el.getElementsByTagName("iframe").length&&(this.el.getElementsByTagName("iframe")[0].contentWindow?this.el.getElementsByTagName("iframe")[0].contentWindow.postMessage(e(this.id,a,b),"*"):this.remove())},this.sendWidth=function(){var a=this.el.offsetWidth.toString();this.sendMessage("width",a)};for(var h in c)this.settings[h]=c[h];return this.onMessage("height",this._onHeightMessage),this.onMessage("navigateTo",this._onNavigateToMessage),this.onMessage("scrollToChildPos",this._onScrollToChildPosMessage),window.addEventListener("message",this._processMessage,!1),this._constructIframe(),this},b.Child=function(b){this.parentWidth=null,this.id=null,this.parentTitle=null,this.parentUrl=null,this.settings={renderCallback:null,xdomain:"*",polling:0},this.timerId=null,this.messageRegex=null,this.messageHandlers={},b=b||{},this.onMessage=function(a,b){a in this.messageHandlers||(this.messageHandlers[a]=[]),this.messageHandlers[a].push(b)},this._fire=function(a,b){if(a in this.messageHandlers)for(var c=0;c<this.messageHandlers[a].length;c++)this.messageHandlers[a][c].call(this,b)},this._processMessage=function(a){if(d(a,this.settings)&&"string"==typeof a.data){var b=a.data.match(this.messageRegex);if(b&&3===b.length){var c=b[1],e=b[2];this._fire(c,e)}}}.bind(this),this._onWidthMessage=function(a){var b=parseInt(a);b!==this.parentWidth&&(this.parentWidth=b,this.settings.renderCallback&&this.settings.renderCallback(b),this.sendHeight())},this.sendMessage=function(a,b){window.parent.postMessage(e(this.id,a,b),"*")},this.sendHeight=function(){var a=document.getElementsByTagName("body")[0].offsetHeight.toString();return this.sendMessage("height",a),a}.bind(this),this.scrollParentTo=function(a){this.sendMessage("navigateTo","#"+a)},this.navigateParentTo=function(a){this.sendMessage("navigateTo",a)},this.scrollParentToChildEl=function(a){var b=document.getElementById(a).getBoundingClientRect().top+window.pageYOffset;this.scrollParentToChildPos(b)},this.scrollParentToChildPos=function(a){this.sendMessage("scrollToChildPos",a.toString())},this._markWhetherEmbedded=function(a){var b,c=document.getElementsByTagName("html")[0],d=c.className;try{b=window.self!==window.top?"embedded":"not-embedded"}catch(a){b="embedded"}d.indexOf(b)<0&&(c.className=d?d+" "+b:b,a&&a(b))},this.remove=function(){window.removeEventListener("message",this._processMessage),this.timerId&&clearInterval(this.timerId)},this.id=c("childId")||b.id,this.messageRegex=new RegExp("^pym"+a+this.id+a+"(\\S+)"+a+"(.*)$");var f=parseInt(c("initialWidth"));this.parentUrl=c("parentUrl"),this.parentTitle=c("parentTitle"),this.onMessage("width",this._onWidthMessage);for(var g in b)this.settings[g]=b[g];return window.addEventListener("message",this._processMessage,!1),this.settings.renderCallback&&this.settings.renderCallback(f),this.sendHeight(),this.settings.polling&&(this.timerId=window.setInterval(this.sendHeight,this.settings.polling)),this._markWhetherEmbedded(b.onMarkedEmbeddedStatus),this},b.autoInit(),b});
    /* eslint-enable */
    return pym;
  }
}));

/*
pym.js LICENSE (https://github.com/nprapps/pym.js/blob/master/LICENSE)
Copyright (c) 2014 NPR

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/
