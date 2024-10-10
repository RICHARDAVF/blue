from django.urls import path
from blue_ventas.core.api.views.login.views import LoginCliente, LoginView
from blue_ventas.core.api.views.articulos.views import ArticulosList
from blue_ventas.core.api.views.pedidos.views import PedidoView,SavePedidoView,LoadImage
from blue_ventas.core.api.views.clientes.views import ClienteCreate
urlpatterns = [
    path(route="v1/list/articulos/",view=ArticulosList.as_view()),
    path(route="v1/pedidos/list/",view=PedidoView.as_view()),
    path(route="v1/pedidos/save/",view=SavePedidoView.as_view()),
    path(route="v1/load/image/",view=LoadImage.as_view()),
    path(route="v1/create/cliente/",view=ClienteCreate.as_view()),
    path(route='v1/login/',view=LoginView.as_view()),
    path(route='v1/login/cliente/',view=LoginCliente.as_view()),
]