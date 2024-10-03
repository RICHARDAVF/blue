import pyodbc
import os
from dotenv import load_dotenv
load_dotenv()
class CAQ:

    def connect(self):
        return pyodbc.connect(
            "DRIVER={SQL Server};"
            +
            f"SERVER={os.getenv('HOSTNAME')};"
            +
            f"DATABASE={os.getenv('DATABASE')};"
            +
            f"UID={os.getenv('UID')};"
            +
            f"PWD={os.getenv('PWD')}"
        )
        
    @classmethod
    def query(cls,sql,params,method='POST',tipe = 1):
        """
        tipe 0 or 1, mode fetchone or fetchall
        """
        instance = cls()
        conn = instance.connect()
        cursor = conn.cursor()
        data = []
        try:
            cursor.execute(sql,params)
            if method=='GET' and tipe == 1:
                data = cursor.fetchall()
            elif method=='GET' and tipe == 0:
                data = cursor.fetchone()
            elif method=='POST':
                data = {"success":True,"message":"Operacion se realizó con exito"}
            if data is None:
                data = {"success":True,"data":[]}
            else:
                data = {"success":True,"data":data}
            conn.commit()
            conn.close()
        except Exception as e:
            data = {'success':False,'error':f"Ocurrio un error:{str(e)}"}
        return data