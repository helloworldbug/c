<?php
require_once 'config.inc.php';


$URL		= GetWeiXinLoginURL();

header("Location: {$URL}");
