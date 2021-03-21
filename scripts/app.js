function init() {


  const searchInput = document.querySelector('.search')
  let searchTerm = ''
  const goBtn = document.querySelector('.go')
  let resArr = []
  let addVol = null
  const results = document.querySelector('.results')
  let selection = null
  let selectionArr = []
  const selectionsDiv = document.querySelector('.selections')
  const submitBtn = document.querySelector('.submit')
  const winner = document.querySelector('.winner')
  const bookDiv = document.querySelector('.book-div')
  const resetBtn = document.querySelector('.reset')

  // Hide Banner
  
  
  // Take the value from the input field and store it in a variable
  searchInput.addEventListener('input', e => {
    searchTerm = e.target.value
  })

  
  function search(e) {
    e.preventDefault()
    // If no search value entered in the input field, display a pop up/error message to say so
    if (!searchTerm) {
      searchInput.style.borderLeft = 'red solid 4px'
      searchInput.setAttribute('placeholder', 'Please enter a search query')
    // Otherwise fetch the data from google books API
    } else {
      fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&key=AIzaSyAqCts0b05Db5NXbJ5YJ9XPzlIvb_MsktY`).then(function (response) {
        return response.json()
      }).then(function (data) {
      // Add each of the 10 results into an array
        data.items.forEach(res => {
          resArr.push(res.volumeInfo)
        })
        showResults()
        // Reset the search input to empty for the next search
        searchInput.value = ''
        // Remove error messages if need be
        searchInput.style.borderLeft = 'black solid 2px'
        searchInput.setAttribute('placeholder', 'Search for your book selections...')
      }).catch(function (err) {
        console.warn('Something went wrong.', err)
      })
    }
  }

  function showResults() {
  // Show the results div
    results.style.display = ''
    // Hide the selections div
    selectionsDiv.style.display = 'none'
    // Hide the submit button
    submitBtn.style.display = 'none'
    // Go through each of the returned volumes from the search response
    resArr.forEach(vol => {
    // If the vol does not have a thumnail image on the json, don't throw an error and break the loop
      if (vol.imageLinks === undefined) {
        console.log('Book Cover Unavailable, skipping Volume')
      } else {
      // Make each of the results clickable by creating buttons
        addVol = document.createElement('button')
        addVol.classList.add('add')
        // Use the cover thumbnails to create image elements
        const cover = document.createElement('img')
        cover.classList.add('cover')
        cover.src = vol.imageLinks.thumbnail
        // Add the cover thumbnail to the button
        addVol.appendChild(cover)
        // Add the button to the results div
        results.appendChild(addVol)
        // Clicking on any button with a cover image will add the book to your selection
        addVol.addEventListener('click', addBook)
      }
    })
  }

  // Click a book from the results to add it to the selection
  function addBook(e) {
  // Store the clicked book cover in an variable
    selection = e.target
    // Push the clicked book cover into an array to use for the submission
    selectionArr.push(selection)
    // Only display the submit button if there are 2 or more items
    if (selectionArr.length >= 2) {
      submitBtn.style.display = 'block'
    }
    // Create a delete button for each cover, in case a mistake is made when adding
    const xBtn = document.createElement('button')
    xBtn.classList.add('x')
    xBtn.setAttribute('type', 'button')
    xBtn.innerHTML = 'X'
    xBtn.addEventListener('click', delSelected)
    // Create a div to hold the delete button and the cover for relative positioning purposes
    const selectedDiv = document.createElement('div')
    selectedDiv.classList.add('selected-div')
    // Add selection to selected div
    selectedDiv.appendChild(selection)
    // Add x button to selected div
    selectedDiv.appendChild(xBtn)
    // Add add selected div to selections div
    selectionsDiv.appendChild(selectedDiv)
    // Hide Results Div
    results.style.display = 'none'
    // Show selections Div
    selectionsDiv.style.display = ''
    // Empty resArr ready for the next search
    resArr = []
    delResults()
  }

  // Clear the results div ready for the next search
  function delResults() {
    while (results.hasChildNodes()) {  
      results.removeChild(results.firstChild)
    }
  }

  // Delete a cover from the selected div if it is mistakenly chosen
  function delSelected(e) {
    e.target.parentElement.remove()
    const index = selectionArr.indexOf(e.target.previousElementSibling)
    selectionArr.splice(index, 1)
    // If the selection array contains less than 2 items, don't show the submit button
    if (selectionArr.length < 2) {
      submitBtn.style.display = ''
    }
  }

  // Submit your input selections to display the chosen random book and hide the other elements 
  function randomize() {
    const randomNumber = (Math.floor(Math.random() * selectionArr.length))
    bookDiv.insertBefore(selectionArr[randomNumber], bookDiv.children[1])
    winner.style.display = 'block'
    submitBtn.style.display = 'none'
    selectionsDiv.style.display = 'none'
    searchInput.style.display = 'none'
    goBtn.style.display = 'none'
  }

  // If you want to make another selection, reset the app
  function reset() {
    winner.style.display = 'none'
    submitBtn.style.display = 'none'
    searchInput.style.display = ''
    goBtn.style.display = ''
    selectionArr = []
    while (selectionsDiv.hasChildNodes()) {  
      selectionsDiv.removeChild(selectionsDiv.firstChild)
    }
    if (bookDiv.hasChildNodes()) {  
      bookDiv.removeChild(bookDiv.childNodes[3])
    }
  }

  goBtn.addEventListener('click', search)
  submitBtn.addEventListener('click', randomize)
  resetBtn.addEventListener('click', reset)
  
}
window.addEventListener('DOMContentLoaded', init)



// TODO
// Don't duplicate additions to selectionArr - error message
// Live search?
// if you enter the go button, but want new results, clear the array and start again
