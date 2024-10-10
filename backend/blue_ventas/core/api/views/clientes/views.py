from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from datetime import datetime
import requests
from blue_ventas.conn import CAQ
class ClienteCreate(GenericAPIView):
    fecha : datetime = datetime.now()
    def post(self,request,*args,**kwargs):
        data = {}
        datos = request.data
        try:
  
            tipo_auxiliar = 'CL'
            sql  = "SELECT aux_docum FROM t_auxiliar WHERE MAA_CODIGO=? AND aux_docum=?"
            res = CAQ.query(sql,(tipo_auxiliar,datos["documento"]),'GET',0)

            if res["success"] and len(res["data"])>0:
                raise ValueError("EL usuario ya esta registrado")
            sql = "SELECT ofi_codigo,aux_cuenta,aux_cuentd,ven_codigo FROM t_auxiliar WHERE aux_docum=?"
            print(datos)
            res = CAQ.query(sql,(datos["document_proveedor"],),'GET',0)
            if not res["success"] or len(res["data"][0].strip())==0:
                raise ValueError("No encontro una familiar para este cliente")
            familia_cliente,cuenta_soles,cuenta_dolares,codigo_vendedor = res["data"]
            sql = "SELECT MAX(AUX_CODIGO) FROM t_auxiliar WHERE MAA_CODIGO=?"
            res = CAQ.query(sql,(tipo_auxiliar,),'GET',0)
            if not res["success"] or len(res["data"])==0:
                res = ['0'] 
            correlativo = res["data"][0]

            tipo = "dni" if len(datos["documento"])==8 else 'ruc'
            tipo_persona = 2 if tipo=='ruc' else 1
            tipo_documento = 1 if tipo=='ruc' else 2
            url = f"http://noisystems.dyndns.org:3030/api/searchdoc/{datos['documento']}/{tipo}/"
            res = requests.get(url)
            if res.status_code==200:
                cliente = res.json()
                cliente =  self.cliente_juridico(cliente["data"]) if tipo=='ruc' else self.cliente_natural(cliente["data"])
            else:
                raise ValueError("No se pudo validar el documento")

            params = (tipo_auxiliar,str(int(correlativo)+1).zfill(6),f"{tipo_auxiliar}{str(int(correlativo)+1).zfill(6)}",cliente["razon_social"],cliente["razon_social"],codigo_vendedor,"CLIENTE",cliente["direccion"],
                      cliente["departamento"],cliente["provincia"],cliente["distrito"],tipo_persona,cliente["documento"],datos["telefono"],self.fecha,cliente["ubigeo"],tipo_documento,
                      datos["email"],self.fecha,familia_cliente,'02',cuenta_soles,cuenta_dolares,cliente["estado"],cliente["condicion"])
 
            sql = f"""
               INSERT INTO t_auxiliar (MAA_CODIGO,aux_codigo,aux_clave,aux_nombre,aux_razon,ven_codigo,maa_nombre,aux_direcc,dep_codigo,pro_codigo,dis_codigo,aux_tipope,aux_docum,aux_telef,aux_creado,aux_edi, aux_tipdoc,
               AUX_email,aux_fecing,ofi_codigo,pag_codigo,aux_cuenta,aux_cuentd,aux_estado,aux_condic) VALUES({','.join('?' for i in params)})   
"""
            res = CAQ.query(sql,params,'POST')
            if not res["success"]:
                raise ValueError(res["error"])
            data = res
        except Exception as e:
            print(str(e))
            data["error"] = f"Ocurrio un error al crear al cliente:{str(e)}"
        return Response(data)
    def cliente_juridico(self,data):
      return {
            "razon_social":data["nombre_o_razon_social"],
            "direccion":data["direccion_completa"],
            "documento":data["ruc"],
            "departamento":data["departamento"],
            "provincia":data["provincia"],
            "distrito":data["distrito"],
            "ubigeo":data["ubigeo_sunat"],
            "estado":data["estado"],
            "condicion":data["condicion"]
        }
    def cliente_natural(self,data):
        return {
 
            "razon_social":data["nombre_completo"],
            "direccion":data["direccion_completa"],
            "documento":data["numero"],
            "departamento":data["departamento"],
            "provincia":data["provincia"],
            "distrito":data["distrito"],
            "ubigeo":data["ubigeo_sunat"],
            "estado":'',
            "condicion":''
        
        }