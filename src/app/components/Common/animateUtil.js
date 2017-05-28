/**
 * @description 元素动画
 * 
 * 
*/

var enterAnimateArray = [
    {type: "none", value: "无"},
    {type: "bounceIn", value: "弹性进入"},
    {type: "bounceInDown", value: "上方弹入"},
    {type: "bounceInUp", value: "下方弹入"},
    {type: "bounceInLeft", value: "左方弹入"},
    {type: "bounceInRight", value: "右方弹入"},
    {type: "fadeIn", value: "渐显"},
    {type: "fadeInDown", value: "上方渐显"},
    {type: "fadeInUp", value: "下方渐显"},
    {type: "fadeInLeft", value: "左方渐显"},
    {type: "fadeInRight", value: "右方渐显"},
    {type: "fadeInDownBig", value: "上方速显"},
    {type: "fadeInUpBig", value: "下方速显"},
    {type: "fadeInLeftBig", value: "左方速显"},
    {type: "fadeInRightBig", value: "右方速显"},
    {type: "flipInX", value: "X轴翻入"},
    {type: "flipInY", value: "Y轴翻入"},
    {type: "lightSpeedIn", value: "光速进入"},
    {type: "rotateIn", value: "旋转进入"},
    {type: "rotateInDownLeft", value: "左降进入"},
    {type: "rotateInDownRight", value: "右降进入"},
    {type: "rotateInUpLeft", value: "右升进入"},
    {type: "rotateInUpRight", value: "左升进入"},
    {type: "slideInUp", value: "下方滑入"},
    {type: "slideInDown", value: "上方滑入"},
    {type: "slideInLeft", value: "左方滑入"},
    {type: "slideInRight", value: "右方滑入"},
    {type: "zoomIn", value: "变大进入"},
    {type: "zoomInDown", value: "变大掉入"},
    {type: "zoomInLeft", value: "左方扩进"},
    {type: "zoomInRight", value: "右方扩进"},
    {type: "zoomInUp", value: "变大飞入"},
    {type: "rollIn", value: "卷入"},
    {type: "ltSlideIn", value: "左上滑入"},
    {type: "rtSlideIn", value: "右上滑入"},
    {type: "lbSlideIn", value: "左下滑入"},
    {type: "rbSlideIn", value: "右下滑入"},
    {type: "scaleInToBig", value: "进入放大"},
    {type: "scaleInToSmall", value: "进入缩小"}

];


    enterAnimateArray.push(
        {type: "clipLeftNoTrans", value: "左渐显现"},
        {type: "clipRightNoTrans", value: "右渐显现"},
        {type: "clipTopNoTrans", value: "上渐显现"},
        {type: "clipBottomNoTrans", value: "下渐显现"}
    );

var exitAnimateArray = [
    {type: "none", value: "无"},
    {type: "bounceOut", value: "弹性退出"},
    {type: "bounceOutDown", value: "下方弹出"},
    {type: "bounceOutUp", value: "上方弹出"},
    {type: "bounceOutLeft", value: "左方弹出"},
    {type: "bounceOutRight", value: "右方弹出"},
    {type: "fadeOut", value: "渐隐"},
    {type: "fadeOutDown", value: "下方渐隐"},
    {type: "fadeOutUp", value: "上方渐隐"},
    {type: "fadeOutLeft", value: "左方渐隐"},
    {type: "fadeOutRight", value: "右方渐隐"},
    {type: "fadeOutDownBig", value: "下方速隐"},
    {type: "fadeOutUpBig", value: "上方速隐"},
    {type: "fadeOutLeftBig", value: "左方速隐"},
    {type: "fadeOutRightBig", value: "右方速隐"},
    {type: "flipOutX", value: "X轴翻出"},
    {type: "flipOutY", value: "Y轴翻出"},
    {type: "lightSpeedOut", value: "光速退出"},
    {type: "rotateOut", value: "旋转退出"},
    {type: "rotateOutDownLeft", value: "右降退出"},
    {type: "rotateOutDownRight", value: "左降退出"},
    {type: "rotateOutUpLeft", value: "左升退出"},
    {type: "rotateOutUpRight", value: "右升退出"},
    {type: "slideOutUp", value: "上方滑出"},
    {type: "slideOutDown", value: "下方滑出"},
    {type: "slideOutLeft", value: "左方滑出"},
    {type: "slideOutRight", value: "右方滑出"},
    {type: "zoomOut", value: "缩小退出"},
    {type: "zoomOutDown", value: "缩小掉落"},
    {type: "zoomOutLeft", value: "左方缩退"},
    {type: "zoomOutRight", value: "右方缩退"},
    {type: "zoomOutUp", value: "缩小飞出"},
    {type: "rollOut", value: "滚出"},
    {type: "ltSlideOut", value: "左上滑出"},
    {type: "rtSlideOut", value: "右上滑出"},
    {type: "lbSlideOut", value: "左下滑出"},
    {type: "rbSlideOut", value: "右下滑出"},
    {type: "hinge", value: "掉落"},
{type: "zoomInFadeOut", value: "先进后出"}
];

var stressAnimateArray = [
    {type: "none", value: "无"},
    {type: "bounce", value: "抖动"},
    {type: "flash", value: "闪烁"},
    {type: "shake", value: "晃动"},
    {type: "rubberBand", value: "橡皮筋"},
    {type: "swing", value: "摆动"},
    {type: "tada", value: "得瑟"},
    {type: "wobble", value: "摇晃"},
    {type: "flip", value: "翻转"},
    {type: "jello", value: "摆动"},
    {type: "pulse", value: "脉动"},
    {type: "scaleElastic", value: "规则跳动"},
    {type: "directWhirlIn", value: "顺时旋转"},
    {type: "inverseWhirlIn", value: "逆时旋转"},
    {type: "enlargeMinify", value: "放大还原"},
    {type: "minifyEnlarge", value: "缩小还原"},
    {type: "driftUpDown", value: "浮动"},
    {type: "sway", value: "震动"},
    {type: "pulseScale", value: "心脏跳动"},
    {type: "swingAround", value: "中心摇动"},
    {type: "moveTopALittle", value: "上移一点"},
    {type: "moveBotALittle", value: "下移一点"},
    {type: "moveLeftALittle", value: "左移一点"},
    {type: "moveRightALittle", value: "右移一点"},
    {type: "blurALittle", value: "模糊一点"},
    {type: "clearToBlur", value: "清晰模糊"},
    {type: "moveTopALittleNoTrans", value: "放大上移"},
    {type: "moveBotALittleNoTrans", value: "放大下移"},
    {type: "moveLeftALittleNoTrans", value: "放大左移"},
    {type: "moveRightALittleNoTrans", value: "放大右移"},
    {type: "slowToBigNoTrans", value: "慢慢放大"},
    {type: "slowToSmallNoTrans", value: "慢慢缩小"},
    {type: "ltSlideALittle", value: "左上移动"},
    {type: "lbSlideALittle", value: "左下移动"},
    {type: "rtSlideALittle", value: "右上移动"},
    {type: "rbSlideALittle", value: "右下移动"}
];
var animationTypes = {};
stressAnimateArray.forEach((item)=> {
    animationTypes[item.type] = "stress"
})
exitAnimateArray.forEach((item)=> {
    animationTypes[item.type] = "out"
})
enterAnimateArray.forEach((item)=> {
    animationTypes[item.type] = "in"
})

module.exports = {
    getType: function getType(animateName) {
        return animationTypes[animateName]
    }
}