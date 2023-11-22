document.addEventListener('DOMContentLoaded', function() {
    var submitButton = document.getElementById('addicon');
    if(submitButton) {
        submitButton.addEventListener('click', function() {
        var title = document.getElementById('review-title').value;
        var body = document.getElementById('review-content').value;
        var name = document.getElementById('user-name').value;
        // var image = document.getElementById('review-image').value;

        // Check if any of the fields are empty
        if (!title || !body || !name ) {
           // alert('Please fill in all fields.');
            return;
        }

        // Create the new review element
        var blogBox = document.createElement('div');
        blogBox.className = 'blog-box';

        //Get the date and time
        const currentDate = new Date();
        const month = currentDate.getMonth() + 1; // Get the current month (0 for January, 1 for February, etc.)
        const day = currentDate.getDate();
        const formattedDay = String(day).padStart(2, '0');

        // Get the image Randomly
        // Array of 5 image URLs
        const images = [
            '../img/banner/b16.jpg',
            '../img/banner/b10.jpg',
            '../img/banner/b17.jpg',
            '../img/banner/b19.jpg',
            '../img/banner/b2.jpg'
        ];
        // Function to generate a random index from 0 to 4
        function getRandomImageIndex() {
            return Math.floor(Math.random() * images.length);
        }
        // Get a random image URL from the array
        const randomImage = images[getRandomImageIndex()];

  

        blogBox.innerHTML = `
            <div class="blog-img">
                <img src="${randomImage}">
            </div>
            <div class="blog-details">
                <h4>${title}</h4>
                <p>${body}</p>
                <h5>${name}</h5>
            </div>
            <h1>${formattedDay}/${month}</h1>`;

        // Append the new review to the blog section
        var blogSection = document.getElementById('blog');
        blogSection.appendChild(blogBox);

        // Clear the form fields
        document.getElementById('review-title').value = '';
        document.getElementById('review-content').value = '';
        document.getElementById('user-name').value = '';
        //document.getElementById('review-date').value = '';
        // document.getElementById('review-image').value = '';
    });
    } else {
        console.error('The submit button was not found in the document.');
    }
    });