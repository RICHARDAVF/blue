import { Component } from "react";
import code from './code.png'
import { Link } from "react-router-dom";
class NavBar extends Component{
    constructor(props){
        super(props)
        
    }
    render(){
        return(
            <div className={this.props.show?"navbar active":"navbar"} style={{visibility:this.props.show,'visible':'hidden',width:this.props.show?240:0,overflow:'hidden',transition:'width 0.3s ease'}} >

                <ul>
                    <li>
                        <Link to='/pedidos'>
                            Pedidos
                        </Link>
                    </li>
                </ul>

                
            </div>
        )
    }
}
export default NavBar