/* document.addEventListener("DOMContentLoaded", function() {
	const yearElement = document.getElementById("current-year");
	const currentYear = new Date().getFullYear();
	yearElement.textContent = "Copyright © "+currentYear+" by Shrey Tyagi. All rights reserved.";
}); */


        /* $(document).ready(function(){
            $("#navbar-container").load("navbar.html");
            $("#footer-container").load("footer.html");
        }); */
		
		
    $(document).ready(function(){
        $("#navbar-container").load("navbar.html", function () {
            $(".navbar-toggler").on("click", function () {
                setTimeout(function () {
                    adjustFooter();
                }, 300);
            });
        });

        $("#footer-container").load("footer.html");

        function adjustFooter() {
            var footer = $("#footer-container");
            var windowHeight = $(window).height();
            var bodyHeight = $("body").outerHeight();
            if (bodyHeight < windowHeight) {
                footer.css("position", "absolute");
            } else {
                footer.css("position", "relative");
            }
        }

        $(window).resize(adjustFooter);
    });


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



$(document).ready(function(){
    $("#navbar-container").load("navbar.html", function() {
        // Ensure navbar toggle does not hide the footer
        $(".navbar-toggler").click(function() {
            setTimeout(function() {
                $("#footer-container").css("display", "block");
            }, 300);
        });
    });

    $("#footer-container").load("footer.html");
});

$(document).ready(function () {
    $("#navbar-container").load("navbar.html", function () {
        // Add an event listener for the navbar toggle button
        $(".navbar-toggler").on("click", function () {
            setTimeout(function () {
                adjustFooter();
            }, 300); // Delay to wait for animation
        });
    });

    $("#footer-container").load("footer.html");

    function adjustFooter() {
        var footer = $("#footer-container");
        var windowHeight = $(window).height();
        var bodyHeight = $("body").outerHeight();
        if (bodyHeight < windowHeight) {
            footer.css("position", "absolute");
        } else {
            footer.css("position", "relative");
        }
    }

    // Adjust on window resize (for responsive behavior)
    $(window).resize(adjustFooter);
});

