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

    // 3D Preview fallback management: hide fallback once iframe loads
    const threeIframe = document.getElementById('three-d-iframe');
    const threeFallback = document.getElementById('three-d-fallback');
    if (threeIframe) {
        threeIframe.addEventListener('load', () => {
            if (threeFallback) {
                threeFallback.style.display = 'none';
            }
        });
    }

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

// 3D cube interactions (pure CSS 3D, with optional mouse drag)
const cube = document.getElementById('cube3d');
const stage = document.getElementById('cube-stage');
let angleX = -25;
let angleY = 25;
let autoRotate = true;

function applyCubeTransform() {
  if (cube) {
    cube.style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg)`;
  }
}

if (cube) {
  // initial render
  applyCubeTransform();
  // auto-rotate loop
  const loop = () => {
    if (autoRotate) {
      angleY += 0.6;
      angleX += 0.2;
      applyCubeTransform();
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

const toggleBtn = document.getElementById('toggle-rotate');
if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    autoRotate = !autoRotate;
    toggleBtn.textContent = autoRotate ? 'Pause Rotation' : 'Resume Rotation';
  });
}

// Drag to rotate
let dragging = false;
let lastX = 0;
let lastY = 0;
if (stage) {
  stage.addEventListener('mousedown', (e) => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
  });
  window.addEventListener('mouseup', () => { dragging = false; });
  window.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    angleY += dx * 0.4;
    angleX -= dy * 0.4;
    lastX = e.clientX;
    lastY = e.clientY;
    applyCubeTransform();
  });
}

function toggleExperience(card) {
    card.classList.toggle('expanded');
}
