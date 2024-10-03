import { Component } from "react";
import { Context } from "./GlobalContext";
import { withRouter } from "./Router";
import { Route, Routes } from "react-router-dom";
import Pedido from "../views/pedidos/Pedido";
import NewPedido from "../views/pedidos/newpedido";
class Content extends Component{
    static contextType = Context
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div className={this.context.shownav ? 'content shifted' : 'content'}>
                <Routes>

                    <Route path="/pedidos"  element={<Pedido/>}/>
                    <Route path="/pedidos/add"  element={<NewPedido/>}/>


                </Routes>
            </div>
        )
    }
}
export default withRouter(Content)