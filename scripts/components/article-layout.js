// Attributes (all passed through to the child components):
//   headline, subtitle -> news-article
//   home-url, date-line -> news-header
//   level, level-name,
//   correct-code, next-url -> game-nav
//
// slots 
//   slot="body" -> article body content
//   slot="sidebar" -> sidebar cards


class ArticleLayout extends HTMLElement {
    connectedCallback() {
        // Get slots
        const bodyEl = this.querySelector('[slot="body"]');
        const sidebarEl = this.querySelector('[slot="sidebar"]');

        this.innerHTML = '';

        // Header
        const header = document.createElement('news-header');
        header.setAttribute('date-line', this.getAttribute('date-line') || '');
        this.appendChild(header);

        // Main layout 
        const main = document.createElement('main');
        main.className = 'page-layout';

        // Article
        const article = document.createElement('news-article');
        article.setAttribute('headline', this.getAttribute('headline') || '');
        article.setAttribute('subtitle', this.getAttribute('subtitle') || '');

        if (bodyEl) {
            bodyEl.removeAttribute('slot');
            article.appendChild(bodyEl);
        }

        main.appendChild(article);

        // Sidebar
        const sidebar = document.createElement('news-sidebar');

        if (sidebarEl) {
            sidebarEl.removeAttribute('slot');
            sidebar.appendChild(sidebarEl);
        }

        main.appendChild(sidebar);

        this.appendChild(main);

        // Bottom navigation
        const nav = document.createElement('game-nav');
        nav.setAttribute('level', this.getAttribute('level') || '1');
        nav.setAttribute('level-name', this.getAttribute('level-name') || '');
        nav.setAttribute('correct-code', this.getAttribute('correct-code') || '');
        nav.setAttribute('next-url', this.getAttribute('next-url') || '');

        this.appendChild(nav);
    }
}
customElements.define('article-layout', ArticleLayout);
