module.exports = () => ({
  modified: [
    ({ htmlDom: $ }) => $('meta[property="article:modified"]').attr('content'),
  ],
});
