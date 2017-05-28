<?php
require_once 'config.inc.php';

$_GET['debug']	= "1";

//请设置登录成功跳转的地址
$LoginTrueURL	= "http://www.agoodme.com/wxlogin";
//请设置登录失败跳转的地址
$LoginFalseURL	= "http://www.agoodme.com/login";


$RefCode		= trim($_GET['code']);
$RefState		= trim($_GET['state']);

//验证失败
if( $RefState!=$_SESSION['WXAPIST'] ){
	header("Location: {$LoginFalseURL}?err=1");
	exit;
}
$_SESSION['weixin_code']		= $RefCode;
$_SESSION['weixin_state']		= $RefState;


sleep(2);
//获取ACCESS_TOKEN 访问令牌
$AccessToKen					= GetWeiXinAccessToKen( $RefCode );
if( $AccessToKen==false ){
	header("Location: {$LoginFalseURL}?err=2");
	exit;
}
$_SESSION['WeiXinAccessToKen']	= $AccessToKen;


sleep(2);
//获取用户信息
$UserInfo						= GetWeiXinUserInfo( $AccessToKen );
if( false==$UserInfo ){
	header("Location: {$LoginFalseURL}?err=3");
	exit;
}


$_SESSION['WeiXinUserInfo']			= $UserInfo;
header("Location: {$LoginTrueURL}");

