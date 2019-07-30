const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

// Form Event Lister
searchForm.addEventListener('submit', e => {
  // Get search term
  const searchTerm = searchInput.value;
  // Get sort
  const sortBy = document.querySelector('input[name="sortby"]:checked').value;
  // Get limit
  const searchLimit = document.getElementById('limit').value;
  // Check input
  validateSearchTerm(searchTerm);
  // Clear input
  searchInput.value = '';
  // Search Reddit
  search(searchTerm, searchLimit, sortBy).then(r => console.log(r));

  e.preventDefault();
});

const validateSearchTerm = searchTerm => {
  if (searchTerm === '') {
    showAlert('Please add a search term', 'alert-danger');
  }
};

// Search Reddit
const search = async (searchTerm = '', searchLimit = 10, sortBy = 'new') => {
  try {
    const response = await fetch(`https://www.reddit.com/search.json?q=${searchTerm}&sort=${sortBy}&limit=${searchLimit}`);
    const data = await response.json();
    const posts = data.data.children.map(data => data.data);
    let output = '<div class="card-columns">';

    // Loop through posts and build output
    posts.forEach(post => {
      const { preview, title, selftext, url, subreddit, score } = post;
      console.log(post);
      // Check for image
      const image = preview ? preview.images[0].source.url : './reddit_logo.jpg';
      output += `
       <div class="card">
         <img class="card-img-top" src="${image}" alt="Card image cap">
         <div class="card-body">
           <h5 class="card-title">${title}</h5>
           <p class="card-text">${truncateText(selftext, 100)}</p>
           <a href="${url}" target="_blank" class="btn btn-primary btn-sm">Read More</a>
           <hr>
           <span class="badge badge-secondary p-2">Subreddit: ${subreddit}</span>
           <span class="badge badge-success p-2">Score: ${score}</span>
         </div>
       </div>`;
    });

    output += '</div>';
    document.getElementById('results').innerHTML = output;

  } catch (err) {
    console.log(err);
  }
};

// Shows alert message
const showAlert = (message = '', className = '') => {
  const alertDiv = createNewElement('div', `alert ${className}`, message);
  // Get parent element
  const searchContainer = document.getElementById('search-container');
  // Get search div
  const searchDiv = document.getElementById('search');
  // Insert message
  searchContainer.insertBefore(alertDiv, searchDiv);
  // Timeout alert
  setTimeout(() =>
    document.querySelector('.alert').remove(), 3000);
};

const createNewElement = (elementName = 'div', className = '', text = '') => {
  // Create element
  const element = document.createElement(elementName);
  // Add classes
  element.className = className;
  // Add text
  element.appendChild(document.createTextNode(text));
  return element;
};

// Truncate Text
const truncateText = (text, limit = 15) => {
  const shortend = text.indexOf(' ', limit);
  return shortend === -1 ? text : text.substring(0, shortend);
};