import {addHamburgerAnimation} from "./hamburger_animation.js";
import {addLinkAnimation} from "./link_animation.js";
import {setLinksStyle} from "./link_style.js";
import {setupRegisterModal} from "./register.js";
import {setupLoginModal} from "./login.js";
import {setModalToggleAnimation} from "./modal.js";
import {setupProfileBtn} from "./auth_utilities.js";
import {setupPaymentBtn} from "./payment.js";
import {setupResetPwdByMailModal} from "./reset_pwd_by_mail.js";
import {setupReviewModal} from "./sendReview.js";
import {download_file} from "./download.js";
import {setupFooter} from "./footer.js";
import {adaptNavbar} from "./navbar_adapter.js";

export function bindScripts() {
    scroll(0,0);
    adaptNavbar();
    setupFooter();
    addHamburgerAnimation();
    addLinkAnimation();
    setLinksStyle();
    if ($('#loginModalCenter').length !== 0) {
        setupLoginModal();
        setupRegisterModal();
        setModalToggleAnimation();
        setupResetPwdByMailModal();
    }
    if ($('#resetModalCenter').length !== 0)
        setupProfileBtn();
    if ($('#reviewModalCenter').length !== 0) {
        setupReviewModal();
        download_file();
    } else setupPaymentBtn();
}