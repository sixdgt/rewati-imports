from rest_framework import serializers
from .models import Category, Product, ProductImage, Wishlist, Review

class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    class Meta:
        model = ProductImage
        fields = ('id', 'image', 'is_feature')
    def get_image(self, obj):
        if obj.image:
            return obj.image.url  # This returns absolute URL if R2 is configured
        return None
class CategorySerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    class Meta:
        model = Category
        fields = ('id', 'name', 'slug', 'image', 'description')
    def get_image(self, obj):
        if obj.image:
            return obj.image.url  # This returns absolute URL if R2 is configured
        return None

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )
    images = ProductImageSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(max_length=1000000, allow_empty_file=False, use_url=False),
        write_only=True, required=False
    )

    class Meta:
        model = Product
        fields = (
            'id', 'category', 'category_id', 'name', 'slug', 'description', 
            'price', 'old_price', 'stock', 'is_featured', 'images', 'uploaded_images',
            'created_at', 'updated_at'
        )

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        product = Product.objects.create(**validated_data)
        for image in uploaded_images:
            ProductImage.objects.create(product=product, image=image)
        return product

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = '__all__'
        
class WishlistSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source='product', read_only=True)

    class Meta:
        model = Wishlist
        fields = ('id', 'product', 'product_details', 'created_at')

class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ('id', 'product', 'user', 'user_name', 'rating', 'comment', 'created_at')
        read_only_fields = ('user',)

    def get_user_name(self, obj):
        return obj.user.full_name or obj.user.username
