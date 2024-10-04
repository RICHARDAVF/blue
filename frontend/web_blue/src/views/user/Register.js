import React, { Component } from 'react';
import '../../styles/Register.css';

class RegisterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      documento: '',
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      password: ''
    };
  }
  async validateDocument(){
    const tipo = this.state.documento.length==8?'dni':'ruc'
    const url = `http://noisystems.dyndns.org:3030/api/search/${tipo}/${this.state.documento}/`
    try{
        const response = await fetch(url,{
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
            }
        })
        const res = await response.json()
        console.log(res)
    }catch(error){
        console.log(error)
    }
  }
  handleChange = (e) => {
    if(e.target.name==='documento' && e.key=='enter'){
        console.log(e)
    }
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para procesar los datos
    console.log('Datos del formulario:', this.state);
  };

  render() {
    return (
      <div className="register-container">
        <form className="register-form" onSubmit={this.handleSubmit}>
          <h2>Registro</h2>

          <div className="form-row">
            <div className="form-group">
              <label>Documento</label>
              <input
                type="text"
                name="documento"
                value={this.state.documento}
                onChange={this.handleChange}
                required
                placeholder="Ingresa tu documento"
              />
            </div>

            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                name="nombre"
                value={this.state.nombre}
                onChange={this.handleChange}
                
                required
                placeholder="Ingresa tu nombre"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Apellido</label>
              <input
                type="text"
                name="apellido"
                value={this.state.apellido}
                onChange={this.handleChange}
                required
                placeholder="Ingresa tu apellido"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={this.state.email}
                onChange={this.handleChange}
                required
                placeholder="Ingresa tu correo electrónico"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="tel"
                name="telefono"
                value={this.state.telefono}
                onChange={this.handleChange}
                required
                placeholder="Ingresa tu teléfono"
              />
            </div>

            <div className="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.handleChange}
                required
                placeholder="Ingresa tu contraseña"
              />
            </div>
          </div>

          <button type="submit" className="submit-btn">Registrarse</button>
        </form>
      </div>
    );
  }
}

export default RegisterForm;
