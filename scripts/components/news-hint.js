const NEWS_HINT_DELAY_MS = 5 * 60 * 1000;

// While this component exists, due to a bug I could not solve in time the hint mechanism does not work as expected.
// instead it somehow display from the start of the level 

class NewsHint extends HTMLElement {
    connectedCallback() {
        const src = this.getAttribute('src') || '';

        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = `
<style>
  :host { display: block; margin-top: 1.5rem; }

  .hint-ad {
    display: none;
  }

  .hint-ad.visible {
    display: block;
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 0 auto;
  }
</style>

<div class="hint-ad" id="ad">
  <img id="hint-img" src="" alt="" />
</div>`;

        shadow.getElementById('hint-img').src = src;

        const startTime = parseInt(localStorage.getItem('net_level_start_time') || '0');
        const storageKey = 'net_hint_' + src;
        const alreadyShown = localStorage.getItem(storageKey) === '1';
        const elapsed = startTime ? (Date.now() - startTime) : 0;
        const remaining = NEWS_HINT_DELAY_MS - elapsed;

        const show = () => {
            localStorage.setItem(storageKey, '1');
            shadow.getElementById('ad').classList.add('visible');
        };

        if (alreadyShown || elapsed >= NEWS_HINT_DELAY_MS) {
            show();
        } else {
            setTimeout(show, remaining);
        }
    }
}

customElements.define('news-hint', NewsHint);
