/**
 * Created by Administrator on 2016/12/13.
 */
import React, {Component} from "react";
import ReactDom from "react-dom";
import Styles from '../../sass/main.scss';
class Search extends Component{
    constructor(props){
        super(props);
        this.handleSearch=this.handleSearch.bind(this);
    }
    handleSearch(){
        let inputValue=ReactDom.findDOMNode(this.refs.searchInput).value;
        inputValue.trim() && this.props.sendAction(inputValue);
    }
    render(){
        return (
            <div className={Styles["ks-flexbox"]}>
                <div className={Styles["flex-child-1"]+" "+Styles["ks-default-logo"]+" "+Styles["left-radius"]}><div className={Styles["ks-logo"]}></div></div>
                <div className={Styles["flex-child-5"]}><input className={Styles["whole-wd"]} type="text" ref="searchInput" placeholder=""/></div>
                <div className={Styles["flex-child-2"]+" "+Styles["right-radius"]}><button className={Styles["ks-default-btn"]+" "+Styles["whole-wd"]} onClick={this.handleSearch}>Search</button></div>
            </div>
        );
    }
}

export default Search;