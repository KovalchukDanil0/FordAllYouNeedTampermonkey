// ==UserScript==
// @name         Ford All You Need
// @namespace    http://tampermonkey.net/
// @version      0.6
// @downloadURL  https://github.com/KovalchukDanil0/FordAllYouNeedTampermonkey/raw/main/FordAllYouNeed.user.js
// @updateURL    https://github.com/KovalchukDanil0/FordAllYouNeedTampermonkey/raw/main/FordAllYouNeed.user.js
// @description  try to take over the ford!
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
// @match        https://wwwprod-ie.brandeulb.ford.com/*
// @match        https://wwwprod-fi.brandeulb.ford.com/*
// @match        https://wwwprod-cz.brandeulb.ford.com/*
// @match        https://wwwprod-hu.brandeulb.ford.com/*
// @match        https://wwwprod-gr.brandeulb.ford.com/*
// @match        https://wwwprod-ro.brandeulb.ford.com/*
// @match        https://wwwprod-lu.brandeulb.ford.com/*
// @match        https://wwwprod-ru.brandeulb.ford.com/*
//
// @match        https://wwwprod-befr.brandeulb.ford.com/*
// @match        https://wwwprod-benl.brandeulb.ford.com/*
//
// @match        https://wwwprod-chde.brandeulb.ford.com/*
// @match        https://wwwprod-chfr.brandeulb.ford.com/*
// @match        https://wwwprod-chit.brandeulb.ford.com/*
//
// @match        https://wwwprod-beta-couk.brandeulb.ford.com/*
// @match        https://wwwprod-beta-de.brandeulb.ford.com/*
// @match        https://wwwprod-beta-es.brandeulb.ford.com/*
// @match        https://wwwprod-beta-fr.brandeulb.ford.com/*
// @match        https://wwwprod-beta-nl.brandeulb.ford.com/*
// @match        https://wwwprod-beta-it.brandeulb.ford.com/*
// @match        https://wwwprod-beta-no.brandeulb.ford.com/*
// @match        https://wwwprod-beta-at.brandeulb.ford.com/*
// @match        https://wwwprod-beta-pt.brandeulb.ford.com/*
// @match        https://wwwprod-beta-pl.brandeulb.ford.com/*
// @match        https://wwwprod-beta-dk.brandeulb.ford.com/*
//
// @match        https://wwwperf.brandeuauthorlb.ford.com/*
//
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ford.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function () {
  "use strict";

  const url = window.location.href;

  const regexWorkflow =
    /(?:.+)?wwwperf\.brandeuauthorlb\.ford\.com(?:\/(?:cf#|editor\.html))?\/etc\/workflow\/packages\/ESM\/\w\w(?:\w\w)?\/(.+)\.html(?:.+)?/gm;
  const regexJira = /jira\.uhub\.biz\/browse\//gm;
  const regexWCMWorkflows =
    /wwwperf\.brandeuauthorlb\.ford\.com\/miscadmin#\/etc\/workflow\/packages\/ESM\//gm;
  const regexResourceResolver =
    /wwwperf\.brandeuauthorlb\.ford\.com(\/(?:cf#|editor\.html))?\/etc\/guxacc\/tools\/resource\-resolver\-tool/gm;

  const regexLive =
    /(?:.+)?(?:secure|www)(?:\.(\w\w))?\.ford\.(\w\w)(?:\.(\w\w))?(?:.+)?/gm;
  const regexPerf =
    /(?:.+)?www(perf|prod)(?:-beta)?-(\w\w)(\w\w)?\.brandeulb\.ford\.com(?:.+)?/gm;
  const regexAuthor =
    /(?:.+)?wwwperf\.brandeuauthorlb\.ford\.com(?:\/(editor\.html|cf#))?\/content\/guxeu(?:-beta)?\/(\w\w)\/(\w\w)_\w\w\/(?:.+)?/gm;

  const marketsInBeta = [
    "uk",
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
    var ifNotPerf = !(url.replace(regexPerf, "$1") == "perf");
    var ifNotProd = !(url.replace(regexPerf, "$1") == "prod");
    var ifNotAuthor = !url.match(regexAuthor);

    if (ifNotLive && ifNotPerf && ifNotProd && ifNotAuthor) return;

    if (ifNotLive) {
      GM.registerMenuCommand("TO LIVE", () => ToEnvironment("live"));
    }
    if (ifNotPerf) {
      GM.registerMenuCommand("TO PERF", () => ToEnvironment("perf"));
    }
    if (ifNotProd) {
      GM.registerMenuCommand("TO PROD", () => ToEnvironment("prod"));
    }
    if (ifNotAuthor) {
      GM.registerMenuCommand("TO AUTHOR", () => ToEnvironment("author"));
    } else {
      GM.registerMenuCommand("TO ANOTHER UI", () => ChangeUI());
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

  function ChangeUI() {
    const regexChangeUI =
      /(.+)?(wwwperf\.brandeuauthorlb\.ford\.com)(?:\/)?(editor\.html|cf#)?(\/content)(.+)?/gm;

    var authorUI = url.replace(regexChangeUI, "$3");
    var newUrl;

    if (authorUI == "editor.html") {
      newUrl = url.replace(regexChangeUI, "$1$2/cf#$4$5");
    } else {
      newUrl = url.replace(regexChangeUI, "$1$2/editor.html$4$5");
    }

    window.open(newUrl, "_self");
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
    const regexRemoveSpaces = /^\s+|\s+$|\s+(?=\s)/gm;

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
    window.open(
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
      case "Ford of Belgium":
        fullPath = "BE";
        switch (localLanguage) {
          case "Dutch":
            fullPath += "/" + fullPath + "NL";
            break;
          case "French":
            fullPath += "/" + fullPath + "FR";
            break;
        }
        break;
      case "Ford of Switzerland":
        fullPath = "CH";
        switch (localLanguage) {
          case "German":
            fullPath += "/" + fullPath + "DE";
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
      case "Ford of Finland":
        fullPath = "FIFI";
        break;
      case "Ford of Spain":
        fullPath = "ESES";
        break;
      case "Ford of Britain":
        fullPath = "ENGB";
        break;
      case "Ford of Germany":
        fullPath = "DEDE";
        break;
      case "Ford of Austria":
        fullPath = "ATDE";
        break;
      case "Ford of Luxembourg":
        fullPath = "LULU";
        break;
    }

    return fullPath;
  }

  function WorkflowFixes() {
    var intervaID = setInterval(function () {
      var iframe = document.querySelector("#cq-cf-frame");
      if (iframe == null) return;

      var form = iframe.contentWindow.document.querySelector(
        "#workflow-title-input"
      );
      if (form == null) return;
      clearInterval(intervaID);

      var elements = iframe.contentWindow.document.querySelectorAll(
        ".content-conf > .configSection > div a"
      );
      for (let index = 0; index < elements.length; index++) {
        elements[index].href = AddBetaToLink(elements[index].href);
      }

      var realButton = iframe.contentWindow.document.querySelector(
        "#start-request-workflow"
      );

      var cancelWF = realButton.insertAdjacentHTML(
        "afterend",
        '<button type="button" id="fake-button-cancel-wf">Cancel WF</button>'
      );

      iframe.contentWindow.document
        .querySelector("#fake-button-cancel-wf")
        .addEventListener("click", function () {
          alert("WIP");
        });

      var createWF = realButton.insertAdjacentHTML(
        "afterend",
        '<button type="button" id="fake-button-create-wf">Auto Start WF</button>&nbsp;'
      );

      realButton.style.display = "none";

      iframe.contentWindow.document
        .querySelector("#fake-button-create-wf")
        .addEventListener("click", function () {
          var WFID = url.replace(regexWorkflow, "$1");
          form.value = WFID;
          realButton.click();
        });
    }, 500);
  }

  function AddBetaToLink(link) {
    const regexDetermineBeta =
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
    var beta = "";

    // Live
    if (url.match(regexLive)) {
      if (url.match(/www\.ford\.\w\w\.\w\w/gm)) {
        market = url.replace(regexLive, "$3");
        localLanguage = url.replace(regexLive, "$2");
      } else {
        market = url.replace(regexLive, "$2");
        localLanguage = url.replace(regexLive, "$1");
      }

      if (IsMarketInBeta(market)) {
        beta = "-beta";
      }

      DetermineEnv(env, market, localLanguage, beta, urlPart);
    }
    // Perf & Prod
    // live isn't grabbing market correctly in UK
    else if (url.match(regexPerf)) {
      if (url.match(/www(perf|prod)-couk\.brandeulb\.ford\.com/gm)) {
        market = url.replace(regexPerf, "$3");
        localLanguage = url.replace(regexPerf, "$4");
      } else {
        market = url.replace(regexPerf, "$2");
        localLanguage = url.replace(regexPerf, "$3");
      }

      if (url.includes("-beta")) beta = "-beta";

      DetermineEnv(env, market, localLanguage, beta, urlPart);
    }
    // Author
    else if (url.match(regexAuthor)) {
      market = FixMarket(url.replace(regexAuthor, "$2"));

      localLanguage = FixLocalLanguage(
        url.replace(regexAuthor, "$3"),
        market,
        false
      );

      if (IsMarketInBeta(market)) {
        beta = "-beta";

        var intervaID = setInterval(function () {
          var iframe = document.getElementById("ContentFrame");

          var realUrl = iframe.contentWindow.document.querySelector(
            "#accelerator-page > div.info-banner > div:nth-child(1)"
          );
          if (realUrl == null) return;
          clearInterval(intervaID);

          var urlPart = realUrl.textContent.replace(
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
      case "prod":
        MakePerf(env, market, localLanguage, beta, urlPart);
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

  function MakePerf(env, market, localLanguage, beta, urlPart) {
    if (market == "uk") {
      [localLanguage, market] = [market, localLanguage];
    }

    window.open(
      "https://www" +
        env +
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
    var wrongLink =
      "/content/guxeu" +
      beta +
      "/" +
      market +
      "/" +
      FixLocalLanguage(localLanguage, market, true) +
      "_" +
      FixMarket(market) +
      "/home" +
      urlPart;

    if (beta == "-beta" && urlPart != "") {
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

  const marketsFixAuthor = ["co"];
  const marketsFixPerf = ["uk"];
  function FixMarket(market) {
    var idx = marketsFixAuthor.indexOf(market);
    if (idx >= 0) {
      return marketsFixPerf[idx];
    }

    idx = marketsFixPerf.indexOf(market);
    if (idx >= 0) {
      return marketsFixAuthor[idx];
    }

    return market;
  }

  const localLanguageFixAuthor = ["cz", "gr"];
  const localLanguageFixPerf = ["cs", "el"];
  function FixLocalLanguage(localLanguage, market, toAuthor) {
    var idx;
    if (toAuthor) {
      if (localLanguage == "") localLanguage = market;

      idx = localLanguageFixAuthor.indexOf(localLanguage);
      if (idx >= 0) {
        localLanguage = localLanguageFixPerf[idx];
      } else {
        switch (market) {
          case "lu":
            localLanguage = "fr";
            break;
          case "uk":
            localLanguage = "en";
            break;
          case "ie":
            localLanguage = "en";
            break;
          case "at":
            localLanguage = "de";
            break;
        }
      }
    } else {
      idx = localLanguageFixPerf.indexOf(localLanguage);
      if (idx >= 0) {
        localLanguage = localLanguageFixAuthor[idx];
      } else {
        switch (market) {
          case "lu":
            localLanguage = "";
            break;
          case "co": //uk
            localLanguage = "uk";
            break;
          case "ie":
            localLanguage = "";
            break;
          case "at":
            localLanguage = "";
            break;
        }
      }

      if (localLanguage == market) localLanguage = "";
    }

    return localLanguage;
  }

  function ResourceResolverGetOrigPath() {
    var wrongLink = GM_getValue("WrongLink", null);
    if (wrongLink == null) return;
    GM_setValue("WrongLink", null);

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
