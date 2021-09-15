chrome.storage.sync.get(null, function (items) {
  var keys = Object.keys(items);
  if (keys.length > 0) {
    keys.forEach((item) => {
      let div = document.createElement('div');
      div.id = item;

      let anchor = document.createElement('a');
      anchor.href = 'https://srv.muzjet.com' + item;
      anchor.innerText = items[item];

      let span = document.createElement('span');
      span.innerHTML = '&#10006; ';
      span.style.cssText = 'color: red; cursor: pointer;';
      span.onclick = function (el) {
        //acao do click para remover
        console.log(item);

        chrome.storage.sync.remove([item], function () {
          var el = document.getElementById(item);
          el.parentNode.removeChild(el);
        });
      };

      div.appendChild(span);
      div.appendChild(anchor);
      document.body.appendChild(div);
    });
  } else {
    const div = document.createElement('div');
    div.innerText = 'Empty list.';
    document.body.appendChild(div);
  }
});
