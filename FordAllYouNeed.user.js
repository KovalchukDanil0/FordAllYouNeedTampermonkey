// ==UserScript==
// @name         Ford All You Need
//
// @description  try to take over the ford!
//
// @author       Gomofob
//
// @version      0.7.1
//
// @namespace    https://github.com/KovalchukDanil0/FordAllYouNeedTampermonkey
//
// @downloadURL  https://github.com/KovalchukDanil0/FordAllYouNeedTampermonkey/raw/main/FordAllYouNeed.user.js
// @updateURL    https://github.com/KovalchukDanil0/FordAllYouNeedTampermonkey/raw/main/FordAllYouNeed.user.js
//
// @require      https://code.jquery.com/jquery-3.7.0.min.js
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
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

var gmc;
(function Config() {
  gmc = new GM_config({
    id: "MyConfig", // The id used for this instance of GM_config
    title: "Script Settings", // Panel Title
    fields: {
      // This is the id of the field
      checkbox: {
        label: "Open links in New window",
        type: "checkbox",
        default: true,
      },
    },
    events: {
      init: function () {},
      save: function () {},
    },
  });
})();

(function AddMenus() {
  if (AEM.ifLive || AEM.ifPerf || AEM.ifProd || AEM.ifAuthor) {
    if (!AEM.ifLive) {
      GM_registerMenuCommand("TO LIVE", () => ToEnvironment("live"));
    }
    if (!AEM.ifPerf) {
      GM_registerMenuCommand("TO PERF", () => ToEnvironment("perf"));
    }
    if (!AEM.ifProd) {
      GM_registerMenuCommand("TO PROD", () => ToEnvironment("prod"));
    }
    if (!AEM.ifAuthor) {
      GM_registerMenuCommand("TO AUTHOR", () => ToEnvironment("author"));
    } else {
      GM_registerMenuCommand("TO ANOTHER UI", () => AEM.changeUI(url));
      GM_registerMenuCommand("OPEN PROPERTIES TOUCH UI", () =>
        AEM.openPropertiesTouchUI()
      );
    }

    GM_registerMenuCommand("SHOW ALT TEXTS", () => ShowAltTexts());
  }

  if (JIRA.ifJira) {
    GM_registerMenuCommand("CREATE WF", () => CreateWFButton());
  }

  GM_registerMenuCommand("OPEN CONFIG (WIP)", () => gmc.open());
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
  } else if (AEM.ifAuthor) {
    /*var links = document.getElementsByTagName("a");

    for (var i = 0; i < links.length; i++) {
      if (
        links[i].href.match(
          /((?:.+)?\/content\/guxeu(?:-beta)?\/(?:\w\w|mothersite)\/(?:\w\w)_\w\w\/(?:.+)?)(\.html|\/)/gm
        )
      ) {
        links[i].href = links[i].href.addBetaToLink();
        links[i].href.replace(
          /((?:.+)?\/content\/guxeu(?:-beta)?\/(?:\w\w|mothersite)\/(?:\w\w)_\w\w\/(?:.+)?)(\.html|\/)/gm,
          "$1.html"
        );
      }
    }*/

    var errorText = document.querySelector("body > header > title");
    if (
      errorText != null &&
      errorText.textContent == "AEM Permissions Required"
    ) {
      document.body.innerHTML = "";
      document.body.insertAdjacentHTML(
        "afterbegin",
        '<iframe src="https://http.cat/404" height="600" width="750" title="description"></iframe>' +
          "<style>body{ text-align:center} .divcss{margin:0 auto;width:500px;height:200px; border:1px solid #ccc}</style>"
      );
    }

    errorText = document.querySelector("body > h1");
    if (errorText != null && errorText.textContent == "Forbidden") {
      document.body.innerHTML = "";
      document.body.insertAdjacentHTML(
        "afterbegin",
        '<iframe src="https://http.cat/403" height="600" width="750" title="description"></iframe>' +
          "<style>body{ text-align:center} .divcss{margin:0 auto;width:500px;height:200px; border:1px solid #ccc}</style>"
      );
    }
  }
})();

var altShowed = false;
function ShowAltTexts() {
  if (altShowed == true) return;

  const imgElements = document.querySelectorAll("img");

  const noAltText = document.createElement("div");
  noAltText.classList.add("no-alt-text");
  noAltText.innerHTML = "This image is decoration";

  const altTextContainer = document.createElement("div");

  for (let i = 0; i < imgElements.length; i++) {
    var altText = imgElements[i].title;

    if (altText === "") {
      imgElements[i].after(noAltText.cloneNode(true));
    } else {
      const altTextElm = document.createElement("p");
      altTextElm.textContent = altText;

      altTextContainer.appendChild(altTextElm);
    }
  }

  document.body.appendChild(altTextContainer);

  altShowed = true;
}

function WorkflowFixes() {
  AEM.waitForWorkflowTitleInput().then((form) => {
    form.value = AEM.WFID;

    AEM.getLinksInWF().forEach(
      (data) => (data.href = data.href.addBetaToLink())
    );

    $(
      "#cq-gen7 > div.wrapper-conf > div > div:nth-child(3) > div > div > div:nth-child(2)"
    ).bind("DOMNodeInserted", function () {
      alert("child is appended");
    });
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
