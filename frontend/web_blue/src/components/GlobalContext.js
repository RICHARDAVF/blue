import { Component,createContext } from "react";

export  const Context = createContext()
class Provider extends Component{
    constructor(props){
        super(props)
        this.state = {
            login:false,
            shownav:false,
            //dominio:'http://192.168.1.12:8000',
            //  dominio:'http://192.168.1.12:3030',
            dominio:'http://192.168.0.105:8000',
            // dominio:'http://192.168.1.12:80',
            documento_proveedor:'',
            usuario :{
                
            }
        }
    }

    updateState=(state)=>{
        this.setState(state)
    }
    render(){
        const globalContext = {
            ...this.state,
            updateState :this.updateState
        }
        return <Context.Provider value={globalContext}>{this.props.children}</Context.Provider>
    }
}
export default Provider