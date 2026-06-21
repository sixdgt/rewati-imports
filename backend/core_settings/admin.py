from django.contrib import admin
import json
from django.utils.timezone import now, timedelta
from django.db.models import Sum, Count
from django.db.models.functions import TruncDay

from orders.models import Order, OrderItem
from products.models import Product
from authentication.models import User


class CustomAdminSite(admin.AdminSite):
    site_header = "Rewati Imports Admin"
    index_template = "admin/custom_index.html"

    def index(self, request, extra_context=None):
        extra_context = extra_context or {}

        total_orders = Order.objects.count()
        total_revenue = Order.objects.aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        total_customers = User.objects.count()
        total_products = Product.objects.count()

        last_week = now() - timedelta(days=7)

        daily_data = (
            Order.objects.filter(created_at__gte=last_week)
            .annotate(day=TruncDay('created_at'))
            .values('day')
            .annotate(
                orders=Count('id'),
                revenue=Sum('total_amount')
            )
            .order_by('day')
        )

        labels = [d['day'].strftime("%b %d") for d in daily_data]
        orders_data = [d['orders'] for d in daily_data]
        revenue_data = [float(d['revenue'] or 0) for d in daily_data]

        top_products = (
            OrderItem.objects.values('product__name')
            .annotate(total_sold=Sum('quantity'))
            .order_by('-total_sold')[:5]
        )

        top_product_labels = [p.get('product__name') or "Deleted" for p in top_products]
        top_product_data = [p['total_sold'] for p in top_products]

        status_data = (
            Order.objects.values('status')
            .annotate(count=Count('id'))
        )

        status_labels = [s['status'] for s in status_data]
        status_counts = [s['count'] for s in status_data]

        extra_context.update({
            "total_orders": total_orders,
            "total_revenue": total_revenue,
            "total_customers": total_customers,
            "total_products": total_products,

            "has_orders_data": len(labels) > 0,
            "chart_labels": json.dumps(labels),
            "orders_data": json.dumps(orders_data),
            "revenue_data": json.dumps(revenue_data),

            "has_top_products": len(top_product_labels) > 0,
            "top_product_labels": json.dumps(top_product_labels),
            "top_product_data": json.dumps(top_product_data),

            "status_labels": json.dumps(status_labels),
            "status_data": json.dumps(status_counts),
        })

        return super().index(request, extra_context)

