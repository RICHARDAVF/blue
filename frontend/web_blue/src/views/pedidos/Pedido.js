import { Component } from "react";
import { withRouter } from "../../components/Router";
import DataTable from 'react-data-table-component';
import { Context } from "../../components/GlobalContext";

class Pedido extends Component{
    static contextType = Context
    constructor(props){
        super(props)
        this.state = {
            data:[],
            dataCopy:[],
            palabra:''
        }  
    }
    componentDidMount(){

        this.requestPedidos()
    }
    async requestPedidos(){
        const {dominio} = this.context
        const url = `${dominio}/api/v1/pedidos/list/`
        const {codigo,tipo_user,familia} = this.context.usuario
        const datos = {
            "codigo":codigo,
            "tipo_user":tipo_user,
            "familia":familia
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
                    return alert(res.error)
                }
                this.setState({data:res,dataCopy:res})
            }
        }catch(error){
           
        }
    }
    buscador=(cadena)=>{
        const {dataCopy} = this.state
        const res = dataCopy.filter(item=>{
            return item.cliente.includes(cadena) || item.numero_pedido.includes(cadena) || item.documento.includes(cadena)
        })
        this.setState({data:res,palabra:cadena})
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
                width:'200px',
                selector:row=>row.cliente
            },
            {
                name:"Sub Total",
                selector:row=>row.subtotal,
                width:'100px',
                cell:row=>(
                    <div style={{width:'100%',display:'flex',justifyContent:'end'}}>
                        <span>{row.subtotal}</span>
                    </div>
                )
               
                
            },
            {
                name:"IGV",
                selector:row=>row.igv,
                width:'100px',
                cell:row=>(
                    <div style={{width:'100%',display:'flex',justifyContent:'end'}}>
                        <span>{row.igv}</span>
                    </div>
                ),
                
            },
            {
                name:"Total",
                selector:row=>row.total,
                width:'100px',
                cell:row=>(
                    <div style={{width:'100%',display:'flex',justifyContent:'end'}}>
                        <span>{row.total}</span>
                    </div>
                ),
                
            },
            {
                name:"ESTADO",
                cell:(row)=>
                    
                    <div style={{backgroundColor:row.estado==='APROBADO'?'#33E40C':row.estado==='ANULADO'?'#E40C25':row.estado==='RECHAZADO'?'#E47C0C':'#FAB46E',width:100,textAlign:'center',borderRadius:3}}>
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
                noDataComponent="No hay datos para mostrar"
                noHeader={false}
                noTableHead={false}
                subHeaderComponent={
                    <div className="header-container">
                        <button className="register-button" onClick={()=>this.props.navigate("/pedidos/add")}>Nuevo Pedido</button>
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Buscar..."
                                value={this.state.palabra}
                                onChange={e=>this.buscador(e.target.value.toUpperCase()||'')}
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