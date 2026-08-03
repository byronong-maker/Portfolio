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
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });

    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').slice(1) === current) {
                item.classList.add('active');
            }
        });
    });

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
