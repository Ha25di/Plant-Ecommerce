let aboutDiv1;
let aboutDiv2;
let aboutDiv3;
let aboutDiv4;

document.addEventListener("DOMContentLoaded", function() {
    aboutDiv1 = document.querySelector(".aboutDiv1");
    aboutDiv2 = document.querySelector(".aboutDiv2");
    const selectImage = document.querySelector(".select-image");
    const inputFile = document.querySelector("#file");
    const imgArea = document.querySelector(".img-area");
    const uploadButton = document.getElementById('upload');
    const errorMessage = document.querySelector('.error-message');

    selectImage.addEventListener("click", function () {
        inputFile.click();
    });

    inputFile.addEventListener("change", function () {
        const image = this.files[0];
        if (image && image.size < 2000000) {
            const reader = new FileReader();
            reader.onload = () => {
                const allImg = imgArea.querySelectorAll("img");
                allImg.forEach((item) => item.remove());
                const imgUrl = reader.result;
                const img = document.createElement("img");
                img.src = imgUrl;
                imgArea.appendChild(img);
                imgArea.classList.add("active");
                imgArea.dataset.img = image.name;

                // Hide error message when image is selected
                errorMessage.style.display = 'none';
            };
            reader.readAsDataURL(image);
        } else {
            alert("Image size more than 2MB");
        }
    });

    uploadButton.addEventListener('click', function() {
        if (!imgArea.dataset.img) {
            // Display error message if no image is selected
            errorMessage.style.display = 'block';
            return;
        }

        swalsuccess();
    });
});

// This function shows a SweetAlert message while processing
function swalsuccess() {
  if (!aboutDiv1 || !aboutDiv2) {
    console.error("aboutDiv1 or aboutDiv2 is not defined");
    return;
}
    let timerInterval
    Swal.fire({
        title: 'Loading...',
        text: 'Investigating the plant disease...',
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
          aboutDiv1.style.display = 'none';
          aboutDiv2.style.display = 'block';             
          }
    })
}




/*******************************  For Soil Section  *****************************************/


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