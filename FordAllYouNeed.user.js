// ==UserScript==
// @name         Ford All You Need
//
// @description  try to take over the ford!
//
// @author       Gomofob
//
// @version      0.6.5
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
    }

    GM.registerMenuCommand("OPEN PROPERTIES TOUCH UI", () =>
      AEM.openPropertiesTouchUI()
    );
  }
})();

(function DetermineEnv() {
  if (AEM.ifWCMWorkflows) {
    AEM.createWF(GMSetADeleteValue("WFTitle"), GMSetADeleteValue("WFName"));
  } else if (AEM.ifWorkflow) {
    WorkflowFixes();
  } else if (AEM.ifJira) {
    WFButton();
  } else if (AEM.ifResourceResolver) {
    ResourceResolverGetOrigPath();
  } /* else if (AEM.ifAuthor) {
    if (document.querySelector("body > h1").textContent == "Forbidden") {
      alert("broken");
    }
  }*/
})();

function WFButton() {
  var buttonsContainer = document.querySelector("#opsbar-edit-issue_container");

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

function WorkflowFixes() {
  AEM.waitForElm("#workflow-title-input").then((form) => {
    form.value = AEM.WFID;

    AEM.getLinksInWF().forEach(
      (data) => (data.href = data.href.addBetaToLink())
    );
  });
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

    if (AEM.isMarketInBeta(market)) {
      beta = "-beta";
    }

    DetermineEnv(env, market, localLanguage, beta, urlPart);
  }
  // Perf & Prod
  else if (url.match(regexPerf)) {
    if (url.match(/www(perf|prod)-beta-couk\.brandeulb\.ford\.com/gm)) {
      market = url.replace(regexPerf, "$3");
      localLanguage = url.replace(regexPerf, "$2");
    } else {
      market = url.replace(regexPerf, "$2");
      localLanguage = url.replace(regexPerf, "$3");
    }

    if (url.includes("-beta")) beta = "-beta";

    DetermineEnv(env, market, localLanguage, beta, urlPart);
  }
  // Author
  else if (url.match(regexAuthor)) {
    market = AEM.FixMarket(url.replace(regexAuthor, "$2"));

    localLanguage = AEM.FixLocalLanguage(
      url.replace(regexAuthor, "$3"),
      market,
      false
    );

    if (AEM.isMarketInBeta(market)) {
      beta = "-beta";

      AEM.waitForElm(
        "#accelerator-page > div.info-banner > div:nth-child(1)"
      ).then((realUrl) => {
        urlPart = realUrl.textContent.replace(
          /(?:[\s\S]*)?Your real URL will be : \.\.\. \/home(\S+)?(?:[\s\S]*)?/gm,
          "$1"
        );

        DetermineEnv(env, market, localLanguage, beta, urlPart);
      });
    } else {
      urlPart = urlPart.replace(
        /(?:.+)?\/content.+\/home(.+)?\.html(?:.+)?/gm,
        "$1"
      );

      DetermineEnv(env, market, localLanguage, beta, urlPart);
    }
  }
}

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
    "_parent"
  );
}

function MakePerf(env, market, localLanguage, beta, urlPart) {
  if (market == "uk" || market == "gb") {
    [localLanguage, market] = [market, localLanguage];
  }

  window.open(
    "https://www" +
      env +
      beta +
      "-" +
      AEM.FixMarket(market) +
      AEM.FixLocalLanguage(localLanguage) +
      ".brandeulb.ford.com" +
      urlPart,
    "_parent"
  );
}

function MakeAuthor(market, localLanguage, beta, urlPart) {
  var wrongLink =
    "/content/guxeu" +
    beta +
    "/" +
    market +
    "/" +
    AEM.FixLocalLanguage(localLanguage, market, true) +
    "_" +
    AEM.FixMarket(market) +
    "/home" +
    urlPart;

  GM_setValue("LinkPart", window.location.search + window.location.hash);

  if (beta == "-beta" && urlPart != "") {
    GM_setValue("WrongLink", wrongLink);
    window.open(
      "https://wwwperf.brandeuauthorlb.ford.com/cf#/etc/guxacc/tools/resource-resolver-tool.html",
      "_parent"
    );
  } else {
    MakeRealAuthorLink(wrongLink);
  }
}

function MakeRealAuthorLink(link) {
  var linkPart = GM_getValue("LinkPart", null);

  window.open(
    "https://wwwperf.brandeuauthorlb.ford.com/" +
      "editor.html" +
      link +
      ".html" +
      linkPart,
    "_parent"
  );
}

function ResourceResolverGetOrigPath() {
  var wrongLink = GMSetADeleteValue("WrongLink");
  if (wrongLink == null) return;

  AEM.waitForElm("#aliasPath").then((form) => {
    form.value = wrongLink;

    var button = document.querySelector("#resolvertool");
    button.click();

    var intervaID = setInterval(function () {
      var originalPath = document.querySelector("#originalPath").textContent;
      if (originalPath.trim().length == 0) return;
      clearInterval(intervaID);

      MakeRealAuthorLink(originalPath);
    }, 500);
  });
}

function GMSetADeleteValue(value) {
  var val = GM_getValue(value, null);
  if (val != null) GM_setValue(value, null);
  return val;
}
