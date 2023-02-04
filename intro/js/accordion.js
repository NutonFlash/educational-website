$(document).ready(function () {
    function togglePanel() {
        this.classList.toggle('active');
        let panel = this.nextElementSibling;
        let span = this.childNodes[3].childNodes[1].firstChild;
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
            span.innerHTML = '+';
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
            span.innerHTML = '-';
        }
    }

    document.querySelectorAll('.accordion').forEach(function (elem) {
        elem.addEventListener('click', togglePanel);
    });
});