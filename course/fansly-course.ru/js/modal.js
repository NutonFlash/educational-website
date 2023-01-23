export function setModalToggleAnimation() {

    let logModal = $('#loginModalCenter');
    let regModal = $('#registerModalCenter');
    let resetPwdModal = $('#resetPwdByMailModalCenter');

    document.getElementById('loginModalCenter').addEventListener('shown.bs.modal', () => {
        document.getElementById('loginEmail').focus();
    })

    document.getElementById('registerModalCenter').addEventListener('shown.bs.modal', () => {
        document.getElementById('registerLogin').focus();
    })

    document.getElementById('resetPwdByMailModalCenter').addEventListener('shown.bs.modal', () => {
        document.getElementById('loginOrEmailForReset').focus();
    })

    $('#createUser').bind('click', function (event) {
        event.preventDefault();
        logModal.modal('hide');
        regModal.modal('show');
    })

    $('#loginInAccount').bind('click', function (event) {
        event.preventDefault();
        regModal.modal('hide');
        logModal.modal('show');
    })

    $('#forgotPassword').bind('click', function (event) {
        event.preventDefault();
        logModal.modal('hide');
        resetPwdModal.modal('show');
    })
}