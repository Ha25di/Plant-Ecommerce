"""
URL configuration for zaatar project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from store.views import HomePage, SignInPage, cartPage, SignOut, ShopPage, ProductDetail, navPage, BlogPage, AboutPage, ContactPage, CheckOutPage, ModelsPage,search

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', HomePage, name='HomePage'),
    path('HomePage/', HomePage, name='HomePage'),
    path('SignInPage/', SignInPage, name='SignInPage'),
    path('cartPage/', cartPage, name='cartPage'),
    path('SignOut/', SignOut, name='SignOut'),
    path('Shop/', ShopPage, name='ShopPage'),
    path('ProductDetail/', ProductDetail, name='ProductDetail'),
    path('navPage/', navPage, name='navPage'),
    path('BlogPage/', BlogPage, name='BlogPage'),
    path('AboutPage/', AboutPage, name='AboutPage'),
    path('ContactPage/', ContactPage, name='ContactPage'),
    path('CheckOutPage/', CheckOutPage, name='CheckOutPage'),
    path('ModelsPage/', ModelsPage, name='ModelsPage'),
    path('search/', search,name="search" )

    
] + static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)

