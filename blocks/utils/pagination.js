export default function createPagination(itemsPerPage, totalItems, currentPage = 1) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pagination = document.getElementById('pagination');

  if (totalItems <= itemsPerPage) {
    pagination.innerHTML = '';
    return;
  }

  const visiblePages = 10; // Number of pages to show in the pagination
  const startPage = Math.max(currentPage - Math.floor(visiblePages / 2), 1);
  const endPage = Math.min(startPage + visiblePages - 1, totalPages);
  const hasLeftEllipsis = startPage > 1;
  const hasRightEllipsis = endPage < totalPages;

  let paginationHTML = '';

  // Previous button
  if (currentPage > 1) {
    paginationHTML += `<a href="#" class="prev page_anchor" data-page="${
      currentPage - 1
    }">Prev</a>`;
  }

  // Left ellipsis
  if (hasLeftEllipsis) {
    paginationHTML += '<a href="#" class="page_anchor" data-page="1">1</a>';
    paginationHTML += '<span class="ellipsis">...</span>';
  }

  // Page numbers
  for (let i = startPage; i <= endPage; i += 1) {
    paginationHTML += `<a href="#" class="page_anchor${
      currentPage === i ? ' active' : ''
    }" data-page="${i}">${i}</a>`;
  }

  // Right ellipsis
  if (hasRightEllipsis) {
    paginationHTML += '<span class="ellipsis">...</span>';
    paginationHTML += `<a href="#" class="page_anchor" data-page="${totalPages}">${totalPages}</a>`;
  }

  // Next button
  if (currentPage < totalPages) {
    paginationHTML += `<a href="#" class="next page_anchor" data-page="${
      currentPage + 1
    }">Next</a>`;
  }

  pagination.innerHTML = paginationHTML;
}
