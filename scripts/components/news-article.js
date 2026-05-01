// <news-article> Web Component
// Attributes:
//   headline - article title
//   subtitle - author and date line shown below the headline
class NewsArticle extends HTMLElement {
    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = `
<style>
  :host { display: block; }

  .article-title {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 2.2rem;
    font-weight: 900;
    line-height: 1.15;
    margin-bottom: 0.5rem;
    color: var(--top-bar-bg, #1a1a2e);
  }

  .article-meta {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 0.78rem;
    color: var(--text-muted, #555);
    margin-bottom: 1.3rem;
    padding-bottom: 0.9rem;
    border-bottom: 1px solid var(--border, #d0ccc0);
  }

  .article-meta:empty {
    display: none;
  }

  @media (max-width: 768px) {
    .article-title { font-size: 1.6rem; }
  }
</style>

<h1 class="article-title" id="headline"></h1>
<p  class="article-meta"  id="subtitle"></p>
<slot></slot>`;

        shadow.getElementById('headline').textContent = this.getAttribute('headline') || '';
        shadow.getElementById('subtitle').textContent = this.getAttribute('subtitle') || '';
    }
}

customElements.define('news-article', NewsArticle);
