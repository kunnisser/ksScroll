/**
 * Created by Administrator on 2016/12/29.
 */
import React,{PropTypes,Component} from "react";
import ReactDom from "react-dom";
import ScrollHandle from "../../utils/scrollHandle";
import Styles from "../../sass/main.scss";
import Config from "../../data/config.json";

export default class ScrollRefresh extends Component{
    constructor(props){
        super(props);
        this.state={"initialized":!1,"refreshMesFlag":!1,"loadingMesFlag":!1},
        this.handleRefresh=this.handleRefresh.bind(this),
        this.handleLoading=this.handleLoading.bind(this);
    }
    handleRefresh(){
        return new Promise((resolve, reject) => {
            this.props.onRefresh(resolve, reject);
        });
    }
    handleLoading(){
        return new Promise((resolve,reject) => {
           this.props.onLoading(resolve,reject);
        });
    }
    init(){
        this.state.initialized || (
            ScrollHandle().init({
                bodyEl:this.refs.body,
                contentEl:this.refs.view,
                freshMesEl:this.refs.srLoading,
                loadMesEl:this.refs.loadingMore,
                refreshFunction:this.handleRefresh,
                loadingFunction:this.handleLoading,
                Component:this
            }),
            this.setState({"initialized":!0})
        );
    }
    componentDidMount(){
        this.props.disabled || this.init();
    }
    render(){
        const {
            children,
            onRefresh,
            onLoading,
            disabled,
            icon,
            ...rest
        }=this.props;
        return <div ref="body" {...rest}>
                    <div ref="view" className={Styles["refresh-view"]}>
                        <div ref="srLoading" className={Styles["ks-srLoading"]}>
                            <span className={Styles["ks-icon"]+" "+Styles["icon-arrow-down-outline"]}>
                                <span className={Styles["sr-text"]}>
                                    {this.state.refreshMesFlag ? Config.loadingMes.afterFresh : Config.loadingMes.beforeFresh}
                                    </span>
                            </span>
                        </div>
                        {children}
                        <div ref="loadingMore" className={Styles["ks-moreLoading"]}>
                            <span className={Styles["ks-icon"]+" "+Styles["icon-arrow-up-outline"]}>
                                <span className={Styles["sr-text"]}>
                                    {
                                        disabled ? Config.loadingMes.loadingEnd :
                                        (this.state.loadingMesFlag ? Config.loadingMes.showMore : Config.loadingMes.loadingMore)
                                    }
                                </span>
                            </span>
                        </div>
                    </div>
              </div>;
    }

}

ScrollRefresh.propTypes={
    onRefresh: PropTypes.func.isRequired,
    onLoading:PropTypes.func.isRequired,
    icon:PropTypes.bool,
    disabled:PropTypes.bool
}