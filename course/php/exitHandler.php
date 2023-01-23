<?php

setcookie('isAuth', 'true', time() - 3600, '/');
setcookie('isAuth', 'false', time() + 60 * 60 * 24 * 14, '/');
setcookie('login', $_COOKIE['login'], time() - 3600, '/');
setcookie('email', $_COOKIE['email'], time() - 3600, '/');

echo '{"responseCode":0}';