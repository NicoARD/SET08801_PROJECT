// <news-sidebar> Web Component
// Attributes:
//   heading - section heading text (default: "Picks for you")
class NewsSidebar extends HTMLElement {
    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = `
<style>
  :host {
    display: block;
    background: var(--sidebar-bg, #ede9de);
    border: 1px solid var(--border, #d0ccc0);
    padding: 1rem 1rem 1.2rem;
    align-self: start;
  }

  h2 {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-muted, #555);
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--top-bar-bg, #1a1a2e);
  }
</style>

<h2 id="heading">Picks for you</h2>
<slot></slot>`;

        shadow.getElementById('heading').textContent =
            this.getAttribute('heading') || 'Picks for you';
    }
}

customElements.define('news-sidebar', NewsSidebar);
