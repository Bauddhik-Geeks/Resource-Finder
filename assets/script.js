function init() {
  const contributionsDisplay = document.getElementById('contributions-number')
  const displayClass = document.getElementById('contributions-number').classList

  // Remove the example contribution card
  let displayNumber = document.getElementsByClassName('card').length - 1;

  // show up there are too many cards
  const showInfoInConsole = () => {
    const cardsInIndex = document.getElementsByClassName('card').length - 1

    console.info('Cards in index.html', cardsInIndex)
    if (cardsInIndex > 100) console.warn('Too many cards in index.html. Move older cards to archive.', cardsInIndex)
  }
  showInfoInConsole()

  // display for the number of contributions
  const setContributionCount = (count) => {
    contributionsDisplay.innerText = count.toString().padStart(2, 0);
  }
  setContributionCount(displayNumber);

  // adding the archive cards to the grid
  const createArchiveObject = i => {
    const container = document.querySelector('.container')
    const archiveObject = document.createElement('object')
    archiveObject.setAttribute('id', `archiveObject_${i}`)
    archiveObject.setAttribute('data', `archive/archive_${i}.html`)
    archiveObject.setAttribute('type', 'text/html')
    archiveObject.setAttribute('width', '300')
    archiveObject.setAttribute('height', '5000')
    container.append(archiveObject)
  }
  const NUMBER_OF_FILES = 13
  let current = 1
  const getArchiveCards = i => {
    createArchiveObject(i)

    document.getElementById(`archiveObject_${i}`).onload = function () {
      const archiveObject = document.getElementById(`archiveObject_${i}`)
      const cards = archiveObject.contentDocument.querySelectorAll('.card')
      const grid = document.querySelector('.grid')

      cards.forEach(card => grid.append(card))
      archiveObject.remove()

      if (current < NUMBER_OF_FILES) {
        current++
        getArchiveCards(current)
      }
      setContributionCount(displayNumber + cards.length);
    }
  }

  getArchiveCards(current)

  // night mode feature
  $('#toggle-box-checkbox').on('change', function () {
    localStorage.setItem('mode', this.checked ? "light" : "dark");
    if (this.checked) {
      $('body').addClass('night')
    } else {
      $('body').removeClass('night')
    }
  });

  // set stored theme
  let mode = localStorage.getItem('mode');
  if (mode === "light") {
    $('#toggle-box-checkbox').click();
  }

  function demo() {
    setInterval(function () {
      $('#toggle-box-checkbox').trigger('click')
    }, 1000)
  }
  if (document.location.pathname.indexOf('fullcpgrid') > -1) {
    demo()
  }

  // Current year for footer
  const currentYearSpan = document.getElementById('currentYear')
  const currentYear = new Date().getFullYear()
  currentYearSpan.innerText = currentYear

  // Search bar
  const searchBar = document.getElementById('searchbar')
  searchBar.addEventListener('input', searchCard)

  function clearSearchHighlights() {
    const marks = Array.from(document.querySelectorAll('mark'))
    if (marks.length > 0) {
      marks.forEach(mark => {
        mark.outerHTML = mark.innerText
      })
    }
  }

  function applyHighlightToSearchResults(value, card) {
    const regex = new RegExp(value, 'gi')
    const cardElements = Array.from(card.querySelectorAll('*'))
    const matches = cardElements.filter(
      element => element.children.length === 0 && element.textContent.toLowerCase().includes(value)
    )

    if (value && value.length > 1) {
      matches.forEach(match => (match.innerHTML = match.textContent.replaceAll(regex, `<mark>${value}</mark>`)))
    }
  }

  function searchCard() {
    let input = searchBar.value.toLowerCase()
    const cards = document.getElementsByClassName('card')

    clearSearchHighlights()

    for (i = 0; i < cards.length; i++) {
      if (!cards[i].textContent.toLowerCase().includes(input)) {
        cards[i].style.display = 'none'
      } else {
        cards[i].style.display = 'flex'
        applyHighlightToSearchResults(input, cards[i])
      }
    }
  }
}

function onReady(callback) {
  if (document.readyState != 'loading') callback();
  else if (document.addEventListener) document.addEventListener('DOMContentLoaded', callback);
  else document.attachEvent('onreadystatechange', function () {
    if (document.readyState == 'complete') callback();
  });
}

onReady(init);
