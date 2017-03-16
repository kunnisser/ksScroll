/**
 * Created by Administrator on 2016/12/13.
 */
import React, {Component} from "react";
import Config from "../../data/config.json";
import Fetch from "isomorphic-fetch";
import Styles from '../../sass/main.scss';
import ScrollRefresh from "../ksScroll/scrollRefresh";
class SearchList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            "refresh" : !1,
            "loading": !1,
            "index" : 1,
            "end":!1,
            "list": []
        };
    }
    componentDidMount() {
        this.setState({"firstView": !0});
    }
    freshUrl(id){
        this.setState({"refresh": !0});
        let requestPath = Config.fetchUrl["searchUrl"];
        Fetch(requestPath)
            .then(res => res.json())
            .then(data => {
                this.setState({"refresh": !1, "index":1 , "loadEnd":!1 , "list": data.events})
            })
            .catch(err => console.error(err));
    }
    loadUrl(id){
        this.setState({"loading": !0});
        let requestPath=Config.fetchUrl["loadingUrl"]+this.state.index+".json";
        Fetch(requestPath,{
            method: "GET",
        }).then(res => {
            if(res.ok)
              return  res.json();
        })
            .then(data => {
                data && this.setState({"loading": !1, "index" : parseInt(this.state.index+1), "list": this.state.list.concat(data.events)})
             }).catch(err => console.error(err))
    }
    componentWillReceiveProps(nextProps) {
        this.setState({"firstView": !1});
        this.freshUrl(nextProps);
    }
    handleImageLoaded(e){
        e.currentTarget.setAttribute("class","lazyShow");
    }
    handleRefresh(){
        this.freshUrl();
    }
    handleLoading(){
        this.state.index<6 ? this.loadUrl() : this.setState({"loadEnd":!0});
    }
    handleHref(){
        alert(123);
    }
    render() {
        let searchHtml, changeStateHtml,fullLoading, fullView, successView;
        (this.state.refresh && !this.state.firstView) && (
            document.body.addEventListener("touchmove",(e)=>{
                e.preventDefault();
            },false)
        );
        fullView = (
            <div className={Styles["ks-flexbox"] + " " + Styles["whole-hg"]}>
                <div className={Styles["flex-child-1"]}>
                    <div className={Styles["searchResultInit"]}>
                        <i className={Styles["ks-icon"] + " " + Styles["icon-zoom"]}></i><span>查询</span>
                    </div>
                </div>
            </div>
        );
        fullLoading=(
            <div className={Styles["ks-flexbox"] + " " + Styles["whole-hg"]}>
                <div className={Styles["flex-child-1"]}>
                    <div className={Styles["loader"]+" "+Styles["square-loader"]}>
                        <div className={Styles["square-am-1"]}></div>
                        <div className={Styles["square-am-2"]}></div>
                        <div className={Styles["square-am-3"]}></div>
                        <div className={Styles["square-am-4"]}></div>
                    </div>
                </div>
            </div>
        );
        successView = (<ScrollRefresh onRefresh={this.handleRefresh.bind(this)} onLoading={this.handleLoading.bind(this)} disabled={this.state.loadEnd}  className={Styles["searchResultList"]}>
            <ul className={Styles["ks-wtfl"]}>
                <li className={Styles["col-wtf"]}>
                    {
                        this.state.list.map((goods, index) => {
                            if(!(index%2))
                                return(
                                    <div key={index} onClick={this.handleHref} className={Styles["searchWrapItem"]}>
                                        <div className={Styles["imgLazyLoadedBox"]}><img onLoad={this.handleImageLoaded.bind(this)} src={goods.image_lmobile}/></div>
                                        <h3>{goods.title}</h3>
                                    </div>)
                            }
                        )}
                </li>
                <li className={Styles["col-wtf"]}>
                    {
                        this.state.list.map((goods, index) =>{
                            if(index%2)
                                return(
                                    <div key={index} className={Styles["searchWrapItem"]}>
                                    <div className={Styles["imgLazyLoadedBox"]}><img onLoad={this.handleImageLoaded.bind(this)} className={this.state.imageStatus ? Styles["lazyShow"] : ""} src={goods.image_lmobile}/></div>
                                    <h3>{goods.title}</h3>
                                    </div>)
                            }
                        )}
                </li>

            </ul>
        </ScrollRefresh>);

        changeStateHtml = this.state.firstView ? fullView : (this.state.refresh ? fullLoading : successView);
        searchHtml = <div className={Styles["ks-panel"] + " " + Styles["default-panel"]}>{changeStateHtml}</div>;
        return (searchHtml);
    }
}

export default SearchList;