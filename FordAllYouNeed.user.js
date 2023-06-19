// ==UserScript==
// @name         Ford All You Need
// @namespace    http://tampermonkey.net/
// @version      0.4
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
  var regexWCMWorkflows =
    /wwwperf\.brandeuauthorlb\.ford\.com\/miscadmin#\/etc\/workflow\/packages\/ESM\//gm;

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
  var regexAuthor =
    /wwwperf\.brandeuauthorlb\.ford\.com(?:\/(editor\.html|cf#))?\/content\/guxeu(?:-beta)?\//gm;

  AddMenus();
  function AddMenus() {
    if (!url.match(regexLive)) {
      GM.registerMenuCommand("TO LIVE", () => ToEnvironment("live"));
    }
    if (!url.match(regexPerf)) {
      GM.registerMenuCommand("TO PERF", () => ToEnvironment("perf"));
    }
    if (!url.match(regexAuthor)) {
      GM.registerMenuCommand("TO AUTHOR", () => ToEnvironment("author"));
    }
  }

  if (url.match(regexWCMWorkflows)) {
    CreateWF();
  } else if (url.match(regexWorkflow)) {
    WorkflowFixes();
  } else if (url.match(regexJira)) {
    WFButton();
  }

  function WFButton() {
    var buttonsContainer = document.querySelector(
      "#opsbar-edit-issue_container"
    );

    buttonsContainer.insertAdjacentHTML(
      "afterend",
      '<button title="Create workflow" target="_blank" class="aui-button")"><span class="rigger-label">Create workflow</span></button>'
    );

    document
      .querySelector(
        "#stalker > div > div.command-bar > div > div > div > div.aui-toolbar2-primary > button"
      )
      .addEventListener("click", CreateWFButton);
  }

  function CreateWFButton() {
    var regexRemoveSpaces = /\r?\n\s+|\r/gm;

    market = document
      .querySelector("#customfield_13300-val")
      .textContent.replace(regexRemoveSpaces, "");
    localLanguage = document
      .querySelector("#customfield_15000-val")
      .textContent.replace(regexRemoveSpaces, "");

    GM_setValue("WFTitle", document.querySelector("#summary-val").textContent);
    GM_setValue(
      "WFName",
      document
        .querySelector("#parent_issue_summary")
        .getAttribute("data-issue-key")
        .match(/ESM-\w+/gm)
    );

    var WFPath = TextToWFPath(market, localLanguage);
    var newPage = window.open(
      "https://wwwperf.brandeuauthorlb.ford.com/miscadmin#/etc/workflow/packages/ESM/" +
        WFPath
    );
  }

  function CreateWF() {
    var WFTitle = GM_getValue("WFTitle", null);
    GM_setValue("WFTitle", null);

    var WFName = GM_getValue("WFName", null);
    GM_setValue("WFName", null);

    if (WFTitle == null || WFName == null) return;

    var intervaID = setInterval(function () {
      var firstItemInList = document.querySelector(
        "#cq-gen75 > div.x-grid3-row.x-grid3-row-first > table > tbody > tr > td.x-grid3-col.x-grid3-cell.x-grid3-td-title > div"
      );
      if (firstItemInList == null) return;

      var button = document.getElementById("cq-gen91");
      button.click();
      clearInterval(intervaID);

      intervaID = setInterval(function () {
        var form = document.getElementById("ext-comp-1079");
        if (form == null) return;

        form.value = WFTitle;
        form.insertAdjacentHTML(
          "beforebegin",
          '<label style="width:130px; color:red;">Be aware of incorrect WF path!!!</label>'
        );

        form = document.getElementById("ext-comp-1080");
        form.value = WFName;

        clearInterval(intervaID);
      }, 500);
    }, 500);
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
      case "Ford of Belgium":
        fullPath = "BE";
        switch (localLanguage) {
          case "Dutch":
            fullPath += "/BENL";
        }
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
        urlPart,
      "_self"
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
        urlPart,
      "_self"
    );
  }
})();
