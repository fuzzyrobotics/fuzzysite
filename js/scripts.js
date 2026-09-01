/**
 * FUZZY ROBOTICS // WASTELAND
 * Clean Skunkworks Scripts
 */

document.addEventListener('DOMContentLoaded', function () {
    // Header scroll background elevation
    var header = document.querySelector('.site-header');
    if (header) {
        function onScroll() {
            header.classList.toggle('scrolled', window.scrollY > 20);
        }
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }
});
