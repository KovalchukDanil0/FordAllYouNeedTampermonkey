// ==UserScript==
// @name         Ford All You Need
//
// @description  try to take over the ford!
//
// @author       Gomofob
//
// @version      0.6
//
// @namespace    https://github.com/KovalchukDanil0/FordAllYouNeedTampermonkey
//
// @downloadURL  https://github.com/KovalchukDanil0/FordAllYouNeedTampermonkey/raw/main/FordAllYouNeed.user.js
// @updateURL    https://github.com/KovalchukDanil0/FordAllYouNeedTampermonkey/raw/main/FordAllYouNeed.user.js
//
// @require      https://raw.githubusercontent.com/KovalchukDanil0/FordAllYouNeedTampermonkey/main/AEMAPI.js
// @require      https://raw.githubusercontent.com/KovalchukDanil0/FordAllYouNeedTampermonkey/main/JIRAAPI.js
// @require      https://code.jquery.com/jquery-3.7.0.min.js
//
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ford.com
//
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
// @match        https://*.brandeulb.ford.com/*
//
// @match        https://wwwperf.brandeuauthorlb.ford.com/*
//
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function () {
  "use strict";

  const url = window.location.href;

  var market = "";
  var localLanguage = "";

  (function AddMenus() {
    if (AEM.ifLive || AEM.ifPerf || AEM.ifProd || AEM.ifAuthor) {
      if (!AEM.ifLive) {
        GM.registerMenuCommand("TO LIVE", () => ToEnvironment("live"));
      }
      if (!AEM.ifPerf) {
        GM.registerMenuCommand("TO PERF", () => ToEnvironment("perf"));
      }
      if (!AEM.ifProd) {
        GM.registerMenuCommand("TO PROD", () => ToEnvironment("prod"));
      }
      if (!AEM.ifAuthor) {
        GM.registerMenuCommand("TO AUTHOR", () => ToEnvironment("author"));
      } else {
        GM.registerMenuCommand("TO ANOTHER UI", () => AEM.changeUI());
      }

      GM.registerMenuCommand("OPEN PROPERTIES TOUCH UI", () =>
        AEM.openPropertiesTouchUI()
      );
    }
  })();

  if (AEM.ifWCMWorkflows) {
    AEM.createWF(GMSetADeleteValue("WFTitle"), GMSetADeleteValue("WFName"));
  } else if (AEM.ifWorkflow) {
    WorkflowFixes();
  } else if (AEM.ifJira) {
    WFButton();
  } else if (AEM.ifResourceResolver) {
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

  function TextToWFPath(market, localLanguage) {
    var fullPath;
    switch (market) {
      default:
        fullPath = WFPAthFromTitle(GM_getValue("WFTitle", null));
        break;
      case "Ford of Belgium":
        fullPath = "BE";
        switch (localLanguage) {
          case "Dutch":
            fullPath += "/" + fullPath + "NL";
            break;
          case "French":
            fullPath += "/" + fullPath + "FR";
            break;
          default:
            fullPath = WFPAthFromTitle(GM_getValue("WFTitle", null));
            break;
        }
        break;
      case "Ford of Switzerland":
        fullPath = "CH";
        switch (localLanguage) {
          case "German":
            fullPath += "/" + fullPath + "DE";
            break;
          default:
            fullPath = WFPAthFromTitle(GM_getValue("WFTitle", null));
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
      case "Ford of Denmark":
        fullPath = "DA_DK";
        break;
      case "Ford of France":
        fullPath = "FRFR";
        break;
    }

    return fullPath;
  }

  function WFPAthFromTitle(title) {
    const regexWFTitle = /^(\w\w)(\w\w)?(?:.+)?/gm;

    market = title.replace(regexWFTitle, "$1");
    localLanguage = title.replace(regexWFTitle, "$2");
    return market + "/" + market + localLanguage;
  }

  function WorkflowFixes() {
    var iframe;
    var intervaID = setInterval(function () {
      iframe = document.querySelector("#cq-cf-frame");
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
        elements[index].href = AEM.addBetaToLink(elements[index].href);
      }

      var createWF = iframe.contentWindow.document.querySelector(
        "#start-request-workflow"
      );
      var WFID = url.replace(AEM.regexWorkflow, "$1");
      form.value = WFID;

      var cancelWF = realButton.insertAdjacentHTML(
        "afterend",
        '<button type="button" id="fake-button-cancel-wf">Cancel WF</button>'
      );

      iframe.contentWindow.document
        .querySelector("#fake-button-cancel-wf")
        .addEventListener("click", function () {
          alert("WIP");
        });
    }, 500);
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
    if (url.match(AEM.regexLive)) {
      if (url.match(/www\.ford\.\w\w\.\w\w/gm)) {
        market = url.replace(AEM.regexLive, "$3");
        localLanguage = url.replace(AEM.regexLive, "$2");
      } else {
        market = url.replace(AEM.regexLive, "$2");
        localLanguage = url.replace(AEM.regexLive, "$1");
      }

      if (AEM.isMarketInBeta(market)) {
        beta = "-beta";
      }

      DetermineEnv(env, market, localLanguage, beta, urlPart);
    }
    // Perf & Prod
    else if (url.match(AEM.regexPerf)) {
      if (url.match(/www(perf|prod)-beta-couk\.brandeulb\.ford\.com/gm)) {
        market = url.replace(AEM.regexPerf, "$3");
        localLanguage = url.replace(AEM.regexPerf, "$2");
      } else {
        market = url.replace(AEM.regexPerf, "$2");
        localLanguage = url.replace(AEM.regexPerf, "$3");
      }

      if (url.includes("-beta")) beta = "-beta";

      DetermineEnv(env, market, localLanguage, beta, urlPart);
    }
    // Author
    else if (url.match(AEM.regexAuthor)) {
      market = FixMarket(url.replace(AEM.regexAuthor, "$3"));

      localLanguage = FixLocalLanguage(
        url.replace(AEM.regexAuthor, "$4"),
        market,
        false
      );

      if (AEM.isMarketInBeta(market)) {
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
    if (market == "uk" || market == "gb") {
      [localLanguage, market] = [market, localLanguage];
    }

    alert(market);
    alert(localLanguage);

    window.open(
      "https://www" +
        env +
        beta +
        "-" +
        FixMarket(market) +
        FixLocalLanguage(localLanguage) +
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

  const marketsFixAuthor = ["gb"];
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

  function FixLocalLanguage(localLanguage, market, toAuthor) {
    if (toAuthor) {
      if (localLanguage == "") localLanguage = market;

      switch (market) {
        case "uk":
        case "ie":
          localLanguage = "en";
          break;
        case "lu":
          localLanguage = "fr";
          break;
        case "at":
          localLanguage = "de";
          break;
        case "dk":
          localLanguage = "da";
          break;
        case "cs":
          localLanguage = "cz";
          break;
        case "el":
          localLanguage = "gr";
          break;
      }
    } else {
      switch (market) {
        case "lu":
        case "ie":
        case "at":
        case "dk":
          localLanguage = "";
          break;
        case "en":
          localLanguage = "uk";
          break;
        case "cz":
          localLanguage = "cs";
          break;
        case "gr":
          localLanguage = "el";
          break;
      }

      if (localLanguage == market) localLanguage = "";
    }

    return localLanguage;
  }

  function ResourceResolverGetOrigPath() {
    var wrongLink = GMSetADeleteValue("WrongLink");
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

  function GMSetADeleteValue(value) {
    let val = GM_getValue(value, null);
    if (val != null) GM_setValue(value, null);
    return val;
  }
})();
