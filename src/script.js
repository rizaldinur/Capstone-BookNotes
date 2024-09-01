function removePlaceholder(element) {
  element.parentNode.classList.remove("placeholder-glow");
  element.classList.remove("placeholder");
}

//display content function
function displayContent(page, container, content, itemsPerPage) {
  $(window).scrollTop(0);
  $(container).empty();
  const start = (page - 1) * itemsPerPage;
  const end = Math.min(start + itemsPerPage, content.length);
  const totalPages = Math.ceil(content.length / itemsPerPage);

  for (let i = start; i < end; i++) {
    $(container).append(content[i].outerHTML);
  }

  // Update page indicator
  $("#pageIndicator").text(`Page ${page} of ${totalPages}`);

  // Disable/enable buttons based on page
  $("#prevPage").prop("disabled", page === 1);
  $("#firstPage").prop("disabled", page === 1);
  $("#nextPage").prop("disabled", page === totalPages);
  $("#lastPage").prop("disabled", page === totalPages);
}

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

$(document).ready(function () {
  //mobile screen search button handler
  $("#mobile-btn-search").on("click", function () {
    $("#togglerIcon").toggleClass("fa-times");
    $("#mobile-search-container").slideToggle();
  });

  //set color mode
  //default is dark, check for storedTheme
  const storedTheme = localStorage.getItem("theme");
  const storedIcon = localStorage.getItem("icon");
  const oldIcon = localStorage.getItem("oldIcon");
  if (storedTheme) {
    document.documentElement.setAttribute("data-bs-theme", storedTheme);
    document
      .querySelector(".themeTogglerIcon")
      .classList.replace(oldIcon, storedIcon);
  }
  //handle color mode toggle

  document
    .querySelector(".themeToggler")
    .addEventListener("click", function () {
      let currentTheme = document.documentElement.getAttribute("data-bs-theme");
      let currentIcon = this.firstElementChild.classList[1].toString();
      console.log(currentIcon);
      let newTheme = currentTheme === "dark" ? "light" : "dark";
      let newIcon = currentIcon === "fa-moon-o" ? "fa-sun-o" : "fa-moon-o";

      document.documentElement.setAttribute("data-bs-theme", newTheme);

      this.firstElementChild.classList.replace(currentIcon, newIcon);
      console.log(this.firstElementChild.classList);

      this.firstElementChild.animate(
        [
          {
            transform: "scale(1)",
            easing: "ease-out",
          },
          {
            transform: "scale(0.1)",
            easing: "ease-in",
          },
          {
            transform: "scale(1)",
          },
        ],
        200
      );
      localStorage.setItem("oldIcon", currentIcon);
      localStorage.setItem("theme", newTheme);
      localStorage.setItem("icon", newIcon);
    });

  console.log(localStorage.getItem("theme"));

  //set items per page and total pages, container, and contents to be viewed
  let itemsPerPage;
  let currentPage = 1;
  let totalPages;
  let dataContainer;
  let cards;

  try {
    dataContainer = document.getElementById("book-container");
    if (!dataContainer) throw Error;
    try {
      itemsPerPage = parseInt($(dataContainer).attr("data-itemsPerPage"));
      cards = Array.from(
        dataContainer.getElementsByClassName("card-container")
      );
      totalPages = Math.ceil(cards.length / itemsPerPage);
    } catch (error) {
      console.error("skibidi," + error.stack);
    }
  } catch (error) {
    cards = [];
    itemsPerPage = 0;
    totalPages = 0;
    console.error("skibidi," + error.stack);
  }
  // //handle options items to show per page
  // $(".dropdown-item").on("click", function () {
  //   const viewItems = parseInt($(this).attr("data-option-viewItems"));
  //   console.log(viewItems);
  //   itemsPerPage = viewItems;
  //   displayContent(currentPage, dataContainer, cards, itemsPerPage);
  // });
  console.log(itemsPerPage);
  console.log(totalPages);

  $("#nextPage").click(function () {
    if (currentPage < totalPages) {
      currentPage++;
      displayContent(currentPage, dataContainer, cards, itemsPerPage);
    }
  });

  $("#lastPage").click(function () {
    if (currentPage < totalPages) {
      currentPage = totalPages;
      displayContent(currentPage, dataContainer, cards, itemsPerPage);
    }
  });

  $("#prevPage").click(function () {
    if (currentPage > 1) {
      currentPage--;
      displayContent(currentPage, dataContainer, cards, itemsPerPage);
    }
  });

  $("#firstPage").click(function () {
    if (currentPage > 1) {
      currentPage = 1;
      displayContent(currentPage, dataContainer, cards, itemsPerPage);
    }
  });

  if (cards.length === 0) {
    //disbable page button if no cards exist
    $("#prevPage").prop("disabled", true);
    $("#nextPage").prop("disabled", true);
  } else {
    // Initial display
    displayContent(currentPage, dataContainer, cards, itemsPerPage);
  }

  //set debounce
  let debounceTimeout;
  //get the input from searchbox
  let container;
  let suggestionElement;
  $(".searchbox").on("input", async function () {
    const input = $(this).val();
    console.log(input);
    if (!input) {
      $(suggestionElement).empty();
    }

    // Clear the previous timeout if the input changes before the timeout is reached
    clearTimeout(debounceTimeout);

    //wait until no input after 2 seconds, then execute below
    debounceTimeout = setTimeout(async () => {
      if (!input) return;
      //get the suggestions view container
      container = $(this).closest(".search-container");
      suggestionElement = $(container).find(".suggestions");
      $(suggestionElement).show();
      console.log(suggestionElement);
      $(suggestionElement).empty();
      //get mathcing book data from fetch API based on input
      const data = await getMatchingBooks(input);
      const suggestions = data.docs;
      console.log(suggestions);

      //render data as suggestions list
      //suggestions is array, so iterate each data
      suggestions.forEach((books, index) => {
        const imgKey = books.cover_i;
        const imgURL = `https://covers.openlibrary.org/b/id/${imgKey}-M.jpg`;
        $(suggestionElement).append(
          `<button type="submit" value="${books.key.replace(
            "/works/",
            ""
          )}" form="book-search" name="bookKey" class="list-group-item search-result d-flex w-100 gap-4 p-2"> <img src="${imgURL}" alt="" width="100" class="bg-dark" /><div id=about-book-${index} class="about-book text-start m-0 p-0"> <h2 class"book-title">${
            books.title
          } (${books.first_publish_year})</h2></div></button>`
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

  $(document).on("click", (event) => {
    if (!$(event.target).closest(container).length) {
      $(suggestionElement).hide();
    }
  });
});
