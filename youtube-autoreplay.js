// ==UserScript==
// @name         Youtube AutoReplay
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Automatically click Replay button after the video ends
// @author       Cloude
// @match        http://www.youtube.com/watch*
// @match        http://www.youtube.com/embed/*
// @match        https://www.youtube.com/watch*
// @match        https://www.youtube.com/embed/*
// ==/UserScript==

(function() {
  'use strict';

  function observerCallback(mutationList, observer) {
    for(let mutation of mutationList) {
      if(mutation.attributeName === 'title' && mutation.target.title.toLowerCase() === "replay") {
        setTimeout(()=>{
          console.log('[script] auto replay.')
          mutation.target.click(); // auto click replay
        }, 500);
      }
    }
  }

  const observer = new MutationObserver(observerCallback);
  const playBtn = document.querySelector('button.ytp-play-button');
  observer.observe(playBtn, {attributes: true});

  window.addEventListener('beforeunload', () => {
    observer.disconnect();
  });

})();
