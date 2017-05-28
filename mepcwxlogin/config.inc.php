<?php
/**
 * 微信第三方登录配置文件
 * 
 */

define("WeiXinAppID",		'wxaa846f77ece37b87');
define("WeiXinAppSecret",	"f0d946528c0a81c7b156d0b6fe761195");

//登录成功后微信回调地址，请保证与应用申请的域名地址保持一致
define("WeiXinRedirectURL",	"http://www.agoodme.com/mepcwxlogin/weixin_ref.php");

session_start();



function FunDeBug( $Arr ){
	if( $_GET['debug']=="1"||$_COOKIE['debug']=="1" ){
		print_r($Arr);
	}
}



/**
 * 获取微信登录地址
 * @return string
 */
function GetWeiXinLoginURL(){
	$_SESSION['WXAPIST']	= 	md5(time()+"abc");
	$URL					= 	"https://open.weixin.qq.com/connect/qrconnect?appid=". WeiXinAppID .
								"&redirect_uri=" . urlencode(WeiXinRedirectURL) . "&response_type=code&scope=snsapi_login&state=".$_SESSION['WXAPIST']
								."#wechat_redirect";
	return $URL;
}


//获取accessToKen
/**
{ 
"access_token":"ACCESS_TOKEN", 
"expires_in":7200, 
"refresh_token":"REFRESH_TOKEN",
"openid":"OPENID", 
"scope":"SCOPE",
"unionid": "o6_bmasdasdsad6_2sgVt7hMZOPfL"
}
 */
function GetWeiXinAccessToKen( $Code ){
	$ToCode					= $Code;
	$ToURL					= "https://api.weixin.qq.com/sns/oauth2/access_token?appid=". WeiXinAppID ."&secret=". WeiXinAppSecret ."&code={$ToCode}&grant_type=authorization_code";
	$Run					= false;
	
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
			
			if( is_array($Json)&&!empty($Json['access_token'])&&!empty($Json['expires_in'])&&!empty($Json['openid']) ){
				$Run					= $Json;
				$Run["expires_time"]	= time();
			}
		}
	}
	
	return $Run;
}


/**
 * 返回个人信息
 * @param array $ToKen
 * @return Ambigous <boolean, string>
 * 
 * 
openid		普通用户的标识，对当前开发者帐号唯一
nickname	普通用户昵称
sex			普通用户性别，1为男性，2为女性
province	普通用户个人资料填写的省份
city		普通用户个人资料填写的城市
country		国家，如中国为CN
headimgurl	用户头像，最后一个数值代表正方形头像大小（有0、46、64、96、132数值可选，0代表640*640正方形头像），用户没有头像时该项为空
privilege	用户特权信息，json数组，如微信沃卡用户为（chinaunicom）
unionid		用户统一标识。针对一个微信开放平台帐号下的应用，同一用户的unionid是唯一的。
 * 
 */
function GetWeiXinUserInfo( array $ToKen ){
	
	$AccessToKen			= $ToKen['access_token'];
	$OpenID					= $ToKen['openid'];
	
	if( empty($AccessToKen)||empty($OpenID) ){
		return false;
	}
	
	$ToURL					= "https://api.weixin.qq.com/sns/userinfo?access_token={$AccessToKen}&openid={$OpenID}";
	$Run					= false;
	
	if( function_exists("curl_init") ){
		$cFs				= curl_init();
	
		curl_setopt($cFs,	CURLOPT_URL,		$ToURL);	//设定访问地址
		curl_setopt($cFs,	CURLOPT_HEADER,		false);		//关闭头输出
		curl_setopt($cFs,	CURLOPT_TIMEOUT,	10);		//超时10秒
		curl_setopt($cFs,	CURLOPT_RETURNTRANSFER,	1);		//以字符串形式输出
		curl_setopt($cFs,	CURLOPT_SSL_VERIFYPEER,	false);	//以字符串形式输出
		
		$cHTML				= curl_exec($cFs);
		
		if( false!=$cHTML ){
			$Json			= json_decode($cHTML,true);
			/*if( is_array($Json)&&!empty($Json['openid'])&&!empty($Json['nickname'])&&!empty($Json['sex']) ){
				$Run		= $Json;
			}*/
			if(is_array($Json)&&isset($Json['openid'])&&isset($Json['nickname'])&&isset($Json['sex']) ){
            				$Run		= $Json;
            			}
		}
	}
	
	return $Run;
}

