from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WebsiteSettingsView, AdvertisementViewSet

router = DefaultRouter()
router.register('ads', AdvertisementViewSet)

urlpatterns = [
    path('website/', WebsiteSettingsView.as_view(), name='website_settings'),
    path('', include(router.urls)),
]
