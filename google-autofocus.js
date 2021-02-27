// ==UserScript==
// @name         Google Autofocus
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Allow users to focus on searchbar by slash.
// @author       Cloude
// @match        http://www.google.com/*
// @match        https://www.google.com/*
// ==/UserScript==

(function() {
    'use strict';

    function isFocused(ref) {
      return document && document.activeElement === ref;
    }

    function moveCursor2End(input) {
      let value = input.value;
      input.value = '';
      input.value = value;
    }

    function onKeyDown(e) {
      let input = document.querySelector('form[role=search] input[aria-label=Search]');
      if(!input) {
        console.warn('[addon] searchbar is not found. shortcut ignored.')
        return;
      }
      switch(e.code) {
        case 'Slash':
          if(!isFocused(input)) {
            e.preventDefault();
            input.focus();
            moveCursor2End(input);
          }
          break;
        default:
      }
    }
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('beforeunload', () => {
      document.removeEventListener('keydown', onKeyDown);
    });
})();