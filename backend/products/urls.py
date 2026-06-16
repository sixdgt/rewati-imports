from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ProductImageViewSet, ProductViewSet, WishlistViewSet, ReviewViewSet

router = DefaultRouter()
router.register('categories', CategoryViewSet)
router.register('products', ProductViewSet)
router.register('wishlist', WishlistViewSet, basename='wishlist')
router.register('reviews', ReviewViewSet, basename='reviews')
router.register('product-images', ProductImageViewSet, basename='product-images')

urlpatterns = [
    path('', include(router.urls)),
]
