export function download_file() {
    $('#download-icon').bind('click', function () {
        document.querySelector('#download-link a').click();
    })
}