(() => {
    document.querySelectorAll('.nav-item:not(.active)').forEach((item) => {
        item.addEventListener('pointerdown', () => item.classList.add('is-pressing'));
        item.addEventListener('pointercancel', () => item.classList.remove('is-pressing'));
    });

    const revealTargets = document.querySelectorAll([
        '.gallery-hero-section',
        '.albums-hero-section',
        '.videos-hero-section',
        '.profile-section',
        '.featured-section',
        '.stats-section',
        '.invitation-section',
        '.albums-section',
        '.wedding-film-section',
        '.camera-hand-section',
        '.photo-frames-section',
        '.services-section',
        '.instagram-section',
        '.contact-section',
        '.gallery-card',
        '.albums-page-section',
        '.videos-page-section',
        '.packages-page-section'
    ].join(','));

    if (!revealTargets.length) return;

    const revealImmediately = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    revealTargets.forEach((target) => target.classList.add('scroll-reveal'));
    if (revealImmediately || !('IntersectionObserver' in window)) {
        revealTargets.forEach((target) => target.classList.add('is-revealed'));
        return;
    }

    const observer = new IntersectionObserver((entries, activeObserver) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-revealed');
            activeObserver.unobserve(entry.target);
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -6% 0px'
    });

    revealTargets.forEach((target) => observer.observe(target));

    const isVisibleInViewport = (target) => {
        const bounds = target.getBoundingClientRect();
        return bounds.top < window.innerHeight * 0.94 && bounds.bottom > 0;
    };

    // Ensure the initially visible content always reveals, rather than relying
    // only on the observer's timing during a page load.
    requestAnimationFrame(() => {
        revealTargets.forEach((target) => {
            if (isVisibleInViewport(target)) target.classList.add('is-revealed');
        });
    });

    // Browsers can restore a previous page from memory with its completed
    // animation state intact. Reset visible sections and replay their reveal.
    window.addEventListener('pageshow', (event) => {
        if (!event.persisted) return;

        const visibleTargets = Array.from(revealTargets).filter(isVisibleInViewport);
        visibleTargets.forEach((target) => target.classList.remove('is-revealed'));
        void document.body.offsetWidth;

        requestAnimationFrame(() => {
            visibleTargets.forEach((target) => target.classList.add('is-revealed'));
        });
    });

    if (document.querySelector('.gallery-masonry-grid')) {
        const galleryObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (!(node instanceof Element) || !node.matches('.gallery-card')) return;
                    node.classList.add('scroll-reveal');
                    observer.observe(node);
                });
            });
        });

        galleryObserver.observe(document.querySelector('.gallery-masonry-grid'), {
            childList: true,
            subtree: true
        });
    }
})();
