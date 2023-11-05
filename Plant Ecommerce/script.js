
/******************************* Start add to Cart ****************************** */
// document.addEventListener('DOMContentLoaded', function() {
 
//   // Find all the cart icons and set up click event listeners
  
//   var cartIcons = document.querySelectorAll('.cart-icon-container a');
//   cartIcons.forEach(function(icon) {
//       icon.addEventListener('click', function(event) {
//           event.preventDefault(); // Prevent the default anchor behavior

//           // Get product details from the closest product container
          
//           var product = icon.closest('.pro');
//           var imageSrc = product.querySelector('.producto').src;
//           var productName = product.querySelector('.des h5').textContent;

          
//           var price = product.querySelector('.des h4').textContent;
         
//           // Create a new row for the cart
//           var cartRow = createCartRow(imageSrc, productName, price);

//           console.log('Cart row created', cartRow);
          
//           // Append the new row to the cart table
//           var cartBody = document.getElementById('cart-body');

//          console.log('CartBody', cartBody);

//           cartBody.appendChild(cartRow);
          
        
          
//       });
//   });
// });

// function createCartRow(imageSrc, productName, price) {
//   // Create the row and cells

//   var tr = document.createElement('tr');
//   var tdImage = document.createElement('td');
//   var tdProduct = document.createElement('td');
//   var tdPrice = document.createElement('td');
//   var tdQuantity = document.createElement('td');
//   var tdSubtotal = document.createElement('td');
//   var tdRemove = document.createElement('td');
  
//   // Set the content of each cell
//   tdImage.innerHTML = `<img src="${imageSrc}" style="width: 50px; height: auto;">`;
//   tdProduct.textContent = productName;
//   tdPrice.textContent = price;
//   tdQuantity.innerHTML = `<input type="number" value="1" min="1" style="width: 50px;">`;
//   tdSubtotal.textContent = price; // For now, subtotal is the same as price
//   tdRemove.innerHTML = `<a href="#"><img class="close-icon-cart" src="img/icons/x.png"></a>`;
 
//   // Append cells to the row
//   tr.appendChild(tdRemove);
//   tr.appendChild(tdImage);
//   tr.appendChild(tdProduct);
//   tr.appendChild(tdPrice);
//   tr.appendChild(tdQuantity);
//   tr.appendChild(tdSubtotal);
  
//   return tr;

// }
/******************************* End add to Cart ****************************** */


/******************************* Start Remove from Cart ****************************** */
// document.addEventListener('DOMContentLoaded', function() {
//   var cartBody = document.getElementById('cart-body');
//   cartBody.addEventListener('click', function(event) {
//     if (event.target.classList.contains('close')) {
//       event.preventDefault();
//       var tr = event.target.closest('tr');
//       tr.remove();
//     }
//   });
// });

/******************************* End Remove from Cart ****************************** */


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




