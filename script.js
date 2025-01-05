// Function to share devotional (You'll need to add the actual logic here later)
function shareDevotional() {
    console.log("Share button clicked");
  }
  
  // --- Date Pill ---
  const monthSelect = document.getElementById('monthSelect');
  const daySelect = document.getElementById('daySelect');
  const yearDisplay = document.getElementById('yearDisplay');
  
  // Function to populate the daySelect with the correct number of days
  function populateDaySelect() {
    const month = parseInt(monthSelect.value);
    const year = new Date().getFullYear(); // Get current year
    const daysInMonth = new Date(year, month, 0).getDate(); // Get days in selected month
  
    daySelect.innerHTML = ''; // Clear existing options
  
    for (let i = 1; i <= daysInMonth; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.text = i;
      daySelect.add(option);
    }
  }
  
  // Function to get the formatted date (e.g., "1.4" for January 4th)
  function getFormattedDate() {
    const month = parseInt(monthSelect.value);
    const day = parseInt(daySelect.value);
    return `${month}.${day}`;
  }
  
  // --- Get the devotional text element ---
  const devotionalTextDiv = document.getElementById('devotionalText');
  
  // Function to fetch and display the devotional
  function displayDevotional() {
    const formattedDate = getFormattedDate();
    const filename = `devotionals/${formattedDate}-devotional.txt`;
    fetch(filename)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok'); 
        }
        return response.text();
      })
      .then(text => {
        if (text.trim() === '') {
          devotionalTextDiv.innerHTML = `
            <p>Edits in Progress</p>
            <p>May God bless your heart for seeking Him!</p>
            <p>Just say a prayer for today to Him! In Jesus' name, Amen!</p>
          `;
        } else {
          devotionalTextDiv.innerHTML = text;
        }
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
        devotionalTextDiv.innerHTML = "<p>Error loading devotional.</p><p>Please try again later.</p>";
      });
  }
  
  // Function to increment the day number
  function nextDay() {
    let month = parseInt(monthSelect.value);
    let day = parseInt(daySelect.value) + 1; // Increment the day
  
    // Handle month and year changes
    const daysInMonth = new Date(new Date().getFullYear(), month, 0).getDate();
    if (day > daysInMonth) {
      day = 1;
      month++;
      if (month > 12) {
        month = 1;
      }
    }
  
    monthSelect.value = month;
    populateDaySelect(); // Repopulate daySelect for the new month
    daySelect.value = day;
  
    displayDevotional();
  }
  
  // --- Previous Day Function ---
  function prevDay() {
    let month = parseInt(monthSelect.value);
    let day = parseInt(daySelect.value) - 1; // Decrement the day
  
    // Handle month and year changes
    if (day < 1) {
      month--;
      if (month < 1) {
        month = 12; 
      }
      const daysInPreviousMonth = new Date(new Date().getFullYear(), month, 0).getDate();
      day = daysInPreviousMonth;
    }
  
    monthSelect.value = month;
    populateDaySelect(); // Repopulate daySelect for the new month
    daySelect.value = day;
  
    displayDevotional();
  }
  
  
  // --- Dark Mode Toggle ---
  const darkModeToggle = document.getElementById('darkModeToggle');
  
  darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });
  
  
  // --- Font Size Controls ---
  const answerDisplay = document.getElementById('devotionalText'); 
  const decreaseFont = document.getElementById('decreaseFont');
  const increaseFont = document.getElementById('increaseFont');
  
  let currentFontSize = 16; // Set an initial font size
  
  decreaseFont.addEventListener('click', () => {
    currentFontSize -= 2;
    answerDisplay.style.fontSize = currentFontSize + 'px';
  });
  
  increaseFont.addEventListener('click', () => {
    currentFontSize += 2;
    answerDisplay.style.fontSize = currentFontSize + 'px';
  });
  
  
  // --- Share Button ---
  const shareButton = document.getElementById('shareButton'); // Declared in the global scope
  
  shareButton.addEventListener('click', () => {
    // Get the content to share (devotional or podcast)
    const contentToShare = devotionalTextDiv.textContent; 
  
    // Show the share options
    const shareOptions = document.querySelectorAll('.share-options'); 
    shareOptions.forEach(option => {
      option.style.display = option.style.display === 'none' ? 'block' : 'none';
    });
  
    // Share via Facebook
    const shareFacebook = document.querySelectorAll('.share-facebook'); 
    shareFacebook.forEach(facebook => {
      facebook.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://jaytrust150.github.io/bible-app/')}`;
      facebook.target = '_blank';
    });
  
    // Share via Instagram
    const shareInstagram = document.querySelectorAll('.share-instagram');
    shareInstagram.forEach(instagram => {
      instagram.href = `https://www.instagram.com/`; 
      instagram.target = '_blank';
    });
  
    // Share via Snapchat
    const shareSnapchat = document.querySelectorAll('.share-snapchat');
    shareSnapchat.forEach(snapchat => {
      snapchat.href = `https://www.snapchat.com/`;
      snapchat.target = '_blank';
    });  
  
    // Share via Email
    const shareEmail = document.querySelectorAll('.share-email'); 
    shareEmail.forEach(email => {
      const emailBody = `${contentToShare.trim()}\n\nRead more at: [your website link here]`;
      email.href = `mailto:?subject=Shared Devotional&body=${encodeURIComponent(emailBody)}`;
    });
  
    // Share via Twitter (X)
    const shareX = document.querySelectorAll('.share-x');
    shareX.forEach(x => {
      x.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(contentToShare.trim())}`;
      x.target = '_blank';
    });
  
    // Share via Reddit
    const shareReddit = document.querySelectorAll('.share-reddit');
    shareReddit.forEach(reddit => {
      reddit.href = `https://www.reddit.com/submit?title=Shared%20Devotional&text=${encodeURIComponent(contentToShare.trim())}`;
      reddit.target = '_blank';
    });
  
    // Share via Google Docs
    const shareGoogleDocs = document.querySelectorAll('.share-google-docs');
    shareGoogleDocs.forEach(googleDocs => {
      googleDocs.href = `https://docs.google.com/document/create?usp=docs_home&title=Shared%20Devotional&content=${encodeURIComponent(contentToShare.trim())}`;
      googleDocs.target = '_blank';
    });
  
    // Share via Text (SMS)
    const shareText = document.querySelectorAll('.share-text');
    shareText.forEach(text => {
      text.href = `sms:?body=${encodeURIComponent(contentToShare.trim())}`;
    });
  });
  
  
  // --- Audio Buttons ---
  const audioButton = document.getElementById('audioButton');
  const podcastsAudioButtons = document.querySelectorAll('#podcastsAudioButton');
  
  function readDevotional() {
    const devotionalText = devotionalTextDiv.textContent;
  
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(devotionalText);
      speechSynthesis.speak(utterance);
    } else {
      alert('Sorry, your browser does not support text-to-speech.');
    }
  }
  
  audioButton.addEventListener('click', readDevotional);
  
  podcastsAudioButtons.forEach(button => {
    button.addEventListener('click', readDevotional);
  });
  
  
  // --- Previous/Next Day Buttons ---
  const prevDevotional = document.getElementById('prevDevotional');
  const nextDayButton = document.getElementById('nextDevotional'); 
  
  prevDevotional.addEventListener('click', prevDay);
  nextDayButton.addEventListener('click', nextDay); 
  
  // --- Podcasts Button ---
  const podcastsButtons = document.querySelectorAll('#podcastsButton'); 
  
  podcastsButtons.forEach(button => {
    button.addEventListener('click', () => {
      devotionalTextDiv.innerHTML = "<h2>Podcasts</h2><p>This is where your podcasts content will go.</p>"; 
    });
  });
  
  // Initial setup
  populateDaySelect(); // Populate daySelect initially
  yearDisplay.textContent = new Date().getFullYear(); // Set the year
  
  // Set initial values for month and day selects
  const today = new Date();
  const currentMonth = today.getMonth() + 1; // Month is 0-indexed
  const currentDay = today.getDate();
  monthSelect.value = currentMonth;
  daySelect.value = currentDay;
  
  displayDevotional(); // Call displayDevotional to load the initial devotional
  
  monthSelect.addEventListener('change', () => {
    populateDaySelect();
    displayDevotional();
  });
  
  daySelect.addEventListener('change', displayDevotional);
  // --- Bible App Button ---
const bibleAppButton = document.getElementById('bibleAppButton');

bibleAppButton.addEventListener('click', () => {
  window.location.href = 'https://jaytrust150.github.io/bible-app/';
});
// --- Search Functionality ---
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

searchButton.addEventListener('click', () => {
  const searchQuery = searchInput.value; 
  const bibleAppURL = `https://jaytrust150.github.io/bible-app/?query=${encodeURIComponent(searchQuery)}`;
  window.location.href = bibleAppURL;
});