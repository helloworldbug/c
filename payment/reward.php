<?php
/**
 * 打赏
 * 
 */
$RefCode = trim($_GET['code']);
$Openid = GetWeiXinAccessToKen( $RefCode );

 function GetWeiXinAccessToKen( $Code ){
 	$ToCode = $Code;
 	$ToURL  = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=wxd2714a072abdd918&secret=8931787bcb61b7ee8d86c0c96158aece&code={$ToCode}&grant_type=authorization_code";
 	$openid = false;

 	if( function_exists("curl_init") ){
 		$cFs					= curl_init();

 		curl_setopt($cFs,	CURLOPT_URL,		$ToURL);	//设定访问地址
 		curl_setopt($cFs,	CURLOPT_HEADER,		false);		//关闭头输出
 		curl_setopt($cFs,	CURLOPT_TIMEOUT,	10);		//超时10秒
 		curl_setopt($cFs,	CURLOPT_RETURNTRANSFER,	1);		//以字符串形式输出
 		curl_setopt($cFs,	CURLOPT_SSL_VERIFYPEER,	false);	//以字符串形式输出


 		$cHTML = curl_exec($cFs);

 		if( false!=$cHTML ){
 			$Json   = json_decode($cHTML,true);
 			$openid = $Json['openid'];
 		}
 	}

 	return $openid;
 }

?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title></title>
        <meta charset="utf-8">
        <meta name="viewport" id="viewport"
              content="width=640, initial-scale=0.5, minimum-scale=0.5, maximum-scale=0.5, user-scalable=yes">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black">
        <style type="text/css">
            * {
                margin: 0px;
                padding: 0px;
                box-sizing: border-box;
            }
            html,body {
                background: #1f1f1f;
                width: 100%;
                height: 100%;
                overflow: hidden;
            }
            .reward-content{
                width: 100%;
                height: 100%;
                background: #ececec;
                position: absolute;
                top: 0;
                left: 0;
            }

            .reward-header{
                position: absolute;
                width: 16.26%;
                top: 110px;
                left: 41.87%;
                height: 122px;
                box-sizing: border-box;
                border-radius: 100%;
                border: 2px solid #fff;
            }
            .reward-info{
                position: absolute;
                top: 262px;
                width: 100%;
                text-align: center;
                font-size: 28px;
                color: #000;
                line-height: 28px;
                letter-spacing: 2.8px;
            }
            #reward-level{
                font-weight: bold;
            }
            /*************************/
            #reward-money-list{
                position: absolute;
                top: 378px;
                width: 100%;
                height: 380px;
            }
            .money-list{
                width: 100%;
                height: 276px;
                padding-left: 2.53%;
                padding-right: 4.27%;
            }
            .money-list li{
                list-style-type: none;
                height: 125px;
                margin-bottom: 13px;
                width: 31.47%;
                float: left;
                text-align: center;
                line-height: 125px;
                margin-left: 1.86%;
                font-size: 48px;
                margin-bottom: 13px;
                color: #f15353;
                box-sizing: border-box;
                border: 1px solid #ccc;
                background: #fff;
            }
            .money-list-selected{
                color: #fff !important;
                background: #f15353 !important;
            }
            #go-back{
                display: inline-block;
                width: 100%;
                letter-spacing: -1.4px;
                margin-top: 75px;
                font-size: 28px;
                color: #999;
                text-align: center;
            }
            #go-back:link, #go-back:visited{
                color: #999;
            }
            /*************************/
            #reward-money-ok{
                display: none;
                position: absolute;
                top: 378px;
                width: 100%;
                height: 380px;
            }
            .reward-money-hint{
                width: 100%;
                font-size: 32px;
                color: #000;
                letter-spacing: -1.6px;
                text-align: center;
                margin-bottom: 44px;
            }
            #reward-money-content{
                width: 100%;
                font-size: 48px;
                color: #f15353;
                letter-spacing: -2.4px;
                text-align: center;
                margin-bottom: 88px;
            }
            #reward-ok{
                width: 91.47%;
                height: 88px;
                margin: 0 auto;
                border: 2px solid #ccc;
                color: #000;
                font-size: 32px;
                letter-spacing: -1.6px;
                text-align: center;
                line-height: 88px;
                border-radius: 44px;
            }
            /*************************/
            .service-tel{
                position: absolute;
                bottom: 24px;
                width: 100%;
                font-size: 26px;
                text-align: center;
                color: #999;
                letter-spacing: -1.3px;
            }
            /*************************/
            #msg-layer{
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,.5);
                position: absolute;
                z-index: 3;
                top: 0;
                left: 0;
                display: none;
            }
            .msg-box{
                width: 540px;
                height: 250px;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                transform: -webkit-translate(-50%, -50%);
                background: rgba(255,255,255,.9);
                border-radius: 12px;
                text-align: center;
            }
            .msg-hint{
                width: 100%;
                height: 160px;
                box-sizing: border-box;
                border: none;
                border-bottom: 1px solid #ccc;
                font-size: 28px;
                line-height: 160px;
                letter-spacing: -1.4px;
                color: #000;
            }
            .msg-btn{
                height: 90px;
                position: absolute;
                bottom: 0;
                box-sizing: border-box;
                width: 100%;
            }
            #reject-reward{
                width: 50%;
                height: 100%;
                box-sizing: border-box;
                border: 0;
                border-right: 1px solid #ccc;
                color: #999;
                font-size: 28px;
                letter-spacing: -1.4px;
                line-height: 90px;
                float: left;
            }
            #reward-again{
                width: 50%;
                height: 100%;
                box-sizing: border-box;
                border: 0;
                color: #0079FF;
                font-size: 28px;
                letter-spacing: -1.4px;
                float: right;
                line-height: 90px;
            }
            .common-active-btn:active{
                opacity: .5;
            }
        </style>
    </head>
    <body>
        <input id="openid" type="hidden" value="<?php echo $Openid ?>" />
        <div class="reward-content">
            <img class="reward-header" src=""/>
            <div class="reward-info"><span id="reward-name">迷途的鹿 </span><span id="reward-level">V6</span></div>
            <div id="reward-money-list">
                <ul class="money-list">
                    <li data-num="1">￥1</li>
                    <li data-num="5">￥5</li>
                    <li data-num="10">￥10</li>
                    <li data-num="20">￥20</li>
                    <li data-num="50">￥50</li>
                    <li data-num="100">￥100</li>
                </ul>
                <a id="go-back" href="">返回作品</a>
            </div>
            <div id="reward-money-ok">
                <div class="reward-money-hint">谢主隆恩，已收到赏金</div>
                <div id="reward-money-content">￥10</div>
                <div id="reward-ok" class="common-active-btn">朕知道了！</div>
            </div>
            <p class="service-tel">客服电话：13112345678</p>
        </div>
        <div id="msg-layer">
            <div class="msg-box">
                <div class="msg-hint">支付失败了~~(>_<)~~</div>
                <div class="msg-btn">
                    <div id="reject-reward" class="common-active-btn">拒绝打赏</div>
                    <div id="reward-again" class="common-active-btn">重新打赏</div>
                </div>
            </div>
        </div>
        <script type="text/javascript" src="https://cdn.bootcss.com/jquery/2.1.4/jquery.min.js"></script>
        <script src="http://www.agoodme.com/vendor/fmacapi/fmacapi.interface.min.js">
            var fmawr = "0";
        </script>
        <script type="text/javascript">
            var rewardHeader = $('.reward-header'); //受赏人头像
            var rewardName = $('#reward-name');     //受赏人名
            var rewardLeave = $('#reward-level');   //受赏人等级
            var rewardMoneyList = $("#reward-money-list");
            var rewardList = $('.money-list');   //打赏的钱
            var goBack = $('#go-back');             //返回作品

            var rewardMoneyOk = $("#reward-money-ok"); //大厦成功
            var rewardMoneyContent = $("#reward-money-content");  //收到的金额
            var rewardOkBtn = $("#reward-ok");     //知道按钮

            var msgLayer = $("#msg-layer");       //消息错误层
            var rejectReward = $("#reject-reward"); //拒绝打赏
            var rewardAgain = $("#reward-again");   //重新打赏
            //打赏的钱
            var checkMoney = 0; // 选中的钱
            var tplId = "";      //作品ID
            var userId = "";    //用户ID
            var pageId = "";    //页ID
            var userHeaderSrc = "";     //用户头像
            var userName = "";          //用户名称
            var userLeave = 0;          //用户等级
            $(document).ready(function() {
                initUserInfo();
                rewardList.on("click",rewardHandle );
                rewardOkBtn.on("click",rewardOkBtnHandle );
                rejectReward.on("click", rejectRewardHandle);
                rewardAgain.on("click", rewardAgainHandle);
            });
            /**
             * 初始化用户信息，作品信息
             * tpl_award_info 格式
             * {
             *   tplId: "",
             *   pageId:"",
             *   userId:"",
             *   userHeaderSrc:"",
             *   userName:"",
             *   userLeave:0
             * }
             */
            function initUserInfo (){
                //格式必须按照json字符串存储
                var tplAwardInfo = window.localStorage.tpl_award_info;
                console.log(tplAwardInfo);
                if(!tplAwardInfo) return;
                tplAwardInfo = JSON.parse(tplAwardInfo);
                tplId = tplAwardInfo.tplId;
                pageId = tplAwardInfo.pageId;
                userId = tplAwardInfo.userId;
                userHeaderSrc = tplAwardInfo.userHeaderSrc;
                userName = tplAwardInfo.userName;
                userLeave = tplAwardInfo.userLeave;

                rewardHeader.attr("src", userHeaderSrc);
                rewardName.text(userName);
                rewardLeave.text("V"+userLeave);
                //正式服的返回链接
                var linkSrc = "http://" + location.host + "/views/mobile.html?tid="+tplId+"&dataFrom=pc2-0";
                if(pageId){
                    linkSrc = linkSrc+"&pid="+pageId;
                }
                //仅供测试
//                var linkSrc = "http://" + location.host + "/branches/test/index.html";
                goBack.attr("href", linkSrc);
            }
            /**
             * 打赏的具体操作
             * @param e
             */
            function rewardHandle(e){
                e.preventDefault();
                e.stopPropagation();
                var liList  = rewardList.find("li");
                for(var i = 0; i < liList.length; i ++){
                    $(liList[i]).removeClass("money-list-selected");
                }
                var $target = $(e.target);
                var moneyNum = $target.attr("data-num");
                if(moneyNum){
                    checkMoney = parseInt(moneyNum);
                    $target.addClass("money-list-selected");
                    weiXinPay();
                    //支付成功显示界面
                }
            }
            /**
             * 微信支付具体实现
             *
             **/
            function weiXinPay(){
                // 选中的钱 checkMoney
                //作品ID tplId
                //用户ID userId
                var openid = $("#openid").val();
                var data = {
                    openid: openid,
                    total_fee: checkMoney,// 金额
                    trade_type: '1',//交易类型 1为打赏
                    tid: tplId,//作品id
                    uid: userId,//打赏给用户的id
                    body:'打赏'  // 描述
                };
                if(!openid || !tplId || !userId){
                    alert("openid = " + openid + " tid = " + tplId + " uid = " + userId);
                    return;
                }
                fmacloud.Cloud.run('wechat_jsapi', data, {
                    success: function (data) {
                        WeixinJSBridge.invoke('getBrandWCPayRequest',{
                            "appId":JSON.parse(data).appId,
                            "timeStamp":JSON.parse(data).timeStamp,
                            "nonceStr":JSON.parse(data).nonceStr,
                            "package":JSON.parse(data).package,
                            "signType" : JSON.parse(data).signType,
                            "paySign":JSON.parse(data).paySign
                        },
                        function(res){
                            //支付成功或失败前台判断
                            if(res.err_msg=='get_brand_wcpay_request:ok'){
                                rewardOkHandle();
                            }else{
                                rewardFailHandle();
                            }
                        });

                    },
                    error: function (error) {
                        rewardFailHandle();
                    }
                });


            }
            /**
             * 打赏的成功页面点击知道回调处理函数
             * @param e
             */
             function rewardOkBtnHandle (e){
                e.preventDefault();
                e.stopPropagation();
                rewardMoneyOk.hide();
                rewardMoneyList.show();
            }
            /**
             * 打赏成功的回调函数
             */
            function rewardOkHandle(){
                rewardMoneyList.hide();
                rewardMoneyContent.text("￥" + checkMoney);
                rewardMoneyOk.show();
            }
            /**
             * 打赏失败的回调函数
             */
            function rewardFailHandle(){
                msgLayer.show();
            }
            /**
             * 拒绝打赏
             * @param e
             */
            function rejectRewardHandle(e){
                e.preventDefault();
                e.stopPropagation();
                msgLayer.hide();
                var linkSrc = "http://" + location.host + "/views/mobile.html?tid="+tplId+"&dataFrom=pc2-0";
                if(pageId){
                    linkSrc = linkSrc+"&pid="+pageId;
                }
                goBack.attr("href", linkSrc);
            }
            /**
             * 重新打赏
             * @param e
             */
            function rewardAgainHandle(e){
                e.preventDefault();
                e.stopPropagation();
                msgLayer.hide();
            }
        </script>
    </body>
</html>