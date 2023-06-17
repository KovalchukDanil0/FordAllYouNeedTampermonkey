// ==UserScript==
// @name         Ford All You Need
// @namespace    http://tampermonkey.net/
// @version      0.2
// @downloadURL  https://github.com/KovalchukDanil0/FordAllYouNeedTampermonkey/raw/main/FordAllYouNeed.user.js
// @updateURL    https://github.com/KovalchukDanil0/FordAllYouNeedTampermonkey/raw/main/FordAllYouNeed.user.js
// @description  try to take over the world!
// @author       You
// @match        https://www.ford.pt/*
// @match        https://wwwperf.brandeuauthorlb.ford.com/*
// @match        https://jira.uhub.biz/browse/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ford.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function () {
  "use strict";

  let url = window.location.href;

  var regexWorkflow =
    /wwwperf\.brandeuauthorlb\.ford\.com(\/(?:cf#|editor\.html))?\/etc\/workflow\/packages\/ESM/gm;
  var regexJira = /jira\.uhub\.biz\/browse\//gm;
  var regexWCMWorkflows = "";

  GM.registerMenuCommand("Hello, world (simple)", () => WFButton());

  if (regexWCMWorkflows) {
  } else if (url.match(regexWorkflow)) {
    WorkflowFixes();
  } else if (regexJira) {
    WFButton();
  }
  
  function WFButton() {
    var buttonsContainer = document.querySelector(
      "#opsbar-edit-issue_container"
    );

    var rrr = buttonsContainer.insertAdjacentHTML(
      "afterend",
      '<button title="Create workflow" target="_blank" class="aui-button")"><span class="rigger-label">Create workflow</span></button>'
    );

    document
      .querySelector(
        "#stalker > div > div.command-bar > div > div > div > div.aui-toolbar2-primary > button"
      )
      .addEventListener("click", CreateWF);
  }

  function CreateWF() {
    var regexRemoveSpaces = /\r?\n\s+|\r/gm;

    var market = document
      .querySelector("#customfield_13300-val")
      .textContent.replace(regexRemoveSpaces, "");
    var localLanguage = document
      .querySelector("#customfield_15000-val")
      .textContent.replace(regexRemoveSpaces, "");

    var WFPath = TextToWFPath(market, localLanguage);
    var newPage = window.open(
      "https://wwwperf.brandeuauthorlb.ford.com/miscadmin#/etc/workflow/packages/ESM/" +
        WFPath
    );
    newPage.focus();

    var test = newPage.document.querySelector("#cq-gen91");
    newPage.alert(test);
  }

  function TextToWFPath(market, localLanguage) {
    var fullPath;
    switch (market) {
      case "Ford of Poland":
        fullPath = "PLPL";
      case "Ford of Czech Republic":
        fullPath = "CSCZ";
      case "Ford of Italy":
        fullPath = "ITIT";
    }

    return fullPath;
  }

  function WorkflowFixes() {
    var elements = document.querySelectorAll(
      ".content-conf > .configSection > div a"
    );
    for (let index = 0; index < elements.length; index++) {
      elements[index].href = determineIfBeta(elements[index].href);
    }
  }

  function determineIfBeta(link = "test") {
    var regexDetermineBeta =
      /(.+)?(\/(?:editor\.html|cf#))?(\/content\/guxeu(?:-beta)?\/(?:.+)?)/gm;
    if (link.includes("/guxeu-beta/")) {
      link = link.replace(regexDetermineBeta, "$1/editor.html$3");
    } else {
      link = link.replace(regexDetermineBeta, "$1/cf#$3");
    }
    return link;
  }

  function ToEnvironment(env) {
    var regexEditor =
      /wwwperf\.brandeuauthorlb\.ford\.com(?:\/(editor\.html|cf#))?\/content\/guxeu(?:-beta)?\//gm;
    var regexPerf = /wwwperf-beta-\w\w(?:\w\w)?\.brandeulb\.ford\.com/gm;
    var regexLive = /www(?:\.\w\w)?\.ford\.\w\w(?:\.\w\w)?/gm;
  }
})();
