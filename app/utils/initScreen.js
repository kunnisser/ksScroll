/**
 * Created by Administrator on 2016/12/13.
 */
var initScale=function(){
    var baseClientWidth=document.documentElement.clientWidth>640?640:(document.documentElement.clientWidth>320?document.documentElement.clientWidth:320);
    document.documentElement.style.fontSize=baseClientWidth/6.4+"px";
};
initScale.call(this);
window.onresize=initScale;