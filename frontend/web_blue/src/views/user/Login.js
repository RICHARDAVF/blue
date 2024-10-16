import React, { Component } from 'react';
import { Context } from '../../components/GlobalContext';
import { withRouter } from '../../components/Router';
import Swal from 'sweetalert2';
class Login extends Component {
  static contextType = Context
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      documento:'',
      password: '',
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  handle_login=(res)=>{
    this.context.updateState({login:true,usuario:res})
    localStorage.setItem("user",JSON.stringify(res))
    localStorage.setItem('login',true)
    this.props.navigate("/pedidos")
  }
  async login(data){
    const {dominio} = this.context
    const url = `${dominio}/api/v1/login/`
    try{

      const response = await fetch(url,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
      })
      const res = await response.json()
      if(res.success && parseInt(res.tipo_user)===1){     
        this.handle_login(res)
      }else if(res.success && parseInt(res.tipo_user)===0){
        Swal.fire({
          title:"Numero de documento",
          input:'text',
          inputPlaceholder:'Ingrese su documento',
          showCancelButton:true
        }).then(resp=>{

          if(resp.isConfirmed && resp.value.length>0){
            fetch(url+'cliente/',{
              method:'POST',
              headers:{
                'Content-Type':'application/json'
              },
              body:JSON.stringify({documento:resp.value,familia:res.familia})
            }).then(response=>{
              return response.json()
            }).then(response=>{


              if(response.success){
                this.handle_login({...res,...response})
              }else if(!response.login){
                Swal.fire({
                  title:"Error",
                  text:"No tiene una cuenta, registrese",
                  showConfirmButton:true,
                  showCancelButton:true
                }).then(res=>{
                  if(res.isConfirmed){
                    this.context.updateState({"documento_proveedor":this.state.documento})
                    this.props.navigate('/register')
                  }
                })
              }else{
                Swal.fire({
                  title:"Error",
                  text:"Documento, Usuario o Contraseña incorrecta"
                })
              }
            })
          }
        })
      }else{
        Swal.fire({
          text:"Documento, Usuario o contraseña incorrecta"
        })

      }
    }catch(error){
      Swal.fire({
        text:"Documento, Usuario o contraseña incorrecta"
      })
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const { username, password,documento } = this.state;
    const datos = {"username":username,"password":password,"documento":documento}
    this.login(datos)
  };

  render() {
    const { username, password,documento } = this.state;

    return (
      <div className="login-container">
        <form className="login-form" onSubmit={this.handleSubmit}>
          <h2>Iniciar Sesión</h2>
          <div className="input-group">
            <label htmlFor="documento">RUC o DNI</label>
            <input
              type="text"
              id="documento"
              name="documento"
              placeholder='RUC o DNI'
              value={documento}
              onChange={this.handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Usuario</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder='Nombre de usuario'
              value={username}
              onChange={this.handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder='Contraseña'
              value={password}
              onChange={this.handleChange}
              required
            />
          </div>
          <button type="submit" className="login-button">Iniciar Sesión</button>          
        </form>
      </div>
    );
  }
}

export default withRouter(Login);
