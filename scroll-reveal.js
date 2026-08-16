(() => {
    const revealTargets = document.querySelectorAll([
        '.profile-section',
        '.featured-section',
        '.stats-section',
        '.invitation-section',
        '.albums-section',
        '.wedding-film-section',
        '.camera-hand-section',
        '.photo-frames-section',
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
