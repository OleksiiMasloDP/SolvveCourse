const $ul = document.querySelector("#people_list");
const $spinner = document.querySelector(".spinner");
const $mainContainer = document.querySelector(".container");
const $btnPrevious = document.querySelector(".btn-previous");
const $btnNext = document.querySelector(".btn-next");
const $paginationList = document.querySelector(".pagination-pages");

let activePaginationId = 1;

$paginationList.addEventListener("click", (e) => {
  e.preventDefault();
  const $el = e.target;
  activePaginationId = +$el.dataset.value;
  peopleRequestById(activePaginationId);
  changeActivePaginationByEl($el);
});

$btnPrevious.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.classList.contains("disabled")) {
    return;
  }
  activePaginationId = +activePaginationId - 1;
  changeActivePaginationById(activePaginationId);
  peopleRequestById(activePaginationId);
});

$btnNext.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.classList.contains("disabled")) {
    return;
  }
  activePaginationId = +activePaginationId + 1;
  changeActivePaginationById(activePaginationId);
  peopleRequestById(activePaginationId);
});

function changeActivePaginationByEl(el) {
  $paginationList.querySelector(".active").classList.remove("active");
  el.classList.add("active");
}

function changeActivePaginationById(id) {
  $paginationList.querySelector(".active").classList.remove("active");
  const newActiveEl = document.querySelector(`[data-value='${id}']`);
  newActiveEl.classList.add("active");
}

const addPersonItem = (person) => {
  const secondFilm = _.get(person, '["films"][1]', "Unknown");
  const $li = document.createElement("li");
  $li.className = "list-group-item";
  $li.innerText = `
        ${person["name"]}
        (birth year: ${person["birth_year"]})
        - second film: ${secondFilm}
    `;
  $ul.appendChild($li);
};

const addPaginationPages = (pageLength) => {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < pageLength; i++) {
    const $li = document.createElement("li");
    const counter = i + 1;
    const activeClass = i === 0 ? "active" : "";
    $li.className = `page-item ${activeClass}`;
    $li.innerHTML = `<a class="page-link" href="#" data-value=${counter}>${counter}</a>`;
    fragment.appendChild($li);
  }
  $paginationList.appendChild(fragment);
};

function toggleNextBtnDisabled(isNextExist) {
  if (isNextExist) {
    $btnNext.classList.remove("disabled");
    return;
  }

  $btnNext.classList.add("disabled");
}

function togglePreviousBtnDisabled(isPreviousExist) {
  if (isPreviousExist) {
    $btnPrevious.classList.remove("disabled");
    return;
  }

  $btnPrevious.classList.add("disabled");
}

function hideContent() {
  $mainContainer.classList.add("d-none");
  $spinner.classList.remove("d-none");
}

function showContent() {
  $spinner.classList.add("d-none");
  $mainContainer.classList.remove("d-none");
}

function peopleRequestById(id) {
  hideContent();
  $ul.innerHTML = "";

  axios.get(`https://swapi.dev/api/people/?page=${id}`).then((res) => {
    res.data.results.forEach((person) => {
      addPersonItem(person);
    });

    toggleNextBtnDisabled(res.data.next);
    togglePreviousBtnDisabled(res.data.previous);
    showContent();
  });
}

axios.get("https://swapi.dev/api/people/").then((res) => {
  res.data.results.forEach((person) => {
    addPersonItem(person);
  });

  const peopleCount = res.data.count;
  const pagesLength = Math.ceil(peopleCount / res.data.results.length);
  addPaginationPages(pagesLength);

  toggleNextBtnDisabled(res.data.next);
  togglePreviousBtnDisabled(res.data.previous);

  showContent();
});
