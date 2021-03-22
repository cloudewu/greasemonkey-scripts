// ==UserScript==
// @name         Youtube AutoReplay
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Automatically click Replay button after the video ends
// @author       Cloude
// @match        http://www.youtube.com/watch*
// @match        http://www.youtube.com/embed/*
// @match        https://www.youtube.com/watch*
// @match        https://www.youtube.com/embed/*
// ==/UserScript==

(function() {
  'use strict';

  function addAutoReplayBtn() {
    let input = document.createElement('input', {is: 'btn-autoreplay'})
    input.setAttribute('type', 'checkbox')
    input.setAttribute('id', 'btn-autoreplay')
    input.setAttribute('title', 'Auto Replay')
    input.classList.add('ytp-button')

    let container = document.querySelector('#movie_player .ytp-chrome-bottom .ytp-right-controls')
    container.prepend(input)
    
    return input;
  }
  
  function observerCallback(mutationList, observer) {
    for(let mutation of mutationList) {
      if(mutation.attributeName === 'title' && mutation.target.title.toLowerCase() === "replay") {
        setTimeout(()=>{
          mutation.target.click(); // auto click replay
        }, 500);
      }
    }
  }

  const observer = new MutationObserver(observerCallback);
  const playBtn = document.querySelector('button.ytp-play-button');
  
  let autoReplayBtn = addAutoReplayBtn();
  autoReplayBtn.onchange = (e) => {
    if(e.target.checked) {
      observer.observe(playBtn, {attributes: true});
      console.log('[script] autoreplay enabled')
    } else {
      observer.disconnect();
      console.log('[script] autoreplay disabled')
    }
  }
  
  window.addEventListener('beforeunload', () => {
    observer.disconnect();
  });
})();
