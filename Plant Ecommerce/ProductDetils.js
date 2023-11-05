
/******************************* Start add to Cart ****************************** */

// This function will be called when a cart icon is clicked
function addToCart(productID) {
    var imgSrc = null;
    var productName = null;
    var price = null;

    // Retrieve existing cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Find the product element
    const productElement = document.getElementById(productID);

    if(productElement != null) {

    imgSrc = productElement.querySelector('.producto').src;
    productName = productElement.querySelector('.des h5').textContent;
    price = productElement.querySelector('.des h4').textContent;
    }

    else{
        const productDetailsString = localStorage.getItem('current_product');
        const productDetails = JSON.parse(productDetailsString);
        imgSrc = productDetails.imgSrc;
        productName = productDetails.productName;
        price = productDetails.price;

    }
  
    // Create a product object
    const product = {
        id: productID,
        image: imgSrc,
        name: productName,
        price: price.replace(/^\$/, ''), // Removing the dollar sign if present
        quantity: 1 // Default quantity is 1
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
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  
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



/****************************** Start For Details of a Product ********************************/

// Function to handle clicking on a product
function handleProductClick(productId) {
    const productElement = document.getElementById(productId);

    // Extract the product details
    const imgSrc = productElement.querySelector('.producto').src;
    const productName = productElement.querySelector('.des h5').textContent;
    const price = productElement.querySelector('.des h4').textContent;

    const current_product = { imgSrc, productName, price};
    localStorage.setItem('current_product', JSON.stringify(current_product));

    const details= "Plant Product";
  
    // Save the product details to localStorage
    const productDetails = { imgSrc, productName, price,details};
    localStorage.setItem('currentProduct', JSON.stringify(productDetails));
    // Redirect to the sproduct.html page
    window.location.href = 'sproduct.html';
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
document.addEventListener('DOMContentLoaded', (event) => {
    initProductListeners();
});

// Function to update the product details on the sproduct.html page
function updateProductDetails() {
    
    // Get the product details from localStorage
    const productDetails = JSON.parse(localStorage.getItem('currentProduct'));
    
    // If there is no product info, return early
    if (!productDetails) return;

    // Update the product details in the sproduct.html page
    const imgElement = document.querySelector('.single-pro-image img');
    const titleElement = document.querySelector('.single-pro-details h4');
    const priceElement = document.querySelector('.single-pro-details h2');
    const detailsElement = document.querySelector('.single-pro-details span');

    imgElement.src = productDetails.imgSrc;
    titleElement.textContent = productDetails.title;
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