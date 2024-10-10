import { Component } from "react";

class Page404 extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
        <div style={{
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            color:'black',
            fontWeight:'bold',
            height: '100vh',
            textAlign: 'center' 
        }}>
            Página no encontrada
        </div>

        )
    }
}
export default Page404