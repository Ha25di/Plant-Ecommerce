from django.contrib import admin
from .models import Plant, Pesticide, Review, Coupon, Order, OrderItem


admin.site.register(Plant)
admin.site.register(Pesticide)
admin.site.register(Review)
admin.site.register(Coupon)
admin.site.register(Order)
admin.site.register(OrderItem)