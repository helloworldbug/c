<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title></title>
</head>
<body>
<?php

/**
 * 红包付款
 * 
 */
$_input_charset = $_POST['_input_charset'];
$body = $_POST['body'];
$notify_url = $_POST['notify_url'];
$out_trade_no = $_POST['out_trade_no'];
$partner = $_POST['partner'];
$payment_type = $_POST['payment_type'];
$return_url = $_POST['return_url'];
$seller_email = $_POST['seller_email'];
$service = $_POST['service'];
$subject = $_POST['subject'];
$total_fee = $_POST['total_fee'];
$sign = $_POST['sign'];
$sign_type = $_POST['sign_type'];
?>
<form id="alipaysubmit" name="alipaysubmit" action="https://mapi.alipay.com/gateway.do?_input_charset=utf-8" method="get">
<input type="hidden" name="_input_charset" value="<?php echo $_input_charset?>">
<input type="hidden" name="body" value="<?php echo $body?>">
<input type="hidden" name="notify_url" value="<?php echo $notify_url?>">
<input type="hidden" name="out_trade_no" value="<?php echo $out_trade_no?>">
<input type="hidden" name="partner" value="<?php echo $partner?>">
<input type="hidden" name="payment_type" value="<?php echo $payment_type?>">
<input type="hidden" name="return_url" value="<?php echo $return_url?>">
<input type="hidden" name="seller_email" value="<?php echo $seller_email?>">
<input type="hidden" name="service" value="<?php echo $service?>">
<input type="hidden" name="subject" value="<?php echo $subject?>">
<input type="hidden" name="total_fee" value="<?php echo $total_fee?>">
<input type="hidden" name="sign" value="<?php echo $sign?>">
<input type="hidden" name="sign_type" value="<?php echo $sign_type?>">

<input type="submit" value="正在跳转...">
</form>
<script>
document.forms['alipaysubmit'].submit();
</script>
</body>
</html>