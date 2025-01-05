// --- Global Variables ---
let verseCache = {}; // Cache to store fetched verses

// Object to store the number of chapters per book
const chaptersPerBook = {
    "Genesis": 50, "Exodus": 40, "Leviticus": 27, "Numbers": 36, "Deuteronomy": 34,
    "Joshua": 24, "Judges": 21, "Ruth": 4, "1 Samuel": 31, "2 Samuel": 24,
    "1 Kings": 22, "2 Kings": 25, "1 Chronicles": 29, "2 Chronicles": 36,
    "Ezra": 10, "Nehemiah": 13, "Esther": 10, "Job": 42, "Psalms": 150,
    "Proverbs": 31, "Ecclesiastes": 12, "Song of Solomon": 8, "Isaiah": 66,
    "Jeremiah": 52, "Lamentations": 5, "Ezekiel": 48, "Daniel": 12, "Hosea": 14,
    "Joel": 3, "Amos": 9, "Obadiah": 1, "Jonah": 4, "Micah": 7, "Nahum": 3,
    "Habakkuk": 3, "Zephaniah": 3, "Haggai": 2, "Zechariah": 14, "Malachi": 4,
    "Matthew": 28, "Mark": 16, "Luke": 24, "John": 21, "Acts": 28, "Romans": 16,
    "1 Corinthians": 16, "2 Corinthians": 13, "Galatians": 6, "Ephesians": 6,
    "Philippians": 4, "Colossians": 4, "1 Thessalonians": 5, "2 Thessalonians": 3,
    "1 Timothy": 6, "2 Timothy": 4, "Titus": 3, "Philemon": 1, "Hebrews": 13,
    "James": 5, "1 Peter": 5, "2 Peter": 3, "1 John": 5, "2 John": 1,
    "3 John": 1, "Jude": 1, "Revelation": 22
};

// --- Helper Functions ---

// Function to disable/enable inputs during fetch
function disableInputs(disable) {
    const inputs = document.querySelectorAll('select, input, button');
    inputs.forEach(input => input.disabled = disable);
}

// Function to update the chapter select dropdown
function updateChapterSelect(selectedBook, selectedChapter) {
    populateChapterSelect(selectedBook);
    chapterSelect.value = selectedChapter;
}

// Function to populate the chapter select dropdown
function populateChapterSelect(selectedBook) {
    const chapterSelect = document.getElementById('chapterSelect');
    chapterSelect.innerHTML = ''; // Clear previous options

    // Get the number of chapters for the selected book
    const numChapters = chaptersPerBook[selectedBook] || 0;

    for (let i = 1; i <= numChapters; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        chapterSelect.appendChild(option);
    }
}

// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    // --- Restore Last Reading Position ---
    const lastBook = localStorage.getItem('lastBook');
    const lastChapter = localStorage.getItem('lastChapter');
    const lastVerse = localStorage.getItem('lastVerse');

    // --- Daily Devotional Button --- 
    const dailyDevotionalButton = document.getElementById('dailyDevotionalButton');

    dailyDevotionalButton.addEventListener('click', () => {
      window.location.href = 'https://jaytrust150.github.io/daily-devotional/'; 
    });

    // --- Dark Mode Toggle ---
    const darkModeToggle = document.getElementById('darkModeToggle');
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            darkModeToggle.textContent = 'Light Mode';
        } else {
            darkModeToggle.textContent = 'Dark Mode';
        }
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });

    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        darkModeToggle.textContent = 'Light Mode';
    }

    // --- Font Size Functionality ---
    const answerDisplay = document.getElementById('answerDisplay');
    let currentFontSize = 16;

    const increaseFontButton = document.getElementById('increaseFont');
    increaseFontButton.addEventListener('click', () => {
        currentFontSize += 2;
        if (currentFontSize > parseInt(getComputedStyle(answerDisplay).getPropertyValue('max-font-size'))) {
            currentFontSize = parseInt(getComputedStyle(answerDisplay).getPropertyValue('max-font-size'));
        }
        answerDisplay.style.fontSize = `${currentFontSize}px`;
    });

    const decreaseFontButton = document.getElementById('decreaseFont');
    decreaseFontButton.addEventListener('click', () => {
        currentFontSize -= 2;
        if (currentFontSize < parseInt(getComputedStyle(answerDisplay).getPropertyValue('min-font-size'))) {
            currentFontSize = parseInt(getComputedStyle(answerDisplay).getPropertyValue('min-font-size'));
        }
        answerDisplay.style.fontSize = `${currentFontSize}px`;
    });

    // --- Version Selection ---
    const versionSelectTop = document.getElementById('versionSelectTop');
    versionSelectTop.addEventListener('change', () => {
        const selectedBook = bookSelect.value;
        const selectedChapter = parseInt(chapterSelect.value);
        fetchChapter(selectedBook, selectedChapter, versionSelectTop.value);
    });

    // --- Book Selection ---
    const bookSelect = document.getElementById('bookSelect');
    bookSelect.addEventListener('change', () => {
        const selectedBook = bookSelect.value;
        console.log("Book changed to:", selectedBook);
        updateChapterSelect(selectedBook, 1);
        fetchChapter(selectedBook, 1, versionSelectTop.value);

        // Save current book to localStorage
        localStorage.setItem('lastBook', selectedBook); 
    });

    // --- Chapter Selection ---
    const chapterSelect = document.getElementById('chapterSelect');
    chapterSelect.addEventListener('change', () => {
        const selectedBook = bookSelect.value;
        const selectedChapter = parseInt(chapterSelect.value);
        console.log("Chapter changed to:", selectedChapter);
        fetchChapter(selectedBook, selectedChapter, versionSelectTop.value);

        // Save current chapter to localStorage
        localStorage.setItem('lastChapter', selectedChapter);
    });

    // Populate the book select dropdown
    for (const book in chaptersPerBook) {
        const option = document.createElement('option');
        option.value = book;
        option.textContent = book;
        bookSelect.appendChild(option);
    }

    // Set default book (or restore from localStorage)
    bookSelect.value = lastBook || 'John'; 

    // Populate chapters for the default book
    populateChapterSelect(bookSelect.value);

    // --- Search Functionality ---
    const questionInput = document.getElementById('questionInput');
    const searchButton = document.getElementById('searchButton');
    searchButton.addEventListener('click', () => {
        const input = questionInput.value.trim();
        console.log("Search button clicked with input:", input);
        searchBible(input);
    });

    // --- Chapter Navigation ---
    const prevChapterButton = document.getElementById('prevChapter');
    const nextChapterButton = document.getElementById('nextChapter');
    const prevChapterButtonTop = document.getElementById('prevChapterTop');
    const nextChapterButtonTop = document.getElementById('nextChapterTop');

    function navigateChapter(direction) {
        let selectedChapter = parseInt(chapterSelect.value);
        const numChapters = chaptersPerBook[bookSelect.value] || 0;

        if (direction === 'prev' && selectedChapter > 1) {
            selectedChapter--;
        } else if (direction === 'next' && selectedChapter < numChapters) {
            selectedChapter++;
        }

        updateChapterSelect(bookSelect.value, selectedChapter);
        fetchChapter(bookSelect.value, selectedChapter, versionSelectTop.value);

        // Save current chapter to localStorage
        localStorage.setItem('lastChapter', selectedChapter); 
    }

    prevChapterButton.addEventListener('click', () => navigateChapter('prev'));
    nextChapterButton.addEventListener('click', () => navigateChapter('next'));
    prevChapterButtonTop.addEventListener('click', () => navigateChapter('prev'));
    nextChapterButtonTop.addEventListener('click', () => navigateChapter('next'));

    // --- Fetch and display the initial verse (or restore from localStorage) ---
    if (lastBook && lastChapter) {
        // If lastBook and lastChapter are in localStorage, fetch that
        const chapter = lastVerse ? `${lastChapter}:${lastVerse}` : lastChapter; // Include verse if available
        fetchChapter(lastBook, chapter, versionSelectTop.value);
    } else {
        // Otherwise, fetch John 3:16
        fetchChapter('John', 3, versionSelectTop.value); 
    }

    // --- Copy Selected Verses ---
    const copySelectedButton = document.getElementById('copySelected');
    copySelectedButton.addEventListener('click', copySelectedVerses);

    const copySelectedButtonTop = document.getElementById('copySelectedTop');
    copySelectedButtonTop.addEventListener('click', copySelectedVerses);

    // --- Share Selected Verses ---
    const shareSelectedButton = document.getElementById('shareSelected');
    shareSelectedButton.addEventListener('click', shareSelectedVerses);

    const shareSelectedButtonTop = document.getElementById('shareSelectedTop');
    shareSelectedButtonTop.addEventListener('click', shareSelectedVerses);
});
// Function to fetch and display a single verse
function fetchBibleVerse(book, chapter, verse, version) {
    const cacheKey = `${book}+${chapter}:${verse}?version=${version}`;
    if (verseCache[cacheKey]) {
        return Promise.resolve(verseCache[cacheKey]);
    }

    return fetch(`https://bible-api.com/${book}+${chapter}:${verse}?translation=${version}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            verseCache[cacheKey] = data; // Store in cache
            return data;
        })
        .catch(error => {
            console.error('Error fetching verse:', error);
            const answerDisplay = document.getElementById('answerDisplay');
            answerDisplay.innerHTML += `<p>Error fetching verse: ${error.message}. Please check your connection or try again later.</p>`;
        });
}

// Mapping of full book names to their abbreviations
const bookAbbreviations = {
    "Genesis": "Gen",
    "Exodus": "Exod",
    "Leviticus": "Lev",
    "Numbers": "Num",
    "Deuteronomy": "Deut",
    "Joshua": "Josh",
    "Judges": "Judg",
    "Ruth": "Ruth",
    "1 Samuel": "1 Sam",
    "2 Samuel": "2 Sam",
    "1 Kings": "1 Kgs",
    "2 Kings": "2 Kgs",
    "1 Chronicles": "1 Chr",
    "2 Chronicles": "2 Chr",
    "Ezra": "Ezra",
    "Nehemiah": "Neh",
    "Esther": "Esth",
    "Job": "Job",
    "Psalms": "Ps",
    "Proverbs": "Prov",
    "Ecclesiastes": "Eccl",
    "Song of Solomon": "Song",
    "Isaiah": "Isa",
    "Jeremiah": "Jer",
    "Lamentations": "Lam",
    "Ezekiel": "Ezek",
    "Daniel": "Dan",
    "Hosea": "Hos",
    "Joel": "Joel",
    "Amos": "Amos",
    "Obadiah": "Obad",
    "Jonah": "Jonah",
    "Micah": "Mic",
    "Nahum": "Nah",
    "Habakkuk": "Hab",
    "Zephaniah": "Zeph",
    "Haggai": "Hag",
    "Zechariah": "Zech",
    "Malachi": "Mal",
    "Matthew": "Matt",
    "Mark": "Mark",
    "Luke": "Luke",
    "John": "John",
    "Acts": "Acts",
    "Romans": "Rom",
    "1 Corinthians": "1 Cor",
    "2 Corinthians": "2 Cor",
    "Galatians": "Gal",
    "Ephesians": "Eph",
    "Philippians": "Phil",
    "Colossians": "Col",
    "1 Thessalonians": "1 Thess",
    "2 Thessalonians": "2 Thess",
    "1 Timothy": "1 Tim",
    "2 Timothy": "2 Tim",
    "Titus": "Titus",
    "Philemon": "Philem",
    "Hebrews": "Heb",
    "James": "James",
    "1 Peter": "1 Pet",
    "2 Peter": "2 Pet",
    "1 John": "1 John",
    "2 John": "2 John",
    "3 John": "3 John",
    "Jude": "Jude",
    "Revelation": "Rev"
};

/// Function to display a single verse (extracted for clarity)
function displayVerse(data) {
    if (!data || !data.book_name || !data.chapter || !data.verse || !data.text) {
        console.error('Invalid data:', data);
        return;
    }

    const reference = `${data.book_name} ${data.chapter}:${data.verse}`;
    const answerDisplay = document.getElementById('answerDisplay');
    const verseContainer = document.createElement('div');
    verseContainer.classList.add('verse-container');

    const verseCheckbox = document.createElement('input');
    verseCheckbox.type = 'checkbox';
    verseCheckbox.classList.add('verse-checkbox');
    verseCheckbox.id = `verse-${reference.replace(/\s+/g, '')}`;
    verseCheckbox.value = `${reference}|${data.text}`;

    // Add event listener to toggle highlight class
    verseCheckbox.addEventListener('change', (event) => {
        if (event.target.checked) {
            verseContainer.classList.add('highlighted');
        } else {
            verseContainer.classList.remove('highlighted');
        }
    });

    // Create a link element for the book, chapter, and verse number
    const verseLink = document.createElement('a');
    verseLink.classList.add('verse-link');
    verseLink.href = '#';
    verseLink.setAttribute('aria-label', `Read ${reference}`);
    verseLink.onclick = (event) => {
        event.preventDefault();
        const [book, chapterVerse] = reference.split(' ');
        const chapter = chapterVerse.split(':')[0]; // Extract the chapter only
        bookSelect.value = book;
        populateChapterSelect(book);
        chapterSelect.value = chapter;
        const versionSelect = document.getElementById('versionSelect');
        const version = versionSelect ? versionSelect.value : 'kjv'; // Use 'kjv' as the default version if versionSelect is not found
        fetchChapter(book, chapter, version, false);
    };
    const [book, chapterVerse] = reference.split(' ');
    const bookAbbreviation = bookAbbreviations[book] || book;
    verseLink.textContent = `${bookAbbreviation} ${chapterVerse}`;

    // Create a span for the verse text
    const verseText = document.createElement('span');
    verseText.classList.add('verse-text');
    verseText.textContent = ` ${data.text}`;
    verseText.onclick = (event) => {
        event.preventDefault();
        const [book, chapterVerse] = reference.split(' ');
        const chapter = chapterVerse.split(':')[0]; // Extract the chapter only
        bookSelect.value = book;
        populateChapterSelect(book);
        chapterSelect.value = chapter;
        const versionSelect = document.getElementById('versionSelect');
        const version = versionSelect ? versionSelect.value : 'kjv'; // Use 'kjv' as the default version if versionSelect is not found
        fetchChapter(book, chapter, version, false);
    };

    // Append the checkbox, link, and text to the verse container
    verseContainer.appendChild(verseCheckbox);
    verseContainer.appendChild(verseLink);
    verseContainer.appendChild(verseText);

    // Append the verse container to the answer display
    answerDisplay.appendChild(verseContainer);
}

// Function to fetch and display a chapter
function fetchChapter(book, chapter, version, updateHistory = true) {
    const answerDisplay = document.getElementById('answerDisplay');
    answerDisplay.innerHTML = '<div class="loader"></div>'; // Show loading spinner
    disableInputs(true); // Disable inputs during fetch

    fetch(`https://bible-api.com/${book}+${chapter}?translation=${version}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then(chapterData => {
            console.log(`Displaying chapter: ${chapterData.reference}`);
            if (chapterData.verses && chapterData.verses.length > 1) {
                displayChapter(chapterData);
                answerDisplay.classList.add('verse-by-verse');
                bookSelect.value = book;
                updateChapterSelect(book, chapter);
                if (updateHistory) {
                    history.pushState({ book, chapter, version }, '', `?book=${book}&chapter=${chapter}&version=${version}`);
                }
            } else {
                answerDisplay.innerHTML = '';
                const verseParagraph = document.createElement('p');
                verseParagraph.textContent = `${chapterData.reference} ${chapterData.text}`;
                answerDisplay.appendChild(verseParagraph);
                answerDisplay.classList.remove('verse-by-verse');
            }
        })
        .catch(error => {
            console.error('Error fetching chapter:', error);
            answerDisplay.innerHTML = `<p>Error fetching chapter: ${error.message}. Please check your connection or try again later.</p>`;
        })
        .finally(() => {
            disableInputs(false);
        });
}

// Function to display a chapter (always verse-by-verse)
function displayChapter(chapterData) {
    const answerDisplay = document.getElementById('answerDisplay');
    answerDisplay.innerHTML = '';

    const [book, chapter] = chapterData.reference.split(' ');

    chapterData.verses.forEach((verse) => {
        const verseContainer = document.createElement('div');
        verseContainer.classList.add('verse-container');

        const verseCheckbox = document.createElement('input');
        verseCheckbox.type = 'checkbox';
        verseCheckbox.classList.add('verse-checkbox');
        verseCheckbox.id = `verse-${chapterData.reference.replace(/\s+/g, '')}-${verse.verse}`;
        verseCheckbox.value = `${book} ${chapter}:${verse.verse}|${verse.text}`;

        // Add event listener to toggle highlight class
        verseCheckbox.addEventListener('change', (event) => {
            if (event.target.checked) {
                verseContainer.classList.add('highlighted');
            } else {
                verseContainer.classList.remove('highlighted');
            }
        });

        // Create a link element for the book, chapter, and verse number
        const verseLink = document.createElement('a');
        verseLink.classList.add('verse-link');
        verseLink.href = '#';
        verseLink.setAttribute('aria-label', `Read ${book} ${chapter}:${verse.verse}`);
        verseLink.onclick = (event) => {
            event.preventDefault();
            bookSelect.value = book;
            populateChapterSelect(book);
            chapterSelect.value = chapter;
            const versionSelect = document.getElementById('versionSelect');
            const version = versionSelect ? versionSelect.value : 'kjv'; // Use 'kjv' as the default version if versionSelect is not found
            fetchChapter(book, chapter, version, false);
        };
        const bookAbbreviation = bookAbbreviations[book] || book;
        verseLink.textContent = `${bookAbbreviation} ${chapter}:${verse.verse}`;

        // Create a span for the verse text
        const verseText = document.createElement('span');
        verseText.classList.add('verse-text');
        verseText.textContent = ` ${verse.text}`;
        verseText.onclick = (event) => {
            event.preventDefault();
            bookSelect.value = book;
            populateChapterSelect(book);
            chapterSelect.value = chapter;
            const versionSelect = document.getElementById('versionSelect');
            const version = versionSelect ? versionSelect.value : 'kjv'; // Use 'kjv' as the default version if versionSelect is not found
            fetchChapter(book, chapter, version, false);
        };

        // Append the checkbox, link, and text to the verse container
        verseContainer.appendChild(verseCheckbox);
        verseContainer.appendChild(verseLink);
        verseContainer.appendChild(verseText);

        // Append the verse container to the answer display
        answerDisplay.appendChild(verseContainer);
    });

    document.getElementById('copySelected').style.display = 'block';
    document.getElementById('copySelectedTop').style.display = 'block';
}

// Function to copy selected verses
function copySelectedVerses() {
    console.log("Copy button clicked");
    const checkboxes = document.querySelectorAll('.verse-checkbox:checked');
    let selectedVerses = '';
    let currentBook = '';
    let currentChapter = '';
    let startVerse = null;
    let endVerse = null;
    let verseGroup = '';

    checkboxes.forEach((checkbox, index) => {
        // Use '|' as the separator in checkbox.value
        const [ref, text] = checkbox.value.split('|', 2);
        const [bookChapter, verse] = ref.split(':');
        const [book, chapter] = bookChapter.split(' ');

        if (index === 0) {
            currentBook = book;
            currentChapter = chapter;
            startVerse = verse;
            endVerse = verse;
            verseGroup = text;
        } else {
            if (book === currentBook && chapter === currentChapter && parseInt(verse) === parseInt(endVerse) + 1) {
                endVerse = verse;
                verseGroup += ` ${text}`;
            } else {
                const fullReference = startVerse === endVerse ? `${currentBook} ${currentChapter}:${startVerse}` : `${currentBook} ${currentChapter}:${startVerse}-${endVerse}`;
                selectedVerses += `"${verseGroup.trim()}" - ${fullReference}\n\n`;

                currentBook = book;
                currentChapter = chapter;
                startVerse = verse;
                endVerse = verse;
                verseGroup = text;
            }
        }
    });

    if (verseGroup) {
        const fullReference = startVerse === endVerse ? `${currentBook} ${currentChapter}:${startVerse}` : `${currentBook} ${currentChapter}:${startVerse}-${endVerse}`;
        selectedVerses += `"${verseGroup.trim()}" - ${fullReference}\n\n`;
    }

    if (selectedVerses) {
        navigator.clipboard.writeText(selectedVerses.trim())
            .then(() => {
                alert('The Bible App says: Selected verses copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    } else {
        alert('Please select the verse(s) to copy by clicking on the empty box(es) first.');
    }
}

// Function to share selected verses
function shareSelectedVerses() {
    console.log("Share button clicked");
    const checkboxes = document.querySelectorAll('.verse-checkbox:checked');
    let selectedVerses = '';
    let currentBook = '';
    let currentChapter = '';
    let startVerse = null;
    let endVerse = null;
    let verseGroup = '';

    checkboxes.forEach((checkbox, index) => {
        // Use '|' as the separator in checkbox.value
        const [ref, text] = checkbox.value.split('|', 2);
        const [bookChapter, verse] = ref.split(':');
        const [book, chapter] = bookChapter.split(' ');

        if (index === 0) {
            currentBook = book;
            currentChapter = chapter;
            startVerse = verse;
            endVerse = verse;
            verseGroup = text;
        } else {
            if (book === currentBook && chapter === currentChapter && parseInt(verse) === parseInt(endVerse) + 1) {
                endVerse = verse;
                verseGroup += ` ${text}`;
            } else {
                const fullReference = startVerse === endVerse ? `${currentBook} ${currentChapter}:${startVerse}` : `${currentBook} ${currentChapter}:${startVerse}-${endVerse}`;
                selectedVerses += `"${verseGroup.trim()}" - ${fullReference}\n\n`;

                currentBook = book;
                currentChapter = chapter;
                startVerse = verse;
                endVerse = verse;
                verseGroup = text;
            }
        }
    });

    if (verseGroup) {
        const fullReference = startVerse === endVerse ? `${currentBook} ${currentChapter}:${startVerse}` : `${currentBook} ${currentChapter}:${startVerse}-${endVerse}`;
        selectedVerses += `"${verseGroup.trim()}" - ${fullReference}\n\n`;
    }

    if (selectedVerses) {
        const shareOptions = document.querySelectorAll('#shareOptions, #shareOptionsTop');
        shareOptions.forEach(option => {
            option.style.display = option.style.display === 'none' ? 'block' : 'none';
        });

        // Example: Share via Email
        const shareEmail = document.querySelectorAll('#shareEmail, #shareEmailTop');
        shareEmail.forEach(email => {
            email.href = `mailto:?subject=Shared Bible Verse&body=${encodeURIComponent(selectedVerses.trim())}`;
        });

        // Example: Share via Facebook
        const shareFacebook = document.querySelectorAll('#shareFacebook, #shareFacebookTop');
        shareFacebook.forEach(facebook => {
            facebook.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://jaytrust150.github.io/bible-app/')}`;
            facebook.target = '_blank';
        });

        // Example: Share via Twitter
        const shareX = document.querySelectorAll('#shareX, #shareXTop');
        shareX.forEach(x => {
            x.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(selectedVerses.trim())}`;
            x.target = '_blank';
        });

        // Example: Share via Reddit
        const shareReddit = document.querySelectorAll('#shareReddit, #shareRedditTop');
        shareReddit.forEach(reddit => {
            reddit.href = `https://www.reddit.com/submit?title=Shared%20Bible%20Verse&text=${encodeURIComponent(selectedVerses.trim())}`;
            reddit.target = '_blank';
        });

        // Example: Share via Google Docs
        const shareGoogleDocs = document.querySelectorAll('#shareGoogleDocs, #shareGoogleDocsTop');
        shareGoogleDocs.forEach(googleDocs => {
            googleDocs.href = `https://docs.google.com/document/create?usp=docs_home&title=Shared%20Bible%20Verse&content=${encodeURIComponent(selectedVerses.trim())}`;
            googleDocs.target = '_blank';
        });

        // Example: Share via Word
        const shareWord = document.querySelectorAll('#shareWord, #shareWordTop');
        shareWord.forEach(word => {
            word.href = `https://word.office.live.com/we/wordeditorframe.aspx?ui=en-US&rs=US&dver=1.0&top=1&docid=Shared%20Bible%20Verse&content=${encodeURIComponent(selectedVerses.trim())}`;
            word.target = '_blank';
        });

        // Example: Share via Text
        const shareText = document.querySelectorAll('#shareText, #shareTextTop');
        shareText.forEach(text => {
            text.href = `sms:?body=${encodeURIComponent(selectedVerses.trim())}`;
        });
    } else {
        alert('Please select the verse(s) to share by clicking on the empty box(es) first.');
    }
}
// Function to search the Bible based on user input
function searchBible(query) {
    const answerDisplay = document.getElementById('answerDisplay');
    answerDisplay.innerHTML = '<div class="loader"></div>'; // Show loading spinner
    disableInputs(true); // Disable inputs during fetch

    fetch(`https://bible-api.com/${query}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            answerDisplay.innerHTML = ''; // Clear loading spinner
            if (data.verses && data.verses.length > 0) {
                data.verses.forEach(verse => displayVerse(verse));
            } else {
                const verseParagraph = document.createElement('p');
                verseParagraph.textContent = `${data.reference} ${data.text}`;
                answerDisplay.appendChild(verseParagraph);
            }
        })
        .catch(error => {
            console.error('Error fetching search results:', error);
            answerDisplay.innerHTML = `<p>Error fetching search results: ${error.message}. Please check your connection or try again later.</p>`;
        })
        .finally(() => {
            disableInputs(false);
        });
}
// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    // --- Restore Last Reading Position ---
    const lastBook = localStorage.getItem('lastBook');
    const lastChapter = localStorage.getItem('lastChapter');
    const lastVerse = localStorage.getItem('lastVerse');

    // --- Daily Devotional Button --- 
const dailyDevotionalButton = document.getElementById('dailyDevotionalButton');

dailyDevotionalButton.addEventListener('click', () => {
    window.location.href = 'https://your-daily-devotional-app-url.com/index.html'; // Replace with the actual URL of your Daily Devotional app
});

    


    // --- Font Size Functionality ---
    const answerDisplay = document.getElementById('answerDisplay');
    let currentFontSize = 16;

    const increaseFontButton = document.getElementById('increaseFont');
    increaseFontButton.addEventListener('click', () => {
        currentFontSize += 2;
        if (currentFontSize > parseInt(getComputedStyle(answerDisplay).getPropertyValue('max-font-size'))) {
            currentFontSize = parseInt(getComputedStyle(answerDisplay).getPropertyValue('max-font-size'));
        }
        answerDisplay.style.fontSize = `${currentFontSize}px`;
    });

    const decreaseFontButton = document.getElementById('decreaseFont');
    decreaseFontButton.addEventListener('click', () => {
        currentFontSize -= 2;
        if (currentFontSize < parseInt(getComputedStyle(answerDisplay).getPropertyValue('min-font-size'))) {
            currentFontSize = parseInt(getComputedStyle(answerDisplay).getPropertyValue('min-font-size'));
        }
        answerDisplay.style.fontSize = `${currentFontSize}px`;
    });

    // --- Version Selection ---
    const versionSelectTop = document.getElementById('versionSelectTop');
    versionSelectTop.addEventListener('change', () => {
        const selectedBook = bookSelect.value;
        const selectedChapter = parseInt(chapterSelect.value);
        fetchChapter(selectedBook, selectedChapter, versionSelectTop.value);
    });

    // --- Book Selection ---
    const bookSelect = document.getElementById('bookSelect');
    bookSelect.addEventListener('change', () => {
        const selectedBook = bookSelect.value;
        console.log("Book changed to:", selectedBook);
        updateChapterSelect(selectedBook, 1);
        fetchChapter(selectedBook, 1, versionSelectTop.value);

        // Save current book to localStorage
        localStorage.setItem('lastBook', selectedBook); 
    });

    // --- Chapter Selection ---
    const chapterSelect = document.getElementById('chapterSelect');
    chapterSelect.addEventListener('change', () => {
        const selectedBook = bookSelect.value;
        const selectedChapter = parseInt(chapterSelect.value);
        console.log("Chapter changed to:", selectedChapter);
        fetchChapter(selectedBook, selectedChapter, versionSelectTop.value);

        // Save current chapter to localStorage
        localStorage.setItem('lastChapter', selectedChapter);
    });

    // Populate the book select dropdown
    for (const book in chaptersPerBook) {
        const option = document.createElement('option');
        option.value = book;
        option.textContent = book;
        bookSelect.appendChild(option);
    }

    // Set default book (or restore from localStorage)
    bookSelect.value = lastBook || 'John'; 

    // Populate chapters for the default book
    populateChapterSelect(bookSelect.value);

    // --- Search Functionality ---
    const questionInput = document.getElementById('questionInput');
    const searchButton = document.getElementById('searchButton');
    searchButton.addEventListener('click', () => {
        const input = questionInput.value.trim();
        console.log("Search button clicked with input:", input);
        searchBible(input);
    });

    // --- Chapter Navigation ---
    const prevChapterButton = document.getElementById('prevChapter');
    const nextChapterButton = document.getElementById('nextChapter');
    const prevChapterButtonTop = document.getElementById('prevChapterTop');
    const nextChapterButtonTop = document.getElementById('nextChapterTop');

    function navigateChapter(direction) {
        let selectedChapter = parseInt(chapterSelect.value);
        const numChapters = chaptersPerBook[bookSelect.value] || 0;

        if (direction === 'prev' && selectedChapter > 1) {
            selectedChapter--;
        } else if (direction === 'next' && selectedChapter < numChapters) {
            selectedChapter++;
        }

        updateChapterSelect(bookSelect.value, selectedChapter);
        fetchChapter(bookSelect.value, selectedChapter, versionSelectTop.value);

        // Save current chapter to localStorage
        localStorage.setItem('lastChapter', selectedChapter); 
    }

    prevChapterButton.addEventListener('click', () => navigateChapter('prev'));
    nextChapterButton.addEventListener('click', () => navigateChapter('next'));
    prevChapterButtonTop.addEventListener('click', () => navigateChapter('prev'));
    nextChapterButtonTop.addEventListener('click', () => navigateChapter('next'));

    // --- Fetch and display the initial verse (or restore from localStorage) ---
    if (lastBook && lastChapter) {
        // If lastBook and lastChapter are in localStorage, fetch that
        const chapter = lastVerse ? `${lastChapter}:${lastVerse}` : lastChapter; // Include verse if available
        fetchChapter(lastBook, chapter, versionSelectTop.value);
    } else {
        // Otherwise, fetch John 3:16
        fetchChapter('John', 3, versionSelectTop.value); 
    }

    // --- Copy Selected Verses ---
    const copySelectedButton = document.getElementById('copySelected');
    copySelectedButton.addEventListener('click', copySelectedVerses);

    const copySelectedButtonTop = document.getElementById('copySelectedTop');
    copySelectedButtonTop.addEventListener('click', copySelectedVerses);

    // --- Share Selected Verses ---
    const shareSelectedButton = document.getElementById('shareSelected');
    shareSelectedButton.addEventListener('click', shareSelectedVerses);

    const shareSelectedButtonTop = document.getElementById('shareSelectedTop');
    shareSelectedButtonTop.addEventListener('click', shareSelectedVerses);
});