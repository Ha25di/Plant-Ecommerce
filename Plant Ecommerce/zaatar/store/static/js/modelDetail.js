function updateProductDetails() {

    // alert('Product Details');
    
    // Get the product details from localStorage
    const productDetails = JSON.parse(localStorage.getItem('modelProduct'));
    
    // If there is no product info, return early
    if (!productDetails) return;

    // Update the product details in the sproduct.html page
    const imgElement = document.querySelector('.single-pro-image img');
    const titleElement = document.querySelector('.single-pro-details h4');
    const priceElement = document.querySelector('.single-pro-details h3');
    const detailsElement = document.querySelector('.single-pro-details span');

    imgElement.src = productDetails.image;
    titleElement.textContent = productDetails.name;
    priceElement.textContent = productDetails.price;
    detailsElement.textContent = productDetails.description;

    localStorage.removeItem('modelProduct');
   
}

// Call the function to update the product details when the DOM content is loaded
document.addEventListener('DOMContentLoaded', updateProductDetails);