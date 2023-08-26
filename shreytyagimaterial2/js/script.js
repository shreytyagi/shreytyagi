document.addEventListener("DOMContentLoaded", function() {
	const yearElement = document.getElementById("current-year");
	const currentYear = new Date().getFullYear();
	yearElement.textContent = "Copyright © "+currentYear+" by Shrey Tyagi. All rights reserved.";
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


const movieData = [
    {
        name: "The Lord of the Rings: The Fellowship of the Ring",
        lan: "English",
        d: "3D",
        d2: "IMAX with Laser",
		d3: "4K",
        sub: "English",
        poster: "https://upload.wikimedia.org/wikipedia/en/0/0d/Avengers_Endgame_poster.jpg"
    },
    {
        name: "Jurassic Park",
        lan: "English",
        d: "2D",
        d2: "",
		d3: "",
        sub: "",
        poster: ""
    },
	{
        name: "Jurassic Park",
        lan: "English",
        d: "2D",
        d2: "",
		d3: "",
        sub: "",
        poster: "https://upload.wikimedia.org/wikipedia/commons/d/d2/Tomb_of_Humayun%2C_Delhi.jpg"
    },
	    {
        name: "Avengers Endgame",
        lan: "Hindi",
        d: "3D",
        d2: "",
		d3: "",
        sub: "",
        poster: "https://upload.wikimedia.org/wikipedia/en/0/0d/Avengers_Endgame_poster.jpg"
    },
    {
        name: "Jurassic Park",
        lan: "English",
        d: "2D",
        d2: "",
		d3: "",
        sub: "",
        poster: ""
    },
	{
        name: "Jurassic Park",
        lan: "English",
        d: "2D",
        d2: "",
		d3: "",
        sub: "",
        poster: "https://upload.wikimedia.org/wikipedia/commons/d/d2/Tomb_of_Humayun%2C_Delhi.jpg"
    },
	{
        name: "The Lord of the Rings: The Fellowship of the Ring",
        lan: "English",
        d: "3D",
        d2: "IMAX with Laser",
		d3: "4K",
        sub: "English",
        poster: "https://upload.wikimedia.org/wikipedia/en/0/0d/Avengers_Endgame_poster.jpg"
    },
    {
        name: "Jurassic Park",
        lan: "English",
        d: "2D",
        d2: "",
		d3: "",
        sub: "",
        poster: ""
    },
	{
        name: "Jurassic Park",
        lan: "English",
        d: "2D",
        d2: "",
		d3: "",
        sub: "",
        poster: "https://upload.wikimedia.org/wikipedia/commons/d/d2/Tomb_of_Humayun%2C_Delhi.jpg"
    },
	    {
        name: "Avengers Endgame",
        lan: "Hindi",
        d: "3D",
        d2: "",
		d3: "",
        sub: "",
        poster: "https://upload.wikimedia.org/wikipedia/en/0/0d/Avengers_Endgame_poster.jpg"
    },
    {
        name: "Jurassic Park",
        lan: "English",
        d: "2D",
        d2: "",
		d3: "",
        sub: "",
        poster: ""
    },
	{
        name: "Jurassic Park",
        lan: "English",
        d: "2D",
        d2: "",
		d3: "",
        sub: "",
        poster: "https://upload.wikimedia.org/wikipedia/commons/d/d2/Tomb_of_Humayun%2C_Delhi.jpg"
    },
    // Add more movie objects here...
];






document.addEventListener("DOMContentLoaded", function() {
    const ticketContainer = document.getElementById("ticketContainer");

    movieData.forEach(movie => {
        const ticketElement = createTicketElement(movie);
        const ticketWrapper = createTicketWrapper(ticketElement); // Create the wrapper div
        const colWrapper = createColWrapper(ticketWrapper); // Create the col wrapper div
        const rowWrapper = createRowWrapper(colWrapper); // Create the row wrapper div
        const containerWrapper = createContainerWrapper(rowWrapper); // Create the container wrapper div
        
        ticketContainer.appendChild(containerWrapper); // Append the container wrapper to the main container
    });
});

function createContainerWrapper(rowWrapper) {
    const containerWrapper = document.createElement("div");
    containerWrapper.classList.add("col-xl-4", "col-lg-6", "col-md-6");
    containerWrapper.appendChild(rowWrapper); // Append the row wrapper to the container wrapper
    return containerWrapper;
}

function createRowWrapper(colWrapper) {
    const rowWrapper = document.createElement("div");
    rowWrapper.classList.add("card-link");
    rowWrapper.appendChild(colWrapper); // Append the col wrapper to the row wrapper
    return rowWrapper;
}

function createColWrapper(ticketWrapper) {
    const colWrapper = document.createElement("a");
    colWrapper.classList.add("card-link");
    colWrapper.appendChild(ticketWrapper); // Append the ticket wrapper to the col wrapper
    return colWrapper;
}

function createTicketWrapper(ticketElement) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("card", "custom-card", "article");
    wrapper.appendChild(ticketElement); // Append the ticket element to the wrapper
    return wrapper;
}

function createTicketElement(movie) {
    const ticket = document.createElement("div");
    ticket.classList.add("card-inner");
	ticket.classList.add("ticket");

    const poster = document.createElement("div");
    poster.classList.add("poster");
    const posterImage = document.createElement("img");
    posterImage.src = movie.poster;
    poster.appendChild(posterImage);

    const details = document.createElement("div");
    details.classList.add("details");
    const detailsText = createDetailsText(movie);
    details.textContent = detailsText;

    // Calculate total text length
    const totalTextLength = detailsText.length;

    // Adjust font size based on text length
    let fontSize = 18; // Default font size
    if (totalTextLength > 50) {
        fontSize = 17; // Smaller font size for longer text
    }

	if (totalTextLength > 90) {
        fontSize = 14; // Smaller font size for longer text
    }

    details.style.fontSize = `${fontSize}px`;

    ticket.appendChild(poster);
    ticket.appendChild(details);

    return ticket;
}


function createDetailsText(movie) {
    let detailsText = `${movie.name}`;

    if (movie.d) {
        detailsText += ` (${movie.d})`;
    }

	if (movie.d2) {
        detailsText += ` (${movie.d2})`;
    }

	if (movie.d3) {
        detailsText += ` (${movie.d3})`;
    }

	if (movie.sub) {
		detailsText += ` (${movie.lan} with ${movie.sub} subs)`;
	}

	else if (movie.lan) {
		detailsText += ` (${movie.lan})`;
	}

	else {
		detailsText += '';
	}

    return detailsText;
}



document.addEventListener("DOMContentLoaded", function() {
    var navElement = document.createElement("nav");
    navElement.id = "shreyNav";
    navElement.className = "navbar navbar-expand-lg navbar-dark bg-dark";

    var containerDiv = document.createElement("div");
    containerDiv.className = "container";

    var brandDiv = document.createElement("div");
    brandDiv.className = "navbar-brand mr-auto";
    brandDiv.textContent = "Shrey Tyagi";
    brandDiv.href = "index.html";

    var toggleButton = document.createElement("button");
    toggleButton.className = "navbar-toggler";
    toggleButton.type = "button";
    toggleButton.setAttribute("data-toggle", "collapse");
    toggleButton.setAttribute("data-target", "#navbarSupportedContent");
    toggleButton.setAttribute("aria-controls", "navbarSupportedContent");
    toggleButton.setAttribute("aria-expanded", "false");
    toggleButton.setAttribute("aria-label", "Toggle navigation");
    toggleButton.innerHTML = '<span class="navbar-toggler-icon"></span>';

    var collapseDiv = document.createElement("div");
    collapseDiv.className = "collapse navbar-collapse";
    collapseDiv.id = "navbarSupportedContent";

    var ulElement = document.createElement("ul");
    ulElement.className = "navbar-nav ml-auto";

    var homeLi = document.createElement("li");
    homeLi.className = "nav-item active";
    homeLi.innerHTML = '<a class="nav-link" href="#">Home<span class="sr-only">(current)</span></a>';

    var blogsLi = document.createElement("li");
    blogsLi.className = "nav-item";
    blogsLi.innerHTML = '<a class="nav-link" href="blogs.html">Blogs</a>';

    var movieReviewsLi = document.createElement("li");
    movieReviewsLi.className = "nav-item";
    movieReviewsLi.innerHTML = '<a class="nav-link" href="moviereviews.html">Movie Reviews</a>';

    var galleryLi = document.createElement("li");
    galleryLi.className = "nav-item";
    galleryLi.innerHTML = '<a class="nav-link" href="photogallery.html">Gallery</a>';

    var youtubeDropdownLi = document.createElement("li");
    youtubeDropdownLi.className = "nav-item dropdown";
    youtubeDropdownLi.innerHTML = `
        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownYouTube" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">YouTube</a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdownYouTube">
            <a class="dropdown-item" href="https://www.youtube.com/channel/UCCJT8WfnCjflckjAoxxCoiA" target="_blank">Channel 1</a>
            <a class="dropdown-item" href="https://www.youtube.com/channel/UCBgc_s9bZcC7_VPC7Qyegfw" target="_blank">Channel 2</a>
            <!-- Add more dropdown items as needed -->
        </div>
    `;

    var socialMediaDropdownLi = document.createElement("li");
    socialMediaDropdownLi.className = "nav-item dropdown";
    socialMediaDropdownLi.innerHTML = `
        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownSocialMedia" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Social Media</a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdownSocialMedia">
            <a class="dropdown-item" href="https://x.com/iamshreytyagi" target="_blank">X (Twitter)</a>
            <a class="dropdown-item" href="https://instagram.com/iamshreytyagi" target="_blank">Instagram</a>
            <!-- Add more dropdown items as needed -->
        </div>
    `;

    var listsLi = document.createElement("li");
    listsLi.className = "nav-item";
    listsLi.innerHTML = '<a class="nav-link" href="lists.html">Lists</a>';

    var utilitiesLi = document.createElement("li");
    utilitiesLi.className = "nav-item";
    utilitiesLi.innerHTML = '<a class="nav-link" href="utilities.html">Utilities</a>';

    ulElement.appendChild(homeLi);
    ulElement.appendChild(blogsLi);
    ulElement.appendChild(movieReviewsLi);
    ulElement.appendChild(galleryLi);
    ulElement.appendChild(youtubeDropdownLi);
    ulElement.appendChild(socialMediaDropdownLi);
    ulElement.appendChild(listsLi);
    ulElement.appendChild(utilitiesLi);

    collapseDiv.appendChild(ulElement);

    containerDiv.appendChild(brandDiv);
    containerDiv.appendChild(toggleButton);
    containerDiv.appendChild(collapseDiv);

    navElement.appendChild(containerDiv);

    var existingNavElement = document.getElementById("shreyNav");
    existingNavElement.parentNode.replaceChild(navElement, existingNavElement);
});
