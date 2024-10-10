import { Component } from "react";
import { Context } from "./GlobalContext";
import {GiHamburgerMenu} from 'react-icons/gi'
import { withRouter } from "./Router";
import Swal from "sweetalert2";
class Header extends Component{
    static contextType = Context
    constructor(props){
        super(props)
        this.state ={
            showmenu:false
        }
    }
    showMenuButton(){
        this.setState({showmenu:!this.state.showmenu})
    }
    logout(){
        Swal.fire({
          
            text:'¿Esta seguro que desea salir?',
            icon:'warning',
            showCancelButton:true,
            confirmButtonColor:'#3085d6',
            cancelButtonColor:'#d33',
            confirmButtonText:'Si',
            cancelButtonText:'No',

        }).then(res=>{
            if(res.isConfirmed){
                localStorage.removeItem("user")
                localStorage.removeItem("login")
                this.context.updateState({login:false})
                this.props.navigate("/")
            }
        })
    }
    render(){
        return(
            <header style={styles.header}  >
            <GiHamburgerMenu onClick={()=>this.context.updateState({shownav:!this.context.shownav})}/>
                <div style={styles.dropdownContainer}>
                    <button style={styles.userButton} onClick={()=>this.showMenuButton()}>
                            {this.context.usuario.razon_social}
                    </button>
                    {
                        this.state.showmenu && (
                            <div style={styles.dropdownMenu}>
                                <p><strong>Cliente:{this.context.usuario.razon_social}</strong></p>
                                <p><strong>Codigo:{this.context.usuario.codigo}</strong></p>
                                <button onClick={()=>this.logout()} style={styles.logoutButton}>Salir</button>
                            </div> 
                        )
                    }
                </div>
        </header>
        )
    }
}
const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',  // Espacio entre el botón de hamburguesa y el botón del usuario
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#011627',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
    },
    dropdownContainer: {
        position: 'relative',
        display: 'inline-block',
        color:'black'
    },
    userButton: {
        padding: '8px 12px',
        // backgroundColor: '#007BFF',
        color: '#000',
        border: '1px solid',
        borderRadius: '4px',
        cursor: 'pointer',
        maxWidth:200,
        whiteSpace:'nowrap',
        overflow:'hidden',
        textOverflow:'ellipsis'
        
    },
    dropdownMenu: {
        position: 'absolute',
        top: '100%',
        right: 0,  
        backgroundColor: '#fff',
        boxShadow: '0px 8px 16px rgba(0,0,0,0.2)',
        padding: '10px',
        zIndex: 1,
        borderRadius: '4px',
        minWidth: '330px', 
        // whiteSpace: 'nowrap'  
    },
    logoutButton: {
        padding: '6px 12px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    }
};
export default withRouter(Header)