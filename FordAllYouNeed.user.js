// ==UserScript==
// @name         Ford All You Need
//
// @description  try to take over the ford!
//
// @author       Gomofob
//
// @version      0.7
//
// @namespace    https://github.com/KovalchukDanil0/FordAllYouNeedTampermonkey
//
// @downloadURL  https://github.com/KovalchukDanil0/FordAllYouNeedTampermonkey/raw/main/FordAllYouNeed.user.js
// @updateURL    https://github.com/KovalchukDanil0/FordAllYouNeedTampermonkey/raw/main/FordAllYouNeed.user.js
//
// @require      https://raw.githubusercontent.com/KovalchukDanil0/FordAllYouNeedTampermonkey/main/AEMAPI.js
// @require      https://raw.githubusercontent.com/KovalchukDanil0/FordAllYouNeedTampermonkey/main/JIRAAPI.js
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
// @match        https://*.brandeuauthorlb.ford.com/content/*
// @match        https://*.brandeuauthorlb.ford.com/etc/guxacc/tools/resource-resolver-tool.html
// @match        https://*.brandeuauthorlb.ford.com/miscadmin
// @match        https://*.brandeuauthorlb.ford.com/etc/workflow/packages/ESM/*
//
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// ==/UserScript==

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
      GM.registerMenuCommand("OPEN PROPERTIES TOUCH UI", () =>
        AEM.openPropertiesTouchUI()
      );
    }
  }

  if (JIRA.ifJira) {
    GM.registerMenuCommand("CREATE WF", () => CreateWFButton());
  }
})();

(function DetermineEnv() {
  if (AEM.ifWCMWorkflows) {
    AEM.createWF(GMGetADeleteValue("WFTitle"), GMGetADeleteValue("WFName"));
  } else if (AEM.ifWorkflow) {
    WorkflowFixes();
  } else if (JIRA.ifJira) {
    WFButton();
  } else if (AEM.ifResourceResolver) {
    ResourceResolverGetOrigPath();
  } /* else if (AEM.ifAuthor) {
    if (document.querySelector("body > h1").textContent == "Forbidden") {
      alert("broken");
    }
  }*/
})();

function WorkflowFixes() {
  AEM.waitForWorkflowTitleInput().then((form) => {
    form.value = AEM.WFID;

    AEM.getLinksInWF().forEach(
      (data) => (data.href = data.href.addBetaToLink())
    );
  });
}

function WFButton() {
  var buttonsContainer = JIRA.buttonsContainer;
  var createWFButton = buttonsContainer.appendChild(JIRA.createWFButton);

  createWFButton.addEventListener("click", CreateWFButton);
}

function CreateWFButton() {
  market = JIRA.ticketMarket;
  localLanguage = JIRA.ticketLocalLanguage;

  GM_setValue("WFTitle", JIRA.ticketTitle);
  GM_setValue("WFName", JIRA.ticketNumber);

  var WFPath = AEM.textToWFPath(market, localLanguage);
  window.open(
    "https://wwwperf.brandeuauthorlb.ford.com/miscadmin#/etc/workflow/packages/ESM/" +
      WFPath
  );
}

function ToEnvironment(env) {
  var isAuthorBeta = false;

  // Live
  if (AEM.ifLive) {
    if (url.match(/www\.ford\.\w\w\.\w\w/gm)) {
      market = url.replace(regexLive, "$3");
      localLanguage = url.replace(regexLive, "$2");
    } else {
      market = url.replace(regexLive, "$2");
      localLanguage = url.replace(regexLive, "$1");
    }

    if (AEM.isMarketInBeta(market)) {
      beta = "-beta";
    }
  }
  // Perf & Prod
  else if (AEM.ifPerfProd) {
    if (url.match(/www(?:perf|prod)(?:-beta)?-couk\.brandeulb\.ford\.com/gm)) {
      market = url.replace(regexPerfProd, "$3");
      localLanguage = url.replace(regexPerfProd, "$2");
    } else {
      market = url.replace(regexPerfProd, "$2");
      localLanguage = url.replace(regexPerfProd, "$3");
    }

    if (AEM.isMarketInBeta(market)) beta = "-beta";
  }
  // Author
  else if (AEM.ifAuthor) {
    market = url.replace(regexAuthor, "$2");

    localLanguage = AEM.fixLocalLanguage(
      url.replace(regexAuthor, "$3"),
      market,
      false
    );

    if (AEM.isMarketInBeta(market)) {
      beta = "-beta";

      isAuthorBeta = true;
      AEM.waitRealAuthorPath().then((realUrl) => {
        urlPart = realUrl.textContent.replace(
          /(?:[\s\S]*)?Your real URL will be : \.\.\. \/home(\S+)?(?:[\s\S]*)?/gm,
          "$1"
        );

        AEM.determineEnv(env, market, localLanguage, beta, urlPart);
      });
    } else {
      urlPart = urlPart.replace(
        /(?:.+)?\/content.+\/home(.+)?\.html(?:.+)?/gm,
        "$1"
      );
    }
  }

  if (!isAuthorBeta) {
    AEM.determineEnv(env, market, localLanguage, beta, urlPart);
  }
}

function ResourceResolverGetOrigPath() {
  var wrongLink = GMGetADeleteValue("WrongLink");
  if (wrongLink == "")
    throw new Error("Link is not defined, resource resolver opened manually");

  AEM.waitForAliasPath().then((form) => {
    form.value = wrongLink;

    var button = AEM.resolverToolButton;
    button.click();

    var intervaID = setInterval(function () {
      var originalPath = AEM.originalPath;
      if (originalPath.trim().length == 0) return;
      clearInterval(intervaID);

      AEM.makeRealAuthorLink(originalPath);
    }, 500);
  });
}

function GMGetADeleteValue(value) {
  var val = GM_getValue(value, "");
  if (val != "") GM_setValue(value, "");
  return val;
}
