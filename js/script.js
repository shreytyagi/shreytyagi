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



































































document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search-input");
    const cardContainer = document.getElementById("card-container");
    let articles = []; // To store CSV data globally

    // Get master category filter from <body> attribute
    const masterCategoryFilter = document.body.getAttribute("data-master-category")?.toLowerCase() || "";

    // Load and Parse CSV
    fetch("index.csv")
        .then(response => response.text())
        .then(csvData => {
            articles = parseCSV(csvData);
            // Filter based on master category before rendering
            const filteredArticles = masterCategoryFilter
                ? articles.filter(article => article.masterCategory === masterCategoryFilter)
                : articles;
            renderArticles(filteredArticles); // Initial rendering with filter applied
        })
        .catch(error => console.error("Error loading CSV:", error));

    // Function to parse CSV
    function parseCSV(data) {
        return data.trim().split("\n").map(row => {
            const [masterCategory, category, title, date, link] = row.split(",").map(item => item.trim());
            return { masterCategory: masterCategory.toLowerCase(), category, title, date, link };
        }).sort((a, b) => b.date.localeCompare(a.date)); // Sort by date (descending)
    }

    // Function to format date
    function formatDate(isoDate) {
        const [year, month, day] = isoDate.split(".");
        const dateObj = new Date(year, month - 1, day);
        return dateObj.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
    }

    // Function to render articles
    function renderArticles(articleList) {
        cardContainer.innerHTML = "";
        articleList.forEach(({ category, title, date, link }) => {
            const formattedDate = formatDate(date);
            const cardHTML = `
                <div class="col-lg-4 col-md-6 col-sm-12">
                    <div class="card-link">
                        <a href="${link}" class="card-link">
                            <div class="card custom-card article">
                                <div class="card-inner">
                                    <div class="card-content">
                                        <p class="card-text">${category}</p>
                                        <h5 class="card-title">${title}</h5>
                                        <p class="card-date">${formattedDate}</p>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            `;
            cardContainer.insertAdjacentHTML("beforeend", cardHTML);
        });
    }

    // Function to filter articles on search input
    function searchArticles() {
        const searchText = searchInput.value.toLowerCase();
        const filteredArticles = articles
            .filter(({ category, title }) =>
                category.toLowerCase().includes(searchText) || title.toLowerCase().includes(searchText)
            )
            .filter(({ masterCategory }) =>
                masterCategoryFilter === "" || masterCategory === masterCategoryFilter
            ); // Ensure master category filtering is always applied
        renderArticles(filteredArticles);
    }

    // Event listener for real-time search
    searchInput.addEventListener("input", searchArticles);
});
