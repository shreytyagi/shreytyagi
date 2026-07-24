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
                currentField += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            currentRow.push(currentField.trim());
            currentField = '';
        } else if ((char === '\n' || char === '\r') && !inQuotes) {
            if (char === '\r' && nextChar === '\n') i++;
            currentRow.push(currentField.trim());
            rows.push(currentRow);
            currentField = '';
            currentRow = [];
        } else {
            if (char === '\n' && inQuotes) {
                currentField += '<br>';
            } else {
                currentField += char;
            }
        }
        i++;
    }

    if (currentField.length > 0 || currentRow.length > 0) {
        currentRow.push(currentField.trim());
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
                $("#footer-container").css({
                    "display": "block",
                    "visibility": "visible",
                    "min-height": "50px"
                });
                $("#footer-container nav").css({
                    "display": "block",
                    "visibility": "visible"
                });
                let bodyHeight = $("body").outerHeight();
                let windowHeight = $(window).height();
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

        $(".navbar-toggler").on("click", function () {
            setTimeout(function () {
                $("#footer-container").show().css("visibility", "visible");
                $("#footer-container nav").show().css("visibility", "visible");
            }, 600);
        });
    });

    $("#footer-container").load("footer.html", function () {
        $("#footer-container nav").css("display", "block");
    });
	
	$("#current-year").text("Copyright © " + new Date().getFullYear() + " by Shrey Tyagi. All rights reserved.");
});

// ==========================================
// --- OPTIMIZED ARTICLE RENDERING ---
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search-input");
    const cardContainer = document.getElementById("card-container");
    let articles = []; 

    const masterCategoryFilter = document.body.getAttribute("data-master-category")?.toLowerCase() || "";
    const csvFile = document.body.getAttribute("csvfile") || "index.csv"; 

    fetch(csvFile)
        .then(response => response.text())
        .then(csvData => {
            articles = parseCSV(csvData);
            const filteredArticles = masterCategoryFilter
                ? articles.filter(article => article.masterCategory === masterCategoryFilter)
                : articles;
            renderArticles(filteredArticles); 
        })
        .catch(error => console.error("Error loading CSV:", error));

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

    function formatDate(isoDate) {
        const [year, month, day] = isoDate.split(".");
        const dateObj = new Date(year, month - 1, day);
        return dateObj.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
    }

    // Exponential Fix: Batch HTML in memory and inject once
    function renderArticles(articleList) {
        let allCardsHTML = ""; 
        
        articleList.forEach(({ masterCategory, category, title, date, link }) => {
            const formattedDate = formatDate(date);
            allCardsHTML += `
                <div class="col-lg-4 col-md-6 col-12">
                    <div class="card-link">
                        <a href="${link}" class="card-link">
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
        });
        
        cardContainer.innerHTML = allCardsHTML; 
    }

    function searchArticles() {
        const searchText = searchInput.value.toLowerCase();

        if (searchText.trim() === "") {
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
            return 0; 
        });

        const filteredForCategory = masterCategoryFilter
            ? sortedArticles.filter(({ masterCategory }) => masterCategory === masterCategoryFilter)
            : sortedArticles;

        renderArticles(filteredForCategory);
    }

    // Exponential Fix: Debounce live search to save CPU
    let searchTimeout;
    if (searchInput) {
        searchInput.addEventListener("input", function() {
            clearTimeout(searchTimeout); 
            searchTimeout = setTimeout(() => {
                searchArticles(); 
            }, 250);
        });
    }
});

// ==========================================
// --- PHOTO GALLERY RENDERING ---
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
    const galleryContainer = document.querySelector(".gallery-container .row");
    const csvFile = document.querySelector(".gallery-container")?.getAttribute("csvfile") || "photos.csv";

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

    let images = []; 
    let currentIndex = -1; 

    if(galleryContainer) {
        fetch(csvFile)
            .then(response => response.text())
            .then(data => {
                images = parseCSV(data).slice(1); 
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
    }

    function parseCSV(data) {
        return parseCSVRaw(data).slice(1); 
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
            previewImage.src = images[index][1]; 
            overlay.style.display = "flex";

            prevBtn.style.visibility = index === 0 ? "hidden" : "visible";
            nextBtn.style.visibility = index === images.length - 1 ? "hidden" : "visible";
        }
    }
});

// ==========================================
// --- ADVANCED DYNAMIC TABLE ENGINE ---
// ==========================================

window.masterCsvData = [];
window.currentVisibleCols = [];

window.toggleTableConfig = function(visibleColsStr, fullWidthStr, priorityStr, dontBreakStr, sortColStr, hideId, showId) {
    const container = document.querySelector('.table-container');
    if (!container) return;

    container.setAttribute('visiblecolumns', visibleColsStr);
    container.setAttribute('fullwidth', fullWidthStr);
    container.setAttribute('columnpriority', priorityStr);
    container.setAttribute('dontbreakcolumns', dontBreakStr);
    container.setAttribute('sortcolumn', sortColStr);

    if (document.getElementById(hideId)) document.getElementById(hideId).style.display = 'none';
    if (document.getElementById(showId)) document.getElementById(showId).style.display = 'inline';

    if (window.rebuildTableFromMaster) {
        window.rebuildTableFromMaster();
    }
};

document.addEventListener("DOMContentLoaded", function () {
    const tableContainer = document.querySelector(".table-container");
    if (!tableContainer) return;

    const csvFile = tableContainer.getAttribute("csvfile") || "data.csv";
    
    let currentFilteredData = [];
    let currentSortColumn = null;
    let sortOrder = 0;
    let isFullWidth = false;

    fetch(csvFile)
        .then(response => response.text())
        .then(data => {
            window.masterCsvData = parseCSVRaw(data);
            if (window.masterCsvData.length === 0) return;
            window.rebuildTableFromMaster();
        })
        .catch(error => console.error("Error loading CSV:", error));

    window.rebuildTableFromMaster = function() {
        isFullWidth = tableContainer.getAttribute("fullwidth") === "true";
        let visibleAttr = tableContainer.getAttribute("visiblecolumns");
        let sortColAttr = tableContainer.getAttribute("sortcolumn");
        let sortOrderAttr = tableContainer.getAttribute("sortorder");

        let totalCols = window.masterCsvData[0].length;
        
        window.currentVisibleCols = [];
        if (!visibleAttr) {
            for(let i=0; i < totalCols; i++) window.currentVisibleCols.push(i);
        } else {
            window.currentVisibleCols = visibleAttr.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
        }

        currentFilteredData = window.masterCsvData.map(row => {
            return window.currentVisibleCols.map(idx => row[idx] !== undefined ? row[idx] : '');
        });

        if (sortColAttr) {
            let absoluteSortCol = parseInt(sortColAttr, 10);
            let relSortCol = window.currentVisibleCols.indexOf(absoluteSortCol);
            if (relSortCol !== -1) currentSortColumn = relSortCol;
            else currentSortColumn = null;
        } else {
            currentSortColumn = null;
        }

        sortOrder = sortOrderAttr === "asc" ? 1 : sortOrderAttr === "desc" ? -1 : 0;

        let dataToRender = currentFilteredData;
        if (currentSortColumn !== null && sortOrder !== 0) {
            dataToRender = sortData(currentFilteredData, currentSortColumn, sortOrder);
        }

        renderTable(dataToRender, isFullWidth);
    };

    function calculateColumnWidths(data) {
        const numCols = data[0].length;
        let maxChars = new Array(numCols).fill(0);
        let totalChars = new Array(numCols).fill(0);

        const dataRows = data.length > 1 ? data.slice(1) : data;
        let numRows = dataRows.length || 1;

        dataRows.forEach(row => {
            row.forEach((cell, index) => {
                if (index < numCols) {
                    const rawText = cell.replace(/<[^>]*>?/gm, '').replace(/&[a-z]+;/gi, ' ');
                    let len = rawText.length;
                    maxChars[index] = Math.max(maxChars[index], len);
                    totalChars[index] += len;
                }
            });
        });

        let avgChars = totalChars.map(total => total / numRows);
        let blendedChars = maxChars.map((max, i) => (max + avgChars[i]) / 2);

        let dontBreakAttr = tableContainer.getAttribute("dontbreakcolumns");
        let absoluteDontBreak = dontBreakAttr ? dontBreakAttr.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n)) : [];
        let dontBreakCols = absoluteDontBreak.map(abs => window.currentVisibleCols.indexOf(abs)).filter(rel => rel !== -1);
        
        let isLocked = new Array(numCols).fill(false);
        dontBreakCols.forEach(c => { if(c >= 0 && c < numCols) isLocked[c] = true; });

        let priorityAttr = tableContainer.getAttribute("columnpriority");
        let weights = new Array(numCols).fill(1);
        let maxWeight = 1;
        if (priorityAttr) {
            let absolutePriorities = priorityAttr.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
            absolutePriorities.forEach((absIdx, i) => {
                let relIdx = window.currentVisibleCols.indexOf(absIdx);
                if (relIdx !== -1) weights[relIdx] = absolutePriorities.length - i;
            });
            maxWeight = Math.max(...weights);
        }

        let lockedTotal = 0;
        let unlockedBaseTotal = 0;
        
        let baseWidths = maxChars.map((maxLen, idx) => {
            let calcLen = isLocked[idx] ? maxLen : blendedChars[idx];
            let w = (calcLen === 0) ? 5 : isLocked[idx] ? (calcLen * 2.0) + 6 : (calcLen * 1.8) + 4;
            w = Math.max(w, 5);
            if (isLocked[idx]) { lockedTotal += w; return w; } 
            else { w = Math.min(w, 50); unlockedBaseTotal += w; return w; }
        });

        let finalWidths = new Array(numCols).fill(0);
        let unlockedTotalSpace = 100 - lockedTotal;
        
        if (lockedTotal >= 95) {
            let total = baseWidths.reduce((a,b)=>a+b,0);
            return baseWidths.map(w => (w / total) * 100);
        }

        let remainder = unlockedTotalSpace - unlockedBaseTotal;
        let totalUnlockedWeight = 0;
        let totalUnlockedInverseWeight = 0;
        
        baseWidths.forEach((w, i) => {
            if (!isLocked[i]) {
                totalUnlockedWeight += weights[i];
                totalUnlockedInverseWeight += (maxWeight - weights[i] + 1);
            }
        });

        baseWidths.forEach((w, i) => {
            if (isLocked[i]) {
                finalWidths[i] = w;
            } else {
                if (remainder >= 0) {
                    let extraSpace = (totalUnlockedWeight === 0) ? (remainder / numCols) : (remainder * (weights[i] / totalUnlockedWeight));
                    finalWidths[i] = w + extraSpace;
                } else {
                    let deficit = Math.abs(remainder);
                    let inverseWeight = (maxWeight - weights[i] + 1);
                    let shrinkAmount = (totalUnlockedInverseWeight === 0) ? (deficit / numCols) : (deficit * (inverseWeight / totalUnlockedInverseWeight));
                    finalWidths[i] = Math.max(w - shrinkAmount, 5);
                }
            }
        });
        
        let finalSum = finalWidths.reduce((a,b)=>a+b,0);
        if (Math.abs(finalSum - 100) > 0.1) {
            let actualLockedSum = 0;
            let actualUnlockedSum = 0;
            finalWidths.forEach((w, i) => {
                if (isLocked[i]) actualLockedSum += w;
                else actualUnlockedSum += w;
            });
            let requiredUnlockedSum = 100 - actualLockedSum;
            if (requiredUnlockedSum > 0 && actualUnlockedSum > 0) {
                finalWidths = finalWidths.map((w, i) => isLocked[i] ? w : (w / actualUnlockedSum) * requiredUnlockedSum);
            } else {
                finalWidths = finalWidths.map(w => (w / finalSum) * 100);
            }
        }
        return finalWidths;
    }

    function renderTable(data, isFullWidth) {
        const tableHead = document.querySelector("#dynamic-table thead");
        const tableBody = document.querySelector("#dynamic-table tbody");
        const dynamicTable = document.querySelector("#dynamic-table");

        if (isFullWidth) {
            tableContainer.classList.add("full-width");
            tableContainer.style.overflowX = "auto";
            dynamicTable.style.width = "max-content";
            dynamicTable.style.tableLayout = "auto";
        } else {
            tableContainer.classList.remove("full-width");
            tableContainer.style.overflowX = "hidden";
            dynamicTable.style.width = "100%";
            dynamicTable.style.tableLayout = "fixed";
        }
        
        let columnWidths = isFullWidth ? [] : calculateColumnWidths(data);

        let dontBreakAttr = tableContainer.getAttribute("dontbreakcolumns");
        let absoluteDontBreak = dontBreakAttr ? dontBreakAttr.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n)) : [];
        let dontBreakCols = absoluteDontBreak.map(abs => window.currentVisibleCols.indexOf(abs)).filter(rel => rel !== -1);

        // --- STEP 1: CREATE IN-MEMORY FRAGMENTS (Zero Layout Thrashing) ---
        const headFragment = document.createDocumentFragment();
        const bodyFragment = document.createDocumentFragment();
        const breakPattern = /([a-z]{1,}?)(?=[a-z])/gi;

        const headerRow = document.createElement("tr");
        data[0].forEach((header, index) => {
            const th = document.createElement("th");
            th.innerHTML = header; 
            th.setAttribute("data-column-index", index);
            th.style.cursor = "pointer";
            th.style.padding = "8px";
            if (!isFullWidth) th.style.width = columnWidths[index] + "%";
            th.addEventListener("click", () => sortTableByColumn(index));
            headerRow.appendChild(th);
        });
        headFragment.appendChild(headerRow);

        // --- STEP 2: BUILD ROWS AND INJECT HYPHENS OFFLINE ---
        data.slice(1).forEach(rowData => {
            const row = document.createElement("tr");
            rowData.forEach((cellData, index) => {
                const td = document.createElement("td");
                
                const words = String(cellData).split(/\s+/);
                const hyphenatedWords = words.map(word => {
                    if (word.length < 10 || /[<>]/.test(word)) return word;
                    return word.replace(breakPattern, "$1&shy;");
                });
                
                td.innerHTML = hyphenatedWords.join(" "); 
                td.style.padding = "8px";
                if (!isFullWidth) td.style.width = columnWidths[index] + "%";
                if (dontBreakCols.includes(index)) td.style.whiteSpace = "nowrap";

                row.appendChild(td);
            });
            bodyFragment.appendChild(row);
        });

        // --- STEP 3: MERGE CELLS OFFLINE (Lightning Fast) ---
        const rows = bodyFragment.querySelectorAll('tr');
        const numCols = data[0].length;

        for (let colIndex = 0; colIndex < numCols; colIndex++) {
            let topCell = null;
            let rowspanCount = 1;

            for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
                const currentCell = rows[rowIndex].children[colIndex];
                if (!currentCell) continue;

                if (topCell && topCell.innerHTML === currentCell.innerHTML && topCell.textContent.trim() !== "") {
                    rowspanCount++;
                    topCell.setAttribute('rowspan', rowspanCount);
                    currentCell.style.display = 'none'; 
                } else {
                    topCell = currentCell;
                    rowspanCount = 1;
                }
            }
        }

        // --- STEP 4: SINGLE BULK PAINT TO SCREEN ---
        tableHead.innerHTML = "";
        tableBody.innerHTML = "";
        tableHead.appendChild(headFragment);
        tableBody.appendChild(bodyFragment);
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
        
        const sortedData = sortOrder === 0 ? [...currentFilteredData] : sortData(currentFilteredData, currentSortColumn, sortOrder);
        renderTable(sortedData, isFullWidth);
    }

});

document.documentElement.lang = "en";
