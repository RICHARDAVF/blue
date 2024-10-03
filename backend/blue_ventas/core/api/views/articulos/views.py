from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from blue_ventas.conn import CAQ
from datetime import datetime
class ArticulosList(GenericAPIView):
    fecha : datetime = datetime.now()
    def post(self,request,*args,**kwargs):
        data = {}
        try:
            datos = request.data
            cadena = datos["palabra"]
            fil = ''
            if len(cadena)>0:
                fil = f"""
                    AND a.art_codigo LIKE '%{cadena}%' 
                    OR b.art_nombre LIKE '%{cadena}%'
                """
            sql = f"""
                    SELECT
                        b.art_codigo,
                        b.ART_NOMBRE,
                        d.lis_pmino,
                        'mom_cant' = SUM(CASE WHEN a.mom_tipmov = 'E' THEN a.mom_cant WHEN a.mom_tipmov = 'S' THEN a.mom_cant * -1 END)

                    FROM
                        movm{self.fecha.year} AS a
                    LEFT JOIN
                        t_articulo b ON a.ART_CODIGO = b.art_codigo
                    LEFT JOIN maelista AS d ON a.art_codigo=d.art_codigo AND d.lis_fini<GETDATE() AND d.lis_ffin>GETDATE()
                    WHERE
                        a.elimini = 0
                        AND b.art_mansto = 0
                        AND a.ALM_CODIGO = '01'
                        AND a.UBI_COD1 = '01'
                        {fil}
                        

                    GROUP BY
                        b.art_codigo,
                        b.ART_NOMBRE,
                        d.lis_pmino
                    HAVING
                        SUM(CASE WHEN a.mom_tipmov = 'E' THEN a.mom_cant WHEN a.mom_tipmov = 'S' THEN a.mom_cant * -1 END) > 0
                        AND d.lis_pmino>0
                    ORDER BY
                        b.art_nombre

            """
            res = CAQ.query(sql,(),"GET",1)

            if res["success"]:
                data = [
                    {
                        "id":index,
                        "codigo":value[0].strip(),
                        "producto":value[1].strip(),
                        "precio":value[2],
                        "stock":value[3]
                    } for index,value in enumerate(res["data"])
                ]
            else:
                data['error'] = res["error"]
        except Exception as e:
            data["error"] = f"Ocurrio un error :{str(e)}"
        return Response(data)