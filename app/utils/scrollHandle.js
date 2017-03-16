/**
 * Created by Intel on 2017/1/2 0002.
 */
export default function scrollHandle(){
    /*initialize scroll actives*/
    const defaults={
        bodyEl:"ksScrollBody",
        contentEl:"ksScrollArea",
        freshMesEl:"ksScrollFresh",
        loadMesEl:"ksScrollLoad",
        refreshFunction:false,
        loadingFunction:false
    }

    const init=function(params){
        let innerParams= params || {},
            options={
                Component:innerParams.Component || null,
                bodyEl:innerParams.bodyEl || document.getElementById(defaults.bodyEl),
               contentEl:innerParams.contentEl || document.getElementById(defaults.contentEl),
                freshMesEl:innerParams.freshMesEl || document.getElementById(defaults.freshMesEl),
                loadMesEl:innerParams.loadMesEl || document.getElementById(defaults.loadMesEl),
                refreshFunction:innerParams.refreshFunction || document.getElementById(defaults.refreshFunction),
                loadingFunction:innerParams.loadingFunction || document.getElementById(defaults.loadingFunction)
            };
        (new scrollApp(options)).create();
    };

    const scrollApp=function(options){
        this.options=options,
        this.topSlow=5,//顶部阻尼基数
        this.topY=0,//距离顶部偏移距离
        this.startY=0,//每次滑动起始Y值
        this.dragMove=0,//每次滑动Y移动距离
        this.moveState=!1,//滚动状态
        this.lastMoveStart=0,//惯性缓动初始位置
        this.lastMoveTime=0,//初始化时间戳
        this.stopInertiaMove=!0,//关闭惯性flag
        this.topPullY=0,//顶部最大位置
        this.PullL=50,//顶部最大pull距离
        this.PushL=50,//底部最大push距离,
        this.freshFlag=!1,//刷新开关
        this.loadingFlag=!1,
        this.touchBoundFlag=!1
    };
    scrollApp.prototype.create=function(){
        this.addEvent();
    };
    scrollApp.prototype.addEvent=function(){
        this.options.contentEl.addEventListener("touchstart",this.touchstart.bind(this),false),
        this.options.contentEl.addEventListener("touchmove",this.touchmove.bind(this),false),
        this.options.contentEl.addEventListener("touchend",this.touchend.bind(this),false),
        this.options.contentEl.addEventListener("touchcancel",this.touchend.bind(this),false)
    };
    scrollApp.prototype.touchstart=function(e){
        e.preventDefault(),
        this.touchBoundFlag=!0,
        this.bottomPushY=this.options.bodyEl.offsetHeight-this.options.contentEl.offsetHeight,
        this.moveStart(e);
    };
    scrollApp.prototype.touchmove=function(e){
        e.preventDefault();
        if(this.touchBoundFlag && (e.touches[0].pageY < 0 || e.touches[0].pageY > window.innerHeight || e.touches[0].pageX<0 || e.touches[0].pageX >window.innerWidth)){
            this.touchend(e),
            this.touchBoundFlag=!1
        }else{
            this.moveIng(e)
        }
    };
    scrollApp.prototype.touchend=function(e){
        e.preventDefault(),
        this.moveEnd(e)
    };
    scrollApp.prototype.moveStart=function(e){
        this.moveState=!0,
        this.stopInertiaMove=!0,
        e.touches &&
        (e=e.touches[0],
        this.startY=e.pageY,
        this.lastMoveStart=this.startY,
        this.lastMoveTime=new Date().getTime()
        )
    };
    scrollApp.prototype.moveIng=function(e){
        if(e.touches){
            let nowY=e.touches[0].pageY;
            this.dragMove=nowY-this.startY,
            this.startY=nowY;
            this.topY > this.topPullY && (
                this.dragMove=this.dragMove/this.topSlow,
                (this.topY + this.topPullY) > this.PullL ? (this.options.freshMesEl.classList.add('refreshReady'),
                    this.freshFlag=!0,
                    this.options.Component.setState({"refreshMesFlag":!0})):
                    (this.options.freshMesEl.classList.remove('refreshReady'),
                    this.freshFlag=!1,
                    this.options.Component.setState({"refreshMesFlag":!1}))
            ),
            this.topY < this.bottomPushY && (
                this.dragMove=this.dragMove/this.topSlow,
                    (this.topY<this.bottomPushY-this.PushL) ? (this.options.loadMesEl.classList.add('refreshReady'),
                    this.loadingFlag=!0,
                    this.options.Component.setState({"loadingMesFlag":!0})):
                    (this.options.loadMesEl.classList.remove('refreshReady'),
                    this.loadingFlag=!1,
                    this.options.Component.setState({"loadingMesFlag":!1}))
            ),
            this.topY+=this.dragMove;
            let nowMoveTime=new Date().getTime();
            this.stopInertiaMove=!1,
            (nowMoveTime-this.lastMoveTime > 300) && (  //检测触碰滑动接触的时间
                this.lastMoveTime=nowMoveTime,
                this.lastMoveStart=nowY
            );
            requestAnimationFrame(this.moveTranslate.bind(this));
        }
    };
    scrollApp.prototype.moveEnd=function(e){
        e.changedTouches && (
            e=e.changedTouches[0],
            this.dragMove=e.pageY-this.startY,
            this.topY+=this.dragMove,
            this.startY=e.pageY
        );
        //this.topY < this.bottomPushY && (this.options.contentEl.classList.add('transLoading'));
        let nowMoveTime=new Date().getTime(),
            currentThis=this,
        vertY=(e.pageY-this.lastMoveStart)/(nowMoveTime-this.lastMoveTime),//计算惯性速度
        dir=vertY>0 ? -1:1,
        deceleration=dir*0.001;
        (function inertiaMove(){
            if(currentThis.stopInertiaMove)
                return;
            let nowTimer=new Date().getTime(),
                t=nowTimer-nowMoveTime;
            vertY=vertY+parseFloat(deceleration*t);
            nowMoveTime=nowTimer;
            (vertY*deceleration>=0) && (currentThis.stopInertiaMove=!0);//判断惯性速度是否为零
            if(currentThis.topY >= currentThis.topPullY){
                currentThis.topY = currentThis.topPullY;
            }else if(currentThis.topY <= currentThis.bottomPushY ){
                currentThis.topY = currentThis.bottomPushY;
            }else{
                currentThis.topY+=vertY*25;
                requestAnimationFrame(inertiaMove)
            }
            currentThis.moveTranslate();
        })();
        this.dragMove=0,
        this.moveState=!1,
        this.freshFlag && (this.options.refreshFunction()),
        this.loadingFlag && (
                currentThis.options.loadingFunction().then(currentThis.loadingFlag=!1)
            ),
        this.options.contentEl.removeEventListener("touchmove",this.touchmove,false),
        this.options.contentEl.removeEventListener("touchend",this.touchend,false)
    };
    scrollApp.prototype.moveTranslate=function(){
        this.options.contentEl.style.transform="translate3d(0,"+this.topY+"px,0)",
        this.options.contentEl.style.webkitTransform="translate3d(0,"+this.topY+"px,0)"
    };
    return {
        init:init
    }
}