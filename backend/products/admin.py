from django.contrib import admin

from backend.core_settings.models import Advertisement, WebsiteSettings
from .models import Category, Product, ProductImage, Wishlist, Review
from django.utils.html import format_html

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('product', 'user', 'rating', 'created_at')
    list_filter = ('rating',)

@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'created_at')
    
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'category', 'price', 'stock',
        'is_featured', 'created_at', 'product_image'
    )
    list_filter = ('category', 'is_featured', 'created_at')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProductImageInline]

    def product_image(self, obj):
        image = obj.images.filter(is_feature=True).first()
        if image:
            return format_html('<img src="{}" width="50" height="50" />', image.image.url)
        return "No Image"

class WebsiteSettingsAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        # Only allow one instance of settings
        if self.model.objects.count() >= 1:
            return False
        return super().has_add_permission(request)

class AdvertisementAdmin(admin.ModelAdmin):
    list_display = ('title', 'position', 'is_active', 'created_at')
    list_filter = ('position', 'is_active')
    search_fields = ('title',)

admin.site.register(WebsiteSettings, WebsiteSettingsAdmin)
admin.site.register(Advertisement, AdvertisementAdmin)  