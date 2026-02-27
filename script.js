// Analytics Helper
function trackEvent(action, category, label, value = null) {
  if (typeof gtag === 'function') {
    gtag('event', action, {
      'event_category': category,
      'event_label': label,
      'value': value
    });
  } else {
    console.log(`[Analytics Simulation] Action: ${action} | Category: ${category} | Label: ${label}`);
  }
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Click Tracking for Interactive Elements
    const trackableElements = document.querySelectorAll('[data-ga-action]');
    trackableElements.forEach(el => {
        el.addEventListener('click', () => {
            const action = el.getAttribute('data-ga-action');
            const label = el.getAttribute('data-ga-label');
            trackEvent(action, 'engagement', label);
        });
    });

    // 2. Scroll Depth Tracking
    let scrollDepths = new Set();
    // Use throttling for scroll performance
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                const scrollTop = window.scrollY;
                const docHeight = document.body.offsetHeight;
                const winHeight = window.innerHeight;
                // Avoid division by zero on very short pages
                if (docHeight > winHeight) {
                    const scrollPercent = scrollTop / (docHeight - winHeight);
                    const thresholds = [0.25, 0.5, 0.75, 1.0];
                    
                    thresholds.forEach(depth => {
                        if (scrollPercent >= depth && !scrollDepths.has(depth)) {
                            scrollDepths.add(depth);
                            trackEvent('scroll_depth', 'engagement', `${depth * 100}%`);
                        }
                    });
                }
                scrollTimeout = null;
            }, 100);
        }
    });

    // 3. Project Filtering Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    if (filterBtns.length > 0 && projectItems.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update button styles
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                // Apply filtering with smooth transition
                projectItems.forEach(item => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(15px)';
                    
                    setTimeout(() => {
                        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                            item.classList.remove('hidden');
                            // Trigger reflow
                            void item.offsetWidth;
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        } else {
                            item.classList.add('hidden');
                        }
                    }, 400); // matches the 0.4s transition in css
                });
            });
        });
    }
});
