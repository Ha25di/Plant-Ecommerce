
/******************************* Start add to Cart ****************************** */

// This function will be called when a cart icon is clicked
function addToCart(productID) {
  // Retrieve existing cart from localStorage
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Find the product element
  const productElement = document.getElementById(productID);
  const imgSrc = productElement.querySelector('.producto').src;
  const productName = productElement.querySelector('.des h5').textContent;
  const price = productElement.querySelector('.des h4').textContent;

  // Create a product object
  const product = {
      id: productID,
      image: imgSrc,
      name: productName,
      price: price.replace(/^\$/, ''), // Removing the dollar sign if present
      quantity: 1 // Default quantity is 1
  };

  // Add the product to the cart array
  cart.push(product);

  // Save the updated cart back to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Attach the click event listener to each cart icon
document.querySelectorAll('.pro').forEach((productElement, index) => {
  const cartIconContainer = productElement.querySelector('.cart-icon-container');
  cartIconContainer.addEventListener('click', function(event) {
      event.preventDefault(); // Prevent the anchor default click behavior
      const productID = `plant${index + 1}`; // Construct the product ID
      addToCart(productID);
  });
});



// This function will render the cart items on the cart page
function renderCart() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartBody = document.getElementById('cart-body');
  
  // Clear the cart body
  cartBody.innerHTML = '';

  // Loop over the items in the cart and append them to the table
  cart.forEach((product, index) => {
      const cartRowHTML = `
          <tr>
              <td><a href="#" onclick="removeFromCart(${index}); return false;"><img class="close-icon-cart" src="img/icons/x.png"></a></td>
              <td><img src="${product.image}"></td>
              <td>${product.name}</td>
              <td>$${product.price}</td>
              <td><input type="number" value="${product.quantity}" min="1" max="5" onchange="updateQuantity(${index}, this.value)"></td>
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
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1); // Remove the item at the specified index
  localStorage.setItem('cart', JSON.stringify(cart)); // Update the cart in localStorage
  renderCart(); // Re-render the cart
  updateCartTotal();
}

/******************************* End Remove from Cart ****************************** */

/******************************* Update Quantity in Cart ****************************** */
function updateQuantity(index, quantity) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Ensure the quantity is within the min and max values
  quantity = Math.max(1, Math.min(quantity, 5));
  
  cart[index].quantity = quantity; // Update the quantity
  localStorage.setItem('cart', JSON.stringify(cart)); // Update the cart in localStorage
  renderCart(); // Re-render the cart to update the subtotal
  updateCartTotal();
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







const bar = document.getElementById('bar');
const nav = document.getElementById('navbar');
const close = document.getElementById('close');

if (bar){
    bar.addEventListener('click', () => {
        nav.classList.add('active');
    })
}

if (close){
    close.addEventListener('click', () => {
        nav.classList.remove('active');
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




