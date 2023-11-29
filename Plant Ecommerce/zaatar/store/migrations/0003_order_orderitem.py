# Generated by Django 4.2.7 on 2023-11-26 17:04

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('contenttypes', '0002_remove_content_type_name'),
        ('store', '0002_remove_orderitem_content_type_remove_orderitem_order_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('total_price', models.DecimalField(blank=True, decimal_places=2, max_digits=10)),
                ('status', models.CharField(choices=[('P', 'Pending'), ('D', 'Delivered')], default='P', max_length=1)),
                ('date_of_purchase', models.DateTimeField(default=django.utils.timezone.now)),
                ('address', models.CharField(max_length=300)),
                ('zip', models.CharField(max_length=300)),
                ('firstName', models.CharField(max_length=300)),
                ('lastName', models.CharField(max_length=300)),
                ('is_paid', models.BooleanField(default=False)),
                ('payment_intent', models.CharField(max_length=300)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='OrderItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('object_id', models.PositiveIntegerField()),
                ('quantity', models.IntegerField(default=1)),
                ('content_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='contenttypes.contenttype')),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='store.order')),
            ],
        ),
    ]