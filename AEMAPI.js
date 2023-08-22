const url =
  window.location != window.parent.location
    ? parent.location.href
    : document.location.href;

var market = "";
var localLanguage = "";

var urlPart =
  window.location.pathname + window.location.search + window.location.hash;
if (urlPart == "/") {
  urlPart = "";
}

var beta = "";

const regexWorkflow =
  /(?:.+)?wwwperf\.brandeuauthorlb\.ford\.com(?:\/(?:editor\.html|cf#))?\/etc\/workflow\/packages\/ESM\/\w\w(?:(?:_)?\w\w)?(?:\/\w\w\w\w)?\/(.+)\.html(?:.+)?/gm;
const regexWCMWorkflows =
  /wwwperf\.brandeuauthorlb\.ford\.com\/miscadmin#\/etc\/workflow\/packages\/ESM\//gm;
const regexInbox = /wwwperf\.brandeuauthorlb\.ford\.com\/inbox/gm;
const regexResourceResolver =
  /wwwperf\.brandeuauthorlb\.ford\.com(?:\/(?:editor\.html|cf#))?\/etc\/guxacc\/tools\/resource\-resolver\-tool/gm;
const regexFindAndReplaceLinks =
  /wwwperf\.brandeuauthorlb\.ford\.com(?:\/(?:editor\.html|cf#))?\/etc\/guxfoe\/tools\/find\-replace\-links/gm;

const regexLive =
  /(?:.+)?(?:secure|www)(?:\.(\w\w))?\.ford\.(\w\w)(?:\.(\w\w))?(?:.+)?/gm;
const regexPerfProd =
  /(?:.+)?www(perf|prod)(?:-beta)?-(\w\w)(\w\w)?\.brandeulb\.ford\.com(?:.+)?/gm;
const regexAuthor =
  /(?:.+)?wwwperf\.brandeu(?:author)?lb\.ford\.com(?:\/(?:editor\.html|cf#))?(\/content\/guxeu(?:-beta)?\/(\w\w|mothersite)\/(\w\w)_\w\w\/(?:.+)?)(?:\.html|\/)(?:.+)?/gm;
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

function waitForElm(selector, timeout = Number.MAX_VALUE) {
  return new Promise((resolve) =>
    setTimeout(function () {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver((mutations) => {
        if (document.querySelector(selector)) {
          resolve(document.querySelector(selector));
          observer.disconnect();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }, timeout)
  );
}

String.prototype.addBetaToLink = function () {
  const regexDetermineBeta = /(.+)?(\/content\/guxeu(?:-beta)?\/(?:.+)?)/gm;
  return this.replace(regexDetermineBeta, "$1/editor.html$2");
};

class AEM {
  /*static number(value) {
    this.value = value;
    this.plus = function (sum) {
      this.value += sum;
      return this;
    };

    this.return = function () {
      return this.value;
    };
    return this;
  }*/

  static get ifWorkflow() {
    return url.match(regexWorkflow);
  }

  static get ifWCMWorkflows() {
    return url.match(regexWCMWorkflows);
  }

  static get ifInbox() {
    return url.match(regexInbox);
  }

  static get ifResourceResolver() {
    return url.match(regexResourceResolver);
  }

  static get ifFindAndReplace() {
    return url.match(regexFindAndReplaceLinks);
  }

  static get ifLive() {
    return url.match(regexLive);
  }

  static get ifPerf() {
    return url.replace(regexPerfProd, "$1") == "perf";
  }

  static get ifProd() {
    return url.replace(regexPerfProd, "$1") == "prod";
  }

  static get ifPerfProd() {
    return url.match(regexPerfProd);
  }

  static get ifAuthor() {
    return url.match(regexAuthor);
  }

  static isMarketInBeta(market) {
    if (marketsInBeta.some((link) => market.includes(link))) return true;
    return false;
  }

  static textToWFPath(market, localLanguage) {
    var fullPath;
    switch (market) {
      default:
        fullPath = this.wfPathFromTitle(GM_getValue("WFTitle", ""));
        break;
      case "Ford of Germany":
        fullPath = "DEDE";
        break;
      case "Ford of Britain":
        fullPath = "ENGB";
        break;
      case "Ford of Spain":
        fullPath = "ESES";
        break;
      case "Ford of France":
        fullPath = "FRFR";
        break;
      case "Ford of Italy":
        fullPath = "ITIT";
        break;
      case "Ford of Netherlands":
        fullPath = "NLNL";
        break;
      case "Ford of Ireland":
        fullPath = "IEIE";
        break;
      case "Ford of Denmark":
        fullPath = "DA_DK";
        break;
      case "Ford of Portugal":
        fullPath = "PTPT";
        break;
      case "Ford of Norway":
        fullPath = "NONO";
        break;
      case "Ford of Finland":
        fullPath = "FIFI";
        break;
      case "Ford of Poland":
        fullPath = "PLPL";
        break;
      case "Ford of Austria":
        fullPath = "ATDE";
        break;
      case "Ford of Czech Republic":
        fullPath = "CSCZ";
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
            fullPath = this.wfPathFromTitle(GM_getValue("WFTitle", ""));
            break;
        }
        break;
      case "Ford of Hungary":
        fullPath = "HUHU";
        break;
      case "Ford of Greece":
        fullPath = "ELGR";
        break;
      case "Ford of Switzerland":
        fullPath = "CH";
        switch (localLanguage) {
          case "German":
            fullPath += "/" + fullPath + "DE";
            break;
          default:
            fullPath = this.wfPathFromTitle(GM_getValue("WFTitle", ""));
            break;
        }
        break;
      case "Ford of Romania":
        fullPath = "RORO";
        break;
      case "Ford of Luxembourg":
        fullPath = "LULU";
        break;
      // FOE
      // FMNY
      // FMNYDE
      // MS
    }

    return fullPath;
  }

  static wfPathFromTitle(title) {
    const regexWFTitle = /^(?:NWP_)?(\w\w)(\w\w)?(?:.+)?/gm;

    market = title.replace(regexWFTitle, "$1");
    localLanguage = title.replace(regexWFTitle, "$2");
    return market + "/" + market + localLanguage;
  }

  static getLinksInWF() {
    return document.querySelectorAll(".content-conf > .configSection > div a");
  }

  static get WFID() {
    return url.replace(regexWorkflow, "$1");
  }

  static createWF(WFTitle, WFName) {
    if (WFTitle == "" || WFName == "")
      throw new Error(
        "WFTitle or WFName are not defined, workflows opened manually"
      );

    waitForElm(
      "#cq-gen75 > div.x-grid3-row.x-grid3-row-first > table > tbody > tr > td.x-grid3-col.x-grid3-cell.x-grid3-td-title > div"
    ).then((firstItemInList) => {
      var button = document.getElementById("cq-gen91");
      button.click();

      waitForElm("#ext-comp-1079").then((form) => {
        form.value = WFTitle;

        form = document.querySelector("#ext-comp-1080");
        form.value = WFName;
      });

      waitForElm("#ext-comp-1076 > div:nth-child(3)").then(
        (promotionButton) => {
          promotionButton.click();
        }
      );
    });
  }

  static changeUI(link, newTab) {
    const regexChangeUI =
      /((?:.+)?wwwperf\.brandeu(?:author)?lb\.ford\.com)((?:\/)?(?:editor\.html|cf#)?\/)(content(?:.+)?)/gm;

    var authorUI = link.replace(regexChangeUI, "$2");
    var newUrl;

    console.log(authorUI);

    if (authorUI == "/editor.html/")
      newUrl = link.replace(regexChangeUI, "$1/cf#/$3");
    else newUrl = link.replace(regexChangeUI, "$1/editor.html/$3");

    window.open(newUrl, newTab ? "_blank" : "_parent");
  }

  static openPropertiesTouchUI() {
    window.open(
      url.replace(
        regexAuthor,
        "https://wwwperf.brandeuauthorlb.ford.com/mnt/overlay/wcm/core/content/sites/properties.html?item=$1"
      )
    );
  }

  static waitForWorkflowTitleInput() {
    return waitForElm("#workflow-title-input");
  }

  static waitForAliasPath() {
    return waitForElm("#aliasPath");
  }

  static waitRealAuthorPath() {
    return waitForElm("#accelerator-page > div.info-banner > div:nth-child(1)");
  }

  static get resolverToolButton() {
    return document.querySelector("#resolvertool");
  }

  static get originalPath() {
    return document.querySelector("#originalPath").textContent;
  }

  static determineEnv(env, market, localLanguage, beta, urlPart, newTab) {
    if (market == "") throw new Error("Market is not set!");

    switch (env) {
      default:
        throw new Error("No such environment");
      case "live":
        this.makeLive(market, localLanguage, urlPart, newTab);
        break;
      case "perf":
      case "prod":
        this.makePerf(env, market, localLanguage, beta, urlPart, newTab);
        break;
      case "author":
        this.makeAuthor(market, localLanguage, beta, urlPart, newTab);
        break;
    }
  }

  static makeLive(market, localLanguage, urlPart, newTab) {
    var britain = "";
    if (market == "uk") {
      britain = market;
      market = localLanguage + ".";
      localLanguage = "";
    }

    if (localLanguage != "") localLanguage += ".";

    window.open(
      "https://www." + localLanguage + "ford." + market + britain + urlPart,
      newTab ? "_blank" : "_parent"
    );
  }

  static makePerf(env, market, localLanguage, beta, urlPart, newTab) {
    if (market == "uk" || market == "gb") {
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
      newTab ? "_blank" : "_parent"
    );
  }

  static makeAuthor(market, localLanguage, beta, urlPart, newTab) {
    var wrongLink =
      "/content/guxeu" +
      beta +
      "/" +
      market +
      "/" +
      this.fixLocalLanguage(localLanguage, market, true) +
      "_" +
      this.fixMarket(market) +
      "/home" +
      urlPart;

    if (beta == "-beta" && urlPart != "") {
      GM_setValue("LinkPart", window.location.search + window.location.hash);
      GM_setValue("WrongLink", wrongLink);
      window.open(
        "https://wwwperf.brandeuauthorlb.ford.com/etc/guxacc/tools/resource-resolver-tool.html",
        newTab ? "_blank" : "_parent"
      );
    } else {
      this.makeRealAuthorLink(wrongLink, newTab);
    }
  }

  static makeRealAuthorLink(link, newTab) {
    var linkPart = GMGetADeleteValue("LinkPart");

    window.open(
      "https://wwwperf.brandeuauthorlb.ford.com/" +
        "editor.html" +
        link +
        ".html" +
        linkPart,
      newTab ? "_blank" : "_parent"
    );
  }

  static fixMarket(market) {
    const marketsFixAuthor = ["gb"];
    const marketsFixPerf = ["uk"];

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

  static fixLocalLanguage(localLanguage, market, toAuthor) {
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
        case "cz":
          localLanguage = "cs";
          break;
        case "gr":
          localLanguage = "el";
          break;
      }
    } else {
      switch (market) {
        case "cz":
        case "gr":
        case "lu":
        case "ie":
        case "at":
        case "dk":
          localLanguage = "";
          break;
        case "uk":
          localLanguage = "co";
          break;
      }

      if (localLanguage == market) localLanguage = "";
    }

    return localLanguage;
  }
}
