<?php
$RefCode		= trim($_GET['code']);
$AccessToKen					= GetWeiXinAccessToKen( $RefCode );
$url = "location:http://tsme.avosapps.com/wechatpay/dashang?openid=" . $AccessToKen;
header($url);

 function GetWeiXinAccessToKen( $Code ){
 	$ToCode					= $Code;
 	$ToURL					= "https://api.weixin.qq.com/sns/oauth2/access_token?appid=wxd2714a072abdd918&secret=8931787bcb61b7ee8d86c0c96158aece&code={$ToCode}&grant_type=authorization_code";
 	$openid					= false;

 	if( function_exists("curl_init") ){
 		$cFs					= curl_init();

 		curl_setopt($cFs,	CURLOPT_URL,		$ToURL);	//设定访问地址
 		curl_setopt($cFs,	CURLOPT_HEADER,		false);		//关闭头输出
 		curl_setopt($cFs,	CURLOPT_TIMEOUT,	10);		//超时10秒
 		curl_setopt($cFs,	CURLOPT_RETURNTRANSFER,	1);		//以字符串形式输出
 		curl_setopt($cFs,	CURLOPT_SSL_VERIFYPEER,	false);	//以字符串形式输出


 		$cHTML				= curl_exec($cFs);

 		if( false!=$cHTML ){
 			$Json			= json_decode($cHTML,true);
 			$openid = $Json['openid'];
 		}
 	}

 	return $openid;
 }

?>
