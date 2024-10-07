import React, { Component } from 'react';
import '../../styles/Register.css';
import Swal from 'sweetalert2'
import { Context } from '../../components/GlobalContext';
import { withRouter } from '../../components/Router';
class RegisterForm extends Component {
  static contextType = Context
  constructor(props) {
    super(props)
    this.state = {
      document_proveedor:'',
      username_proveedor:'',
      documento: '',
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      password: '',
      document_validate:false
    };
  }
  async validateDocument() {
    const { documento } = this.state;
  
    
    const tipo = documento.length === 8 ? 'dni' : 'ruc';
    const url = `http://noisystems.dyndns.org:3030/api/searchdoc/${documento}/${tipo}/`;

   
    Swal.fire({
      title: 'Validando documento...',
      text: 'Por favor espera mientras validamos tu documento.',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading(); 
      },
      backdrop: 'rgba(0, 0, 0, 0.5)',
    });
    try{

      const response = await fetch(url,{
        method:'GET'
      })
      const res = await response.json()
      if(res.success && res.data){
        this.setState({document_validate:true})
        Swal.close()
        Swal.fire({
          title:"Success",
          text:"Documentos válidos"
        })
      }else{

        Swal.close()
        Swal.fire({
          title:"Error",
          text:res.error
        })
      }
    }catch(error){
      Swal.close()
      Swal.fire({
        title:"Error",
        text:error.toString()
      })
    }
  }
  
  
  handleChange = (e) => {

    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async(e) => {
    e.preventDefault();
    if(!this.state.document_validate){
      return Swal.fire({
        title:"Alerta",
        text:"Validar el documento",
        icon:'warning'
      })
    }
    try{
      const {dominio} = this.context
      const url = `${dominio}/api/v1/create/cliente/` 
      const datos = {...this.state} 
      const response = await fetch(url,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(datos)
      })

      const res = await response.json()
      if(res.success){
        Swal.fire({
          title:"Success",
          text:"Su cuenta fue creada exitosamente",
          icon:'success',
          allowOutsideClick: false, 
          allowEscapeKey: false
        }).then(res=>{
          if(res.isConfirmed){
            this.props.navigate("/")
          }
        })
      }else{
        Swal.fire({
          title:"Error",
          text:res.error,
          icon:'error'
        })
      }
    }catch(error){
      Swal.fire({
        title:"Error",
        text:error.toString(),
        icon:'error'
      })
    }
  };

  render() {
    return (
      <div className="register-container">
        <form className="register-form" onSubmit={this.handleSubmit}>
          <h2>Registro</h2>

          <div className="form-row">
            <div className="form-group">
              <label>Documento del proveedor</label>
              <input
                type="text"
                name="document_proveedor"
                value={this.state.document_proveedor}
                onChange={this.handleChange}
                required
                placeholder="Ingresa el documento"
              />
            </div>

            <div className="form-group">
              <label>Usuario del proveedor</label>
              <input
                type="text"
                name="username_proveedor"
                value={this.state.username_proveedor}
                onChange={this.handleChange}
                required
                placeholder="Ingresa el usuario"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
            <label>Documento (Presione Enter para validar)</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                name="documento"
                value={this.state.documento}
                onChange={this.handleChange}
                required
                placeholder="Ingresa tu documento"
                style={{ marginRight: '10px' }} 
              />
              <button
              onClick={()=>this.validateDocument()}
                type="button"
                style={{
                  height: 30,
                  border: 0,
                  marginTop: 1,
                  cursor: 'pointer',
                  background: '#48d4ab',
                  borderRadius: 5,
                }}
              >
                VALIDAR
              </button>
            </div>
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
                maxLength={8}
                value={this.state.password}
                onChange={this.handleChange}
                required
                placeholder="Ingresa tu contraseña"
              />
            </div>
          </div>
          <button  type="submit" className="submit-btn">Registrarse</button>
          <div style={{color:'black'}}>
            <p>¿Ya tienes una cuenta? <a style={{color:'blue'}} href='/'>Iniciar Sesión</a></p>
          </div>
        </form>
      </div>
    );
  }
}

export default withRouter(RegisterForm);
