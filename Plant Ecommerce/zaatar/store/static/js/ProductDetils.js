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
document.addEventListener('DOMContentLoaded', function () {
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
});
/******************************* End For search icon click ****************************** */










/******************************* Start add to Cart ****************************** */

// This function will be called when a cart icon is clicked
function addToCart(productID) {
  
  //  alert(userId);

    var imgSrc = null;
    var productName = null;
    var price = null;
    var MaxQty = null;

    // Retrieve existing cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart'+userId)) || [];

    // Find the product element
    const productElement = document.getElementById(productID);

    if(productElement != null) {

    imgSrc = productElement.querySelector('.producto').src;
    productName = productElement.querySelector('.des h5').textContent;
    price = productElement.querySelector('.des h4').textContent;
    MaxQty = productElement.querySelector('.des h1').textContent;

    }

    else{
        const productDetailsString = localStorage.getItem('current_product');
        const productDetails = JSON.parse(productDetailsString);
        imgSrc = productDetails.imgSrc;
        productName = productDetails.productName;
        price = productDetails.price;
        MaxQty = productDetails.MaxQty;

    }
  
    // Create a product object
    const product = {
        id: productID,
        image: imgSrc,
        name: productName,
        price: price.replace(/^\$/, ''), // Removing the dollar sign if present
        quantity: 1, // Default quantity is 1
        MaxQty :MaxQty
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

    updateCartCounter();
  }




// Add number of items to the cart
function updateCartCounter() {
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
   const cart = JSON.parse(localStorage.getItem('cart'+userId)) || [];
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
                <td><input type="number" value="${product.quantity}" min="1" max="${product.MaxQty}" onchange="updateQuantity(${index}, this.value)"></td>
                <td>$${(parseFloat(product.price) * product.quantity).toFixed(2)}</td>
            </tr>
        `;
        cartBody.innerHTML += cartRowHTML;
    });
  }
  /******************************* End add to Cart ****************************** */



/****************************** Start For Details of a Product ********************************/

// Function to handle clicking on a product
function handleProductClick(productId) {
    const productElement = document.getElementById(productId);

    // Extract the product details
    const imgSrc = productElement.querySelector('.producto').src;
    const productName = productElement.querySelector('.des h5').textContent;
    const price = productElement.querySelector('.des h4').textContent;
    const MaxQty = productElement.querySelector('.des h1').textContent;

    // productElement.querySelector('.des h3').style.display = 'block;'
    // const desc = productElement.querySelector('.des h3').textContent;

    const current_product = { imgSrc, productName, price, MaxQty};
    localStorage.setItem('current_product', JSON.stringify(current_product));

    const details = productElement.querySelector('.des h3').textContent;
  
    //Save the product details to localStorage
    const productDetails = { imgSrc, productName, price, MaxQty, details};
    localStorage.setItem('currentProduct', JSON.stringify(productDetails));
  
    // Redirect to the sproduct.html page
    window.location.href = productDetailUrl;
}

// Function to initialize click listeners for all products
function initProductListeners() {
    // Find all product images
    const products = document.querySelectorAll('.pro');

    // Add click event listeners to each product
    products.forEach(product => {
        const imgElement = product.querySelector('.producto');
        imgElement.addEventListener('click', function() {
            // added this line
            localStorage.setItem('selectedProduct', product.id);
            handleProductClick(product.id);
        });
    });
}

// Call the function to initialize listeners when the DOM content is loaded
document.addEventListener('DOMContentLoaded', initProductListeners);


// Function to update the product details on the sproduct.html page
function updateProductDetails() {
    
    // Get the product details from localStorage
    const productDetails = JSON.parse(localStorage.getItem('currentProduct'));
    
    // If there is no product info, return early
    if (!productDetails) return;

    // Update the product details in the sproduct.html page
    const imgElement = document.querySelector('.single-pro-image img');
    const titleElement = document.querySelector('.single-pro-details h4');
    const priceElement = document.querySelector('.single-pro-details h3');
    const detailsElement = document.querySelector('.single-pro-details span');

    imgElement.src = productDetails.imgSrc;
    titleElement.textContent = productDetails.productName;
    priceElement.textContent = productDetails.price;
    detailsElement.textContent = productDetails.details;

   
}

// Call the function to update the product details when the DOM content is loaded
document.addEventListener('DOMContentLoaded', updateProductDetails);


document.getElementById('detailAdd').addEventListener('click', function() {
    // Retrieve the stored product ID from localStorage
    const selectedProductID = localStorage.getItem('selectedProduct');

    console.log(selectedProductID);
    
    if (selectedProductID) {
      addToCart(selectedProductID);
      
      //localStorage.removeItem('selectedProduct');
    } else {
      console.log('No product selected');
     
    }
  });
  /****************************** End For Details of a Product ********************************/


