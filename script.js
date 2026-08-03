document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    navLinksItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    const navbar = document.querySelector('.navbar');
    const progress = document.getElementById('scrollProgress');
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');

    // Single rAF-throttled scroll handler drives the navbar state, the progress
    // bar and the active nav link. Previously two separate unthrottled listeners
    // ran layout reads on every scroll event.
    let ticking = false;
    const onScroll = () => {
        const y = window.scrollY;

        navbar.classList.toggle('scrolled', y > 50);

        if (progress) {
            const doc = document.documentElement;
            const max = doc.scrollHeight - doc.clientHeight;
            progress.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
        }

        let current = '';
        sections.forEach(section => {
            if (y >= section.offsetTop - 200) current = section.id;
        });
        navItems.forEach(item => {
            item.classList.toggle('active', item.getAttribute('href').slice(1) === current);
        });

        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(onScroll);
        }
    }, { passive: true });
    onScroll();

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section, .experience-card, .project-card, .skill-category, .contact-link, .contact-content').forEach(el => {
        observer.observe(el);
    });
});

function toggleExperience(card) {
    card.classList.toggle('expanded');
}

// Stats: count up when the bar scrolls into view.
// The markup already holds the final value ("6+", "50+", "17"), so if this never
// runs the numbers simply display as written — nothing to fail open.
document.addEventListener('DOMContentLoaded', () => {
    const bar = document.querySelector('.stats-section');
    if (!bar) return;

    const nums = [...bar.querySelectorAll('.stat-number')].map(el => {
        const m = el.textContent.trim().match(/^(\d+)(.*)$/);
        return m ? { el, target: +m[1], suffix: m[2], final: el.textContent } : null;
    }).filter(Boolean);

    if (!nums.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const run = () => {
        const DURATION = 1400;
        const start = performance.now();
        const tick = now => {
            const p = Math.min((now - start) / DURATION, 1);
            const eased = 1 - Math.pow(1 - p, 3);   // ease-out cubic
            nums.forEach(n => {
                n.el.textContent = p < 1
                    ? Math.round(n.target * eased) + n.suffix
                    : n.final;
            });
            if (p < 1) requestAnimationFrame(tick);
        };
        nums.forEach(n => { n.el.textContent = '0' + n.suffix; });
        requestAnimationFrame(tick);
    };

    new IntersectionObserver((entries, obs) => {
        entries.forEach(e => {
            if (e.isIntersecting) { run(); obs.disconnect(); }
        });
    }, { threshold: 0.4 }).observe(bar);
});

// About: type out a real automation run in the terminal card.
// Fires when scrolled into view, runs once. The command is typed character by
// character; output lines then appear line by line, the way a real run reads.
document.addEventListener('DOMContentLoaded', () => {
    const card = document.getElementById('aboutTerminal');
    const out = document.getElementById('terminalOut');
    if (!card || !out) return;

    const SCRIPT = [
        { t: 'cmd', text: 'claude-code run kpi-report --brand demo-store' },
        { t: 'out', cls: 't-muted', text: '→ connecting to Klaviyo MCP server' },
        { t: 'out', cls: 't-ok',    text: '✓ authenticated' },
        { t: 'out', cls: 't-muted', text: '→ pulling campaign + flow metrics (last 14 days)' },
        { t: 'out', cls: 't-ok',    text: '✓ 24 campaigns · 11 flows' },
        { t: 'out', cls: 't-muted', text: '→ analysing with Claude' },
        { t: 'out', cls: 't-key',   text: '  open rate · click rate · revenue attribution summarised' },
        { t: 'out', cls: 't-muted', text: '→ formatting report → Slack #kpi-weekly' },
        { t: 'out', cls: 't-ok',    text: '✓ posted · next run scheduled Monday 09:00' },
        { t: 'out', cls: 't-warn',  text: 'done in 12.4s — zero manual steps' },
    ];

    const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const line = s => s.t === 'cmd'
        ? `<span class="t-prompt">$</span> <span class="t-cmd">${esc(s.text)}</span>\n`
        : `<span class="${s.cls}">${esc(s.text)}</span>\n`;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
        out.innerHTML = SCRIPT.map(line).join('');
        return;
    }

    let started = false;
    const run = () => {
        if (started) return;
        started = true;

        let i = 0;
        const step = () => {
            if (i >= SCRIPT.length) return;
            const s = SCRIPT[i];

            if (s.t === 'cmd') {
                // type the command one character at a time
                let n = 0;
                const typeChar = () => {
                    n++;
                    out.innerHTML = `<span class="t-prompt">$</span> <span class="t-cmd">${esc(s.text.slice(0, n))}</span>\n`;
                    if (n < s.text.length) {
                        setTimeout(typeChar, 38);
                    } else {
                        i++;
                        setTimeout(step, 520);
                    }
                };
                typeChar();
            } else {
                out.innerHTML += line(s);
                i++;
                setTimeout(step, s.cls === 't-ok' ? 420 : 300);
            }
        };
        setTimeout(step, 400);
    };

    new IntersectionObserver((entries, obs) => {
        entries.forEach(e => {
            if (e.isIntersecting) { run(); obs.disconnect(); }
        });
    }, { threshold: 0.35 }).observe(card);
});

// Hero: type/erase the rotating specialty line
document.addEventListener('DOMContentLoaded', () => {
    const el = document.getElementById('heroRotator');
    if (!el) return;

    const phrases = [
        'agentic AI workflows',
        'Claude-powered automations',
        'high-converting Shopify pages',
        'automated KPI pipelines',
        'systems that run without me'
    ];

    // Respect reduced-motion: show the first phrase, skip the animation entirely.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        el.textContent = phrases[0];
        return;
    }

    let phrase = 0;
    let chars = 0;
    let erasing = false;

    const tick = () => {
        const current = phrases[phrase];
        chars += erasing ? -1 : 1;
        el.textContent = current.slice(0, chars);

        let delay = erasing ? 35 : 70;

        if (!erasing && chars === current.length) {
            erasing = true;
            delay = 1900;
        } else if (erasing && chars === 0) {
            erasing = false;
            phrase = (phrase + 1) % phrases.length;
            delay = 350;
        }

        setTimeout(tick, delay);
    };

    setTimeout(tick, 1600);
});
