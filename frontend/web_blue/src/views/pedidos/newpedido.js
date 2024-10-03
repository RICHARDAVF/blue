import { Component } from "react";
import { Context } from "../../components/GlobalContext";
import { withRouter } from "../../components/Router";
import DataTable from "react-data-table-component";
import { FaPlus } from "react-icons/fa"
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
            total: 0.00
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
    select_articulo = (row) => {
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
    save_data = (item) => {
        const index = this.state.productos.findIndex(value => value.codigo == item.codigo)
        if (index === -1) {
            var total = 0
            const newdata = [...this.state.productos, item]

            for (let value of newdata) {
    
                total += parseFloat(value.subtotal)
            }
            const igv = (total * 0.18).toFixed(2)
            const subtotal = (total - igv).toFixed(2)

            this.setState({ productos: newdata, subtotal: subtotal, igv: igv, total: total.toFixed(2) })
            this.show_modal()
        }

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
            console.log(res)
            if(res.success){
                this.props.navigate("/pedidos")
            }else{
                alert(res.error)
            }
        }catch(error){
            alert(error)
        }
    }
    render() {
        const columns = [
            {
                name: "OPCION",
                cell: (row) => <FaPlus style={{cursor:'pointer'}} onClick={() => this.select_articulo(row)} />,
                width: '100px'
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
                name: "STOK",
                selector: row => row.stock,
                width: '100px'
            },
            {
                name: "PRECIO",
                cell: row => (
                    <div>
                        S/ {row.precio}
                    </div>
                ),
                width: '100px',
            },
        ]
        const columns1 = [
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
                width: '100px',
                selector: row => row.cantidad
            },
            {
                name: 'Sub Total',
                width: '100px',
                selector: row => row.subtotal
            },
        ]

        return (
            <div>
                <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap',justifyContent:'space-between' }}>
                    <div
                        style={{
                            width: '60%',
                            border: '1px solid green',
                            borderRadius: 5,
                            minWidth: '300px', // Establece un ancho mínimo
                            marginBottom: '10px', // Margen para la alineación vertical
                        }}
                    >
                        {/* Tabla de artículos */}
                        <DataTable
                            title="Listado de articulos"
                            columns={columns}
                            data={this.state.data}
                            pagination={true}
                            subHeader={true}
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
                            width: '35%',
                            border: '1px solid green',
                            borderRadius: 5,
                            padding: 5,
                            minWidth: '300px', // Establece un ancho mínimo
                            marginBottom: '10px',
                       
                        }}
                    >
                        {/* Detalle del pedido */}
                        <div style={{height:'80%'}}>
                            <DataTable
                                title="Detalle del Pedido"
                                pagination={true}
                                columns={columns1}
                                data={this.state.productos}
                            />
                        </div>
                        <div
                            style={{
                                height:'20%',
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'flex-end', // Alinea al lado derecho
                            }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                <div>
                                    <label>Sub Total</label>
                                    <input
                                        type="number"
                                        style={{ borderRadius: 3, height: 30, textAlign: 'end',marginLeft:5,marginTop:4 }}
                                        value={this.state.subtotal}
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label>IGV(18%)</label>
                                    <input
                                        type="number"
                                        style={{ borderRadius: 3, height: 30, textAlign: 'end',marginLeft:5,marginTop:4 }}
                                        value={this.state.igv}
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label>Total</label>
                                    <input
                                        type="number"
                                        style={{ borderRadius: 3, height: 30, textAlign: 'end',marginLeft:5,marginTop:4 }}
                                        value={this.state.total}
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <button onClick={()=>this.savePedido()} style={{backgroundColor:'#32fa4e',cursor:'pointer'}}>GUARDAR</button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <Modal
                    visible={this.state.visible}
                    showModal={this.show_modal}
                    data={this.state.item}
                    saveData={this.save_data}
                />
            </div>

        )
    }
}
export default withRouter(NewPedido)