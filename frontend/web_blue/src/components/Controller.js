import { Component } from "react";
import {BrowserRouter,Route,Routes} from "react-router-dom"
import { Context } from "./GlobalContext";
import NavBar from "./Navbar";
import Login from "../views/user/Login";
import Content from "./Content";
import Header from "./Header";
import Register from "../views/user/Register";
import Page404 from "./Page404";

class Controller extends Component{
    static contextType = Context
    constructor(props){
        super(props)
        this.state = {
            shownav:false,
            showmenu :false
        }
    }
    componentDidMount(){
        const is_login = localStorage.getItem("login")

        if(is_login){
            
            this.context.updateState({'login':is_login})
        }
        const user = localStorage.getItem("user")
        if(user){
            this.context.updateState({usuario:JSON.parse(user)})
        }
    }


    render(){
       
        return(
            <BrowserRouter>
            {(!this.context.login)?
                <Routes>
                    <Route path="/" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/*" element={<Page404/>}/>
                </Routes>
                :
                <div>
                    <Header/>
                    <div className="main">
                        <NavBar show={this.context.shownav}/>
                        <Content show={this.context.shownav}/>
                    </div>
                </div>
            }
            </BrowserRouter>
        )
    }
}

export default Controller