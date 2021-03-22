// ==UserScript==
// @name         Google Autofocus
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Allow users to focus on searchbar by slash.
// @author       Cloude
// @match        http://www.google.com/*
// @match        https://www.google.com/*
// @match        http://mail.google.com/*
// @match        https://mail.google.com/*
// ==/UserScript==

(function() {
    'use strict';

    const INPUT_SELECTORS = [
      'form[role=search] input[title="Search"]', // engine top searchbar
      '#search .obcontainer input', // dictionary
      '#searchbox_form #searchboxinput', // google map
      '#aso_search_form_anchor input[name=q]' // gmail
    ];

    function getNextInput(curInput = null) {
      let inputList = INPUT_SELECTORS.reduce((acc, selector)=> {
        let input = document.querySelector(selector);
        return input ? acc.concat(input) : acc;
      }, []);
      let curIdx = inputList.indexOf(curInput);
      return (curIdx < 0) ? head(inputList)
                          : inputList[(curIdx+1)%inputList.length];
    }

    function head(list) {
      return list.length>0 && list[0] || null;
    }

    function inputFocused() {
      return document && document.activeElement && document.activeElement.tagName.toLowerCase() === 'input';
    }

    function moveCursor2End(input) {
      let value = input.value;
      input.value = '';
      input.value = value;
    }

    function onGlobalKeyDown(e) {
      let input = null;
      switch(e.code) {
        case 'Slash':
          if(inputFocused() && !e.ctrlKey) {
            break;
          }
          input = getNextInput(e.target);
          if(input) {
            e.preventDefault();
            document.querySelector('body').click(); // close suggestions
            input.focus();
            moveCursor2End(input);
          }
          break;
        default:
      }
    }

    // unfocus the input if suggestion list is not opened
    function onSearchbarKeyDown(e) {
      if(e.code !== 'Escape') return;
      if(document.querySelector('form[role="search"] .UUbT9').style.display === 'none') {
        e.target.blur();
      }
    }

    const searchbar = document.querySelector('form[role=search] input[title="Search"]');
    searchbar && searchbar.addEventListener('keydown', onSearchbarKeyDown);
    document.addEventListener('keydown', onGlobalKeyDown);

    window.addEventListener('beforeunload', () => {
      document.removeEventListener('keydown', onGlobalKeyDown);
      searchbar.removeEventListener('keydown', onSearchbarKeyDown);
    });
})();