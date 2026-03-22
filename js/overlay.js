// ─────────────────────────────────────────────
//  open section
// ─────────────────────────────────────────────

function openSection(id, wrap) {
    const overlay = document.getElementById('sky-overlay');
    const content = document.getElementById('overlay-content');
    const title = document.getElementById('title');
    const particles = document.getElementById('particles');

    // 1. player attacks
    window.dispatchEvent(new CustomEvent('player-attack'));

    // 2. kill the clicked monster
    monsterStates[id].isDead = true;
    const monsterContainer = document.getElementById(`sprite-container-${id}`);
    const monsterImg = document.getElementById(`monster-sprite-${id}`);

    if (monsterContainer && monsterImg) {
        swapImg(monsterImg, 'assets/monster-death-spritesheet.png', 'monster-sprite pixelart');
        monsterContainer.className = 'monster-sprite-container dying';
        wrap.classList.add('dead');

        setTimeout(() => {
            monsterContainer.className = 'monster-sprite-container dead';
        }, 820);
    }

    // 3. hide all other monsters
    document.querySelectorAll('.monster-wrap').forEach(w => {
        if (w !== wrap) w.classList.add('others-hidden');
    });

    // 4. show the overlay after the attack animation
    setTimeout(() => {
        // populate content
        const template = document.getElementById(`content-${id}`);
        content.innerHTML = '';
        content.appendChild(template.content.cloneNode(true));

        // fade and blur whole background
        title.className = 'title hiding';
        title.addEventListener('animationend', () => {
            title.style.visibility = 'hidden';
        }, { once: true });

        particles.style.filter = 'blur(2px)';
        particles.style.transition = 'filter 0.4s ease';

        // open the overlay
        overlay.className = 'sky-overlay opening';

        activeMonster = id;
        sectionOpen = true;
    }, 400);
}

// ─────────────────────────────────────────────
//  close section
// ─────────────────────────────────────────────

function closeSection() {
    const overlay = document.getElementById('sky-overlay');
    const title = document.getElementById('title');
    const particles = document.getElementById('particles');

    // close overlay 
    overlay.className = 'sky-overlay closing';
    overlay.addEventListener('animationend', () => {
        overlay.className = 'sky-overlay hidden';
    }, { once: true });

    // unblur background elements
    particles.style.filter = '';

    // revive dead monster
    if (activeMonster) {
        const deadWrap = document.getElementById(`monster-${activeMonster}`);
        const deadContainer = document.getElementById(`sprite-container-${activeMonster}`);
        const deadImg = document.getElementById(`monster-sprite-${activeMonster}`);

        if (deadWrap) {
            deadWrap.classList.remove('dead');
        }

        if (deadContainer && deadImg) {
            swapImg(deadImg, 'assets/monster-walk-right-spritesheet.png', 'monster-sprite pixelart');
            deadContainer.className = 'monster-sprite-container walk-right';
        }

        // reset monster state
        if (monsterStates[activeMonster]) {
            monsterStates[activeMonster].isDead = false;
            monsterStates[activeMonster].lastDirClass = 'walk-right';
            monsterStates[activeMonster].dir = 1;
            monsterStates[activeMonster].walkTimer = Math.floor(Math.random() * 120) + 60;
        }
    }

    // show all monsters again
    document.querySelectorAll('.monster-wrap').forEach(w => {
        w.classList.remove('others-hidden');
    });

    // restore title
    title.style.visibility = '';
    void title.offsetWidth;
    title.className = 'title showing';

    activeMonster = null;
    sectionOpen = false;
}

// ─────────────────────────────────────────────
//  boot
// ─────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    createBinaryStrip();
    initPlayer();
    initMonsters();

    document.getElementById('revive-btn').addEventListener('click', closeSection);
});