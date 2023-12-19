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
from asyncio import CancelledError
from sre_constants import SUCCESS
from django.contrib import admin
from django.urls import path
from store.views import FailurePage, HomePage, SignInPage, add_review, analyze1, analyze2, cartPage, SignOut, ShopPage, ProductDetail, footerPage, handle_cart_data, my_webhook_view, navPage, BlogPage, AboutPage, ContactPage, CheckOutPage, ModelsPage,search, successPage
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
    path('footerPage/', footerPage, name='footerPage'),
    path('BlogPage/', BlogPage, name='BlogPage'),
    path('AboutPage/', AboutPage, name='AboutPage'),
    path('ContactPage/', ContactPage, name='ContactPage'),
    path('CheckOutPage/', CheckOutPage, name='CheckOutPage'),
    path('ModelsPage/', ModelsPage, name='ModelsPage'),
    path('search/', search,name="search" ),
    path('add_review/', add_review, name='add_review'),
    path('handle_cart_data/', handle_cart_data, name='handle_cart_data'),
    path('webhook/stripe', my_webhook_view, name='webhook-stripe'),
    path('successPage/',successPage, name='successPage'),
    path('FailurePage/',FailurePage, name='FailurePage'),
    path('analyze1/',analyze1, name='analyze1'),
    path('analyze2/',analyze2, name='analyze2')
    

    
] + static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)


