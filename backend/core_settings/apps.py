from django.apps import AppConfig
import django.contrib.admin.apps


class CoreSettingsConfig(AppConfig):
    default = True
    name = 'core_settings'

class CustomAdminConfig(django.contrib.admin.apps.AdminConfig):
    default = False
    default_site = 'core_settings.admin.CustomAdminSite'
