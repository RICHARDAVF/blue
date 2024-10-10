import { Component } from "react";
import code from './code.png'
import { Link } from "react-router-dom";
import { Context } from "./GlobalContext";
class NavBar extends Component{
    static contextType = Context
    constructor(props){
        super(props)
        
    }
    render(){
        return(
            <div className={this.props.show?"navbar active":"navbar"} style={{visibility:this.props.show,'visible':'hidden',width:this.props.show?240:0,overflow:'hidden',transition:'width 0.3s ease'}} >

                <ul>
                    <li>
                        <Link to='/pedidos'>
                            Mis Pedidos
                        </Link>
                    </li>
                    {
                        this.context.usuario.tipo_user==1 && 
                    <li>
                        <Link to='/pedidos/client'>
                            Pedido de clientes
                        </Link>
                    </li>
                    }
                </ul>

                
            </div>
        )
    }
}
export default NavBar