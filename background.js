// Extension's background code
chrome.runtime.onMessageExternal.addListener(function (
  request,
  sender,
  sendResponse
) {
  /* do work */
  if (request.type === 'remove' && request.to === 'background') {
    chrome.storage.sync.remove([request.key], function () {
      sendResponse(true);
    });
  } else if (request.type === 'add' && request.to === 'background') {
    chrome.storage.sync.set({ [request.key]: request.value }, function () {
      sendResponse(true);
    });
  }
});
