from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone

class Plant(models.Model):
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    image = models.ImageField(upload_to='plants/')
    quantity = models.IntegerField()

    def __str__(self):
        return self.name
    
    
class Pesticide(models.Model):
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    image = models.ImageField(upload_to='pesticides/')
    quantity = models.IntegerField()

    def __str__(self):
        return self.name


class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    reviewBody = models.TextField()
    sentiment = models.CharField(max_length=200)
    date_posted = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title



class Coupon(models.Model):
    name = models.CharField(max_length=100)
    percentageOfDiscount = models.FloatField()

    def __str__(self):
        return self.name


class Order(models.Model):
    STATUS_CHOICES = (
        ('P', 'Pending'),
        ('D', 'Delivered'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True)
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default='P')
    date_of_purchase = models.DateTimeField(default=timezone.now)
    address = models.CharField(max_length=300)
    zip = models.CharField(max_length=300)
    firstName = models.CharField(max_length=300)
    lastName = models.CharField(max_length=300)
    is_paid = models.BooleanField(default=False)
    payment_intent = models.CharField(max_length=300)

    def __str__(self):
        return f"Order {self.id} by {self.user.username}"
    
    
class OrderItem (models.Model):
        order = models.ForeignKey('Order', on_delete=models.CASCADE, related_name='items', null=False)
        content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
        object_id = models.PositiveIntegerField()
        content_object = GenericForeignKey('content_type', 'object_id')
        quantity = models.IntegerField(default=1)

        def __str__(self):
            return f"{self.content_object.name} x {self.quantity}"
    
  
