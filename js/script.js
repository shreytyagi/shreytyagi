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





























let articles = []; // Store articles globally for searching

function loadCSVAndGenerateCards() {
    fetch("index.csv")
        .then(response => response.text())
        .then(data => {
            const rows = data.trim().split("\n");

            articles = []; // Clear existing articles

            rows.forEach((row, index) => {
                if (index === 0) return; // Skip header if present
                
                const [category, title, date, link] = row.split(",");

                // Ensure date is in YYYY.MM.DD format
                const dateParts = date.split(".");
                if (dateParts.length !== 3) {
                    console.error(`Invalid date format in CSV: ${date}`);
                    return;
                }

                const year = dateParts[0];
                const month = dateParts[1] - 1; // Month index starts from 0 in JavaScript
                const day = dateParts[2];

                let formattedDate = new Date(year, month, day);

                // Convert to "DD MMMM, YYYY" format (e.g., "25 January, 1998")
                const options = { day: "2-digit", month: "long", year: "numeric" };
                const displayDate = formattedDate.toLocaleDateString("en-US", options);

                // Store parsed data
                articles.push({ category, title, displayDate, link, formattedDate });
            });

            // Sort by date (newest first)
            articles.sort((a, b) => b.formattedDate - a.formattedDate);

            renderArticles(articles);
        })
        .catch(error => console.error("Error loading CSV:", error));
}

// Function to render articles (used for both initial load and search filtering)
function renderArticles(filteredArticles) {
    let html = "";
    filteredArticles.forEach(({ category, title, displayDate, link }) => {
        html += `
            <div class="col-lg-4 col-md-6 col-sm-12 article-card">
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
}

// Function to filter articles based on search input
function searchArticles() {
    const searchText = document.getElementById("search-input").value.toLowerCase();

    const filteredArticles = articles.filter(({ category, title }) =>
        category.toLowerCase().includes(searchText) || title.toLowerCase().includes(searchText)
    );

    renderArticles(filteredArticles);
}

// Call the function after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    loadCSVAndGenerateCards();
    document.getElementById("search-input").addEventListener("input", searchArticles);
});
