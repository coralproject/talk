function showError(error) {
  try {
    let err = JSON.parse(error);
    $('.error-console').text(err.message).addClass('active');
  } catch (err) {
    $('.error-console').text(error).addClass('active');
  }
}
