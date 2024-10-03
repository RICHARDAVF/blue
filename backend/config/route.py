from django.urls import path
from .consumers import EstadoStock
websocket_urlpatterns = [
    path("ws/app/",EstadoStock.as_asgi())
]