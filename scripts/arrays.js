// console.log(data);
// 1. instead of creating the cards manually, we should use array functions to convert the data into cards

const courseToCard = ({
  prefix,
  number,
  title,
  url,
  desc,
  prereqs,
  credits,
}) => {
  const prereqLinks = prereqs
    .map((prereq) => `<a href="#" class="card-link">${prereq}</a>`)
    .join();
  const courseTemplate = `<div class="col">
            <div class="card" style="width: 18rem;">
              <h3 class="card-header"><a href="${url}">${title}</a></h3>
              <div class="card-body">
                <h5 class="card-title">${prefix} ${number}</h5>
                <p class="card-text">${desc}</p>
                ${prereqLinks}
                <div class="card-footer text-muted">
                  ${credits}
                </div>
              </div>
            </div>
          </div>`;
  return courseTemplate;
};
const resultsContainer = document.querySelector("#filtered-results");
const courseCards = data.items.map(courseToCard);
let filteredCourseCards = courseCards;
let filteredItems = data.items;
resultsContainer.innerHTML = filteredCourseCards.join("");
// courseCards.forEach((c) => document.write(c));

// console.log(courseCards);
// document.write(courseCards.join(''))

// 2. maybe we only show those that match the search query?
//

const filterItem = (item, query) => {
  const lowerCaseQuery = query.toLowerCase()
  hasPrefix = item.prefix.toLowerCase().includes(lowerCaseQuery);
  hasNumber = query == item.number;
  hasTitle = item.title.toLowerCase().includes(lowerCaseQuery);
  return hasPrefix || hasNumber || hasTitle;
}

// const filterCourseCard = (markup, query) => {
//   // console.log(markup, query);
//   return markup.toLowerCase().includes(query.toLowerCase());
// };

const searchButton = document.getElementById("search-btn");
searchButton.addEventListener("click", (ev) => {
  // console.log(ev);
  ev.preventDefault();
  // ev.stopPropagation();
  // console.log("query text");
  const searchField = document.querySelector('input[name="query-text"]');
  const queryText = searchField.value;
  // console.log(queryText);
  filteredItems = data.items.filter((item) => filterItem(item, queryText));
  filteredCourseCards = filteredItems.map(courseToCard);
  // filteredCourseCards = courseCards.filter((card) =>
  //   filterCourseCard(card, queryText)
  // );
  // console.log('filteredCourseCards', filteredCourseCards);
  resultsContainer.innerHTML = filteredCourseCards.join("");
  updateCount();
  updateCredits();
});

// 3. we update the result count and related summary info as we filter
function updateCount() {
  const count = document.getElementById("result-count");
  // console.log(count);
  const countValue = filteredCourseCards.length;
  // console.log(countValue);
  count.innerText = `${countValue} items`;
}

function getSumCredits(total, card) {
  console.log(typeof total);
  console.log(typeof card);
  return total + card.credits;
}

function updateCredits() {
  const creditHours = document.getElementById("credit-hours");
  const prereqHours = document.getElementById("prereq-hours");
  // console.log(filteredCourseCards);
  // let creditHoursValue = filteredItems.reduce(getSumCredits, 0);
  let creditHoursValue = 0;
  let prereqHoursValue = 0;
  const creditCourses = new Set();
  const prereqCourses = new Set();
  for (let i = 0; i < filteredItems.length; i++) {
    creditCourses.add(filteredItems[i].number);
    for (let j = 0; j < filteredItems[i].prereqs.length; j++) {
      // if (!prereqCourses.has(filteredItems[i].prereqs[j])) {
      //   prereqHoursValue += filteredItems[i].credits
      // }
      prereqCourses.add(filteredItems[i].prereqs[j]);
      creditCourses.add(filteredItems[i].prereqs[j]);
    }
  }

  console.log(prereqCourses);
  console.log(creditCourses);
  for (let i = 0; i < data.items.length; i++) {
    const curItem = data.items[i];
    if (creditCourses.has(curItem.number)) {
      creditHoursValue += curItem.credits
    }
    if (prereqCourses.has(curItem.number)) {
      prereqHoursValue += curItem.credits
    }
  }

  creditHoursValue -= prereqHoursValue;

  // creditHoursValue -= prereqHoursValue;
  creditHours.innerText = `${creditHoursValue}`;
  prereqHours.innerText = `${prereqHoursValue}`;
}

updateCount();
updateCredits();