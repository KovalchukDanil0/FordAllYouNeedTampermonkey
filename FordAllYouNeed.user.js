// ==UserScript==
// @name         Ford All You Need
//
// @description  try to take over the ford!
//
// @author       Gomofob
//
// @version      0.7.5
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
// @match        https://*.brandeuauthorlb.ford.com/miscadmin
// @match        https://*.brandeuauthorlb.ford.com/etc/workflow/packages/ESM/*
// @match        https://*.brandeuauthorlb.ford.com/etc/guxacc/tools/resource-resolver-tool.html
// @match        https://*.brandeuauthorlb.ford.com/etc/guxfoe/tools/find-replace-links.html
//
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// ==/UserScript==

const gmc = new GM_config({
  id: "MyConfig",
  title: "Script Settings",
  fields: {
    openInNewTab: {
      label: "Open in new tab",
      type: "checkbox",
      default: false,
    },
    fixFindReplace: {
      label: "Fix Find&Replace",
      type: "checkbox",
      default: false,
    },
    catErrors: {
      label: "Cat Errors",
      type: "checkbox",
      default: false,
    },
  },
  events: {
    init: function () {},
    save: function () {
      gmc.close();
    },
  },
});

let onInit = (config) =>
  new Promise((resolve) => {
    let isInit = () =>
      setTimeout(() => (config.isInit ? resolve() : isInit()), 0);
    isInit();
  });

let init = onInit(gmc);

/*example promise
  init.then(() => {
    let val = gmc.get('val_1');
  });*/

const menuCommandNames = {
  toLive: {
    command: null,
    name: "TO LIVE",
  },
  toPerf: {
    command: null,
    name: "TO PERF",
  },
  toProd: {
    command: null,
    name: "TO PROD",
  },
  toAuthor: {
    command: null,
    name: "TO AUTHOR",
  },
  toAuthorUI: {
    command: null,
    name: "TO ANOTHER UI",
  },
  openPropertiesTouchUI: {
    command: null,
    name: "OPEN PROPERTIES TOUCH UI",
  },
  showAltTexts: {
    command: null,
    name: "SHOW ALT TEXTS",
  },
  highlightHeadings: {
    command: null,
    name: "HIGHLIGHT HEADINGS",
  },
  createWF: {
    command: null,
    name: "CREATE WF",
  },
  openConfig: {
    command: null,
    name: "OPEN CONFIG (WIP)",
  },
};

AddMenus();
function AddMenus(idxChange = null, textToChange = null) {
  if (idxChange != null || textToChange != null) {
    RemoveMenus();
    menuCommandNames[idxChange].name = textToChange;
  }

  if (AEM.ifLive || AEM.ifPerf || AEM.ifProd || AEM.ifAuthor) {
    if (!AEM.ifLive) {
      menuCommandNames["toLive"].command = GM_registerMenuCommand(
        menuCommandNames["toLive"].name,
        () => ToEnvironment("live")
      );
    }
    if (!AEM.ifPerf) {
      menuCommandNames["toPerf"].command = GM_registerMenuCommand(
        menuCommandNames["toPerf"].name,
        () => ToEnvironment("perf")
      );
    }
    if (!AEM.ifProd) {
      menuCommandNames["toProd"].command = GM_registerMenuCommand(
        menuCommandNames["toProd"].name,
        () => ToEnvironment("prod")
      );
    }
    if (!AEM.ifAuthor) {
      menuCommandNames["toAuthor"].command = GM_registerMenuCommand(
        menuCommandNames["toAuthor"].name,
        () => ToEnvironment("author")
      );
    } else {
      menuCommandNames["toAuthorUI"].command = GM_registerMenuCommand(
        menuCommandNames["toAuthorUI"].name,
        () =>
          function () {
            init.then(() => {
              AEM.changeUI(url, gmc.get("openInNewTab"));
            });
          }
      );
      menuCommandNames["openPropertiesTouchUI"].command =
        GM_registerMenuCommand(
          menuCommandNames["openPropertiesTouchUI"].name,
          () => AEM.openPropertiesTouchUI()
        );
    }

    menuCommandNames["showAltTexts"].command = GM_registerMenuCommand(
      menuCommandNames["showAltTexts"].name,
      () => ShowAltTexts()
    );
    menuCommandNames["highlightHeadings"].command = GM_registerMenuCommand(
      menuCommandNames["highlightHeadings"].name,
      () => HighlightHeading()
    );
  }

  if (JIRA.ifJira) {
    menuCommandNames["createWF"].command = GM_registerMenuCommand(
      menuCommandNames["createWF"].name,
      () => CreateWFButton()
    );
  }

  menuCommandNames["openConfig"].command = GM_registerMenuCommand(
    menuCommandNames["openConfig"].name,
    () => gmc.open()
  );
}

function RemoveMenus() {
  for (let menu in menuCommandNames) {
    GM_unregisterMenuCommand(menuCommandNames[menu].command);
  }
}

(function DetermineEnv() {
  if (AEM.ifWCMWorkflows) {
    AEM.createWF(GMGetADeleteValue("WFTitle"), GMGetADeleteValue("WFName"));
  } else if (AEM.ifWorkflow) {
    WorkflowFixes();
  } else if (JIRA.ifJira) {
    WFButton();
  } else if (AEM.ifResourceResolver) {
    ResourceResolverGetOrigPath();
  } else if (AEM.ifFindAndReplace) {
    FindAndReplaceFix();
  } else if (AEM.ifAuthor) {
    CatErrors();
  }
})();

const className = "highlight-heading-ext";
const headings = {
  h1: {
    elements: [],
    bg: "yellow",
    color: "#000",
    count: 0,
  },
  h2: {
    elements: [],
    bg: "orange",
    color: "#000",
    count: 0,
  },
  h3: {
    elements: [],
    bg: "blue",
    color: "#fff",
    count: 0,
  },
  h4: {
    elements: [],
    bg: "purple",
    color: "#fff",
    count: 0,
  },
  h5: {
    elements: [],
    bg: "cyan",
    color: "#000",
    count: 0,
  },
  h6: {
    elements: [],
    bg: "black",
    color: "#fff",
    count: 0,
  },
};
const keyContainerId = "hheContainer";
const keyId = "hheKey";
const styleTagId = "hheStyleTag";
const r = (node) => node && node.remove();
var headingsHighlighted = false;
function HighlightHeading() {
  var HHMenuText;
  if (!headingsHighlighted) {
    headingsHighlighted = true;
    HHMenuText = "UNHIGHLIGHT HEADINGS";
    init();
  } else {
    headingsHighlighted = false;
    HHMenuText = "HIGHLIGHT HEADINGS";
    resetDOM();
  }

  AddMenus("highlightHeadings", HHMenuText);

  function init() {
    document.body.classList.add(className);
    initialiseHeadings();
    appendKeyToDOM();
    insertBadgeStyles();
  }

  function initialiseHeadings() {
    for (let h in headings) {
      headings[h].elements = [...document.body.querySelectorAll(h)];
      headings[h].count = headings[h].elements.length;
    }
  }

  function appendKeyToDOM() {
    const container = document.createElement("div");
    container.id = keyContainerId;
    container.innerHTML = `<div id="${keyId}">${createKey()}</div>`;
    document.body.appendChild(container);
  }

  function insertBadgeStyles() {
    document.head.appendChild(getStyles());
  }

  function getHeadingClassNames() {
    return Object.getOwnPropertyNames(headings).reduce((prev, curr) => {
      return (
        prev +
        `.${className} ${curr} { 
          outline: 3px solid ${headings[curr].bg} !important; 
       }`
      );
    }, "");
  }

  function getStyles() {
    const styleEl = document.createElement("style");
    styleEl.id = styleTagId;
    styleEl.innerHTML = `
    #${keyId} {
      background: #fff;
      border-radius: 4px;
      border: 1px solid #ccc;
      min-height: 16px;
      padding: 6px;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 999999;
    }

    #${keyId} p {
        font-size: 20px;
        margin: 0;
        padding: 6px;
    }

    #${keyId}:hover {
      /** If you want to see something behind it **/
      opacity: 0.1;
    }

    ${getHeadingClassNames()}
  `;
    return styleEl;
  }

  function createKey() {
    return Object.getOwnPropertyNames(headings)
      .map(
        (h) =>
          `<p style="background-color: ${headings[h].bg}; color: ${headings[h].color}">Heading : ${h}, count: ${headings[h].count}</p>`
      )
      .join("");
  }

  function hasExecuted() {
    const styles = document.querySelector(`#${styleTagId}`);
    const key = document.querySelector(`#${keyId}`);
    return Boolean(styles || key);
  }

  function resetDOM() {
    r(document.querySelector(`#${keyContainerId}`));
    r(document.querySelector(`#${styleTagId}`));
    document.body.classList.remove(className);
  }
}

// not forking after second validation
var findRepalceFixed = false;
function FindAndReplaceFix() {
  init.then(() => {
    if (!gmc.get("fixFindReplace")) return;

    waitForElm(
      "#cq-gen4 > div > div > div.find-replace-links.ng-scope > div.content.first > div.root-path-selection > button:nth-child(4)"
    ).then((validateButton) => {
      validateButton.addEventListener("click", function () {
        if (findRepalceFixed) return;

        waitForElm(".link-to-input").then(() => {
          const regexRemoveEndLink = /(.+?)(\.html(?:.+)?)?/gm;
          findRepalceFixed = true;

          var inputFields = document.querySelectorAll(".link-to-input");
          var nonSimilarElements = [];
          inputFields.forEach((element) => {
            var linkWithoutHtml = element.value.replace(
              regexRemoveEndLink,
              "$1"
            );

            if (!nonSimilarElements.includes(linkWithoutHtml)) {
              nonSimilarElements.push(linkWithoutHtml);

              var similarElements = [];

              var linkOnlyHtml = element.value.replace(
                regexRemoveEndLink,
                "$2"
              );

              inputFields.forEach((element2) => {
                if (
                  linkWithoutHtml ==
                  element2.value.replace(regexRemoveEndLink, "$1")
                ) {
                  similarElements.push(element2);
                }
              });

              element.addEventListener("change", function () {
                var clearLink = element.value.replace(regexRemoveEndLink, "$1");

                similarElements.forEach((similarElm) => {
                  similarElm.value =
                    clearLink +
                    similarElm.value.replace(regexRemoveEndLink, "$2");
                });
                element.value = clearLink + linkOnlyHtml;
              });
            } else {
              element.parentElement.style.display = "none";
            }
          });
        });
      });
    });
  });
}

function CatErrors() {
  init.then(() => {
    if (!gmc.get("catErrors")) return;

    var errorText = document.querySelector("body > header > title");
    if (
      errorText != null &&
      errorText.textContent == "AEM Permissions Required"
    ) {
      document.body.innerHTML = "";
      document.body.insertAdjacentHTML(
        "afterbegin",
        '<img style="display: block;-webkit-user-select: none; display: block; margin-left: auto; margin-right: auto; width: 50%;" src="https://http.cat/404">'
      );
    }

    errorText = document.querySelector("body > h1");
    if (errorText != null && errorText.textContent == "Forbidden") {
      document.body.innerHTML = "";
      document.body.insertAdjacentHTML(
        "afterbegin",
        '<img style="display: block;-webkit-user-select: none; display: block; margin-left: auto; margin-right: auto; width: 50%;" src="https://http.cat/403">'
      );
    }
  });
}

var altTextContainerElm;

var altShowed = false;
function ShowAltTexts() {
  var SATMenuText;
  if (!altShowed) {
    const imgElements = document.querySelectorAll("img");

    const noAltText = document.createElement("div");
    noAltText.classList.add("noAltText");
    noAltText.innerHTML = "This image is decoration";

    const altTextContainer = document.createElement("div");
    altTextContainer.classList.add("altTextExist");

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

    altTextContainerElm = document.body.appendChild(altTextContainer);

    SATMenuText = "HIDE ALT TEXTS";
    altShowed = true;
  } else {
    document.querySelectorAll(".noAltText").forEach((element) => {
      element.remove();
    });
    altTextContainerElm.remove();

    SATMenuText = "SHOW ALT TEXTS";
    altShowed = false;
  }

  AddMenus("showAltTexts", SATMenuText);
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

        init.then(() => {
          AEM.determineEnv(
            env,
            market,
            localLanguage,
            beta,
            urlPart,
            gmc.get("openInNewTab")
          );
        });
      });
    } else {
      urlPart = urlPart.replace(
        /(?:.+)?\/content.+\/home(.+)?\.html(?:.+)?/gm,
        "$1"
      );
    }
  }

  if (!isAuthorBeta) {
    init.then(() => {
      AEM.determineEnv(
        env,
        market,
        localLanguage,
        beta,
        urlPart,
        gmc.get("openInNewTab")
      );
    });
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
      var originalPath = AEM.originalPath.replace("-gf3-test", "");
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
