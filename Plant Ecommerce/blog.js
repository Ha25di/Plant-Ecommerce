document.addEventListener('DOMContentLoaded', function() {
    var submitButton = document.getElementById('addicon');
    if(submitButton) {
        submitButton.addEventListener('click', function() {
        var title = document.getElementById('review-title').value;
        var body = document.getElementById('review-content').value;
        var name = document.getElementById('user-name').value;
        // var image = document.getElementById('review-image').value;

        // Check if any of the fields are empty
        if (!title || !body || !name  ) {
            alert('Please fill in all fields.');
            return;
        }

        // Create the new review element
        var blogBox = document.createElement('div');
        blogBox.className = 'blog-box';

        blogBox.innerHTML = `
            <div class="blog-img">
                <img src="img/blog/b4.jpg">
            </div>
            <div class="blog-details">
                <h4>${title}</h4>
                <p>${body}</p>
                <h5>${name}</h5>
            </div>
            <h1>${new Date(date).toLocaleDateString()}</h1>`;

        // Append the new review to the blog section
        var blogSection = document.getElementById('blog');
        blogSection.appendChild(blogBox);

        // Clear the form fields
        document.getElementById('review-title').value = '';
        document.getElementById('review-content').value = '';
        document.getElementById('user-name').value = '';
        document.getElementById('review-date').value = '';
        // document.getElementById('review-image').value = '';
    });
    } else {
        console.error('The submit button was not found in the document.');
    }
    });