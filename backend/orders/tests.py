from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from products.models import Product, Category
from authentication.models import Address
from decimal import Decimal

User = get_user_model()

class OrderValidationTests(APITestCase):
    def setUp(self):
        # Create categories and products
        self.category = Category.objects.create(name="Electronics", slug="electronics")
        
        # Product costing less than Rs. 13,300 (e.g. Rs. 5,000)
        self.cheap_product = Product.objects.create(
            category=self.category,
            name="Cheap Product",
            slug="cheap-product",
            price=Decimal("5000.00"),
            stock=10
        )
        
        # Product costing more than Rs. 13,300 (e.g. Rs. 15,000)
        self.expensive_product = Product.objects.create(
            category=self.category,
            name="Expensive Product",
            slug="expensive-product",
            price=Decimal("15000.00"),
            stock=10
        )
        
        # Create users
        self.user = User.objects.create_user(
            email="testuser@example.com",
            username="testuser",
            password="testpassword123",
            full_name="Test User"
        )
        
        # Another user with no saved addresses
        self.user_no_address = User.objects.create_user(
            email="noaddress@example.com",
            username="noaddress",
            password="testpassword123",
            full_name="No Address User"
        )
        
        # Create saved address for primary user
        self.address = Address.objects.create(
            user=self.user,
            title="Home",
            address="123 Kathmandu St",
            city="Kathmandu",
            zip_code="44600",
            is_default=True
        )

    def test_order_creation_fails_without_saved_address(self):
        # Login user with no address
        self.client.force_authenticate(user=self.user_no_address)
        
        url = "/api/orders/"
        data = {
            "full_name": "No Address User",
            "email": "noaddress@example.com",
            "phone": "9876543210",
            "address": "123 Kathmandu St",
            "city": "Kathmandu",
            "zip_code": "44600",
            "payment_method": "COD",
            "order_items": [
                {"product_id": self.expensive_product.id, "quantity": 1}
            ]
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("address", response.data)
        self.assertIn("Please add a shipping address in your profile", str(response.data["address"]))

    def test_order_creation_fails_when_address_does_not_match_saved(self):
        # Login primary user
        self.client.force_authenticate(user=self.user)
        
        url = "/api/orders/"
        data = {
            "full_name": "Test User",
            "email": "testuser@example.com",
            "phone": "9876543210",
            "address": "Different Street 999", # Doesn't match Kathmandu St
            "city": "Kathmandu",
            "zip_code": "44600",
            "payment_method": "COD",
            "order_items": [
                {"product_id": self.expensive_product.id, "quantity": 1}
            ]
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("address", response.data)
        self.assertIn("The shipping address must match one of your saved profile addresses", str(response.data["address"]))

    def test_order_creation_fails_with_total_amount_below_minimum(self):
        # Login primary user
        self.client.force_authenticate(user=self.user)
        
        url = "/api/orders/"
        data = {
            "full_name": "Test User",
            "email": "testuser@example.com",
            "phone": "9876543210",
            "address": "123 Kathmandu St", # Matches saved
            "city": "Kathmandu",
            "zip_code": "44600",
            "payment_method": "COD",
            "order_items": [
                {"product_id": self.cheap_product.id, "quantity": 1} # Total Rs. 5,000 < Rs. 13,300
            ]
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("non_field_errors", response.data)
        self.assertIn("minimum total order amount must be Rs. 13300", str(response.data["non_field_errors"]))

    def test_order_creation_succeeds_with_valid_amount_and_matching_address(self):
        # Login primary user
        self.client.force_authenticate(user=self.user)
        
        url = "/api/orders/"
        data = {
            "full_name": "Test User",
            "email": "testuser@example.com",
            "phone": "9876543210",
            "address": "123 Kathmandu St", # Matches saved
            "city": "Kathmandu",
            "zip_code": "44600",
            "payment_method": "COD",
            "order_items": [
                {"product_id": self.expensive_product.id, "quantity": 1} # Total Rs. 15,000 >= Rs. 13,300
            ]
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(float(response.data["total_amount"]), 15000.00)
