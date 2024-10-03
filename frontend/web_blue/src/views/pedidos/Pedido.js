import { Component } from "react";
import { withRouter } from "../../components/Router";
import DataTable from 'react-data-table-component';
import { Context } from "../../components/GlobalContext";

class Pedido extends Component{
    static contextType = Context
    constructor(props){
        super(props)
        this.state = {
            data:[]
        }  
    }
    componentDidMount(){

        this.requestPedidos()
    }
    async requestPedidos(){
        const {dominio} = this.context
        const url = `${dominio}/api/v1/pedidos/list/`
        const usercodigo = this.context.usuario.codigo
        const datos = {
            "codigo":usercodigo
        }
        try{
            const response = await fetch(url,{
                method:'POST',
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(datos)
            })
            if(response.ok){
                const res = await response.json()
                if(res.error){
                    return alert("Error:",res.error)
                }
                this.setState({data:res})
            }
        }catch(error){
            console.log(error)
        }
    }
    render(){
        const columns = [
            {
                name:"Nro Pedido",
                selector:row=>row.numero_pedido
            },
            {
                name:"FECHA",
                selector:row=>row.fecha
            },
            {
                name:"RUC",
                selector:row=>row.documento
            },
            {
                name:"Cliente",
                selector:row=>row.cliente
            },
            {
                name:"Sub Total",
                selector:row=>row.subtotal
            },
            {
                name:"IGV",
                selector:row=>row.igv
            },
            {
                name:"Total",
                selector:row=>row.total
            },
            {
                name:"ESTADO",
                cell:(row)=>
                    
                    <div style={{backgroundColor:row.estado=='APROBADO'?'#33E40C':row.estado=='ANULADO'?'#E40C25':row.estado=='RECHAZADO'?'#E47C0C':'#FAB46E',width:100,textAlign:'center',borderRadius:3}}>
                        {row.estado}
                    </div>
                
           
            },
        ]

        return(
            <div className="data">
                <DataTable
                title="Listado de pedidos"
                columns={columns}
                data={this.state.data}
                pagination={true}
                subHeader={true}
                subHeaderComponent={
                    <div className="header-container">
                        <button className="register-button" onClick={()=>this.props.navigate("/pedidos/add")}>Nuevo Pedido</button>
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="search-input"
                            />
                        </div>
                    </div>
                }
                />
            </div>
        )
    }
}
export default withRouter(Pedido)