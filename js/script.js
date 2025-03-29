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
    $("#navbar-container").load("/navbar.html", function () {
        $(".navbar-toggler").click(function () {
            setTimeout(function () {
                // Ensure footer is always visible
                $("#footer-container").css({
                    "display": "block",
                    "visibility": "visible",
                    "min-height": "50px"
                });

                // Restore footer content visibility
                $("#footer-container nav").css({
                    "display": "block",
                    "visibility": "visible"
                });

                // Recalculate the height
                let bodyHeight = $("body").outerHeight();
                let windowHeight = $(window).height();

                // If page content is smaller than viewport, keep footer at bottom
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

        // Extra Fix: Restore footer content visibility after menu retracts
        $(".navbar-toggler").on("click", function () {
            setTimeout(function () {
                $("#footer-container").show().css("visibility", "visible"); // Fix: Ensure content is always visible
                $("#footer-container nav").show().css("visibility", "visible"); // Fix: Ensure nav inside footer is also visible
            }, 600);
        });
    });

    $("#footer-container").load("footer.html", function () {
        // Fix: Ensure footer content is visible on page load
        $("#footer-container nav").css("display", "block");
    });
	
	$("#current-year").text("Copyright © " + new Date().getFullYear() + " by Shrey Tyagi. All rights reserved.");

});

































































document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search-input");
    const cardContainer = document.getElementById("card-container");
    let articles = []; // To store CSV data globally

    // Get attributes from <body>
    const masterCategoryFilter = document.body.getAttribute("data-master-category")?.toLowerCase() || "";
    const csvFile = document.body.getAttribute("csvfile") || "index.csv"; // Default to "index.csv"

    // Load and Parse CSV
    fetch(csvFile)
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

    // Function to parse CSV (Strict `""` format, Skips Header Row)
    function parseCSV(data) {
        const rows = data.trim().split("\n").slice(1); // Skip header row
        return rows.map(row => {
            const matches = row.match(/"([^"]*)"/g); // Extract values inside quotes
            if (!matches || matches.length < 5) return null; // Ensure all fields exist
            const [masterCategory, category, title, date, link] = matches.map(val => val.replace(/"/g, "").trim());
            return { masterCategory: masterCategory.toLowerCase(), category, title, date, link };
        }).filter(item => item !== null) // Remove any invalid rows
        .sort((a, b) => b.date.localeCompare(a.date)); // Sort by date (descending)
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




document.addEventListener("DOMContentLoaded", function () {
    const galleryContainer = document.querySelector(".gallery-container .row");
    const csvFile = document.querySelector(".gallery-container")?.getAttribute("csvfile") || "photos.csv";

    // Ensure overlay exists
    if (!document.querySelector(".overlay")) {
        const overlayHTML = `
            <div class="overlay">
                <div class="photo-preview">
                    <span class="close-btn">&times;</span>
                    <button class="prev-btn">&#10094;</button>
                    <img class="preview-image" src="">
                    <button class="next-btn">&#10095;</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML("beforeend", overlayHTML);
    }

    const overlay = document.querySelector(".overlay");
    const previewImage = document.querySelector(".preview-image");
    const closeBtn = document.querySelector(".close-btn");
    const nextBtn = document.querySelector(".next-btn");
    const prevBtn = document.querySelector(".prev-btn");

    let images = []; // Store image list
    let currentIndex = -1; // Track current image index

    fetch(csvFile)
        .then(response => response.text())
        .then(data => {
            images = parseCSV(data).slice(1); // Skip header row
            let galleryHTML = "";

            images.forEach(([thumb, fullres, caption], index) => {
                if (thumb && fullres) {
                    galleryHTML += `
                        <div class="col-xl-2 col-lg-3 col-md-3 col-sm-4 col-6">
                            <div class="card-link nottoobig">
                                <a href="#" class="photo-link" data-index="${index}" data-image="${fullres}">
                                    <div class="card custom-card card-photo" style="background-image: url('${thumb}');">
                                        ${caption ? `<div class="card-caption">${caption}</div>` : ""}
                                    </div>
                                </a>
                            </div>
                        </div>
                    `;
                }
            });

            galleryContainer.innerHTML = galleryHTML;
            bindImageClickEvents();
        })
        .catch(error => console.error("Error loading CSV:", error));

    function parseCSV(data) {
        return data.trim().split("\n").map(line => {
            const matches = line.match(/"([^"]*)"/g);
            return matches ? matches.map(val => val.replace(/"/g, "").trim()) : [];
        });
    }

    function bindImageClickEvents() {
        document.querySelectorAll(".photo-link").forEach(link => {
            link.addEventListener("click", function (event) {
                event.preventDefault();
                currentIndex = parseInt(this.getAttribute("data-index"), 10);
                showImage(currentIndex);
            });
        });

        closeBtn.addEventListener("click", function () {
            overlay.style.display = "none";
        });

        nextBtn.addEventListener("click", function () {
            if (currentIndex < images.length - 1) {
                currentIndex++;
                showImage(currentIndex);
            }
        });

        prevBtn.addEventListener("click", function () {
            if (currentIndex > 0) {
                currentIndex--;
                showImage(currentIndex);
            }
        });

        overlay.addEventListener("click", function (event) {
            if (event.target === overlay) {
                overlay.style.display = "none";
            }
        });
    }

    function showImage(index) {
        if (index >= 0 && index < images.length) {
            previewImage.src = images[index][1]; // Load full-size image
            overlay.style.display = "flex";

            // Hide prev/next buttons when at the start or end
            prevBtn.style.visibility = index === 0 ? "hidden" : "visible";
            nextBtn.style.visibility = index === images.length - 1 ? "hidden" : "visible";
        }
    }
});














// This code is for tables



$(document).ready(function () {
    const tableContainer = document.querySelector(".table-container");
    const csvFile = tableContainer.getAttribute("csvfile") || "data.csv";
    const isFullWidth = tableContainer.getAttribute("fullwidth") === "true";
    const defaultSortColumn = tableContainer.getAttribute("sortcolumn");
    const defaultSortOrder = tableContainer.getAttribute("sortorder");

    let originalData = [];
    let currentSortColumn = defaultSortColumn ? parseInt(defaultSortColumn, 10) : null;
    let sortOrder = defaultSortOrder === "asc" ? 1 : defaultSortOrder === "desc" ? -1 : 0;

    fetch(csvFile)
        .then(response => response.text())
        .then(data => {
            originalData = parseCSV(data);
            if (originalData.length === 0) return;
            if (currentSortColumn !== null && sortOrder !== 0) {
                originalData = sortData(originalData, currentSortColumn, sortOrder);
            }
            renderTable(originalData, isFullWidth);
        })
        .catch(error => console.error("Error loading CSV:", error));

    function parseCSV(data) {
        return data.trim().split("\n").map(line => {
            const matches = line.match(/"([^"]*)"/g);
            return matches ? matches.map(val => val.replace(/"/g, "").trim()) : [];
        });
    }

    function calculateColumnWidths(data) {
        const columnWidths = new Array(data[0].length).fill(0);

        data.forEach(row => {
            row.forEach((cell, index) => {
                columnWidths[index] = Math.max(columnWidths[index], cell.length);
            });
        });

        let totalMaxLength = columnWidths.reduce((a, b) => a + b, 0);
        let calculatedWidths = columnWidths.map(width => (width / totalMaxLength) * 100);

        const minWidth = 27;
        const minHashWidth = 17;
        
        let adjustedWidths = calculatedWidths.map((width, index) => {
            if (data[0][index] === "#") {
                return `min-content`;
            }
            return Math.max(width, minWidth);
        });

        let widthSum = adjustedWidths.filter(w => w !== `min-content`).reduce((a, b) => a + b, 0);
        if (widthSum > 100) {
            adjustedWidths = adjustedWidths.map(width => (width !== `min-content`) ? (width / widthSum) * 100 : width);
        }

        return adjustedWidths;
    }

    function renderTable(data, isFullWidth) {
        const tableHead = document.querySelector("#dynamic-table thead");
        const tableBody = document.querySelector("#dynamic-table tbody");
        const dynamicTable = document.querySelector("#dynamic-table");
        tableHead.innerHTML = "";
        tableBody.innerHTML = "";

        if (isFullWidth) {
            tableContainer.classList.add("full-width");
            tableContainer.style.overflowX = "auto";
            tableContainer.style.whiteSpace = "nowrap";
            tableContainer.style.display = "block";
            dynamicTable.style.width = "max-content";
            dynamicTable.style.minWidth = "100%";
            dynamicTable.style.tableLayout = "auto";
        } else {
            tableContainer.classList.remove("full-width");
            tableContainer.style.overflowX = "hidden";
            tableContainer.style.width = "100%";
            dynamicTable.style.width = "100%";
            dynamicTable.style.tableLayout = "fixed";
        }

        let columnWidths = isFullWidth ? [] : calculateColumnWidths(data);
        
        const headerRow = document.createElement("tr");
        data[0].forEach((header, index) => {
            const th = document.createElement("th");
            th.textContent = header;
            th.setAttribute("data-column-index", index);
            th.style.cursor = "pointer";
            th.style.whiteSpace = "normal";
            th.style.wordBreak = "break-word";
            th.style.hyphens = "auto";
            th.style.padding = "8px";
            
            if (!isFullWidth) {
                th.style.width = header === "#" ? `min-content` : columnWidths[index] + "%";
            }
            th.addEventListener("click", () => sortTableByColumn(index));
            headerRow.appendChild(th);
        });
        tableHead.appendChild(headerRow);

        let sortedData = currentSortColumn !== null && sortOrder !== 0 ? sortData(data, currentSortColumn, sortOrder) : data;

        sortedData.slice(1).forEach(rowData => {
            const row = document.createElement("tr");
            rowData.forEach((cellData, index) => {
                const td = document.createElement("td");
                td.textContent = cellData;
                td.style.whiteSpace = "normal";
                td.style.wordBreak = "break-word";
                td.style.hyphens = "auto";
                td.style.padding = "8px";
                
                if (!isFullWidth) {
                    td.style.width = data[0][index] === "#" ? `min-content` : columnWidths[index] + "%";
                }
                row.appendChild(td);
            });
            tableBody.appendChild(row);
        });
    }

    function sortData(data, columnIndex, order) {
        if (order === 0) return [...data];

        return [data[0], ...data.slice(1).sort((a, b) => {
            const aVal = isNaN(a[columnIndex]) ? a[columnIndex].toLowerCase() : parseFloat(a[columnIndex]);
            const bVal = isNaN(b[columnIndex]) ? b[columnIndex].toLowerCase() : parseFloat(b[columnIndex]);

            if (aVal < bVal) return order === 1 ? -1 : 1;
            if (aVal > bVal) return order === 1 ? 1 : -1;
            return 0;
        })];
    }

    function sortTableByColumn(columnIndex) {
        if (columnIndex !== currentSortColumn) {
            sortOrder = 1;
            currentSortColumn = columnIndex;
        } else {
            sortOrder = (sortOrder === 1) ? -1 : (sortOrder === -1 ? 0 : 1);
        }

        let sortedData = sortOrder === 0 ? [...originalData] : sortData(originalData, columnIndex, sortOrder);
        renderTable(sortedData, isFullWidth);
    }
});
