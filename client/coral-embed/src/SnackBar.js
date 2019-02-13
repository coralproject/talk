const DEFAULT_STYLE = {
  position: 'fixed',
  cursor: 'default',
  userSelect: 'none',
  backgroundColor: '#323232',
  zIndex: 3,
  willChange: 'transform, opacity',
  transition: 'transform .35s cubic-bezier(.55,0,.1,1), opacity .35s',
  pointerEvents: 'none',
  padding: '12px 18px 0',
  color: '#fff',
  borderRadius: '4px',
  maxWidth: '400px',
  left: '50%',
  opacity: 0,
  transform: 'translate(-50%, 20px)',
  bottom: '20px',
  boxSizing: 'border-box',
  fontFamily: 'Helvetica, "Helvetica Neue", Verdana, sans-serif',
  display: 'flex',
};

const CLOSE_STYLE = {
  fontSize: '20px',
  cursor: 'pointer',
  marginLeft: '10px',
  position: 'relative',
  top: '-4px',
};

export default class Snackbar {
  constructor(customStyle = {}) {
    this.timeout = null;
    this.el = document.createElement('div');
    this.el.id = 'coral-notif';

    const closeButton = document.createElement('div');
    closeButton.className = 'coral-notif-close';
    for (let key in CLOSE_STYLE) {
      closeButton.style[key] = CLOSE_STYLE[key];
    }
    closeButton.textContent = '×';
    closeButton.onclick = () => this.clear();

    this.snackbarText = document.createElement('div');
    this.snackbarText.className = 'coral-notif-text';
    this.snackbarText.style.paddingBottom = '12px';
    this.el.appendChild(this.snackbarText);
    this.el.appendChild(closeButton);

    // Apply custom styles to the snackbar.
    const style = Object.assign({}, DEFAULT_STYLE, customStyle);
    for (let key in style) {
      this.el.style[key] = style[key];
    }
  }

  clear() {
    this.el.style.opacity = 0;
    this.el.style.pointerEvents = 'none';
  }

  alert(message) {
    const { type, text } = JSON.parse(message);
    this.el.style.transform = 'translate(-50%, 20px)';
    this.el.style.opacity = 0;
    this.el.className = `coral-notif-${type}`;
    this.snackbarText.textContent = text;

    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      this.el.style.transform = 'translate(-50%, 0)';
      this.el.style.opacity = 1;
      this.el.style.pointerEvents = 'auto';

      this.timeout = setTimeout(() => {
        this.el.style.opacity = 0;
        this.el.style.pointerEvents = 'none';
      }, 15000);
    }, 0);
  }

  attach(el, pym) {
    el.appendChild(this.el);

    // Attach the clear clear notification event to the clear method.
    pym.onMessage('coral-clear-notification', this.clear.bind(this));

    // Attach the alert to the alert method.
    pym.onMessage('coral-alert', this.alert.bind(this));
  }

  remove() {
    this.el.remove();
  }
}
