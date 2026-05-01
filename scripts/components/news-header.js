// <news-header> Web Component
// Attributes:
//   home-url  - href for the logo link
//   date-line - text shown in the masthead strip
class NewsHeader extends HTMLElement {
    connectedCallback() {
        const homeUrl  = this.getAttribute('home-url')  || '../index.html';
        const dateLine = this.getAttribute('date-line') || '';

        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = `
<style>
  :host { display: block; }

  .top-bar {
    background: var(--top-bar-bg, #1a1a2e);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.6rem 2rem;
    position: sticky;
    top: 0;
    z-index: 500;
  }

  .logo {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 1.15rem;
    font-weight: 900;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #fff;
    text-decoration: none;
  }

  .cat-nav {
    display: flex;
    gap: 1.6rem;
  }

  .cat-nav span {
    color: #bbb;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    cursor: default;
    user-select: none;
  }

  .masthead {
    text-align: center;
    padding: 0.55rem 2rem;
    border-bottom: 1px solid var(--border, #d0ccc0);
    background: var(--bg, #f4f1e8);
  }

  .date-line {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 0.75rem;
    color: var(--text-muted, #555);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  @media (max-width: 768px) { .cat-nav { display: none; } }
</style>

<header class="top-bar">
  <span class="logo">New Escape Times</span>
  <nav class="cat-nav" aria-label="Site categories (decorative)">
    <span>World</span>
    <span>Technology</span>
    <span>Politics</span>
    <span>Science</span>
    <span>Lifestyle</span>
  </nav>
</header>

<div class="masthead">
  <span class="date-line" id="date-display"></span>
</div>`;

        shadow.getElementById('date-display').textContent  = dateLine;
    }
}

customElements.define('news-header', NewsHeader);
