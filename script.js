/* ============================================================
   DOKARA SURESH — PORTFOLIO JAVASCRIPT
   Features:
   - Sticky navbar with scroll detection
   - Active nav link highlighting
   - Scroll reveal animations
   - Skill bar animations
   - Smooth scrolling
   - Contact form feedback toast
   - Floating card parallax (subtle)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------
     1. NAVBAR — scroll state + active link highlighting
     -------------------------------------------------------- */
  const navbar  = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link:not(.nav-cta)');
  const sections = document.querySelectorAll('section[id]');

  // Add .scrolled class once page scrolls past 60px
  function handleNavScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // Highlight the nav link whose section is in the viewport
  function highlightActiveLink() {
    let currentSection = '';

    sections.forEach(section => {
      const sectionTop    = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', () => {
    handleNavScroll();
    highlightActiveLink();
  }, { passive: true });

  // Run once on load
  handleNavScroll();
  highlightActiveLink();

  /* --------------------------------------------------------
     2. CLOSE MOBILE NAV after clicking a link
     -------------------------------------------------------- */
  const navCollapse = document.getElementById('navMenu');
  const allNavLinks = document.querySelectorAll('.navbar-nav .nav-link');

  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });

  /* --------------------------------------------------------
     3. INTERSECTION OBSERVER — reveal elements on scroll
     -------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // animate once
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => revealObserver.observe(el));

  /* --------------------------------------------------------
     4. SKILL BARS — animate width when section is visible
     -------------------------------------------------------- */
  const skillBars = document.querySelectorAll('.skill-bar-fill');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const targetWidth = entry.target.getAttribute('data-width');
        // Slight delay so reveal animation plays first
        setTimeout(() => {
          entry.target.style.width = targetWidth + '%';
        }, 300);
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  skillBars.forEach(bar => skillObserver.observe(bar));

  /* --------------------------------------------------------
     5. CONTACT FORM — show toast on "send"
     -------------------------------------------------------- */
  const sendBtn = document.getElementById('sendBtn');

  // Create toast element dynamically
  const toast = document.createElement('div');
  toast.className = 'toast-msg';
  toast.innerHTML = `
    <i class="bi bi-check-circle-fill"></i>
    <span>Message sent! I'll get back to you soon 🚀</span>
  `;
  document.body.appendChild(toast);

  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      // Show toast
      toast.classList.add('show');

      // Update button state
      const originalHTML = sendBtn.innerHTML;
      sendBtn.innerHTML = '<i class="bi bi-check2"></i> Sent!';
      sendBtn.disabled = true;
      sendBtn.style.background = '#00c17a';

      // Reset after 3.5s
      setTimeout(() => {
        toast.classList.remove('show');
        sendBtn.innerHTML = originalHTML;
        sendBtn.disabled = false;
        sendBtn.style.background = '';
      }, 3500);
    });
  }

  /* --------------------------------------------------------
     6. FLOATING CARDS — subtle parallax on mouse move (hero)
     -------------------------------------------------------- */
  const heroSection = document.getElementById('hero');
  const floatingCards = document.querySelectorAll('.floating-card');

  if (heroSection && floatingCards.length) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const cx   = (e.clientX - rect.left) / rect.width  - 0.5; // -0.5 to 0.5
      const cy   = (e.clientY - rect.top)  / rect.height - 0.5;

      floatingCards.forEach((card, i) => {
        const depth = (i + 1) * 6; // each card moves slightly differently
        card.style.transform = `translate(${cx * depth}px, ${cy * depth}px)`;
      });
    });

    heroSection.addEventListener('mouseleave', () => {
      floatingCards.forEach(card => {
        card.style.transform = '';
      });
    });
  }

  /* --------------------------------------------------------
     7. SMOOTH SCROLL for anchor links (polyfill fallback)
     -------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* --------------------------------------------------------
     8. SKILL CARDS — stagger on hover (child tags)
     -------------------------------------------------------- */
  document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.querySelectorAll('.stag').forEach((tag, i) => {
        tag.style.transitionDelay = `${i * 40}ms`;
        tag.style.background = 'rgba(108,99,255,0.12)';
        tag.style.borderColor = 'rgba(108,99,255,0.3)';
        tag.style.color       = '#a09bff';
      });
    });
    card.addEventListener('mouseleave', () => {
      card.querySelectorAll('.stag').forEach(tag => {
        tag.style.transitionDelay = '';
        tag.style.background  = '';
        tag.style.borderColor = '';
        tag.style.color       = '';
      });
    });
  });

  /* --------------------------------------------------------
     9. TYPED EFFECT — hero role cycling (optional flair)
     -------------------------------------------------------- */
  // A lightweight text cycling for the hero eyebrow
  const greetings = ["👋 Hello, I'm", "✨ Hi there, I'm", "🚀 Meet"];
  const eyebrow = document.querySelector('.hero-eyebrow');
  let greetIdx = 0;

  setInterval(() => {
    if (!eyebrow) return;
    eyebrow.style.opacity = '0';
    eyebrow.style.transform = 'translateY(-8px)';
    setTimeout(() => {
      greetIdx = (greetIdx + 1) % greetings.length;
      eyebrow.textContent = greetings[greetIdx];
      eyebrow.style.opacity = '1';
      eyebrow.style.transform = 'translateY(0)';
    }, 300);
  }, 4000);

  // Smooth transition for eyebrow
  if (eyebrow) {
    eyebrow.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  }

  /* --------------------------------------------------------
     10. NAVBAR BRAND hover micro-animation
     -------------------------------------------------------- */
  const brand = document.querySelector('.navbar-brand');
  if (brand) {
    brand.addEventListener('mouseenter', () => {
      const dot = brand.querySelector('.brand-dot');
      if (dot) {
        dot.style.transform = 'scale(1.5)';
        dot.style.transition = 'transform 0.3s ease';
      }
    });
    brand.addEventListener('mouseleave', () => {
      const dot = brand.querySelector('.brand-dot');
      if (dot) {
        dot.style.transform = '';
      }
    });
  }

}); // end DOMContentLoaded