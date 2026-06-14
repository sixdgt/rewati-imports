import os
import django
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from products.models import Category, Product

def seed_data():
    # Categories
    electronics, _ = Category.objects.get_or_create(name='Electronics', slug='electronics')
    fashion, _ = Category.objects.get_or_create(name='Fashion', slug='fashion')
    home, _ = Category.objects.get_or_create(name='Home & Kitchen', slug='home-kitchen')

    # Products
    products = [
        {
            'category': electronics,
            'name': 'Apple iPhone 15 Pro',
            'slug': 'iphone-15-pro',
            'description': 'Latest iPhone with Titanium design and A17 Pro chip.',
            'price': Decimal('185000.00'),
            'old_price': Decimal('195000.00'),
            'stock': 10,
            'is_featured': True
        },
        {
            'category': electronics,
            'name': 'Samsung Galaxy S24 Ultra',
            'slug': 's24-ultra',
            'description': 'Premium flagship with AI features and S-Pen.',
            'price': Decimal('165000.00'),
            'stock': 5,
            'is_featured': True
        },
        {
            'category': fashion,
            'name': 'Nike Air Max 270',
            'slug': 'nike-air-max-270',
            'description': 'Comfortable and stylish sneakers.',
            'price': Decimal('15000.00'),
            'old_price': Decimal('18000.00'),
            'stock': 20,
            'is_featured': True
        }
    ]

    for p_data in products:
        Product.objects.get_or_create(slug=p_data['slug'], defaults=p_data)

    print("Seed data created successfully!")

if __name__ == '__main__':
    seed_data()
