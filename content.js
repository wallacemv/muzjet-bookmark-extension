const script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.setAttribute('src', chrome.runtime.getURL('main.js'));
document.documentElement.appendChild(script);

script.addEventListener('load', () => {
  chrome.storage.local.get(['enabled', 'urls'], (result) => {
    postMessage({
      type: 'ajaxInterceptor',
      to: 'pageScript',
      key: 'enabled',
      value: true,
    });
    postMessage({
      type: 'ajaxInterceptor',
      to: 'pageScript',
      key: 'urls',
      value: [
        'srv.muzjet.com/a/ms/media/search',
        'srv.muzjet.com/a/ms/section',
      ],
    });
  });

  chrome.storage.sync.get(null, function (items) {
    postMessage({
      type: 'bookmarks-list',
      to: 'pageScript',
      key: 'bookmarks',
      value: items,
    });
  });
});
