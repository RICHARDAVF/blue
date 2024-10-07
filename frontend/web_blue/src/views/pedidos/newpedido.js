import { Component } from "react";
import { Context } from "../../components/GlobalContext";
import { withRouter } from "../../components/Router";
import DataTable from "react-data-table-component";
import { FaPlus,FaTrash } from "react-icons/fa"
import Swal from 'sweetalert2'
import Modal from "../../components/modal";
class NewPedido extends Component {
    static contextType = Context
    constructor(props) {
        super(props)
        this.state = {
            palabra: "",
            data: [],
            visible: false,
            item: {},
            productos: [],
            subtotal: 0.00,
            igv: 0.00,
            total: 0.00,
            image:null
        }
    }
    componentDidMount() {

        this.requestArticulo(this.state.palabra)
    }

    
    async requestArticulo(palabra) {
        const { dominio } = this.context
        try {
            const url = `${dominio}/api/v1/list/articulos/`
            const datos = {
                "palabra": palabra
            }
            const response = await fetch(url, {
                headers: {
                    "Content-Type": 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(datos)
            })
            if (response.ok) {
                const res = await response.json()
                if (res.error) {
                    return alert("Error" + res.error)
                }
                this.setState({ data: res })
            }
        } catch (error) {
            return alert("Error:" + error)
        }
    }
    show_modal = () => {
        this.setState({ visible: !this.state.visible })
    }
    async requestImage(codigo){
        const {dominio} = this.context
        const url = `${dominio}/api/v1/load/image/`
        const datos = {
            "codigo":codigo
        }
        try{
            const response = await fetch(url,{
                method: 'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(datos)
            })
            const res = await response.json()
            if(res.success){
                this.setState({image:res})
            }else{
                this.setState({image:null})
            }
        }catch(error){
            this.setState({image:null})
        }
    }
    select_articulo = (row) => {
        this.requestImage(row.codigo)
        row.cantidad = 1
        row.descuento = 0
        row.subtotal = row.precio
        this.setState({ item: row })
        this.show_modal()
    }
    buscador(palabra) {
        this.setState({ palabra: palabra })
        if (palabra.length > 0) {
            this.requestArticulo(palabra)
        }
    }
    add_data = (item) => {
        const index = this.state.productos.findIndex(value => value.codigo === item.codigo)
        if (index === -1) {
            const newdata = [...this.state.productos, item]
            this.setState({productos:newdata})
            this.calculate_total(newdata)
            this.show_modal()
        }else{
            Swal.fire({
                title: 'Este articulo ya se encuentra en la lista',
                text: '¿Cambiar por la nueva cantidad?',
                icon:'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, Cambiar',
                cancelButtonText: 'Cancelar'

            }).then(res=>{
                if(res.isConfirmed){
                    const newdata = [...this.state.productos]
                    newdata[index] = item
                    this.setState({productos:newdata})
                    this.calculate_total(newdata)
                    this.show_modal()
                }
            })
        }

    }
    calculate_total=(data)=>{
        var total = 0
        for (let value of data) {

            total += parseFloat(value.subtotal)
        }
        const igv = (total * 0.18).toFixed(2)
        const subtotal = (total - igv).toFixed(2)

        this.setState({subtotal: subtotal, igv: igv, total: total.toFixed(2) }) 
    }
    async savePedido(){
        const {dominio} = this.context
        const url = `${dominio}/api/v1/pedidos/save/`
        const datos = {
            ...this.context.usuario,
            items:this.state.productos,
            "total":this.state.total,
            "subtotal":this.state.subtotal,
            "igv":this.state.igv
        }
        try{
            const response = await fetch(url,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(datos)
            })
            const res = await response.json()
            if(res.success){
                this.props.navigate("/pedidos")
            }else{
                alert(res.error)
            }
        }catch(error){
            alert(error)
        }
    }
    delete_item=(codigo)=>{
        Swal.fire({
            title: '¿Estás seguro de eliminar este producto?',
            text: 'No podrás revertir esto',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'

        }).then(res=>{
            if(res.isConfirmed){

                const index = this.state.productos.findIndex(item=>item.codigo===codigo)
                const newdata = [...this.state.productos]
                newdata.splice(index,1)
                this.setState({productos:newdata})
                this.calculate_total(newdata)
                Swal.fire('¡Eliminado!','El producto ha sido eliminado','success')
            }
        })
    }
    add_cantidad=(codigo,stock)=>{
        const {productos} = this.state
        const index = productos.findIndex(item=>item.codigo===codigo)
        const data = productos[index]
        if(data.cantidad<stock){
            data.cantidad+=1
            data.subtotal = (data.cantidad*data.precio).toFixed(2)
            productos[index] = data
            this.setState({productos:productos})
            this.calculate_total(productos)
        }
    }
   sus_cantidad=(codigo)=>{
        const {productos} = this.state
        const index = productos.findIndex(item=>item.codigo===codigo)
        const data = productos[index]
        if(data.cantidad>1){
            data.cantidad-=1
            data.subtotal = (data.cantidad*data.precio).toFixed(2)
            productos[index] = data
            this.setState({productos:productos})
            this.calculate_total(productos)

        }
    }
  
    render() {
        const columns = [
            {
                name: "OPCION",
                cell: (row) => <FaPlus style={{cursor:'pointer'}} onClick={() => this.select_articulo(row)} />,
                width: '80px'
            },
            {
                name: "CODIGO",
                selector: row => row.codigo,
                width: '100px'

            },
            {
                name: "ARTICULO",
                selector: row => row.producto,
                width: '400px'
            },
            {
                name: "STOCK",
                selector: row => row.stock,
                width: '100px'
            },
            {
                name: "PRECIO",
                width: '100px',
                cell: row => (
                    <div style={{width:'100%',display:'flex',justifyContent:'space-between'}}>
                        <div>S/</div> 
                        <div>{row.precio.toFixed(2)}</div>
                    </div>
                ),
            },
        ]
        const columns1 = [
            {
                name:"Opcion",
                width:'80px',
                cell:row=>(
                        <FaTrash style={{color:'red',cursor:'pointer'}} onClick={()=>this.delete_item(row.codigo)}/>
                )
            },
            {
                name: 'Codigo',
                width: '100px',
                selector: row => row.codigo
            },
            {
                name: 'Producto',
                width: '200px',
                selector: row => row.producto
            },
            {
                name: 'Cantidad',
                width: '80px', 
                selector: row => row.cantidad,
                cell: row => (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ marginRight: '10px' }}>
                            {row.cantidad}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <button 
                            onClick={()=>this.add_cantidad(row.codigo,row.stock)}
                                style={{ 
                                    width: '15px', 
                                    height: '15px', 
                                    fontSize: '8px', 
                                    marginBottom: '1px' ,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                +
                            </button>
                            <button 
                                onClick={()=>this.sus_cantidad(row.codigo)}

                                style={{ 
                                    width: '15px', 
                                    height: '15px', 
                                    fontSize: '8px' ,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                -
                            </button>
                        </div>
                    </div>
                )
            }
            ,            
            {
                name: 'Sub Total',
                width: '100px',
                selector: row => row.subtotal,
                cell:row=>(
                    <div style={{display:'flex',justifyContent:'space-between',width:'100%'}}>
                        <div>S/</div>
                        <div>{row.subtotal}</div>
                    </div>
                )
            },
        ]

        return (
            <div>
                <div style={{ display: 'flex',height:'100%', width: '100%', flexWrap: 'wrap',justifyContent:'space-between' }}>
                    <div
                        style={{
                            width: '55%',
                            border: '1px solid green',
                            borderRadius: 5,
                            minHeight:'600px',
                            minWidth: '300px', 
                            marginBottom: '10px', 
                        }}
                    >
            
                        <DataTable
                            title="Listado de articulos"
                            columns={columns}
                            data={this.state.data}
                            pagination={true}
                            subHeader={true}
                            noDataComponent="No hay datos para mostrar"
                            subHeaderComponent={
                                <div className="header-newpedido" style={{ display: 'flex' }}>
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Buscar..."
                                            value={this.state.palabra}
                                            onChange={(e) => this.buscador(e.target.value)}
                                            className="search-input"
                                        />
                                    </div>
                                    <button
                                        onClick={() => this.requestArticulo(this.state.palabra)}
                                        className="search-button"
                                        style={{ background: '#32fa4e',border:'none',cursor:'pointer' }}
                                    >
                                        BUSCAR
                                    </button>
                                </div>
                            }
                        />
                    </div>

                    <div
                        style={{
                            width: '40%',
                            minHeight:'50%',
                            border: '1px solid green',
                            borderRadius: 5,
                            padding: 5,
                            minWidth: '300px', 
                            marginBottom: '10px',
                            justifyContent:'space-between',
                            alignContent:'space-between'

                       
                        }}
                    >
                        
                        <div style={{height:'75%'}}>
                            <DataTable
                                title="Detalle del Pedido"
                                pagination={true}
                                columns={columns1}
                                data={this.state.productos}
                            />
                        </div>
                        <div
                            style={{
                                height:'25%',
                                width: '95%',
                                display: 'flex',
                                flexWrap:'wrap',
                               
                                justifyContent:'space-between',
                                alignContent:'flex-end',
                                alignItems:'flex-end'
                            }}
                        >
                            
                                <div style={{width:'45%'}} >
                                    <label>Sub Total</label>
                                    <input
                                        type="number"
                                        style={{ borderRadius: 3, height: 30, textAlign: 'end',width:'100%' }}
                                        value={this.state.subtotal}
                                        readOnly
                                    />
                                </div>
                                <div style={{width:'45%'}} >
                                    <label>IGV(18%)</label>
                                    <input
                                        type="number"
                                        style={{ borderRadius: 3, height: 30, textAlign: 'end',width:'100%'}}
                                        value={this.state.igv}
                                        readOnly
                                    />
                                </div>
                                <div style={{width:'45%'}} >
                                    <label>Total</label>
                                    <input
                                        type="number"
                                        style={{ borderRadius: 3, height: 30, textAlign: 'end',width:'100%',}}
                                        value={this.state.total}
                                        readOnly
                                    />
                                </div>
                                <div style={{width:'45%'}} >
                                    <button onClick={()=>this.savePedido()} style={{backgroundColor:'#32fa4e',border:'0',height:30,marginLeft:10,marginTop:20,width:'100%',cursor:'pointer',color:'black',borderRadius:5}}>GUARDAR</button>
                                </div>
                          
                        </div>

                    </div>
                </div>
                <Modal
                    visible={this.state.visible}
                    showModal={this.show_modal}
                    data={this.state.item}
                    addData={this.add_data}
                    image={this.state.image}
                />
            </div>

        )
    }
}
export default withRouter(NewPedido)