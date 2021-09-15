let interceptor = {
  settings: {
    enabled: false,
    urls: ['srv.muzjet.com/a/ms/media/search', 'srv.muzjet.com/a/ms/section'],
    bookmarks: {},
  },

  originalXHR: window.XMLHttpRequest,
  myXHR: function () {
    const modifyResponse = () => {
      interceptor.settings.urls.forEach((url) => {
        if (this.responseURL.indexOf(url) !== -1) {
          this.responseText = this.responseText;
          this.response = this.response;

          init();
        }
      });
    };

    const init = () => {
      //console.log('init');

      setTimeout(function () {
        var items = $('ms-release-audio-main');

        for (var i = 0; i < items.length; i++) {
          if ($(items[i]).find('span').length == 0) {
            var span = document.createElement('span');
            span.innerHTML = '&#9733;';
            span.style.cssText = interceptor.settings.bookmarks[
              $(items[i]).find('a').attr('href')
            ]
              ? 'color: red;'
              : 'color: black;';

            span.onclick = function (el) {
              //encontro a chave
              var key = $(el.target).parent().find('a').attr('href');
              //encontro o valor
              var value = $(el.target)
                .parent()
                .find('ms-release-audio-name')
                .find('ms-release-audio-name-text')
                .html();

              value = value.replaceAll('<ss>', '');
              value = value.replaceAll('</ss>', '');
              value = value.trim();

              //verifico se o item foi salvo
              if (interceptor.settings.bookmarks[key]) {
                //acao do click para remover
                chrome.runtime.sendMessage(
                  chrome.runtime.id || 'fgaghackakkobojjhdhdmbhmoennfhje',
                  { type: 'remove', to: 'background', key: key, value: null },
                  (response) => {
                    //console.log('received user data', response);
                    el.target.style.cssText = 'color: black;';
                    delete interceptor.settings.bookmarks[key];
                  }
                );
              } else {
                //acao do click para add
                chrome.runtime.sendMessage(
                  chrome.runtime.id || 'fgaghackakkobojjhdhdmbhmoennfhje',
                  { type: 'add', to: 'background', key: key, value: value },
                  (response) => {
                    el.target.style.cssText = 'color: red;';
                    //console.log('received user data', response);
                    interceptor.settings.bookmarks[key] = value;
                  }
                );
              }
            };

            $(items[i]).append(span);
          }
        }
      }, 1000);
    };

    const xhr = new interceptor.originalXHR();
    for (let attr in xhr) {
      if (attr === 'onreadystatechange') {
        xhr.onreadystatechange = (...args) => {
          if (
            this.readyState == XMLHttpRequest.DONE &&
            interceptor.settings.enabled
          ) {
            modifyResponse();
          }
          this.onreadystatechange && this.onreadystatechange.apply(this, args);
        };
        continue;
      } else if (attr === 'onload') {
        xhr.onload = (...args) => {
          if (interceptor.settings.enabled) {
            modifyResponse();
          }
          this.onload && this.onload.apply(this, args);
        };
        continue;
      }

      if (typeof xhr[attr] === 'function') {
        this[attr] = xhr[attr].bind(xhr);
      } else {
        if (attr === 'responseText' || attr === 'response') {
          Object.defineProperty(this, attr, {
            get: () =>
              this[`_${attr}`] == undefined ? xhr[attr] : this[`_${attr}`],
            set: (val) => (this[`_${attr}`] = val),
            enumerable: true,
          });
        } else {
          Object.defineProperty(this, attr, {
            get: () => xhr[attr],
            set: (val) => (xhr[attr] = val),
            enumerable: true,
          });
        }
      }
    }
  },

  originalFetch: window.fetch.bind(window),
};

window.addEventListener(
  'message',
  function (event) {
    const data = event.data;
    if (data.type === 'bookmarks-list' && data.to === 'pageScript') {
      interceptor.settings['bookmarks'] = data.value;
    }

    if (data.type === 'ajaxInterceptor' && data.to === 'pageScript') {
      interceptor.settings[data.key] = data.value;
    }

    if (interceptor.settings.enabled) {
      window.XMLHttpRequest = interceptor.myXHR;
      window.fetch = interceptor.originalFetch;
    } else {
      window.XMLHttpRequest = interceptor.originalXHR;
      window.fetch = interceptor.originalFetch;
    }
  },
  false
);
