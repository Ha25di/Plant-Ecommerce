// /******************************* Start add to Cart ****************************** */

// // This function will be called when a cart icon is clicked
// function addToCart(productID) {
//     // Retrieve existing cart from localStorage
//     const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
//     // Find the product element
//     const productElement = document.getElementById(productID);
//     const imgSrc = productElement.querySelector('.producto').src;
//     const productName = productElement.querySelector('.des h5').textContent;
//     const price = productElement.querySelector('.des h4').textContent;
  
//     // Create a product object
//     const product = {
//         id: productID,
//         image: imgSrc,
//         name: productName,
//         price: price.replace(/^\$/, ''), // Removing the dollar sign if present
//         quantity: 1 // Default quantity is 1
//     };
  
//     // Add the product to the cart array
//     let productIndex = cart.findIndex((p) => p.id === productID);
//     if (productIndex > -1) {
//       // Product exists, increment the quantity
//       cart[productIndex].quantity += 1;
//     } else {
//       // Add the new product to the cart
//       cart.push(product);
//     }
//     //cart.push(product);
  
//     Swal.fire({
//       position: 'center', // Position it in the center
//       icon: 'success',
//       title: 'Added to Cart',
//       showConfirmButton: false,
//       timer: 1500,
//       width: '400px', // Set a smaller width
//       // Optionally, you can use customClass to define your own styles in CSS
//       customClass: {
//         popup: 'my-swal' // This is a class you can define in your CSS file
//       }
//     });
    
//     // Save the updated cart back to localStorage
//     localStorage.setItem('cart', JSON.stringify(cart));
//   }
  
//   // Attach the click event listener to each cart icon
// //   document.querySelectorAll('.pro').forEach((productElement, index) => {
// //     const cartIconContainer = productElement.querySelector('.cart-icon-container');
// //     cartIconContainer.addEventListener('click', function(event) {
// //       event.preventDefault(); // Prevent the anchor default click behavior
// //       const productID = productElement.id; // Use the ID already assigned to the product element
// //       addToCart(productID);
// //     });
// //   });
  


// let detailAddClicked = false; // Flag to track if the detailAdd has been clicked

// // Event listener for the detailAdd
// document.getElementById('detailAdd').addEventListener('click', function() {
//   detailAddClicked = true;
// });

// // Event listeners for each product
// document.querySelectorAll('.pro').forEach((productElement) => {
//   const cartIconContainer = productElement.querySelector('.producto');
//   cartIconContainer.addEventListener('click', function(event) {
// //     event.preventDefault(); // Prevent the anchor default click behavior
    
// //     if(detailAddClicked) {
// //       const productID = productElement.id; // Use the ID already assigned to the product element
// //       addToCart(productID);
// //       detailAddClicked = false; // Reset the flag
// //     } else {
// //       // Handle the case where detailAdd wasn't clicked
// //       console.log('Please click Add Details before adding to cart');
// //     }
//   });
// });

  
//   // This function will render the cart items on the cart page
//   function renderCart() {
//     const cart = JSON.parse(localStorage.getItem('cart')) || [];
//     const cartBody = document.getElementById('cart-body');
    
//     // Clear the cart body
//     cartBody.innerHTML = '';
  
//     // Loop over the items in the cart and append them to the table
//     cart.forEach((product, index) => {
//         const cartRowHTML = `
//             <tr>
//                 <td><a href="#" onclick="removeFromCart(${index}); return false;"><img class="close-icon-cart" src="img/icons/x.png"></a></td>
//                 <td><img src="${product.image}"></td>
//                 <td>${product.name}</td>
//                 <td>$${product.price}</td>
//                 <td><input type="number" value="${product.quantity}" min="1" max="5" onchange="updateQuantity(${index}, this.value)"></td>
//                 <td>$${(parseFloat(product.price) * product.quantity).toFixed(2)}</td>
//             </tr>
//         `;
//         cartBody.innerHTML += cartRowHTML;
//     });
//   }
//   /******************************* End add to Cart ****************************** */



  
// Function to handle clicking on a product
function handleProductClick(productId) {
    // Retrieve the product element by ID
    const productElement = document.getElementById(productId);
    
    // Extract the product details
    const imgSrc = productElement.querySelector('.producto').src;
    const title = productElement.querySelector('.des h5').textContent;
    const price = productElement.querySelector('.des h4').textContent;

    const details= "KOL TIZ";
  
    // Save the product details to localStorage
    const productDetails = { imgSrc, title, price,details };
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
            handleProductClick(product.id);
    
            // if(detailAddClicked) {
            // const productID = productElement.id; // Use the ID already assigned to the product element
            // addToCart(productID);
            // detailAddClicked = false; // Reset the flag
            // } 
            // else {
            // Handle the case where detailAdd wasn't clicked
            // console.log('Please click Add Details before adding to cart');
//             }
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
    const priceElement = document.querySelector('.single-pro-details h2');
    const detailsElement = document.querySelector('.single-pro-details span');

    imgElement.src = productDetails.imgSrc;
    titleElement.textContent = productDetails.title;
    priceElement.textContent = productDetails.price;
    detailsElement.textContent = productDetails.details;

   
}

// Call the function to update the product details when the DOM content is loaded
document.addEventListener('DOMContentLoaded', updateProductDetails);
