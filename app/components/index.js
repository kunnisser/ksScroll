/**
 * Created by Administrator on 2016/12/9.
 */
import React, {Component} from 'react';
import Styles from '../sass/main.scss';
import Searchbar from './searchCmp/searchBar';
import Searchlist from './searchCmp/searchList';

export default class Index extends Component{
    constructor(props){
        super(props);
        this.state={"keyword":""};
        this.refreshKeyword=this.refreshKeyword.bind(this);
    }
    refreshKeyword(name){
        this.setState({"keyword":name});
    }
   render(){
       return (
           <div className={Styles["container"]}>
               <div className={Styles["ks-topbar"]}>
                   <Searchbar sendAction={this.refreshKeyword}/>
               </div>
               <div className={Styles["ks-main"]}>
                   <Searchlist keyWord={this.state.keyword}/>
               </div>
               <div className={Styles["ks-bottombar"]}>
                   <div className={Styles["ks-flexbox"]}>
                       <div className={Styles["flex-child-1"]}>
                           <div className={Styles["ks-menu-items"]}>
                               <div className={Styles["ks-icon"]+" "+Styles["icon-home"]}></div>
                               <div className={Styles["ks-menu-text"]}>首页</div>
                           </div>
                       </div>
                       <div className={Styles["flex-child-1"]}>
                           <div className={Styles["ks-menu-items"]}>
                               <div className={Styles["ks-icon"]+" "+Styles["icon-heart"]}></div>
                               <div className={Styles["ks-menu-text"]}>推荐美食</div>
                           </div>
                       </div>
                       <div className={Styles["flex-child-1"]}>
                           <div className={Styles["ks-menu-items"]+" "+Styles["menu-func"]}>
                               <div className={Styles["ks-icon"]+" "+Styles["icon-plus-outline"]}></div>
                           </div>
                       </div>
                       <div className={Styles["flex-child-1"]}>
                           <div className={Styles["ks-menu-items"]}>
                               <div className={Styles["ks-icon"]+" "+Styles["icon-image"]}></div>
                               <div className={Styles["ks-menu-text"]}>产品赏析</div>
                           </div>
                       </div>
                       <div className={Styles["flex-child-1"]}>
                           <div className={Styles["ks-menu-items"]}>
                               <div className={Styles["ks-icon"]+" "+Styles["icon-user"]}></div>
                               <div className={Styles["ks-menu-text"]}>关于我们</div>
                           </div>
                       </div>
                   </div>
               </div>
           </div>
       );
   }
}