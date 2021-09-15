document.getElementById('showBookmarks').addEventListener('click', function () {
  chrome.tabs.create({ url: chrome.runtime.getURL('bookmarks.html') });
});
