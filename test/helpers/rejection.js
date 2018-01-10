process.on('unhandledRejection', function(reason, promise) {
  console.error(promise);
});
