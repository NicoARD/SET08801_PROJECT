const TOTAL_MS = 90 * 60 * 1000;
const AUTO_PASS_MS = 30 * 60 * 1000;
const HINT_DELAY_MS = 5 * 60 * 1000; 

// Attributes:
//level - current level number (1-4)
//level-name - display name shown in the centre of the bar
//correct-code - the answer that unlocks the next level (case-insensitive)
//next-url - relative URL to navigate to on correct answer

class GameNav extends HTMLElement {

    connectedCallback() {
        this._level = this.getAttribute('level') || '1';
        this._levelName = this.getAttribute('level-name') || `Level ${this._level}`;
        this._code = this.getAttribute('correct-code') || '';
        this._nextUrl =this.getAttribute('next-url') || '';

        this._gameoverUrl = '../gameover.html';

        const formats = {
            '1': '5-letter word',
            '2': '4-digit number',
            '3': '6-digit number',
            '4': '2-digit number'
        };

        this._codeFormat = formats[this._level] || 'code';

        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = this._buildTemplate();

        this._bindEvents(shadow);
        this._startTimer(shadow);
    }

    disconnectedCallback() {
        clearInterval(this._timerInterval);
    }

    /* Template */
    _buildTemplate() {
        return `
<style>
:host {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    display: block;
    font-family: 'Helvetica Neue', Arial, sans-serif;
}

nav {
    background: #1a1a2e;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.55rem 1.5rem;
    gap: 1rem;
    font-size: 0.88rem;
    box-shadow: 0 -2px 10px rgba(0,0,0,0.4);
}

.nav-left  { display: flex; align-items: center; gap: 0.5rem; }
.nav-center {
    flex: 1;
    text-align: center;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    font-size: 0.77rem;
    color: #ccc;
}
.nav-right { display: flex; align-items: center; gap: 0.7rem; }

input[type="text"] {
    padding: 0.38rem 0.75rem;
    border: 1px solid #444;
    background: #2a2a3e;
    color: #fff;
    border-radius: 3px;
    font-size: 0.9rem;
    width: 145px;
    letter-spacing: 0.1em;
    font-family: 'Courier New', Courier, monospace;
}
.code-format {
    font-size: 0.72rem;
    color: #888;
    letter-spacing: 0.04em;
    white-space: nowrap;
}
input[type="text"]::placeholder { color: #666; font-family: inherit; letter-spacing: 0; }
input[type="text"]:focus { outline: none; border-color: #8888aa; }

button {
    border: none;
    border-radius: 3px;
    font-family: inherit;
    font-size: 0.85rem;
}

#submit-btn {
    background: #c41e3a;
    color: #fff;
    padding: 0.4rem 0.95rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    transition: background 0.15s;
}
#submit-btn:hover { background: #a01830; }

#help-btn {
    background: transparent;
    color: #bbb;
    border: 1px solid #555;
    font-weight: 700;
    font-size: 0.9rem;
    width: 2rem;
    height: 2rem;
    padding: 0;
    line-height: 1;
    border-radius: 50%;
}
#help-btn:hover { background: #2a2a3e; color: #fff; border-color: #888; }

#timer-display {
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.95rem;
    color: #ddd;
    min-width: 5ch;
    text-align: right;
}

/* Feedback toast */
#feedback {
    position: fixed;
    bottom: 3.4rem;
    left: 0;
    right: 0;
    text-align: center;
    padding: 0.45rem 1.3rem;
    border-radius: 4px;
    font-size: 0.85rem;
    font-weight: 700;
    opacity: 0;
    transition: opacity 0.22s;
    pointer-events: none;
    white-space: nowrap;
    letter-spacing: 0.02em;
}
#feedback.visible  { opacity: 1; }
#feedback.error    { background: #c41e3a; color: #fff; }
#feedback.correct  { background: #2e7d32; color: #fff; }


/* Help popover */
#popover {
    position: fixed;
    bottom: 3.6rem;
    right: 1.2rem;
    background: #fff;
    color: #1a1a1a;
    border: 1px solid #ccc;
    border-radius: 6px;
    padding: 1.1rem 1.3rem 1rem;
    max-width: 310px;
    box-shadow: 0 4px 22px rgba(0,0,0,0.2);
    font-size: 0.84rem;
    line-height: 1.58;
    z-index: 2000;
}
#popover-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.65rem;
}
#popover h3 {
    font-size: 0.93rem;
    color: #1a1a2e;
    font-weight: 700;
}
#close-popover {
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 0.9rem;
    color: #888;
    padding: 0;
    line-height: 1;
}
#close-popover:hover { color: #333; }
#popover ul {
    margin: 0.45rem 0 0.4rem 1.1rem;
}
#popover li { margin-bottom: 0.3rem; }
#popover .hint-note {
    margin-top: 0.5rem;
    color: #888;
    font-style: italic;
    font-size: 0.8rem;
}
</style>

<nav>
    <div class="nav-left">
        <input type="text" id="code-input"
               placeholder="Enter code…"
               maxlength="10"
               autocomplete="off"
               spellcheck="false"
               aria-label="Answer code" />
        <button id="submit-btn">Submit</button>
        <span class="code-format">${this._codeFormat}</span>
    </div>
    <div class="nav-center">${this._levelName}</div>
    <div class="nav-right">
        <span id="timer-display" aria-label="Time remaining">--:--</span>
        <button id="help-btn" aria-label="How to play">?</button>
    </div>
</nav>

<div id="feedback" role="alert" aria-live="polite"></div>

<div id="popover" hidden>
    <div id="popover-header">
        <h3>How to Play</h3>
        <button id="close-popover" aria-label="Close instructions">✕</button>
    </div>
    <p>You are browsing a fictional news website, but the articles hide secret codes.</p>
    <ul>
        <li>Read the articles carefully for hidden patterns and clues.</li>
        <li>Some puzzles require comparing <em>multiple</em> articles.</li>
        <li>Type the code you find into the box and press <strong>Submit</strong>.</li>
        <li>Complete all four levels before time runs out!</li>
    </ul>
    <p class="hint-note">Hints appear as advertisements after 5 minutes on a level. Spend more than 30 minutes on a level and it will automatically advance.</p>
</div>`;
    }

    _bindEvents(shadow) {
        const input = shadow.getElementById('code-input');
        const submit = shadow.getElementById('submit-btn');
        const helpBtn = shadow.getElementById('help-btn');
        const popover = shadow.getElementById('popover');
        const closeBtn = shadow.getElementById('close-popover');

        submit.addEventListener('click', () => this._validate(shadow));
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this._validate(shadow);
        });
        helpBtn.addEventListener('click', () => {
            popover.hidden = !popover.hidden;
        });
        closeBtn.addEventListener('click', () => {
            popover.hidden = true;
        });
    }

    // Code validation 
    _validate(shadow) {
        const input = shadow.getElementById('code-input');
        const feedback = shadow.getElementById('feedback');
        const value = input.value.trim().toUpperCase();

        if (!value) 
        {
            input.focus();
            return;
        }

        if (value === this._code.toUpperCase()) 
        {
            Progression.unlock(parseInt(this._level) + 1);
            localStorage.setItem('net_level_start_time', String(Date.now()));
            this._showFeedback(feedback, 'Correct! Unlocking next level…', 'correct');
            setTimeout(() => { window.location.href = this._nextUrl; }, 900);
        } 
        else 
        {
            this._showFeedback(feedback, 'Incorrect code. Keep looking…', 'error');
            input.value = '';
            input.focus();
        }
    }

    _showFeedback(el, message, classes) {
        el.textContent = message;
        el.className = 'visible ' + classes;
        setTimeout(() => { el.className = ''; }, 2600);
    }

    // Countdown timer
    _startTimer(shadow) {
        const display = shadow.getElementById('timer-display');

        const tick = () => {
            const startTime = parseInt(localStorage.getItem('net_start_time') || '0', 10);
            if (!startTime) 
            {
                display.textContent = '--:--';
                return;
            }

            const remaining = TOTAL_MS - (Date.now() - startTime);

            if (remaining <= 0) {
                clearInterval(this._timerInterval);
                window.location.href = this._gameoverUrl;
                return;
            }

            const mins = Math.floor(remaining / 60000);
            const secs = Math.floor((remaining % 60000) / 1000);
            display.textContent =
                String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');

            // autopass if player has been on this level too long
            const levelStart = parseInt(localStorage.getItem('net_level_start_time') || '0', 10);
            if (levelStart && levelStart >= startTime && (Date.now() - levelStart) >= AUTO_PASS_MS) {
                clearInterval(this._timerInterval);
                Progression.unlock(parseInt(this._level) + 1);
                localStorage.setItem('net_level_start_time', String(Date.now()));
                window.location.href = this._nextUrl;
            }
        };

        tick();
        this._timerInterval = setInterval(tick, 1000);
    }
}

customElements.define('game-nav', GameNav);
