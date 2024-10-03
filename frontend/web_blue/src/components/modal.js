import React, { Component } from 'react';

class Modal extends Component {
    constructor(props){
        super(props)
        this.state = {
            cantidad:1,
            subtotal:this.props.data.subtotal || 0

        }
    }

    change_cantidad=(value)=>{

        var subtotal = parseFloat(value*this.props.data.precio).toFixed(2)
        this.setState({subtotal:subtotal,cantidad:value})
    }
    save_data=()=>{
        const {data} = this.props
        data.subtotal = this.state.subtotal==0?this.props.data.subtotal:this.state.subtotal
        data.cantidad = this.state.cantidad
        this.props.saveData(data)
        this.setState({cantidad:1})
    }
    render() {
        const subtotal = this.state.subtotal==0?this.props.data.precio:this.state.subtotal
        if(!this.props.visible) return null
        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h2>{this.props.data.producto}</h2>
                    <div className='input-group'>
                        <label htmlFor='precio'>Precio</label>
                        <input type='text' value={this.props.data.precio} readOnly/>
                    </div>
                    <div className='input-group'>
                        <label htmlFor='cantidad'>Cantidad</label>
                        <input type='number' value={this.state.cantidad} onChange={(e)=>this.change_cantidad(e.target.value)}/>
                    </div>
                    <div className='input-group'>
                        <label htmlFor='descuento'>Descuento</label>
                        <input type='text' value={this.props.data.descuento} readOnly/>
                    </div>
                    <div className='input-group'>
                        <label htmlFor='cantidad'>Sub Total</label>
                        <input type='number' value={subtotal} readOnly />
                    </div>
                    <div className='input-group' style={{display:'flex',justifyContent:'space-around',alignItems:'center',width:'100%'}}>
                        <button  
                        onClick={()=>this.save_data()}
                        style={{
                            width:'45%',
                            height:40,
                            borderRadius:5,
                            color:'white',
                            backgroundColor:'blue'
                        }} >GUARDAR</button>
                        <button 
                        onClick={()=>this.props.showModal()}
                        style={{
                             width:'45%',
                             height:40,
                             borderRadius:5,
                             color:'white',
                             backgroundColor:'red'
                        }}>CERRAR</button>
                    </div>

                   
                </div>
            </div>
        );
    }
}

export default Modal;
