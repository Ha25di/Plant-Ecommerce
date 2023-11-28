

/******************************* Start add to Cart ****************************** */
// This function will be called when a cart icon is clicked
function addToCart(productID) {
 // alert(userId);
  // Retrieve existing cart from localStorage
  // alert('cart'+userId);
  const cart = JSON.parse(localStorage.getItem('cart'+userId)) || [];
  // console.log("cart : "+cart);

  //console.log(cart);

  // Find the product element
  const productElement = document.getElementById(productID);
  
  
  const imgSrc = productElement.querySelector('.producto').src;
  const productName = productElement.querySelector('.des h5').textContent;
  const price = productElement.querySelector('.des h4').textContent;
  const MaxQty = productElement.querySelector('.des h1').textContent;

  if(MaxQty <= 0) {
    Swal.fire({
      position: 'center', // Position it in the center
      icon: 'error', // Change icon to 'error'
      title: 'Out Of Stock', // Update title to indicate failure
      showConfirmButton: true, // Show the confirm button
      width: '400px', // Set a smaller width
      // Optionally, you can use customClass to define your own styles in CSS
      customClass: {
        popup: 'my-swal' // This is a class you can define in your CSS file
      }
    });
  }

  else{

  // Create a product object
  const product = {
      id: productID,
      image: imgSrc,
      name: productName,
      price: price.replace(/^\$/, ''), // Removing the dollar sign if present
      quantity: 1,
      MaxQty: MaxQty
  };

   
  // Add the product to the cart array
  let productIndex = cart.findIndex((p) => p.id === productID);
  if (productIndex > -1) {
    // Product exists, increment the quantity
    cart[productIndex].quantity += 1;
   
  } else {
    // Add the new product to the cart
    cart.push(product);
  }
  //cart.push(product);

  Swal.fire({
    position: 'center', // Position it in the center
    icon: 'success',
    title: 'Added to Cart',
    showConfirmButton: false,
    timer: 1500,
    width: '400px', // Set a smaller width
    // Optionally, you can use customClass to define your own styles in CSS
    customClass: {
      popup: 'my-swal' // This is a class you can define in your CSS file
    }
  });
  // Save the updated cart back to localStorage
  localStorage.setItem('cart'+userId, JSON.stringify(cart));
   // Add the number to the cart
   updateCartCounter();

  }
}





// Add number of items to the cart
function updateCartCounter() {
  // const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cart = JSON.parse(localStorage.getItem('cart'+userId)) || [];

  const totalQuantity = cart.reduce((accumulator, currentItem) => {
    return accumulator + currentItem.quantity;
  }, 0);

  if(document.getElementById("cartCounter")){
  document.getElementById("cartCounter").textContent = totalQuantity;
  }

  if(document.getElementById("mobile-cartCounter")) {
    document.getElementById("mobile-cartCounter").textContent = totalQuantity;
  }
}

// Event listener for the storage event to update the counter when changes are made in another page
window.addEventListener('storage', function(event) {
  if (event.key === 'cart') {
    updateCartCounter();
  }
});

// Call updateCartCounter when the page loads to initialize the counter
document.addEventListener('DOMContentLoaded', updateCartCounter);












// Attach the click event listener to each cart icon
document.querySelectorAll('.pro').forEach((productElement, index) => {
  const cartIconContainer = productElement.querySelector('.cart-icon-container');
  cartIconContainer.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the anchor default click behavior
    const productID = productElement.id; // Use the ID already assigned to the product element
    addToCart(productID);
  });
});

// This function will render the cart items on the cart page
function renderCart() {
  
  // const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cart = JSON.parse(localStorage.getItem('cart'+userId)) || [];
  const cartBody = document.getElementById('cart-body');  
  
  // Clear the cart body
  cartBody.innerHTML = '';

  // Loop over the items in the cart and append them to the table
  cart.forEach((product, index) => {
      const cartRowHTML = `
          <tr>
              <td><a href="#" onclick="removeFromCart(${index}); return false;"><img class="close-icon-cart" src="/static/img/icons/x.png"></a></td>
              <td><img src="${product.image}"></td>
              <td>${product.name}</td>
              <td>$${product.price}</td>
              <td><input type="number" value="${product.quantity}" min = "1" max="${product.MaxQty}" onchange="updateQuantity(${index}, this.value)"></td>
              <td>$${(parseFloat(product.price) * product.quantity).toFixed(2)}</td>
          </tr>
      `;
      cartBody.innerHTML += cartRowHTML;
  });
}
/******************************* End add to Cart ****************************** */

/******************************* Start Remove from Cart ****************************** */

// This function will remove an item from the cart
function removeFromCart(index) {
  // const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cart = JSON.parse(localStorage.getItem('cart'+userId)) || [];

  cart.splice(index, 1); // Remove the item at the specified index
  // localStorage.setItem('cart', JSON.stringify(cart)); // Update the cart in localStorage
  localStorage.setItem('cart'+userId, JSON.stringify(cart));
  renderCart(); // Re-render the cart
  updateCartTotal();
  updateCartCounter();
}

/******************************* End Remove from Cart ****************************** */


/******************************* Update Quantity in Cart ****************************** */
function updateQuantity(index, quantity) {
  // const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cart = JSON.parse(localStorage.getItem('cart'+userId)) || [];

  // Ensure the quantity is within the min and max values
  quantity = Math.max(1, Math.min(quantity, cart[index].MaxQty));
  
  cart[index].quantity = quantity; // Update the quantity
  // localStorage.setItem('cart', JSON.stringify(cart)); // Update the cart in localStorage
  localStorage.setItem('cart'+userId, JSON.stringify(cart));

  renderCart(); // Re-render the cart to update the subtotal
  updateCartTotal();
  updateCartCounter();
}

// Call the renderCart function to populate the cart when the page is loaded
document.addEventListener('DOMContentLoaded', renderCart);



/******************************* Update Total in Cart ****************************** */

function updateCartTotal() {
  // Get all the 'tr' elements in the 'tbody' of the cart
  var cartItems = document.querySelectorAll('#cart-body tr');
  var total = 0;

  // Loop through each 'tr' to calculate the total price
  cartItems.forEach(function(item) {
    // Find the 'td' with the subtotal, which is assumed to be the last 'td' in the row
    var subtotalElement = item.querySelector('td:last-child');
    // Get the text content of the 'td', remove the dollar sign, and convert it to a float
    var subtotal = parseFloat(subtotalElement.textContent.replace('$', ''));
    // Add the subtotal to the total
    total += subtotal;
  });

  // Format the total to two decimal places and prepend with a dollar sign
  var formattedTotal = '$' + total.toFixed(2);



  // Update the 'td' with the id 'cartTotal' with the calculated total
  document.getElementById('cartTotal').textContent = formattedTotal;
  document.getElementById('Total').textContent = formattedTotal;

  // to send total to the user
  localStorage.setItem('Invoice' + userId, formattedTotal);

}

// When the page loads
document.addEventListener('DOMContentLoaded', updateCartTotal);

// And after you handle an item being added, removed, or its quantity updated
function onCartItemChange() {
  // ... your code to handle the cart item change ...
  
  // Then update the total
  updateCartTotal();
}
/******************************* ************************* ****************************** */




/******************************* Applying Coupon ****************************** */

document.addEventListener('DOMContentLoaded', () => {
  // Handler for the Apply Coupon button click
  document.getElementById('CouponBtn').addEventListener('click', applyCoupon);
});

function applyCoupon() {
  const couponInput = document.getElementById('CouponInput').value.toLowerCase(); // Get the coupon code and convert to lower case
  const cartTotalElement = document.getElementById('cartTotal');
  const totalElement = document.getElementById('Total');

  let cartTotal = parseFloat(cartTotalElement.textContent.replace('$', '')); // Assuming the cart total is in this format: $335
  let discount = 0;

  // Define the valid coupons
  const validCoupons = coupDetail;
  var foundCoupon = coupDetail.find(function(coupon) {
    return coupon.name === couponInput;
  });

  if (foundCoupon) {
    // Apply the discount
    discount = cartTotal * (foundCoupon.discount / 100); // Convert discount percentage to a decimal
    console.log("Discount applied: " + discount);
    Swal.fire({
      position: 'center', // Position it in the center
      icon: 'success',
      title: 'Discount Applied',
      showConfirmButton: false,
      timer: 1500,
      width: '400px', // Set a smaller width
      // Optionally, you can use customClass to define your own styles in CSS
      customClass: {
        popup: 'my-swal' // This is a class you can define in your CSS file
      }
    });
    
  } else {
    console.log("No valid coupon found");
  }
  // Calculate the total after applying discount
  let total = cartTotal - discount;
  
  // Update the total element
  let formattedTotal = `$${total.toFixed(2)}`;
  totalElement.textContent = formattedTotal;

// Assuming 'userId' is already defined and accessible
   localStorage.setItem('Invoice' + userId, formattedTotal);

}
/******************************* ************************* ****************************** */

const bar = document.getElementById('bar');
const nav = document.getElementById('navbar');
const close = document.getElementById('close');

if (bar){
    bar.addEventListener('click', () => {
      nav.classList.add("active");
      // Select the element with the class .mobile-cart-counter
      var element = document.querySelector(".mobile-cart-counter");

      // Change the display property to 'none'
      if (element) {
        element.style.display = "none";
      }
    })
}

if (close){
    close.addEventListener('click', () => {
        nav.classList.remove('active');
           // Select the element with the class .mobile-cart-counter
      var element = document.querySelector(".mobile-cart-counter");

      // Change the display property to 'block'
      if (element) {
        element.style.display = "inline-block";
      }
    })
}


/******************************* Start For search icon click ****************************** */

// Get the search icon and input element
var searchIcon = document.getElementById('search-og');
var searchInput = document.getElementById('search-input');

// Add click event listener to the search icon
searchIcon.addEventListener('click', function() {
  // Toggle the display of the search input
  if (searchInput.style.display === 'none' || searchInput.style.display === '') {
    searchInput.style.display = 'block';
    searchInput.focus(); // Focus the input field after displaying it
  } else {
    searchInput.style.display = 'none';
  }
});

var MsearchIcon = document.getElementById('mobile-search-og');
var MsearchInput = document.getElementById('mobile-search-input');

// Add click event listener to the search icon
MsearchIcon.addEventListener('click', function() {
  // Toggle the display of the search input
  if (MsearchInput.style.display === 'none' || MsearchInput.style.display === '') {
    MsearchInput.style.display = 'block';
    MsearchInput.focus(); // Focus the input field after displaying it
  } else {
    MsearchInput.style.display = 'none';
  }
});

/******************************* End For search icon click ****************************** */



/******************************* Start code for login/signup ****************************** */
let wrapper = document.querySelector('.wrapper'),
    signUpLink = document.querySelector('.link .signup-link'),
    signInLink = document.querySelector('.link .signin-link');
    
// msgs = messages;
//alert(msgs);

signUpLink.addEventListener('click', () => {
//   if (msgs.length > 0) {
//     // Process messages
//     msgs.forEach(function(message) {
//         console.log(message); 
//         console.log(typeof message); 
//         // if (message.trim() !== 'Invalid username or password') {
//         //   alert("hello");
//         // }
//     });
// }


    wrapper.classList.add('animated-signin');
    wrapper.classList.remove('animated-signup');
});

signInLink.addEventListener('click', () => {
    wrapper.classList.add('animated-signup');
    wrapper.classList.remove('animated-signin');
});
/******************************* End code for login/signup ****************************** */