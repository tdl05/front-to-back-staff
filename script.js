// Front2Back — Interactions

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('nav');

  const onScroll = () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  const reveals = document.querySelectorAll(
    '.service-card, .expect-item, .industry-item, .section-header, .why-content, .contact-info, .contact-form, .join-content'
  );

  reveals.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach(el => observer.observe(el));

  const form = document.getElementById('contactForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const date = document.getElementById('date').value;
    const guests = document.getElementById('guests').value;
    const venue = document.getElementById('venue').value.trim();
    const requirements = document.getElementById('requirements').value.trim();

    const subject = encodeURIComponent(`Staffing Request — ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nEvent Date: ${date || 'TBD'}\nGuest Count: ${guests || 'TBD'}\nVenue: ${venue || 'TBD'}\n\nStaffing Requirements:\n${requirements || 'See details'}`
    );

    window.location.href = `mailto:bookings@front2backstaff.com?subject=${subject}&body=${body}`;

    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Opening email…';
    setTimeout(() => {
      btn.textContent = original;
    }, 2000);
  });
});
