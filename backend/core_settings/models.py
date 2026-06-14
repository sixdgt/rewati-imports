from django.db import models
from django.core.validators import FileExtensionValidator

class WebsiteSettings(models.Model):
    site_name = models.CharField(max_length=255, default="Rewati Imports")
    logo = models.FileField(
        upload_to='settings/', 
        null=True, 
        blank=True,
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'svg'])]
    )
    favicon = models.FileField(
        upload_to='settings/', 
        null=True, 
        blank=True,
        validators=[FileExtensionValidator(allowed_extensions=['ico', 'png', 'svg'])]
    )
    
    # Colors
    primary_color = models.CharField(max_length=20, default="#233a95", help_text="e.g. #233a95")
    secondary_color = models.CharField(max_length=20, default="#ed174a", help_text="e.g. #ed174a")
    
    # SEO
    meta_title = models.CharField(max_length=255, blank=True)
    meta_description = models.TextField(blank=True)
    meta_keywords = models.CharField(max_length=500, blank=True)
    
    # Contact Info
    address = models.TextField(blank=True)
    phone = models.CharField(max_length=50, blank=True)
    email = models.EmailField(blank=True)
    
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Website Settings"
        verbose_name_plural = "Website Settings"

    def __str__(self):
        return self.site_name

class Advertisement(models.Model):
    AD_POSITIONS = (
        ('home_top', 'Home Top Banner'),
        ('home_middle', 'Home Middle Section'),
        ('home_bottom', 'Home Bottom Section'),
        ('sidebar', 'Sidebar'),
    )
    title = models.CharField(max_length=255)
    image = models.ImageField(upload_to='ads/')
    link = models.URLField(blank=True)
    position = models.CharField(max_length=50, choices=AD_POSITIONS)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.position})"
