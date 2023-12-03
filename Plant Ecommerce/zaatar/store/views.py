from venv import logger
from django.urls import reverse
from django.shortcuts import render, redirect
from django.shortcuts import redirect
from .models import Plant, Pesticide, Coupon, Review, OrderItem, Order
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
import json
import re  
from django.http import JsonResponse, HttpResponse
from django.contrib.contenttypes.models import ContentType
from django.core.mail import send_mail
from django.http import HttpResponse
from .forms import ContactForm
from django.conf import settings
import stripe
from django.views.decorators.csrf import csrf_exempt


def HomePage(request):
    Plants = Plant.objects.all()[0:8]
    Pesticides = Pesticide.objects.all()[0:8]
    return render(request, 'index.html', {'plants': Plants, 'pesticides': Pesticides, 'current_page': 'home'})

def cartPage(request):
    coupons = Coupon.objects.all()
    return render(request, 'cart.html', {'current_page': 'cart', 'coupons': coupons})
 
 
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
                # return redirect('SignInPage/#')

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
    return render(request, 'login.html', {'current_page': 'login'})



def SignOut(request):
    logout(request)
    # Redirect to the home page or login page after logout
    return redirect('HomePage')  

def ShopPage(request):
    Plants = Plant.objects.all()
    Pesticides = Pesticide.objects.all()
    return render(request, 'shop.html', {'plants': Plants, 'pesticides': Pesticides, 'current_page': 'shop'})
 
def ProductDetail(request):
    return render(request,'sproduct.html')  

def navPage(request):
    return render(request, 'nav.html')

def footerPage(request):
    return render(request, 'footer.html')

def BlogPage(request):
    Reviews = Review.objects.all()
    return render(request, 'blog.html', {'current_page': 'blog', 'reviews': Reviews})

def AboutPage(request):
    return render(request, 'about.html', {'current_page': 'about'})


def ModelsPage(request):
    return render(request, 'models.html')

def search(request):
    query = request.GET.get('query','')
    if query:
        Plants = Plant.objects.filter(name__icontains=query)
        Pesticides = Pesticide.objects.filter(name__icontains=query)
        # Combine the querysets
    else:
        Plants = []
        Pesticides = []
    return render(request, 'search.html',{
                  'query':query,
                  'plants': Plants, 'pesticides': Pesticides
                  })


def add_review(request):
    if request.method == 'POST':
        print("Received a POST request.")

        # Print the form data
        print("Form data:", request.POST)
        
        user = request.user  # Get the currently logged-in user
        title = request.POST.get('title')
        review_body = request.POST.get('reviewBody')

        if title and review_body:  # Basic validation
            Review.objects.create(user=user, title=title, reviewBody=review_body)
            print("Review created successfully.")
            return redirect('BlogPage')  # Redirect to the blog page
        else:
            # Handle the error, maybe pass an error message to the template
             messages.error(request, "Error: Review submission failed. Please fill in all fields.")

    return render(request, 'blog.html')  # Render the blog page for GET request





stripe.api_key = settings.STRIPE_SECRET_KEY
endpoint_secret = settings.STRIPE_WEBHOOK_SECRET

def handle_cart_data(request):
    
    if request.method == 'POST':
        
        #print("Request Body:", request.body)
        
        data = json.loads(request.body)
        cart_items = data.get('cartItems', [])
        user_info = data.get('userInfo', {})
        total_price = data.get('total', 0)
        
        if request.user.is_authenticated:
            user = request.user
        
        order = Order.objects.create(
                    user=user,
                    total_price=total_price,
                    address=user_info.get('address', ''),
                    zip=user_info.get('zip', ''),
                    firstName=user_info.get('firstName', ''),
                    lastName=user_info.get('lastName', ''),
                    is_paid = False,
                    payment_intent = 'payment',
                    
                )
        
        success_url = reverse('successPage')
        failure_url = reverse('FailurePage')
        
        for item in cart_items:
                    match = re.match(r"(\D+)(\d+)", item['id'])
                    if not match:
                        continue
                    
                    item_type, item_id = match.groups()
                    item_id = int(item_id)
                    quantity = item['quantity']

                    if item_type == 'plant':
                        content_type = ContentType.objects.get_for_model(Plant)
                    elif item_type == 'pest':
                        content_type = ContentType.objects.get_for_model(Pesticide)
                    else:
                        continue
                    
                    order_item, created = OrderItem.objects.get_or_create(
                        order=order,
                        content_type=content_type,
                        object_id=item_id,
                        defaults={'quantity': quantity}
                    )
                    if not created:
                        order_item.quantity += quantity
                        order_item.save()
        
        # Concatenate item IDs into a string
        item_ids = ','.join(str(item['id']) for item in cart_items)
        

        checkout_session = stripe.checkout.Session.create(
            line_items=[
                {
              'price_data': {
                         'currency': 'usd',
                           'product_data': {
                             'name': order.id,
                                    },
                          'unit_amount': int(float(order.total_price) * 100),
                                             },
                             'quantity': 1,
                        }],
            mode='payment',
            success_url=request.build_absolute_uri(reverse('successPage')),
            cancel_url=request.build_absolute_uri(reverse('FailurePage')),
            metadata={
        'order_id': str(order.id),
        'item_ids': item_ids  # Add item IDs in metadata
    }
        )
        

    return JsonResponse({'url': checkout_session.url})


@csrf_exempt
def my_webhook_view(request):
    payload = request.body
    sig_header = request.META['HTTP_STRIPE_SIGNATURE']
    event = None

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError as e:
        # Invalid payload
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        return HttpResponse(status=400)

    # Handle checkout.session.completed event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']

        # Extract the order ID from session metadata
        order_id = session['metadata'].get('order_id')
        payment_intent_id = session.get('payment_intent')
        
        # Retrieve metadata
        item_ids_string = session['metadata'].get('item_ids')

        # Split the item_ids_string into a list of IDs
        item_ids = item_ids_string.split(',') if item_ids_string else []
        
        # Use a regular expression to extract just the numeric part of each item ID
        numeric_item_ids = [int(re.search(r'\d+', item_id).group()) for item_id in item_ids if re.search(r'\d+', item_id)]
        
        if order_id and payment_intent_id:
            fulfill_Order(order_id, payment_intent_id, numeric_item_ids)

    return HttpResponse(status=200)




def fulfill_Order(order_id,  payment_intent_id, item_ids):
    try:
        # Convert order_id to an integer
        order_id_int = int(order_id)
        order = Order.objects.get(id=order_id_int)
        order.payment_intent =  payment_intent_id  # Adjust as needed
        order.is_paid = True
        order.save()
        
        for item_id in item_ids:
            order_item = OrderItem.objects.get(object_id = item_id, order_id = order_id)
            
            if(order_item.content_type.model == "pesticide"):
                pest = Pesticide.objects.get(id = item_id)
                pest.quantity = pest.quantity - order_item.quantity
                pest.save()
                
            if(order_item.content_type.model == "plant"):
                plant = Plant.objects.get(id = item_id)
                plant.quantity = plant.quantity - order_item.quantity
                plant.save()
                
    except ValueError:
        # Handle the case where order_id is not an integer
        logger.error(f"Invalid order_id: {order_id}")
        # Additional handling as needed
    except Order.DoesNotExist:
        # Handle the case where no order is found
        logger.error(f"Order with id {order_id} does not exist.")
        # Additional handling as needed
        

def ContactPage(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            name = form.cleaned_data['name']
            email = form.cleaned_data['email']
            subject = form.cleaned_data['subject']
            message = form.cleaned_data['message']

            # Send an email
            send_mail(
    subject,
    f"Message from {name} ({email}): {message}",
    'hadibazzi2017@hotmail.com',  # This should match EMAIL_HOST_USER
    ['hadibazzi2017@hotmail.com'],
    fail_silently=False,
)       # If everything is OK, add a success message
        messages.success(request, 'Email sent successfully')

        # Redirect to the same page or to a success page
        return redirect('ContactPage')  
    else:
        form = ContactForm()

    return render(request, 'contact.html', {'form': form})


def CheckOutPage(request):
    return render(request, 'checkout.html')



def successPage(request):
    return render(request, 'success.html')

def FailurePage(request):
    return render(request, 'Failure.html')



def index(request):
    return render(request, 'index.html')


import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

def analyze1(request):
    print("hekko")
    result = None
     
    if request.method == 'POST':
        data = json.loads(request.body)
        print("bye")
        print(data)
        
        N = data.get('N')
        P = data.get('P')
        K = data.get('K')
        temp = data.get('temperature')
        ph = data.get('ph')
        humidity = data.get('humidity')
        rainfall = data.get('rainfall')

        crop = pd.read_csv("datasets/Crop_recommendation.csv")

    # remove duplicate values
        crop = crop.drop_duplicates()

    # handle null values in dataset
        attr=["N","P","K","temperature","humidity","ph", "rainfall","label"]
        if crop.isna().any().sum() !=0:
            for i in range(len(attr)):
                crop[attr[i]].fillna(0.0, inplace = True)

    #Remove unwanted parts from strings in a column 
        crop.columns = crop.columns.str.replace(' ', '') 

    # we have given 7 features to the algorithm
        features = crop[['N', 'P','K','temperature', 'humidity', 'ph', 'rainfall']]

    # dependent variable is crop
        target = crop['label']

    # our model will contain training and testing data
        x_train, x_test, y_train, y_test = train_test_split(features,target,test_size = 0.2,random_state =2)
    
    # here n_estimators is The number of trees in the forest.
    # random_state is for controlling  the randomness of the bootstrapping
        RF = RandomForestClassifier(n_estimators=20, random_state=0)

    # we'll use rf.fit to build a forest of trees from the training set (X, y).
        RF.fit(x_train,y_train)
        
    # at this stage our algorithm is trained and ready to use
    
    

    # make a list of user input
        userInput = [N, P, K, temp, humidity, ph, rainfall]
        
    
    # use trained model to predict the data based on user input
        result = RF.predict([userInput])[0]
        
        if isinstance(result, np.ndarray):
                result = result.tolist()
        elif isinstance(result, np.generic):
                result = result.item()
        
    #     Plants = Plant.objects.all()[0:8]

    # # Convert Plants data into a list of dictionaries (or any serializable format)
    #     result = list(Plants.values())
     
        
        #print(result)

    # display  result to the user
       # params = {'purpose':'Predicted Crop: ', 'analyzed_text': result.upper()}
    
    # return render(request, 'index.html', {'result': Plants})  
 #

    # Return a JSON response
    return JsonResponse({'result': result})



#/Users/hadi/Desktop/Plant-Ecommerce/Plant\ Ecommerce/zaatar/stripe [command]
