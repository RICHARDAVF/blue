from datetime import datetime
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from blue_ventas.conn import CAQ
class PedidoView(GenericAPIView):
    def post(self,request,*args,**kwargs):
        data = {}
        datos = request.data
        if datos["view"]==1:
            filters = f"""AND a.mov_codaux='{datos["codigo"]}' """
        else:
            filters = f"""AND b.ofi_codigo='{datos["familia"]}' AND a.mov_codaux<>'{datos["codigo"]}' """

        try:
            sql = f"""
                SELECT 
                    a.MOV_COMPRO, 
                    a.MOV_FECHA,
                    a.elimini,
                    a.ped_status,
                    a.ped_statu2,
                    b.aux_razon, 
                    a.ROU_BRUTO, 
                    a.ROU_IGV, 
                    a.ROU_TVENTA,
                    a.gui_exp001,
                    b.aux_docum
                FROM cabepedido AS a 
                INNER JOIN t_auxiliar AS b ON a.MOV_CODAUX = b.aux_clave 
                WHERE 
                    a.ped_cierre=0 
                    AND a.elimini=0
                    AND a.ped_venweb=1
                    {filters}
                ORDER BY MOV_COMPRO DESC
            """
        
            res = CAQ.query(sql,(),'GET',1)
            if res["success"] and len(res["data"])>=0:
                data = [
                    {
                        'id':index,
                        "numero_pedido":value[0].strip(),
                        "fecha":value[1].strftime("%d-%m-%Y"),
                        "anulado":value[2],
                        "state1":value[3],
                        "state2":value[4],
                        "estado":self.estado_pedido(value[2],value[3],value[4]),
                        "cliente":value[5].strip(),
                        "subtotal":value[6],
                        "igv":value[7],
                        "total":value[8],
                        "obs":value[9].strip(),
                        "documento":value[10].strip()
                    } for index,value in enumerate(res["data"])
                ]
            else:
                data["error"] = "No hay registros para mostrar"
        except Exception as e:
            print(str(e))
            data["error"] = f"Ocurrio un error:{str(e)}"
        return Response(data)
    def estado_pedido(self,anulado,state1,state2):
        state = "APROBADO"
        if anulado==1:
            state = "ANULADO"
        elif state1==3 and state2==3:
            state = "RECHAZADO"
        elif state1 in [0,1] or state2 in [0,1]:
            state = "PENDIENTE"
        return state
            
class SavePedidoView(GenericAPIView):
    fecha :datetime = datetime.now() 
    def post(self,request,*args,**kwargs):
        data = {}
        datos = request.data
        try:
            sql = "SELECT TOP 1 MOV_COMPRO FROM cabepedido WHERE SUBSTRING(mov_compro,1,3)=? ORDER BY MOV_COMPRO DESC"  
            params = (datos["codigo_vendedor"],)
            res = CAQ.query(sql,params,'GET',0)
            cor_res = ['1']
            if res["success"] and len(res["data"])!=0:
                cor_res = res["data"][0]
            # base_imponible = round(float(datos["total"])/1.18,2)
            # igv = float(datos["total"])-base_imponible
            correlativo = f'{datos["codigo_vendedor"]}-{str(int(cor_res.split("-")[-1])+1).zfill(7)}'
            sql = f"SELECT ope_codigo FROM t_parrametro WHERE par_anyo='{self.fecha.year}' "
            res = CAQ.query(sql,(),"GET",0)
            if not res["success"] or len(res["data"])==0:
                raise ValueError("No se encontro un codigo de operacion")
            codigo_operacion =  res["data"][0].strip()
            # total_sin_descuento = self.total_sin_descuento(datos["items"])
            # descuento_total = abs(float(datos["total"])-total_sin_descuento)
            params = (correlativo,self.fecha.strftime("%Y-%m-%d"),datos["codigo"],"S","WEB",self.fecha,datos["total"],
                        '01','02',datos["direccion"],'01',datos["codigo_vendedor"],codigo_operacion,'01',datos["documento"],18,datos["igv"],datos["base_imponible"],
                        1,"F1",datos["total"],0,1,1)
            sql = f"""INSERT INTO cabepedido (MOV_COMPRO,MOV_FECHA,MOV_CODAUX,MOV_MONEDA,USUARIO,FECHAUSU,ROU_TVENTA,
            ubi_codigo,pag_codigo,gui_direc,lis_codigo,ven_codigo,ope_codigo,ubi_codig2,gui_ruc,
            ROU_PIGV,ROU_IGV,ROU_BRUTO,gui_inclu,doc_codigo,rou_submon,rou_dscto,rou_export,ped_venweb) VALUES ({','.join('?' for i in params)})"""
            res = CAQ.query(sql,params,'POST')
            if not res["success"]:
                raise ValueError(res["error"])

            sql1 = f"""INSERT movipedido (ALM_CODIGO,MOM_MES,mov_compro,MOM_FECHA,ART_CODIGO,MOM_TIPMOV,
                ope_codigo,MOM_CANT,MOM_PUNIT,mom_valor,USUARIO,FECHAUSU,gui_inclu,
                doc_codigo,art_afecto) VALUES
                """
            for item in datos["items"]:
                params1 = ('53',str(self.fecha.month).zfill(2),correlativo,self.fecha,item["codigo"],"S",codigo_operacion,item["cantidad"],item["precio"],
                            item["subtotal"],'WEB',self.fecha,1,"F1","S")
                sql2 = sql1+f"({','.join('?' for i in range(len(params1)))})"
                res = CAQ.query(sql2,params1,'POST')
                if not res["success"]:
                    raise ValueError(res["error"])
            data["success"] = "EL pedido se guardo con éxito"
        except Exception as e:
            print(str(e))
            data["error"] = f"Ocurrio un error al grabar el pedido :{str(e)}"
        return Response(data)
    def total_sin_descuento(self,data):
        return sum([float(i["precio"])*float(i["cantidad"]) for i in data])
class LoadImage(GenericAPIView):
    def post(self,request,*args,**kwargs):
        data = {}
        datos = request.data
        try:
            sql = "SELECT art_image2  FROM t_articulo_imagen WHERE art_codigo=?"
            res = CAQ.query(sql,(datos['codigo'],),'GET',0)
            if res['success'] and len(res['data'])>0:
                data['image'] = res["data"][0]
                data['success'] = True
            else:
                data['error'] = 'No se pudo cargar la imagen o no esta disponible'
        except Exception as e:
            data['error'] = 'Imagen no disponible'
        return Response(data)