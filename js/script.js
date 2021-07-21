/*
Treehouse Techdegree:
FSJS Project 2 - Data Pagination and Filtering
*/



const itemsPerPage = 9;
// this activeData variable is here to allow 
// all parts of the program to access the
// list of students after filtering is applied
let activeData = data;

// Add Search Bar
document.querySelector("header.header").insertAdjacentHTML('beforeend',
	`<label for="search" class="student-search">
  		<span>Search by name</span>
  		<input id="search" placeholder="Search by name...">
  		<button type="button"><img src="img/icn-search.svg" alt="Search icon"></button>
	</label>`
);

// Add a "No Results Found" Message
// This will always exist, but be hidden or revealed
// in the showPage function based on whether
// there are any results
const divPage = document.querySelector('div.page');
const noResults = document.createElement('h2');
noResults.textContent = "No results found."
noResults.hidden = true;
noResults.style.fontSize= "36px"
divPage.insertBefore(noResults,document.querySelector('ul.student-list'));



// Show the given 'page' of students, from the 
// list array.  If list is empty, unhide the 
// noResults element, to display that message
function showPage(list,page) {
	const startIndex = (page-1)*itemsPerPage;
	const endIndex = Math.min(page*itemsPerPage,list.length);
	// get the correct <ul> element
	const ul = document.querySelector('ul.student-list');
	// clear the elements already in the list
	ul.innerHTML = ""
	if (list.length === 0) {
		// list is empty, unhide the noResults message
		noResults.hidden = false;
	} else {
		noResults.hidden = true;
	}
	// Create the new <li> elements
	for (let i = startIndex; i < endIndex; i++) {
		const datum = list[i];
		const li = document.createElement('li');
		li.className = "student-item cf";
		li.innerHTML = `
			<div class="student-details">
				<img class="avatar" src="${datum.picture.large}" alt="Profile Picture">
				<h3>${datum.name.first} ${datum.name.last}</h3>
				<span class="email">${datum.email}</span>
			</div>
			<div class="joined-details">
				<span class="date">Joined ${datum.registered.date}</span>
			</div>`
		ul.appendChild(li)
	}
	return ;
}

// Create Pagination for the given list array
function addPagination(list) {
	const pages = Math.ceil(list.length/itemsPerPage);
	const ul = document.querySelector('ul.link-list');
	// remove existing pagination
	ul.innerHTML = "";
	for (let i = 1; i <= pages; i++) {
		const li = document.createElement('li');
		const button = document.createElement('button');
		button.type = "button";
		button.textContent = i.toString();
		if ( i === 1 ) {
			button.className = "active";
		}
		li.appendChild(button);
		ul.appendChild(li);
	}
}

// Filters the data array based on searchValue,
// and returns the filtered array
function filterData(searchValue) {
	const searchList = [];
	// change searchValue and name (below) to lower case
	// to make search insensitive
	searchValue = searchValue.toLowerCase();
	for (let i = 0; i < data.length; i++) {
		let name = data[i]["name"]["first"]+" "+data[i]["name"]["last"];
		name = name.toLowerCase();
		if (name.includes(searchValue)) {
			searchList.push(data[i]);
		}
	}
	return searchList;
}

// resets the web page based on the provided searchValue
// Note that if searchValue is an empty string, all the
// data is shown
function resetPage(searchValue) {
	const currentDataList = filterData(searchValue);
	showPage(currentDataList,1);
	addPagination(currentDataList);
	// Change the activeData (global scope) so other
	// parts of program can access it
	activeData = currentDataList;
	return;
}

// Initialize the first page of students
// use '', so no students are left out
resetPage('');


// Page Buttons Listener
document.querySelector('ul.link-list').addEventListener("click",(e) =>{
	const selected = e.target;
	// Make sure an actual button was pressed,
	// without this, clicking between buttons leads to errors
	if (selected.type !== "button") {
		return;
	}
	document.querySelector('button.active').className = '';
	selected.className = "active";
	showPage(activeData,parseInt(selected.textContent));
});

// Search Bar Typing Listener
const searchBarElement = document.getElementById("search")
searchBarElement.addEventListener('input', e => resetPage(e.target.value) );

// Search Bar Button Listener
document.querySelector("[for=search] [type=button]").addEventListener("click",
	e => resetPage(searchBarElement.value));
