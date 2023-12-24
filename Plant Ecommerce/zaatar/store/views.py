from venv import logger
from django.urls import reverse
from django.shortcuts import render, redirect
from django.shortcuts import redirect
import pandas as pd
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
import numpy as np
import joblib
from django.db.models.functions import Lower


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
    

from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
def add_review(request):
    sentiment = SentimentIntensityAnalyzer()
    if request.method == 'POST':
        print("Received a POST request.")

        # Print the form data
        #print("Form data:", request.POST)
        
        user = request.user  # Get the currently logged-in user
        title = request.POST.get('title')
        review_body = request.POST.get('reviewBody')
        
        scores = sentiment.polarity_scores(review_body)
        #print(scores)

        # Find the label with the highest score
        # Exclude 'compound' score and find the label with the highest score
        scores.pop('compound')  # This removes the 'compound' score from the dictionary
        highest_score_label = max(scores, key=scores.get)
        #print(highest_score_label)

        if title and review_body:  # Basic validation
            Review.objects.create(user=user, title=title, reviewBody=review_body, sentiment =  highest_score_label)
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
    
    #print("HELllllllllllllllllllllllllllllllllllllllllllll")
    
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


def analyze1(request):
    
    result = None
     
    if request.method == 'POST':
        data = json.loads(request.body)

        
        N = data.get('N')
        P = data.get('P')
        K = data.get('K')
        temp = data.get('temperature')
        ph = data.get('ph')
        humidity = data.get('humidity')
        rainfall = data.get('rainfall')

    # make a list of user input
        userInput = [N, P, K, temp, humidity, ph, rainfall]
        RF = joblib.load('trained_RF_model.pkl')
        
    # use trained model to predict the data based on user input
        result = RF.predict([userInput])[0]
        
    # Retrieve the pesticide whose name contains 'result'
        plant = Plant.objects.annotate(lower_name=Lower('name')).get(lower_name__icontains=result)
    
        
        plant_details = {
            'image': plant.image.url if plant.image else None,
            'price': plant.price,
            'description': plant.description,
            'name': plant.name
        }
        
        #print(plant_details)
        
        if isinstance(result, np.ndarray):
                result = result.tolist()
        elif isinstance(result, np.generic):
                result = result.item()
        
    # Return a JSON response
    return JsonResponse({'plant_details': plant_details})




def analyze2(request):
    
    result = None
     
    if request.method == 'POST':
        data = json.loads(request.body)

        
        N = data.get('N')
        P = data.get('P')
        K = data.get('K')
        temp = data.get('temperature')
        moisture = data.get('moisture')
        humidity = data.get('humidity')
        soil = data.get('soil')
        crop = data.get('crop')
        
        
        #print(soil, crop, moisture,humidity, N, P, K, temp)
        
        LR = joblib.load('trained_LR_model.pkl')
        
        soil_type_encoder = joblib.load('trained_Soil Type_encoder.pkl')
        crop_type_encoder = joblib.load('trained_Crop Type_encoder.pkl')

        # Encode the categorical data
        soil_encoded = soil_type_encoder.transform([soil])[0]
        crop_encoded = crop_type_encoder.transform([crop])[0]
        
        userInput = [temp, humidity, moisture, soil_encoded, crop_encoded, N, K, P]
        
        # Prepare your input data (assuming userInput is a list of feature values)
        input_df = pd.DataFrame([userInput], columns=['Temperature', 'Humidity', 'Moisture', 'Soil Type',
                                                      'Crop Type', 'Nitrogen', 'Potassium', 'Phosphorous']) 
        result = LR.predict(input_df)[0]
        
        print("HEEEEEEELLLLOOOO", result)
        
        # Retrieve the plant with the name matching 'result'
        #pest = Pesticide.objects.get(name=result)
        
        # Retrieve the pesticide whose name contains 'result'
        pest = Pesticide.objects.get(name__icontains = result)
        
        print (pest.price, pest.description, pest.name)
        
        pest_details = {
            'image': pest.image.url if pest.image else None,
            'price': pest.price,
            'description': pest.description,
            'name': pest.name
        }
        
        
        
       # print('DWDdwdwfdwdwdwdwdwdwdwdwdwdwdwdwdwdwdwdwdwdwd',pest_details)
        
       # print(result)
        
        if isinstance(result, np.ndarray):
                result = result.tolist()
        elif isinstance(result, np.generic):
                result = result.item()
        
    # Return a JSON response
    return JsonResponse({
        'pest_details': pest_details})



#/Users/hadi/Desktop/Plant-Ecommerce/Plant\ Ecommerce/zaatar/stripe listen --forward-to http://127.0.0.1:8000/webhook/stripe 