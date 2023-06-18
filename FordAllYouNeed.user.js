// ==UserScript==
// @name         Ford All You Need
// @namespace    http://tampermonkey.net/
// @version      0.3
// @downloadURL  https://github.com/KovalchukDanil0/FordAllYouNeedTampermonkey/raw/main/FordAllYouNeed.user.js
// @updateURL    https://github.com/KovalchukDanil0/FordAllYouNeedTampermonkey/raw/main/FordAllYouNeed.user.js
// @description  try to take over the world!
// @author       Gomofob
// @match        https://jira.uhub.biz/browse/*
//
// @match        https://www.ford.ie/*
// @match        https://www.ford.fi/*
// @match        https://www.ford.cz/*
// @match        https://www.ford.hu/*
// @match        https://www.ford.gr/*
// @match        https://www.ford.ro/*
// @match        https://www.ford.lu/*
// @match        https://www.ford.ru/*
//
// @match        https://www.fr.ford.be/*
// @match        https://www.nl.ford.be/*
//
// @match        https://www.de.ford.ch/*
// @match        https://www.fr.ford.ch/*
// @match        https://www.it.ford.ch/*
//
// @match        https://www.ford.co.uk/*
// @match        https://www.ford.de/*
// @match        https://www.ford.es/*
// @match        https://www.ford.fr/*
// @match        https://www.ford.nl/*
// @match        https://www.ford.it/*
// @match        https://www.ford.no/*
// @match        https://www.ford.at/*
// @match        https://www.ford.pt/*
// @match        https://www.ford.pl/*
// @match        https://www.ford.dk/*
//
// @match        https://wwwperf-ie.brandeulb.ford.com/*
// @match        https://wwwperf-fi.brandeulb.ford.com/*
// @match        https://wwwperf-cz.brandeulb.ford.com/*
// @match        https://wwwperf-hu.brandeulb.ford.com/*
// @match        https://wwwperf-gr.brandeulb.ford.com/*
// @match        https://wwwperf-ro.brandeulb.ford.com/*
// @match        https://wwwperf-lu.brandeulb.ford.com/*
// @match        https://wwwperf-ru.brandeulb.ford.com/*
//
// @match        https://wwwperf-befr.brandeulb.ford.com/*
// @match        https://wwwperf-benl.brandeulb.ford.com/*
//
// @match        https://wwwperf-chde.brandeulb.ford.com/*
// @match        https://wwwperf-chfr.brandeulb.ford.com/*
// @match        https://wwwperf-chit.brandeulb.ford.com/*
//
// @match        https://wwwperf-beta-couk.brandeulb.ford.com/*
// @match        https://wwwperf-beta-fe.brandeulb.ford.com/*
// @match        https://wwwperf-beta-es.brandeulb.ford.com/*
// @match        https://wwwperf-beta-fr.brandeulb.ford.com/*
// @match        https://wwwperf-beta-nl.brandeulb.ford.com/*
// @match        https://wwwperf-beta-it.brandeulb.ford.com/*
// @match        https://wwwperf-beta-no.brandeulb.ford.com/*
// @match        https://wwwperf-beta-at.brandeulb.ford.com/*
// @match        https://wwwperf-beta-pt.brandeulb.ford.com/*
// @match        https://wwwperf-beta-pl.brandeulb.ford.com/*
// @match        https://wwwperf-beta-dk.brandeulb.ford.com/*
//
// @match        https://wwwperf.brandeuauthorlb.ford.com/*
//
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ford.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function () {
  "use strict";

  const url = window.location.href;

  var regexWorkflow =
    /wwwperf\.brandeuauthorlb\.ford\.com(\/(?:cf#|editor\.html))?\/etc\/workflow\/packages\/ESM/gm;
  var regexJira = /jira\.uhub\.biz\/browse\//gm;
  var regexWCMWorkflows = /somethingshitfaggot/gm;

  var marketsInBeta = [
    "www.ford.co.uk",
    "www.ford.de",
    "www.ford.es",
    "www.ford.fr",
    "www.ford.nl",
    "www.ford.it",
    "www.ford.no",
    "www.ford.at",
    "www.ford.pt",
    "www.ford.pl",
    "www.ford.dk",
  ];

  var market = "";
  var localLanguage = "";

  var regexLive =
    /(.+)?(secure|www)(\.(\w\w))?(\.ford)(\.(\w\w))(\.(\w\w))?(.+)?/gm;
  var regexPerf =
    /((?:.+)?wwwperf(?:-beta)?-)(\w\w)?(\w\w)(\.brandeulb\.ford\.com(?:.+)?)/gm;
  var regexEditor =
    /wwwperf\.brandeuauthorlb\.ford\.com(?:\/(editor\.html|cf#))?\/content\/guxeu(?:-beta)?\//gm;

  AddMenus();

  if (url.match(regexWCMWorkflows)) {
  } else if (url.match(regexWorkflow)) {
    WorkflowFixes();
  } else if (url.match(regexJira)) {
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

    market = document
      .querySelector("#customfield_13300-val")
      .textContent.replace(regexRemoveSpaces, "");
    localLanguage = document
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

    // todo auto-create WF
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
      elements[index].href = AddBetaToLink(elements[index].href);
    }
  }

  function AddBetaToLink(link = "test") {
    var regexDetermineBeta =
      /(.+)?(\/(?:editor\.html|cf#))?(\/content\/guxeu(?:-beta)?\/(?:.+)?)/gm;
    if (link.includes("/guxeu-beta/")) {
      link = link.replace(regexDetermineBeta, "$1/editor.html$3");
    } else {
      link = link.replace(regexDetermineBeta, "$1/cf#$3");
    }
    return link;
  }

  function AddMenus() {
    if (url.match(regexLive)) {
      GM.registerMenuCommand("TO PERF", () => ToEnvironment("perf"));
    } else if (url.match(regexPerf)) {
      GM.registerMenuCommand("TO LIVE", () => ToEnvironment("live"));
    } else if (url.match(regexEditor)) {
      GM.registerMenuCommand("TO PERF", () => ToEnvironment("perf"));
      GM.registerMenuCommand("TO LIVE", () => ToEnvironment("live"));
    }
  }

  function ToEnvironment(env) {
    var regexUrlPart = /.*?\b\/(.+)|(.+)/gm;
    var urlPart = url.replace(regexUrlPart, "$1");

    market = "";
    localLanguage = "";

    var beta = "";
    if (url.match(regexLive)) {
      if (marketsInBeta.some((link) => url.includes(link))) {
        beta = "-beta";
      }

      if (url.match(/www\.ford\.\w\w\.\w\w/gm)) {
        localLanguage = url.replace(regexLive, "$9");
      } else {
        localLanguage = url.replace(regexLive, "$4");
      }
      market = url.replace(regexLive, "$7");

      switch (env) {
        case "perf":
          LiveToPerf(market, localLanguage, beta, urlPart);
      }
    } else if (url.match(regexPerf)) {
      if (url.includes("-beta")) {
        beta = "-beta";
      }

      var britain = "";
      if (url.match(/wwwperf-beta-\w\w\.brandeulb\.ford\.com/gm)) {
        market = url.replace(regexPerf, "$3");
      } else {
        market = url.replace(regexPerf, "$2");
        if (market == "co") {
          britain = url.replace(regexPerf, ".$3");
        } else {
          localLanguage = url.replace(regexPerf, "$3.");
        }
      }

      switch (env) {
        case "live":
          PerfToLive(localLanguage, market, britain, urlPart);
      }
    }
  }

  function LiveToPerf(market, localLanguage, beta, urlPart) {
    window.open(
      "https://wwwperf" +
        beta +
        "-" +
        market +
        localLanguage +
        ".brandeulb.ford.com/" +
        urlPart
    );
  }

  function PerfToLive(localLanguage, market, britain, urlPart) {
    window.open(
      "https://www." +
        localLanguage +
        "ford." +
        market +
        britain +
        "/" +
        urlPart
    );
  }
})();
