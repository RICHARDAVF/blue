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
      direccion:'',
      email: '',
      telefono: '',
      password: '',
      document_validate:false
    };
  }
  componentDidMount(){
    this.setState({document_proveedor:this.context.documento_proveedor})
  }
  procces_data=(data)=>{

      this.setState({
        "nombre":data.nombre_completo || data.nombre_o_razon_social,
        "direccion":data.direccion
      })
    
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
        this.procces_data(res.data)
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
            <label>Documento</label>
            
              <input
                type="text"
                name="documento"
                value={this.state.documento}
                onChange={this.handleChange}
                required
                placeholder="Ingresa tu documento"
                style={{ marginRight: '10px' }} 
              />
              
   
          </div>


            <div className="form-group">
              <label>Nombre completo</label>
              <input
                type="text"
                name="nombre"
                value={this.state.nombre}
                onChange={this.handleChange}
                
                required
                placeholder="Ingresa tu nombre completo"
              />
            </div>
          </div>

          <div className="form-row">
            

            <div className="form-group">
              <label>Direccion</label>
              <input
                type="text"
                name="direccion"
                value={this.state.direccion}
                onChange={this.handleChange}
                required
                placeholder="Ingresa tu direccion"
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
              <button
                onClick={()=>this.validateDocument()}
                  type="button"
                  style={{
                    height: 30,
                    border: 0,
                    marginTop: 30,
                    cursor: 'pointer',
                    background: '#48d4ab',
                    borderRadius: 5,
                    width:'100%'
                  }}
                >
                  Validar datos
                </button>
            </div>

          </div>
          <button style={!this.state.document_validate?{background:'red'}:{}}  type="submit" className="submit-btn">Registrarse</button>
        </form>
      </div>
    );
  }
}

export default withRouter(RegisterForm);
