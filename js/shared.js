let sectionOpen = false;
let activeMonster = null;
const monsterStates = {};

// ─────────────────────────────────────────────
//  swap img to reset animation
// ─────────────────────────────────────────────

function swapImg(oldImg, newSrc, className) {
    const parent = oldImg.parentNode;
    const newImg = document.createElement('img');

    newImg.src = newSrc;
    newImg.className = className;
    newImg.id = oldImg.id;
    if (oldImg.alt) newImg.alt = oldImg.alt;

    oldImg.remove();
    // forces browser to recalculate layout 
    void parent.offsetWidth;
    parent.appendChild(newImg);
    return newImg;
}