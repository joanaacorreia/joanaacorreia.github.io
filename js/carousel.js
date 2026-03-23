// only runs on mobile
function initCarousel() {
    if (window.innerWidth > 768) return;

    const wraps = Array.from(document.querySelectorAll('.monster-wrap'));
    const dotsContainer = document.getElementById('carousel-dots');
    const leftBtn = document.getElementById('carousel-left');
    const rightBtn = document.getElementById('carousel-right');

    let currentIndex = 0;

    // create dots
    wraps.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = i === 0 ? 'carousel-dot active' : 'carousel-dot';
        dot.dataset.index = i;
        dotsContainer.appendChild(dot);
    });

    function showMonster(index) {
        wraps.forEach((wrap, i) => {
            if (i === index) {
                wrap.classList.remove('carousel-hidden');
                wrap.classList.add('carousel-active');
            } else {
                wrap.classList.add('carousel-hidden');
                wrap.classList.remove('carousel-active');
            }
        });

        // update dots
        document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        currentIndex = index;
    }

    function nextMonster() {
        const next = (currentIndex + 1) % wraps.length;
        showMonster(next);
    }

    function prevMonster() {
        const prev = (currentIndex - 1 + wraps.length) % wraps.length;
        showMonster(prev);
    }

    leftBtn.addEventListener('click', prevMonster);
    rightBtn.addEventListener('click', nextMonster);

    // swipe support
    let touchStartX = 0;

    document.getElementById('ground').addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    document.getElementById('ground').addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        // only register swipe if finger moved more than 50px
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextMonster();
            else prevMonster();
        }
    }, { passive: true });

    // show first monster
    showMonster(0);
}

document.addEventListener('DOMContentLoaded', initCarousel);