document.addEventListener('DOMContentLoaded', function(event) {
  localStorage.setItem('auth', document.getElementById('auth').innerText);
  setTimeout(function() { window.close(); }, 50);
});