document.addEventListener('DOMContentLoaded', () => {
  // Get the auth element and parse it as JSON by decoding it.
  const auth = document.getElementById('auth');
  const doc = document.implementation.createHTMLDocument('');
  doc.body.innerHTML = auth.innerText;

  // Set the item in localStorage.
  localStorage.setItem('auth', doc.body.textContent);

  // Close the window.
  setTimeout(() => {
    window.close();
  }, 50);
});
