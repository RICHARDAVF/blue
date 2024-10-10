from rest_framework.generics import GenericAPIView
from rest_framework.response import Response

from blue_ventas.conn import CAQ
class LoginView(GenericAPIView):
    def post(self,request,*args,**kwargs):
        data = {}
        datos = request.data
        try:
            sql = f"""
                SELECT 
                    aux_user_i,
                    aux_pass_i,
                    aux_clave,
                    aux_docum,
                    aux_razon,
                    aux_direcc,
                    aux_userci,
                    ofi_codigo,
                    ven_codigo 
                FROM t_auxiliar WHERE aux_docum=? AND aux_user_i=? AND (aux_pass_i=? OR aux_userci=?)
"""
            password = datos["password"].upper()
            params = (datos["documento"],datos["username"],password,password)
            res = CAQ.query(sql,params,'GET',0)
            if res["success"] and len(res["data"])==0:
                raise ValueError("Usuario o contraseña incorrecta")
            result = res["data"]
            tipo_user = 1 if result[1].strip()==password.strip() else 0
            data = {
                "success":True,
                "username":result[0].strip(),
                "password":result[1].strip(),
                "codigo":result[2].strip(),
                "documento":result[3].strip(),
                "razon_social":result[4].strip(),
                "direccion":result[5].strip(),
                "tipo_user":tipo_user,
                "familia":result[7].strip(),
                "codigo_vendedor":result[8].strip()
            }
        except Exception as e:
            data["error"] = f"Ocurrio un error: {str(e)}"
        return Response(data)
class LoginCliente(GenericAPIView):
    def post(self,request,*args,**kwargs):
        data = {}
        datos = request.data
        try:

            self.valid_family(datos["documento"],datos["familia"])
            sql = """SELECT 
                        aux_razon,
                        aux_direcc,
                        aux_docum,
                        aux_clave,
                        ofi_codigo,
                        ven_codigo 
                    FROM t_auxiliar WHERE aux_docum=?"""
            res = CAQ.query(sql,(datos['documento'],),'GET',0)
            if res["success"] and len(res["data"])==0:
                data["login"] = False
                raise ValueError("No esta resgistrado")
            result = res["data"]
            data = {
                "success":True,
                "razon_social":result[0].strip(),
                "direccion":result[1].strip(),
                "documento":result[2].strip(),
                "codigo":result[3].strip(),
                "familia":result[4].strip(),
                "codigo_vendedor":result[5].strip()

            }
        except Exception as e:
            data['error'] = str(e)
        return Response(data)
    def valid_family(self,document,family):
        """
            document:Documento del cliente.
           
        """

        try:
            sql = "SELECT ofi_codigo FROM t_auxiliar WHERE aux_docum=?"
            res = CAQ.query(sql,(document,),"GET",0)

            if  res["success"] and len(res["data"][0].strip())==0:
          
                sql = "UPDATE t_auxiliar SET ofi_codigo=? WHERE aux_docum=? "
                res = CAQ.query(sql,(family,document),"POST")
                if not res["success"]:
                    raise ValueError(res["error"])
            return True
        except Exception as e:
            raise ValueError(str(e))