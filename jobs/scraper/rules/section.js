module.exports = () => ({
  section: [
    ({ htmlDom: $ }) => $('meta[property="article:section"]').attr('content'),
  ],
});
