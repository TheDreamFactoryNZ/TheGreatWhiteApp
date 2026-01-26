export default function buildTrackPopupDom({ title, rows = [] }) {
  const root = document.createElement('div');
  root.className = 'track-popup';

  if (title) {
    const h2 = document.createElement('h2');
    h2.textContent = title;
    root.appendChild(h2);
  }

  if (rows && rows.length) {
    const p = document.createElement('p');
    p.style.margin = '0';
    rows.forEach(({ label, value }, idx) => {
      const strong = document.createElement('strong');
      strong.textContent = `${label}: `;
      p.appendChild(strong);
      const span = document.createElement('span');
      span.textContent = value || '';
      p.appendChild(span);
      if (idx !== rows.length - 1) p.appendChild(document.createElement('br'));
    });
    root.appendChild(p);
  }

  return root;
}
