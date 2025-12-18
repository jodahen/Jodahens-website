const sections = document.querySelectorAll(".section");
let isScrolling = false;
let currentSection = 0;
let scrollDelta = 0;
let scrollTimeout;

// Smooth scroll to a section (controlled)
function smoothScrollTo(section) {
    if (!section) return;
    isScrolling = true;

    const start = window.scrollY;
    const end = section.offsetTop;
    const distance = end - start;
    const duration = 700;
    let startTime = null;

    function animate(time) {
        if (!startTime) startTime = time;
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 0.5 - Math.cos(progress * Math.PI) / 2; // ease in-out

        window.scrollTo(0, start + distance * ease);

        if (progress < 1) requestAnimationFrame(animate);
        else {
            isScrolling = false;
            scrollDelta = 0;
            updateScrollHints();
        }
    }

    requestAnimationFrame(animate);
}

// Scroll to section by index
function scrollToSection(index) {
    if (index < 0 || index >= sections.length) return;
    currentSection = index;
    smoothScrollTo(sections[index]);
}

// Show/hide arrows
function updateScrollHints() {
    sections.forEach((sec, i) => {
        const up = sec.querySelector(".scroll-hint.up");
        const down = sec.querySelector(".scroll-hint.down");

        if (up) up.classList.toggle("hidden", currentSection === 0);
        if (down) down.classList.toggle("hidden", currentSection === sections.length - 1);
    });
}

// Wheel scroll
window.addEventListener("wheel", (e) => {
    if (isScrolling) return;

    scrollDelta += e.deltaY;
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        if (scrollDelta > 50) scrollToSection(currentSection + 1);
        else if (scrollDelta < -50) scrollToSection(currentSection - 1);
        scrollDelta = 0;
    }, 50);
});

// Keyboard arrows
window.addEventListener("keydown", (e) => {
    if (isScrolling) return;
    if (e.key === "ArrowDown") scrollToSection(currentSection + 1);
    if (e.key === "ArrowUp") scrollToSection(currentSection - 1);
});

// Touch swipe
let touchStartY = 0;
window.addEventListener("touchstart", (e) => { touchStartY = e.changedTouches[0].screenY; });
window.addEventListener("touchend", (e) => {
    const delta = touchStartY - e.changedTouches[0].screenY;
    if (Math.abs(delta) < 30 || isScrolling) return;
    if (delta > 0) scrollToSection(currentSection + 1);
    else scrollToSection(currentSection - 1);
});

// Initialize arrows
updateScrollHints();

// Jump to first section on load (optional)
scrollToSection(0);
