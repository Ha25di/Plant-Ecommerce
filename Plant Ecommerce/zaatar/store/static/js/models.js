let aboutDiv1;
let aboutDiv2;
let aboutDiv3;
let aboutDiv4;
let aboutDiv5;
let aboutDiv6;

// document.addEventListener("DOMContentLoaded", function() {
//     aboutDiv1 = document.querySelector(".aboutDiv1");
//     aboutDiv2 = document.querySelector(".aboutDiv2");
//     const selectImage = document.querySelector(".select-image");
//     const inputFile = document.querySelector("#file");
//     const imgArea = document.querySelector(".img-area");
//     const uploadButton = document.getElementById('upload');
//     const errorMessage = document.querySelector('.error-message');

//     selectImage.addEventListener("click", function () {
//         inputFile.click();
//     });

//     inputFile.addEventListener("change", function () {
//         const image = this.files[0];
//         if (image && image.size < 2000000) {
//             const reader = new FileReader();
//             reader.onload = () => {
//                 const allImg = imgArea.querySelectorAll("img");
//                 allImg.forEach((item) => item.remove());
//                 const imgUrl = reader.result;
//                 const img = document.createElement("img");
//                 img.src = imgUrl;
//                 imgArea.appendChild(img);
//                 imgArea.classList.add("active");
//                 imgArea.dataset.img = image.name;

//                 // Hide error message when image is selected
//                 errorMessage.style.display = 'none';
//             };
//             reader.readAsDataURL(image);
//         } else {
//             alert("Image size more than 2MB");
//         }
//     });

//     uploadButton.addEventListener('click', function() {
//         if (!imgArea.dataset.img) {
//             // Display error message if no image is selected
//             errorMessage.style.display = 'block';
//             return;
//         }

//         swalsuccess();
//     });
// });

// // This function shows a SweetAlert message while processing
// function swalsuccess() {
//   if (!aboutDiv1 || !aboutDiv2) {
//     console.error("aboutDiv1 or aboutDiv2 is not defined");
//     return;
// }
//     let timerInterval
//     Swal.fire({
//         title: 'Loading...',
//         text: 'Investigating the plant disease...',
//         icon: 'info',
//         confirmButtonText: 'Continuar',
//         timer: 4000,
//         timerProgressBar: true,
//         didOpen: () => {
//             Swal.showLoading()
//             timerInterval = setInterval(() => {
//                 const content = Swal.getHtmlContainer()
//                 if (content) {
//                     const b = content.querySelector('b')
//                     if (b) {
//                         b.textContent = Swal.getTimerLeft()
//                     }
//                 }
//             }, 100)
//         },
//         willClose: () => {
//             clearInterval(timerInterval)
//         }
//     }).then((result) => {
//         if (result.dismiss === Swal.DismissReason.timer) {
//           console.log("Swal timer completed. Updating div visibility.");
//           aboutDiv1.style.display = 'none';
//           aboutDiv2.style.display = 'block';             
//           }
//     })
// }




/*******************************  For Fertilizer Section  *****************************************/
var data;
document.addEventListener("DOMContentLoaded", function() {
    aboutDiv3 = document.getElementById("aboutDiv3");
    aboutDiv4 = document.getElementById("aboutDiv4");
    const uploadButton2 = document.getElementById("upload2");
 
    uploadButton2.addEventListener('click', function() {

        // Get all input fields and select elements
    var temp = document.getElementById('Temp').value.trim();
    var moisture = document.getElementById('Moisture').value.trim();
    var humidity = document.getElementById('Humidity').value.trim();
    var soil = document.getElementById('soil').value.trim();
    var crop = document.getElementById('Crop').value.trim();
    var nitrogen = document.getElementById('N').value.trim();
    var phosphorus = document.getElementById('P').value.trim();
    var potassium = document.getElementById('K').value.trim();

    console.log(`Temperature: '${temp}', Moisture: '${moisture}', Humidity: '${humidity}', Soil: '${soil}', Crop: '${crop}', Nitrogen: '${nitrogen}', Phosphorus: '${phosphorus}', Potassium: '${potassium}'`);
    

    // Check if all fields are filled
    if (temp && moisture && humidity && soil && crop && nitrogen && phosphorus && potassium) {
        swalsuccess2();
    } else {
        alert("Please fill all the fields.");
    }

    data = {
        'temperature': temp,
        'moisture': moisture,
        'soil': soil,
        'humidity': humidity,
        'N': nitrogen,
        'P': phosphorus,
        'K': potassium,
        'crop': crop
    };

   

    fetch('/analyze2/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')  // Ensure CSRF token is sent
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok, status: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        // additional logic based on response

        const resultDiv = document.getElementById('predFert');

        if(resultDiv){
            resultDiv.innerHTML = data.pest_details.name;
            localStorage.setItem('modelProduct', JSON.stringify(data.pest_details));
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });

     
    });
});


// This function shows a SweetAlert message while processing
function swalsuccess2() {
  if (!aboutDiv3 || !aboutDiv4) {
    console.error("aboutDiv3 or aboutDiv4 is not defined");
    return;
}
    let timerInterval
    Swal.fire({
        title: 'Loading...',
        text: 'Investigating the plant apprpriate fertilizer...',
        icon: 'info',
        confirmButtonText: 'Continuar',
        timer: 4000,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading()
            timerInterval = setInterval(() => {
                const content = Swal.getHtmlContainer()
                if (content) {
                    const b = content.querySelector('b')
                    if (b) {
                        b.textContent = Swal.getTimerLeft()
                    }
                }
            }, 100)
        },
        willClose: () => {
            clearInterval(timerInterval)
        }
    }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
          console.log("Swal timer completed. Updating div visibility.");
          aboutDiv3.style.display = 'none';
          aboutDiv4.style.display = 'block';             
          }
    })
}



/*******************************  For Crop Section  *****************************************/

document.addEventListener("DOMContentLoaded", function() {
    aboutDiv5 = document.getElementById("aboutDiv5");
    aboutDiv6 = document.getElementById("aboutDiv6");
    const uploadButton3 = document.getElementById("upload3");

   // alert("Uploading");
 
    uploadButton3.addEventListener('click', function() {

        // Get all input fields and select elements
    var temp2 = document.getElementById('Temp2').value.trim();
    var humidity2 = document.getElementById('Humidity2').value.trim();
    var ph2 = document.getElementById('ph2').value.trim();
    var rainfall2 = document.getElementById('rainfall2').value.trim();
    var nitrogen2= document.getElementById('N2').value.trim();
    var phosphorus2 = document.getElementById('P2').value.trim();
    var potassium2 = document.getElementById('K2').value.trim();

    console.log(`Temperature: '${temp2}', ph: '${ph2}', Humidity: '${humidity2}', rainfall: '${rainfall2}', Nitrogen: '${nitrogen2}', Phosphorus: '${phosphorus2}', Potassium: '${potassium2}'`);
    

    // Check if all fields are filled
    if (temp2 &&  humidity2&& ph2 && rainfall2 && nitrogen2 && phosphorus2 && potassium2) {
        swalsuccess3();
    } else {
        alert("Please fill all the fields.");
    }
     
    

    var data = {
        'temperature': temp2,
        'ph': ph2,
        'rainfall': rainfall2,
        'humidity': humidity2,
        'N': nitrogen2,
        'P': phosphorus2,
        'K': potassium2
    };

   

    fetch('/analyze1/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')  // Ensure CSRF token is sent
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok, status: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        // additional logic based on response

        const resultDiv = document.getElementById('predCrop');

        if(resultDiv){
            resultDiv.innerHTML = data.plant_details.name;
            localStorage.setItem('modelProduct', JSON.stringify(data.plant_details));
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });


});


});



 // Helper function to get CSRF token from cookies
 function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


// This function shows a SweetAlert message while processing
function swalsuccess3() {
  if (!aboutDiv5 || !aboutDiv6) {
    console.error("aboutDiv5 or aboutDiv6 is not defined");
    return;
}
    let timerInterval
    Swal.fire({
        title: 'Loading...',
        text: 'Investigating the best plant for your environment...',
        icon: 'info',
        confirmButtonText: 'Continuar',
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading()
            timerInterval = setInterval(() => {
                const content = Swal.getHtmlContainer()
                if (content) {
                    const b = content.querySelector('b')
                    if (b) {
                        b.textContent = Swal.getTimerLeft()
                    }
                }
            }, 100)
        },
        willClose: () => {
            clearInterval(timerInterval)
        }
    }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
          console.log("Swal timer completed. Updating div visibility.");
          aboutDiv5.style.display = 'none';
          aboutDiv6.style.display = 'block';             
          }
    })
}





