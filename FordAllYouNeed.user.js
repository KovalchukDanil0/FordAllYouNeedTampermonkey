// ==UserScript==
// @name         Ford All You Need
// @namespace    http://tampermonkey.net/
// @version      0.5
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
// @match        https://wwwperf-beta-de.brandeulb.ford.com/*
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
  var regexResourceResolver =
    /wwwperf\.brandeuauthorlb\.ford\.com(\/(?:cf#|editor\.html))?\/etc\/guxacc\/tools\/resource\-resolver\-tool/gm;

  var regexLive =
    /(?:.+)?(?:secure|www)(?:\.(\w\w))?\.ford\.(\w\w)(?:\.(\w\w))?(?:.+)?/gm;
  var regexPerf =
    /(?:.+)?wwwperf(?:-beta)?-(\w\w)(\w\w)?(\.brandeulb\.ford\.com(?:.+)?)/gm;
  var regexAuthor =
    /(?:.+)?wwwperf\.brandeuauthorlb\.ford\.com(?:\/(?:editor\.html|cf#))?\/content\/guxeu(?:-beta)?\/(\w\w)\/(\w\w)_\w\w\/(?:.+)?/gm;

  var marketsInBeta = [
    "co",
    "de",
    "es",
    "fr",
    "nl",
    "it",
    "no",
    "at",
    "pt",
    "pl",
    "dk",
  ];
  function IsMarketInBeta(market) {
    if (marketsInBeta.some((link) => market.includes(link))) return true;

    return false;
  }

  var market = "";
  var localLanguage = "";

  (function AddMenus() {
    var ifNotLive = !url.match(regexLive);
    var ifNotPerf = !url.match(regexPerf);
    var ifNotAuthor = !url.match(regexAuthor);

    if (ifNotLive && ifNotPerf && ifNotAuthor) return;

    if (ifNotLive) {
      GM.registerMenuCommand("TO LIVE", () => ToEnvironment("live"));
    }
    if (ifNotPerf) {
      GM.registerMenuCommand("TO PERF", () => ToEnvironment("perf"));
    }
    if (ifNotAuthor) {
      GM.registerMenuCommand("TO AUTHOR", () => ToEnvironment("author"));
    }
  })();

  if (url.match(regexWCMWorkflows)) {
    CreateWF();
  } else if (url.match(regexWorkflow)) {
    WorkflowFixes();
  } else if (url.match(regexJira)) {
    WFButton();
  } else if (url.match(regexResourceResolver)) {
    ResourceResolverGetOrigPath();
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
    var regexRemoveSpaces = /^\s+|\s+$|\s+(?=\s)/gm;

    market = document
      .querySelector("#customfield_13300-val")
      .textContent.replace(regexRemoveSpaces, "");
    localLanguage = document
      .querySelector("#customfield_15000-val")
      .textContent.replace(regexRemoveSpaces, "");

    GM_setValue(
      "WFTitle",
      document
        .querySelector("#summary-val")
        .textContent.replace(regexRemoveSpaces, "")
    );
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
      clearInterval(intervaID);

      var button = document.getElementById("cq-gen91");
      button.click();

      intervaID = setInterval(function () {
        var form = document.getElementById("ext-comp-1079");
        if (form == null) return;
        clearInterval(intervaID);

        form.value = WFTitle;
        form.insertAdjacentHTML(
          "beforebegin",
          '<label style="width:130px; color:red;">Be aware of incorrect WF path!!!</label>'
        );

        form = document.getElementById("ext-comp-1080");
        form.value = WFName;

        var promotionButton = document.querySelector(
          "#ext-comp-1076 > div:nth-child(3)"
        );
        promotionButton.click();
      }, 500);
    }, 500);
  }

  function TextToWFPath(market, localLanguage) {
    var fullPath;
    switch (market) {
      default:
        return;
        break;
      case "Ford of Belgium":
        fullPath = "BE";
        switch (localLanguage) {
          case "Dutch":
            fullPath += "/BENL";
            break;
          case "French":
            fullPath += "/BEFR";
            break;
        }
        break;
      case "Ford of Poland":
        fullPath = "PLPL";
        break;
      case "Ford of Czech Republic":
        fullPath = "CSCZ";
        break;
      case "Ford of Poland":
        fullPath = "PLPL";
        break;
      case "Ford of Italy":
        fullPath = "ITIT";
        break;
      case "Ford of Netherlands":
        fullPath = "NLNL";
        break;
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
    var urlPart =
      window.location.pathname + window.location.search + window.location.hash;

    if (urlPart == "/") {
      urlPart = "";
    }

    market = "";
    localLanguage = "";
    var britain = "";
    var beta = "";

    // Live
    if (url.match(regexLive)) {
      if (url.match(/www\.ford\.\w\w\.\w\w/gm)) {
        localLanguage = url.replace(regexLive, "$3");
      } else {
        localLanguage = url.replace(regexLive, "$1");
      }
      market = url.replace(regexLive, "$2");

      if (IsMarketInBeta(market)) {
        beta = "-beta";
      }

      DetermineEnv(env, market, localLanguage, beta, urlPart);
    }
    // Perf
    else if (url.match(regexPerf)) {
      if (url.match(/wwwperf-beta-it\.brandeulb\.ford\.com/gm)) {
      }

      market = url.replace(regexPerf, "$1");
      localLanguage = url.replace(regexPerf, "$2");

      if (url.includes("-beta")) beta = "-beta";

      DetermineEnv(env, market, localLanguage, beta, urlPart);
    }
    // Author
    else if (url.match(regexAuthor)) {
      market = url.replace(regexAuthor, "$1");

      localLanguage = url.replace(regexAuthor, "$2");
      switch (localLanguage) {
        case "en":
          switch (market) {
            case "co":
              localLanguage = "uk";
              break;
            case "ie":
              localLanguage = "";
              break;
          }
          break;
        case "cs":
          localLanguage = "";
          break;
        case "el":
          localLanguage = "";
          break;
        case "lu":
          switch (market) {
            case "fr":
              localLanguage = "";
              break;
          }
          break;
        case "de":
          switch (market) {
            case "at":
              localLanguage = "";
              break;
          }
          break;
        case "da":
          localLanguage = "";
          break;
      }
      if (localLanguage == market) localLanguage = "";

      if (IsMarketInBeta(market)) {
        beta = "-beta";

        var intervaID = setInterval(function () {
          var iframe = document.getElementById("ContentFrame");
          if (iframe == null) return;
          clearInterval(intervaID);

          var urlPart = iframe.contentWindow.document
            .querySelector(
              "#accelerator-page > div.info-banner > div:nth-child(1)"
            )
            .textContent.replace(
              /(?:[\s\S]*)?Your real URL will be : \.\.\. \/home(\S+)?(?:[\s\S]*)?/gm,
              "$1"
            );

          DetermineEnv(env, market, localLanguage, beta, urlPart);
        }, 500);
      } else {
        urlPart = urlPart.replace(
          /(?:.+)?\/content.+\/home(.+)?\.html(?:.+)?/gm,
          "$1"
        );

        DetermineEnv(env, market, localLanguage, beta, urlPart);
      }
    }
  }

  // TODO PROD

  function DetermineEnv(env, market, localLanguage, beta, urlPart) {
    if (market == "") return;

    switch (env) {
      case "live":
        MakeLive(market, localLanguage, urlPart);
        break;
      case "perf":
        MakePerf(market, localLanguage, beta, urlPart);
        break;
      case "author":
        MakeAuthor(market, localLanguage, beta, urlPart);
        break;
    }
  }

  function MakeLive(market, localLanguage, urlPart) {
    var britain = "";
    if (market == "co") {
      britain = localLanguage;
      market += ".";
      localLanguage = "";
    }

    if (localLanguage != "") localLanguage += ".";

    window.open(
      "https://www." + localLanguage + "ford." + market + britain + urlPart,
      "_self"
    );
  }

  function MakePerf(market, localLanguage, beta, urlPart) {
    window.open(
      "https://wwwperf" +
        beta +
        "-" +
        market +
        localLanguage +
        ".brandeulb.ford.com" +
        urlPart,
      "_self"
    );
  }

  function MakeAuthor(market, localLanguage, beta, urlPart) {
    if (market == "co") {
      [market, localLanguage] = [localLanguage, market];
    }

    if (localLanguage == "") localLanguage = market;

    var wrongLink =
      "/content/guxeu" +
      beta +
      "/" +
      market +
      "/" +
      FixLocalLanguage(localLanguage) +
      "_" +
      FixMarket(market) +
      "/home" +
      urlPart;

    if (beta == "-beta") {
      GM_setValue("WrongLink", wrongLink);
      window.open(
        "https://wwwperf.brandeuauthorlb.ford.com/cf#/etc/guxacc/tools/resource-resolver-tool.html",
        "_self"
      );
    } else {
      MakeRealAuthorLink(wrongLink);
    }
  }

  function MakeRealAuthorLink(link) {
    window.open(
      "https://wwwperf.brandeuauthorlb.ford.com/" +
        "editor.html" +
        link +
        ".html",
      "_self"
    );
  }

  // сделать одностороннюю проверку массива
  var m1 = ["gb"];
  var m2 = ["uk"];
  function FixMarket(market) {
    var idx = m1.indexOf(market);
    if (idx >= 0) return m2[idx];

    idx = m2.indexOf(market);
    if (idx >= 0) return m1[idx];

    return market;
  }

  var ll1 = ["ie", "en"];
  var ll2 = ["en", "co"];
  function FixLocalLanguage(localLanguage, market = "") {
    var idx = ll1.indexOf(localLanguage);
    if (idx >= 0) return ll2[idx];

    idx = ll2.indexOf(localLanguage);
    if (idx >= 0) return ll1[idx];

    return localLanguage;
  }

  function ResourceResolverGetOrigPath() {
    var wrongLink = GM_getValue("WrongLink", null);
    if (wrongLink == null) return;

    var intervaID = setInterval(function () {
      var iframe = document.querySelector("#cq-cf-frame");
      if (iframe == null) return;

      var form = iframe.contentWindow.document.querySelector("#aliasPath");
      if (form == null) return;
      clearInterval(intervaID);

      form.value = wrongLink;

      var button = iframe.contentWindow.document.querySelector("#resolvertool");
      button.click();
      var intervaID = setInterval(function () {
        var originalPath =
          iframe.contentWindow.document.querySelector(
            "#originalPath"
          ).textContent;
        if (originalPath.trim().length == 0) return;
        clearInterval(intervaID);

        MakeRealAuthorLink(originalPath);
      }, 500);
    }, 500);
  }
})();
