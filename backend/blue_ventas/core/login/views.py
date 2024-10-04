from rest_framework.generics import GenericAPIView
from rest_framework.response import Response

from blue_ventas.conn import CAQ
class LoginView(GenericAPIView):
    def post(self,request,*args,**kwargs):
        data = {}
        datos = request.data
        try:
            sql = f"""
                SELECT aux_user_i,aux_pass_i,aux_clave,aux_docum,aux_razon,aux_direcc,aux_userci FROM t_auxiliar WHERE aux_pass_i=? AND aux_user_i=? OR aux_userci=?
"""
            params = (datos["password"],datos["username"],datos['password'])
            res = CAQ.query(sql,params,'GET',0)

            if res["success"] and len(res["data"])==0:
                raise ValueError("Usuario o contraseña incorrecta")
            result = res["data"]
            tipo_user = 1 if result[1].strip()==datos['password'] else 0
            data = {
                "success":True,
                "username":result[0].strip(),
                "password":result[1].strip(),
                "codigo":result[2].strip(),
                "documento":result[3].strip(),
                "razon_social":result[4].strip(),
                "direccion":result[5].strip(),
                "tipo_user":tipo_user
            }
        except Exception as e:
            data["error"] = f"Ocurrio un error: {str(e)}"
        return Response(data)
class LoginCliente(GenericAPIView):
    def post(self,request,*args,**kwargs):
        data = {}
        datos = request.data
        try:
            sql = "SELECT aux_razon,aux_direcc,aux_docum,aux_clave FROM t_auxiliar WHERE aux_docum=?"
            res = CAQ.query(sql,(datos['documento'],),'GET',0)
            if res["success"] and len(res["data"])==0:
                raise ValueError("No esta resgistrado")
            result = res["data"]
            data = {
                "success":True,
                "razon_social":result[0].strip(),
                "direccion":result[1].strip(),
                "documento":result[2].strip(),
                "codigo":result[3].strip()

            }
        except Exception as e:
            data['error'] = str(e)
        return Response(data)