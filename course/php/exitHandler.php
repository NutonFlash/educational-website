<?php

setcookie('isAuth', 'true', time() - 3600, '/', httponly: true);
setcookie('isAuth', 'false', time() + 60 * 60 * 24 * 14, '/', httponly: true);
setcookie('login', $_COOKIE['login'], time() - 3600, '/', httponly: true);
setcookie('email', $_COOKIE['email'], time() - 3600, '/', httponly: true);

echo '{"responseCode":0}';