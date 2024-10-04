from django.urls import path

from blue_ventas.core.api.views.articulos.views import ArticulosList
from blue_ventas.core.api.views.pedidos.views import PedidoView,SavePedidoView,LoadImage
urlpatterns = [
    path(route="v1/list/articulos/",view=ArticulosList.as_view()),
    path(route="v1/pedidos/list/",view=PedidoView.as_view()),
    path(route="v1/pedidos/save/",view=SavePedidoView.as_view()),
    path(route="v1/load/image/",view=LoadImage.as_view())
]