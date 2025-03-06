/* document.addEventListener("DOMContentLoaded", function() {
	const yearElement = document.getElementById("current-year");
	const currentYear = new Date().getFullYear();
	yearElement.textContent = "Copyright © "+currentYear+" by Shrey Tyagi. All rights reserved.";
}); */

/*
        $(document).ready(function(){
            $("#navbar-container").load("navbar.html");
            $("#footer-container").load("footer.html");
        }); */

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


$(document).ready(function () {
    $("#navbar-container").load("navbar.html", function () {
        $(".navbar-toggler").click(function () {
            setTimeout(function () {
                // 🌟 Ensure footer is always visible
                $("#footer-container").css({
                    "display": "block",
                    "visibility": "visible",
                    "min-height": "50px"
                });

                // 🌟 Restore footer content visibility
                $("#footer-container nav").css({
                    "display": "block",
                    "visibility": "visible"
                });

                // 🌟 Recalculate the height
                let bodyHeight = $("body").outerHeight();
                let windowHeight = $(window).height();

                // 🌟 If page content is smaller than viewport, keep footer at bottom
                if (bodyHeight < windowHeight) {
                    $("#footer-container").css({
                        "position": "relative",
                        "bottom": "auto",
                        "width": "100%"
                    });
                } else {
                    $("#footer-container").css({
                        "position": "relative"
                    });
                }
            }, 300);
        });

        // 🌟 Extra Fix: Restore footer content visibility after menu retracts
        $(".navbar-toggler").on("click", function () {
            setTimeout(function () {
                $("#footer-container").show().css("visibility", "visible"); // 💖 Fix: Ensure content is always visible
                $("#footer-container nav").show().css("visibility", "visible"); // 💖 Fix: Ensure nav inside footer is also visible
            }, 600);
        });
    });

    $("#footer-container").load("footer.html", function () {
        // 💖 Fix: Ensure footer content is visible on page load
        $("#footer-container nav").css("display", "block");
    });
	
	$("#current-year").text("Copyright © " + new Date().getFullYear() + " by Shrey Tyagi. All rights reserved.");

});






















function loadCSVAndGenerateCards() {
    fetch("index.csv")
        .then(response => response.text())
        .then(data => {
            const rows = data.trim().split("\n");
            let articles = [];

            rows.forEach((row, index) => {
                if (index === 0) return; // Skip the header row if present
                
                const [category, title, date, link] = row.split(",");

                // Ensure the date is in YYYY.MM.DD format and split it
                const dateParts = date.split(".");
                if (dateParts.length !== 3) {
                    console.error(`Invalid date format in CSV: ${date}`);
                    return;
                }

                const year = dateParts[0];
                const month = dateParts[1] - 1; // Month index starts from 0 in JavaScript
                const day = dateParts[2];

                // Convert to Date object
                let formattedDate = new Date(year, month, day);

                // Format date for display as "DD MMMM, YYYY" (e.g., "25 January, 1998")
                const options = { day: "2-digit", month: "long", year: "numeric" };
                const displayDate = formattedDate.toLocaleDateString("en-US", options);

                // Store parsed data
                articles.push({ category, title, displayDate, link, formattedDate });
            });

            // Sort articles by date in descending order
            articles.sort((a, b) => b.formattedDate - a.formattedDate);

            let html = "";
            articles.forEach(({ category, title, displayDate, link }) => {
                html += `
                    <div class="col-lg-4 col-md-6 col-sm-12">
                        <div class="card-link">
                            <a href="${link}" class="card-link" target="_blank">
                                <div class="card custom-card article">
                                    <div class="card-inner">
                                        <div class="card-content">
                                            <p class="card-text">${category}</p>
                                            <h5 class="card-title">${title}</h5>
                                            <p class="card-date">${displayDate}</p>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                `;
            });

            document.getElementById("card-container").innerHTML = html;
        })
        .catch(error => console.error("Error loading CSV:", error));
}

// Call the function after DOM is loaded
document.addEventListener("DOMContentLoaded", loadCSVAndGenerateCards);
