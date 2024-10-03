from rest_framework.generics import GenericAPIView
from rest_framework.response import Response

from blue_ventas.conn import CAQ
class LoginView(GenericAPIView):
    def post(self,request,*args,**kwargs):
        data = {}
        datos = request.data
        try:
            sql = f"""
                SELECT aux_user_i,aux_pass_i,aux_clave,aux_docum,aux_razon,aux_direcc FROM t_auxiliar WHERE aux_pass_i=? AND aux_user_i=?
"""
            params = (datos["password"],datos["username"])
            res = CAQ.query(sql,params,'GET',0)

            if res["success"] and len(res["data"])==0:
                raise ValueError("Usuario o contraseña incorrecta")
            result = res["data"]
            data = {
                "success":True,
                "username":result[0].strip(),
                "password":result[1].strip(),
                "codigo":result[2].strip(),
                "documento":result[3].strip(),
                "razon_social":result[4].strip(),
                "direccion":result[5].strip()
            }
        except Exception as e:
            data["error"] = f"Ocurrio un error: {str(e)}"
        return Response(data)