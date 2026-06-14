from rest_framework import serializers
from .models import Order, OrderItem
from products.models import Product

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = OrderItem
        fields = ('id', 'product', 'product_name', 'quantity', 'price')

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    order_items = serializers.JSONField(write_only=True) # Used to send items during creation

    class Meta:
        model = Order
        fields = (
            'id', 'user', 'full_name', 'email', 'phone', 'address', 'city', 
            'country', 'zip_code', 'total_amount', 'shipping_cost', 
            'payment_method', 'status', 'items', 'order_items', 'created_at'
        )
        read_only_fields = ('user', 'status', 'total_amount')

    def validate(self, attrs):
        user = self.context['request'].user
        from authentication.models import Address
        
        # 1. Check if the user has any saved addresses in their profile
        if not Address.objects.filter(user=user).exists():
            raise serializers.ValidationError(
                {"address": "Please add a shipping address in your profile before placing an order."}
            )
            
        # 2. Check if the submitted shipping address details match one of their saved addresses
        address = attrs.get('address')
        city = attrs.get('city')
        zip_code = attrs.get('zip_code')
        if not Address.objects.filter(user=user, address=address, city=city, zip_code=zip_code).exists():
            raise serializers.ValidationError(
                {"address": "The shipping address must match one of your saved profile addresses."}
            )
            
        # 3. Check if the total price of items is at least $AUD 100 equivalent
        order_items_data = attrs.get('order_items')
        if not order_items_data:
            raise serializers.ValidationError("An order must contain at least one item.")
            
        total_amount = 0
        for item_data in order_items_data:
            product_id = item_data.get('product_id')
            quantity = item_data.get('quantity', 1)
            try:
                product = Product.objects.get(id=product_id)
                total_amount += product.price * quantity
            except Product.DoesNotExist:
                raise serializers.ValidationError(f"Product with ID {product_id} does not exist.")
                
        MIN_ORDER_AMOUNT = 100 # $AUD 100
        if total_amount < MIN_ORDER_AMOUNT:
            raise serializers.ValidationError(
                f"The minimum total order amount must be $AUD {MIN_ORDER_AMOUNT}. Your total is $AUD {total_amount}."
            )
            
        return attrs

    def create(self, validated_data):
        order_items_data = validated_data.pop('order_items')
        user = validated_data.get('user')
        
        # Auto-save address
        if user:
            address_line = validated_data.get('address')
            city = validated_data.get('city')
            zip_code = validated_data.get('zip_code')
            
            from authentication.models import Address
            if address_line and not Address.objects.filter(user=user, address=address_line, city=city, zip_code=zip_code).exists():
                is_first = not Address.objects.filter(user=user).exists()
                Address.objects.create(
                    user=user, 
                    title="Saved from Checkout", 
                    address=address_line, 
                    city=city, 
                    zip_code=zip_code, 
                    is_default=is_first
                )

        total_amount = 0
        order = Order.objects.create(total_amount=0, **validated_data)
        
        for item_data in order_items_data:
            product = Product.objects.get(id=item_data['product_id'])
            price = product.price
            quantity = item_data['quantity']
            OrderItem.objects.create(
                order=order, product=product, quantity=quantity, price=price
            )
            total_amount += price * quantity
            
            # Reduce stock
            product.stock -= quantity
            product.save()
            
        order.total_amount = total_amount
        order.save()
        return order
