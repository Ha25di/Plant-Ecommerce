from django.shortcuts import render, redirect
from .models import Plant, Pesticide
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
# from .models import UserProfile


# Create your views here.

def HomePage(request):
    Plants = Plant.objects.all()[0:8]
    Pesticides = Pesticide.objects.all()[0:8]
    return render(request, 'index.html', {'plants': Plants, 'pesticides': Pesticides})

def cartPage(request):
     return render(request, 'cart.html')
 
 
def SignInPage(request):
    if request.method == 'POST':
        if 'signup' in request.POST:  # Check if this is a sign up form submission
            # Extract the information from the signup form
            username = request.POST.get('username')
            email = request.POST.get('email')
            password1 = request.POST.get('password1')
            password2 = request.POST.get('password2')

            # Proceed only if the passwords match
            if password1 == password2:
                # Check if the username or email already exists
                if User.objects.filter(username=username).exists():
                    messages.error(request, 'Username already exists')
                elif User.objects.filter(email=email).exists():
                    messages.error(request, 'Email already exists')
                else:
                    # Create the User object
                    user = User.objects.create_user(username=username, email=email, password=password1)
                    # Log the user in after creating the account
                    login(request, user)
                    # Redirect to the HomePage
                    return redirect('HomePage')
            else:
                messages.error(request, 'Passwords do not match')

        elif 'signin' in request.POST:  # Check if this is a sign in form submission
            # Extract the information from the sign in form
            username = request.POST.get('username')
            password = request.POST.get('password')
            # Authenticate the user
            user = authenticate(request, username=username, password=password)
            if user is not None:
                # Log the user in and redirect to HomePage
                login(request, user)
                return redirect('HomePage')
            else:
                messages.error(request, 'Invalid username or password')

    # Render the login page for GET requests or if neither form has been submitted
    return render(request, 'login.html')



def SignOut(request):
    logout(request)
    # Redirect to the home page or login page after logout
    return redirect('HomePage')  