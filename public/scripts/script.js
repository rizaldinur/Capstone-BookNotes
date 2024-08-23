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

  //function get matching book on input search, limiit to 10
  async function getMatchingBooks(input) {
    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${input}&limit=5&fields=key,title,author_name,cover_i,first_publish_year`
      );
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      console.log(json);
      return json;
    } catch (error) {
      console.error(error.message);
    }
  }

  //set debounce
  let debounceTimeout;
  //get the input from searchbox
  $(".searchbox").on("input", async function () {
    const input = $(this).val();

    // Clear the previous timeout if the input changes before the timeout is reached
    clearTimeout(debounceTimeout);

    //wait until no input after 2 seconds, then execute below
    debounceTimeout = setTimeout(async () => {
      //get the suggestions view container
      const container = $(this).closest(".search-container");
      const suggestionElement = $(container).find(".suggestions");
      console.log(suggestionElement);
      $(suggestionElement).empty();
      //get mathcing book data from fetch API based on input
      if (!input) return;
      const data = await getMatchingBooks(input);
      const suggestions = data.docs;
      console.log(suggestions);

      //render data as suggestions list
      //suggestions is array, so iterate each data
      suggestions.forEach((books, index) => {
        const imgKey = books.cover_i;
        const imgURL = `https://covers.openlibrary.org/b/id/${imgKey}-S.jpg`;
        $(suggestionElement).append(
          `<button class="search-result d-flex w-100 gap-4 p-2 bg-light border-bottom border-dark-subtle"> <img src="${imgURL}" alt="" width="100" class="bg-dark" /><div id=about-book-${index} class="about-book text-start m-0 p-0"> <h2 class"book-title">${books.title} (${books.first_publish_year})</h2></div></button>`
        );
        books.author_name.forEach((authors) => {
          $(`#about-book-${index}`).append(
            `<p class="m-0 authors">${authors}</p>`
          );
          // console.log(authors);
        });
      });
    }, 1000);
  });
});
