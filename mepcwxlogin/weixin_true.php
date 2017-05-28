<?php
require_once 'config.inc.php';


FunDeBug($_SESSION);


$Action		= trim($_GET['act']);
$Json		= array("status"=>true,"data"=>array());
switch($Action){
	case "token":
		$RefCode	= $_SESSION['weixin_code'];
		$RefState	= $_SESSION['weixin_state'];
		
		//获取ACCESS_TOKEN 访问令牌
		$AccessToKen	= GetWeiXinAccessToKen( $RefCode );
		if( false!=$AccessToKen ){
			$_SESSION['WeiXinAccessToKen']		= $AccessToKen;
		}
	break;
	
	
	case "user_info":
		if( !empty($_SESSION['WeiXinUserInfo']) ){ 
			$Json['data']	= $_SESSION['WeiXinUserInfo'];
			break;
		}
		
		$Json['status']		= false;
	break;
}


echo json_encode($Json);

