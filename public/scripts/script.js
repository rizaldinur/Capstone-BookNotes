$(document).ready(function () {
  //mobile screen search button handler
  $("#mobile-btn-search").on("click", function () {
    $("#togglerIcon").toggleClass("fa-times");
    $(".search-column").slideToggle();
  });

  //Make pagination
  //fetch books data to be viewed
  const dataContainer = document.getElementById("book-container");
  const cards = Array.from(
    dataContainer.getElementsByClassName("card-container")
  );
  console.log(cards[0].outerHTML);

  //set items per page and total pages
  const itemsPerPage = 6;
  let currentPage = 1;
  const totalPages = Math.ceil(cards.length / itemsPerPage);

  //display content function
  function displayContent(page) {
    $("#book-container").empty();
    const start = (page - 1) * itemsPerPage;
    const end = Math.min(start + itemsPerPage, cards.length);

    for (let i = start; i < end; i++) {
      $("#book-container").append(cards[i].outerHTML);
    }

    // Update page indicator
    $("#pageIndicator").text(`Page ${page} of ${totalPages}`);

    // Disable/enable buttons based on page
    $("#prevPage").prop("disabled", page === 1);
    $("#nextPage").prop("disabled", page === totalPages);
  }

  $("#prevPage").click(function () {
    if (currentPage > 1) {
      currentPage--;
      displayContent(currentPage);
    }
  });

  $("#nextPage").click(function () {
    if (currentPage < totalPages) {
      currentPage++;
      displayContent(currentPage);
    }
  });

  // Initial display
  displayContent(currentPage);
});
