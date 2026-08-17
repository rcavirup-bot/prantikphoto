(() => {
    const navItems = document.querySelectorAll('.nav-item');

    const activateNavItem = (selectedItem) => {
        navItems.forEach((item) => {
            item.classList.remove('active', 'is-navigating');
        });
        selectedItem.classList.add('active', 'is-navigating');
    };

    let pendingNavigation = null;
    const navigateFromNav = (item) => {
        if (pendingNavigation) return;

        pendingNavigation = item;
        activateNavItem(item);
        window.setTimeout(() => window.location.assign(item.href), 90);
    };

    navItems.forEach((item) => {
        let pointerStart = null;

        // Apply the active state on touch/mouse press, before the next page loads.
        item.addEventListener('pointerdown', (event) => {
            activateNavItem(item);
            pointerStart = { x: event.clientX, y: event.clientY };
        });

        // Touch input can sometimes finish without a click event. Navigate from
        // a completed tap so the visible selected state always leads to the page.
        item.addEventListener('pointerup', (event) => {
            if (event.pointerType === 'mouse' || event.button !== 0 || !pointerStart) return;

            const distance = Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y);
            pointerStart = null;
            if (distance > 12) return;

            event.preventDefault();
            navigateFromNav(item);
        });
        item.addEventListener('pointercancel', () => { pointerStart = null; });

        item.addEventListener('click', (event) => {
            activateNavItem(item);

            // Let the immediate active state paint before beginning normal navigation.
            if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            navigateFromNav(item);
        });
        item.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') activateNavItem(item);
        });
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
