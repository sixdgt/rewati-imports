from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import WebsiteSettings, Advertisement
from .serializers import WebsiteSettingsSerializer, AdvertisementSerializer

class WebsiteSettingsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        settings = WebsiteSettings.objects.first()
        if not settings:
            # Return default settings if none exist
            return Response({
                "site_name": "Rewati Imports",
                "primary_color": "#233a95",
                "secondary_color": "#ed174a"
            })
        serializer = WebsiteSettingsSerializer(settings)
        return Response(serializer.data)

class AdvertisementViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Advertisement.objects.filter(is_active=True)
    serializer_class = AdvertisementSerializer
    permission_classes = [permissions.AllowAny]
