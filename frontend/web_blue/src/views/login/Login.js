import React, { Component } from 'react';
import { Context } from '../../components/GlobalContext';
import { withRouter } from '../../components/Router';

class Login extends Component {
  static contextType = Context
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  async login(data){
    const {dominio} = this.context
    const url = `${dominio}/login/`
    try{

      const response = await fetch(url,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
      })
      const res = await response.json()
      if(res.success){     
        this.context.updateState({login:true,usuario:res})
        localStorage.setItem("user",JSON.stringify(res))
        localStorage.setItem('login',true)
        this.props.navigate("/pedidos")
      }else{
        alert(res.error)
      }
    }catch(error){
      alert.alert(error)
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const { username, password } = this.state;
    const datos = {"username":username,"password":password}
    this.login(datos)
  };

  render() {
    const { username, password } = this.state;

    return (
      <div className="login-container">
        <form className="login-form" onSubmit={this.handleSubmit}>
          <h2>Iniciar Sesión</h2>
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
