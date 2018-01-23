const DEFAULT_STYLE = {
  position: 'fixed',
  cursor: 'default',
  userSelect: 'none',
  backgroundColor: '#323232',
  zIndex: 3,
  willChange: 'transform, opacity',
  transition: 'transform .35s cubic-bezier(.55,0,.1,1), opacity .35s',
  pointerEvents: 'none',
  padding: '12px 18px',
  color: '#fff',
  borderRadius: '3px 3px 0 0',
  textAlign: 'center',
  maxWidth: '400px',
  left: '50%',
  opacity: 0,
  transform: 'translate(-50%, 20px)',
  bottom: 0,
  boxSizing: 'border-box',
  fontFamily: 'Helvetica, "Helvetica Neue", Verdana, sans-serif',
};

export default class Snackbar {
  constructor(customStyle = {}) {
    this.timeout = null;
    this.el = document.createElement('div');
    this.el.id = 'coral-notif';

    // Apply custom styles to the snackbar.
    const style = Object.assign({}, DEFAULT_STYLE, customStyle);
    for (let key in style) {
      this.el.style[key] = style[key];
    }
  }

  clear() {
    this.el.style.opacity = 0;
  }

  alert(message) {
    const { type, text } = JSON.parse(message);
    this.el.style.transform = 'translate(-50%, 20px)';
    this.el.style.opacity = 0;
    this.el.className = `coral-notif-${type}`;
    this.el.textContent = text;

    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      this.el.style.transform = 'translate(-50%, 0)';
      this.el.style.opacity = 1;

      this.timeout = setTimeout(() => {
        this.el.style.opacity = 0;
      }, 7000);
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
