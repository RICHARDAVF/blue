from channels.generic.websocket import AsyncWebsocketConsumer
import json
class EstadoStock(AsyncWebsocketConsumer):
    async def connect(self):
        print("TESTEO DE CONEXION")
        await self.accept()