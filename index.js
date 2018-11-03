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
   if (searchTerm === '') {
      // Show message
      showMessage('Please add a search term', 'alert-danger');
   }

   // Clear input
   searchInput.value = '';

   // Search Reddit
   search(searchTerm, searchLimit, sortBy);


   e.preventDefault();

});

// Search Reddit
function search(searchTerm, searchLimit, sortBy) {
   fetch(`https://www.reddit.com/search.json?q=${searchTerm}&sort=${sortBy}&limit=${searchLimit}`)
      .then(res => res.json())
      .then(data => data.data.children.map(data => data.data))
      .then(results => {
         let output = '<div class="card-columns">';

         // Loop through posts
         results.forEach(post => {
            // CHeck for image
            const image = post.preview ? post.preview.images[0].source.url : 'https://cdn.vox-cdn.com/thumbor/OyJuiYH-nf6CdodLdrNC687SuvM=/0x0:640x427/1200x800/filters:focal(0x0:640x427)/cdn.vox-cdn.com/uploads/chorus_image/image/46682528/reddit_logo_640.0.jpg';

            output += `
            <div class="card">
              <img class="card-img-top" src="${image}" alt="Card image cap">
              <div class="card-body">
                <h5 class="card-title">${post.title}</h5>
                <p class="card-text">${truncateText(post.selftext, 100)}</p>
                <a href="${post.url}" target="_blank" class="btn btn-primary btn-sm">Read More</a>
                <hr>
                <span class="badge badge-secondary p-2">Subreddit: ${post.subreddit}</span>
                <span class="badge badge-success p-2">Score: ${post.score}</span>
              </div>
            </div>
            `;
         });

         output += '</div>';

         document.getElementById('results').innerHTML = output;

      })
      .catch(err => console.log(err));
}

// Shows alert message
function showMessage(message, className) {
   // Create div
   const div = document.createElement('div');
   // Add classes (use template string with back-tick)
   div.className = `alert ${className}`;
   // Add text
   div.appendChild(document.createTextNode(message));
   // Get parent
   const searchContainer = document.getElementById('search-container');
   // Get search
   const search = document.getElementById('search');

   // Insert message
   searchContainer.insertBefore(div, search);

   // Timeout alert
   setTimeout(() =>
      document.querySelector('.alert').remove(), 3000);
}

// Truncate Text
function truncateText(text, limit) {
   const shortend = text.indexOf(' ', limit);
   if(shortend == -1) return text;
   return text.substring(0, shortend);
}