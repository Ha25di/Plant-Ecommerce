from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone

# class UserProfile(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
#     def __str__(self):
#         return self.user.username

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
    date_posted = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title



class Coupon(models.Model):
    name = models.CharField(max_length=100)
    percentageOfDiscount = models.FloatField()

    def __str__(self):
        return self.name


class OrderItem(models.Model):
    # Generic foreign key setup to refer to either a Plant or a Pesticide
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

    quantity = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.content_object.name} x {self.quantity}"

class Order(models.Model):
    STATUS_CHOICES = (
        ('P', 'Pending'),
        ('D', 'Delivered'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    items = models.ManyToManyField(OrderItem)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True)
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default='P')
    date_of_purchase = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Order {self.id} by {self.user.username}"

    def save(self, *args, **kwargs):
        if not self.total_price:
            # Assuming each Plant or Pesticide has a 'price' field
            self.total_price = sum(
                item.content_object.price * item.quantity for item in self.items.all()
            )
        super(Order, self).save(*args, **kwargs)