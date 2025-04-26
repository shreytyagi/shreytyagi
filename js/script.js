function parseCSVRaw(data) {
    const rows = [];
    let currentField = '';
    let currentRow = [];
    let inQuotes = false;
    let i = 0;

    while (i < data.length) {
        const char = data[i];
        const nextChar = data[i + 1];

        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                // Escaped quote ("")
                currentField += '"';
                i++; // Skip next quote
            } else {
                // Toggle in/out of quotes
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            // Field separator
            currentRow.push(currentField.trim()); // 🔥 Trim before pushing
            currentField = '';
        } else if ((char === '\n' || char === '\r') && !inQuotes) {
            // End of row
            if (char === '\r' && nextChar === '\n') i++; // Handle \r\n
            currentRow.push(currentField.trim()); // 🔥 Trim before pushing
            rows.push(currentRow);
            currentField = '';
            currentRow = [];
        } else {
            if (char === '\n' && inQuotes) {
                currentField += '<br>'; // 🔥 Replace newline with <br> if inside quotes
            } else {
                currentField += char;
            }
        }

        i++;
    }

    // Add last field/row if any
    if (currentField.length > 0 || currentRow.length > 0) {
        currentRow.push(currentField.trim()); // 🔥 Trim last field
        rows.push(currentRow);
    }

    return rows;
}






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
    const rows = parseCSVRaw(data);
    return rows.slice(1).map(fields => {
        if (fields.length < 5) return null;
        const [masterCategory, category, title, date, link] = fields;
        return {
            masterCategory: masterCategory.toLowerCase(),
            category,
            title,
            date,
            link
        };
    }).filter(item => item !== null)
      .sort((a, b) => b.date.localeCompare(a.date));
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
        articleList.forEach(({ masterCategory, category, title, date, link }) => {
            const formattedDate = formatDate(date);
            const cardHTML = `
                <div class="col-lg-4 col-md-6 col-12"">
                    <div class="card-link">
                        <a href="${link}" class="card-link"">
                            <div class="card custom-card article">
                                <div class="card-inner">
                                    <div class="card-content">
										<p class="card-text">${masterCategory} &raquo; ${category}</p>
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

    if (searchText.trim() === "") {
        // Return to default state — re-filtered and sorted by date
        const defaultList = masterCategoryFilter
            ? articles.filter(({ masterCategory }) => masterCategory === masterCategoryFilter)
            : articles;

        renderArticles(defaultList);
        return;
    }

    const sortedArticles = [...articles].sort((a, b) => {
        const aMatch = a.title.toLowerCase().includes(searchText) || a.category.toLowerCase().includes(searchText);
        const bMatch = b.title.toLowerCase().includes(searchText) || b.category.toLowerCase().includes(searchText);

        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;
        return 0; // keep original order otherwise
    });

    const filteredForCategory = masterCategoryFilter
        ? sortedArticles.filter(({ masterCategory }) => masterCategory === masterCategoryFilter)
        : sortedArticles;

    renderArticles(filteredForCategory);
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
    return parseCSVRaw(data).slice(1); // Skipping header
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



document.addEventListener("DOMContentLoaded", function () {
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

            // ✅ Auto-insert &shy; after table is rendered
            insertSoftHyphensInTableCells();
        })
        .catch(error => console.error("Error loading CSV:", error));

function parseCSV(data) {
    return parseCSVRaw(data);
}

	
	    function calculateColumnWidths(data) {
        const columnWidths = new Array(data[0].length).fill(0);

        // Determine max length of any cell in each column
        data.forEach(row => {
            row.forEach((cell, index) => {
                columnWidths[index] = Math.max(columnWidths[index], cell.length);
            });
        });

        let totalMaxLength = columnWidths.reduce((a, b) => a + b, 0);
        let calculatedWidths = columnWidths.map(width => (width / totalMaxLength) * 100);

        // Minimum column width rules
        const minWidth = 27;  // Minimum for normal columns
        const minHashWidth = 17; // Minimum for "#" column

        let adjustedWidths = calculatedWidths.map((width, index) => {
            return data[0][index] === "#" ? Math.max(width, minHashWidth) : Math.max(width, minWidth);
        });

        // Normalize if total width exceeds 100%
        let widthSum = adjustedWidths.reduce((a, b) => a + b, 0);
        if (widthSum > 100) {
            adjustedWidths = adjustedWidths.map(width => (width / widthSum) * 100);
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
            dynamicTable.style.width = "max-content";
            dynamicTable.style.tableLayout = "auto";
			/* tableContainer.style.whiteSpace = "nowrap";
            tableContainer.style.display = "block";
			dynamicTable.style.minWidth = "100%"; */
        } else {
            tableContainer.classList.remove("full-width");
            tableContainer.style.overflowX = "hidden";
            dynamicTable.style.width = "100%";
            dynamicTable.style.tableLayout = "fixed";
			/* tableContainer.style.width = "100%"; */
        }
		
		let columnWidths = isFullWidth ? [] : calculateColumnWidths(data);

        const headerRow = document.createElement("tr");
        data[0].forEach((header, index) => {
            const th = document.createElement("th");
            th.innerHTML = header; //Change 3 th.textContent = header;
            th.setAttribute("data-column-index", index);
            th.style.cursor = "pointer";
            /* th.style.whiteSpace = "normal";  // Allow headers to wrap
            th.style.wordBreak = "break-word";
            //th.style.hyphens = "auto"; */
            th.style.padding = "8px";
            if (!isFullWidth) th.style.width = columnWidths[index] + "%";
            th.addEventListener("click", () => sortTableByColumn(index));
            headerRow.appendChild(th);
        });
        tableHead.appendChild(headerRow);

        let sortedData = currentSortColumn !== null && sortOrder !== 0 ? sortData(data, currentSortColumn, sortOrder) : data;

        sortedData.slice(1).forEach(rowData => {
            const row = document.createElement("tr");
            rowData.forEach((cellData, index) => {
                const td = document.createElement("td");
                td.innerHTML = cellData; //Change 1 td.textContent = cellData;
                /* td.style.whiteSpace = "normal";  // Allow text to wrap
                td.style.wordBreak = "break-word";
                td.style.hyphens = "auto"; */
                td.style.padding = "8px";
                if (!isFullWidth) td.style.width = columnWidths[index] + "%";
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
        const sortedData = sortOrder === 0 ? [...originalData] : sortData(originalData, columnIndex, sortOrder);
        renderTable(sortedData, isFullWidth);
        insertSoftHyphensInTableCells(); // ✅ Re-hyphenate after sort
    }

    // ✅ Function: Inserts &shy; and recalculates on resize
    function insertSoftHyphensInTableCells() {
        const cellSelector = "td, th";
        const breakPattern = /([a-z]{1,}?)(?=[a-z])/gi;

        document.querySelectorAll(cellSelector).forEach(cell => {
            const originalText = cell.innerHTML; //Change 2 const originalText = cell.textContent;
            const words = originalText.split(/\s+/);
            const hyphenatedWords = words.map(word => {
                if (word.length < 10 || /[<>]/.test(word)) return word;
                return word.replace(breakPattern, "$1&shy;");
            });
            cell.innerHTML = hyphenatedWords.join(" ");
        });
    }

    // ✅ Optional: Re-run on window resize
    window.addEventListener("resize", () => {
        insertSoftHyphensInTableCells();
    });
});



document.documentElement.lang = "en"; // just in case it's missing or changed
