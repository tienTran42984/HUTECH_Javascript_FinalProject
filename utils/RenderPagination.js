let currentPage = 1;

export function renderPagination(courseId, page) {
    const container = document.getElementById("pagination")

    container.innerHTML = 
    `
        <button class="page-btn" ${page === 1 ? "disabled" : ""} id="prevPage">←</button>
        <span class="page-info">Page ${page}</span>
        <button class="page-btn" id="nextPage">→</button>
    `

    document.getElementById("prevPage")?.addEventListener("click", () => {
        currentPage--
        loadFeedbacks(courseId, currentPage)
    })

    document.getElementById("nextPage")?.addEventListener("click", () => {
        currentPage++
        loadFeedbacks(courseId, currentPage)
    })
}