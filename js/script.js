/* document.addEventListener("DOMContentLoaded", function() {
	const yearElement = document.getElementById("current-year");
	const currentYear = new Date().getFullYear();
	yearElement.textContent = "Copyright © "+currentYear+" by Shrey Tyagi. All rights reserved.";
});*/

/* document.addEventListener("DOMContentLoaded", function () {
    const photoLink = document.querySelector(".photo-link");
    const overlay = document.querySelector(".overlay");
    const previewImage = document.querySelector(".preview-image");
    const closeButton = document.querySelector(".close-btn");

    photoLink.addEventListener("click", function (event) {
        event.preventDefault();
        const imageURL = this.getAttribute("data-image");
        previewImage.src = imageURL;
        overlay.style.display = "block";
    });

    closeButton.addEventListener("click", function () {
        overlay.style.display = "none";
    });
}); */

document.addEventListener("DOMContentLoaded", function () {
    const photoLinks = document.querySelectorAll(".photo-link");
    const overlay = document.querySelector(".overlay");
    const previewImage = document.querySelector(".preview-image");
    const closeButton = document.querySelector(".close-btn");

    photoLinks.forEach(function (photoLink) {
        photoLink.addEventListener("click", function (event) {
            event.preventDefault();
            const imageURL = this.getAttribute("data-image");
            previewImage.src = imageURL;
            overlay.style.display = "block";
        });
    });

    closeButton.addEventListener("click", function () {
        overlay.style.display = "none";
    });
});



$(document).ready(function () {
    $('.card').hover(
        function () {
            $(this).find('.card-caption').addClass('show-full');
        },
        function () {
            $(this).find('.card-caption').removeClass('show-full');
        }
    );
});

/*

$(document).ready(function () {
    // Load the navbar
    $("#navbar-container").load("navbar.html", function () {
        console.log("Navbar loaded successfully!");
        
        // Reinitialize dropdown and any other necessary scripts
        initializeYouTubeDropdown();
    });

    // Load the footer
    $("#footer-container").load("footer.html");

    // Function to reinitialize YouTube dropdown
    function initializeYouTubeDropdown() {
        console.log("Reinitializing YouTube dropdown...");

        // If your dropdown depends on an API call, call the function here
        if (typeof fetchYouTubeData === "function") {
            fetchYouTubeData();
        }

        // Manually trigger any event listeners if needed
        $(".dropdown-toggle").dropdown();
    }
});

*/

document.addEventListener("DOMContentLoaded", function () {
    // Check if YouTube API has loaded
    setTimeout(() => {
        let ytElements = document.querySelectorAll(".g-ytsubscribe");
        ytElements.forEach(el => {
            if (el.innerHTML.trim() !== "") {
                el.nextElementSibling.style.display = "none"; // Hide fallback text
            }
        });
    }, 3000); // Wait 3 sec to ensure API loads
});
