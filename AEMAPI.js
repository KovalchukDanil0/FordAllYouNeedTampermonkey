const url =
  window.location != window.parent.location
    ? parent.location.href
    : document.location.href;

var market;
var localLanguage;

const regexWorkflow =
  /(?:.+)?wwwperf\.brandeuauthorlb\.ford\.com(?:\/(?:editor\.html|cf#))?\/etc\/workflow\/packages\/ESM\/\w\w\w\w(?:\/\w\w)?\/(.+)\.html(?:.+)?/gm;
const regexJira = /jira\.uhub\.biz\/browse\//gm;
const regexWCMWorkflows =
  /wwwperf\.brandeuauthorlb\.ford\.com\/miscadmin#\/etc\/workflow\/packages\/ESM\//gm;
const regexResourceResolver =
  /wwwperf\.brandeuauthorlb\.ford\.com(?:\/(?:editor\.html|cf#))?\/etc\/guxacc\/tools\/resource\-resolver\-tool/gm;

const regexLive =
  /(?:.+)?(?:secure|www)(?:\.(\w\w))?\.ford\.(\w\w)(?:\.(\w\w))?(?:.+)?/gm;
const regexPerf =
  /(?:.+)?www(perf|prod)(?:-beta)?-(\w\w)(\w\w)?\.brandeulb\.ford\.com(?:.+)?/gm;
const regexAuthor =
  /(?:.+)?wwwperf\.brandeu(?:author)?lb\.ford\.com(?:\/(?:editor\.html|cf#))?(\/content\/guxeu(?:-beta)?\/(\w\w|mothersite)\/(\w\w)_\w\w\/(?:.+)?)\.html(?:.+)?/gm;
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

String.prototype.addBetaToLink = function () {
  const regexDetermineBeta = /(.+)?(\/content\/guxeu(?:-beta)?\/(?:.+)?)/gm;
  if (this.includes("/guxeu-beta/")) {
    return this.replace(regexDetermineBeta, "$1/editor.html$2");
  } else {
    return this.replace(regexDetermineBeta, "$1/cf#$2");
  }
};

class AEM {
  static get ifWorkflow() {
    return url.match(regexWorkflow);
  }

  static get ifJira() {
    return url.match(regexJira);
  }

  static get ifWCMWorkflows() {
    return url.match(regexWCMWorkflows);
  }

  static get ifResourceResolver() {
    return url.match(regexResourceResolver);
  }

  static ifLive = url.match(regexLive);

  static ifPerf = url.replace(regexPerf, "$1") == "perf";
  static ifProd = url.replace(regexPerf, "$1") == "prod";

  static ifAuthor = url.match(regexAuthor);

  static isMarketInBeta(market) {
    if (marketsInBeta.some((link) => market.includes(link))) return true;
    return false;
  }

  static textToWFPath(market, localLanguage) {
    var fullPath;
    switch (market) {
      default:
        fullPath = this.wfPathFromTitle(GM_getValue("WFTitle", null));
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
            fullPath = this.wfPathFromTitle(GM_getValue("WFTitle", null));
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
            fullPath = this.wfPathFromTitle(GM_getValue("WFTitle", null));
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
      case "Ford of Romania":
        fullPath = "RORO";
        break;
    }

    return fullPath;
  }

  static wfPathFromTitle(title) {
    const regexWFTitle = /^(\w\w)(\w\w)?(?:.+)?/gm;

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
    if (WFTitle == null || WFName == null) return;

    this.waitForElm(
      "#cq-gen75 > div.x-grid3-row.x-grid3-row-first > table > tbody > tr > td.x-grid3-col.x-grid3-cell.x-grid3-td-title > div"
    ).then((firstItemInList) => {
      var button = document.getElementById("cq-gen91");
      button.click();

      this.waitForElm("#ext-comp-1079").then((form) => {
        form.value = WFTitle;

        form = document.querySelector("#ext-comp-1080");
        form.value = WFName;
      });

      this.waitForElm("#ext-comp-1076 > div:nth-child(3)").then(
        (promotionButton) => {
          promotionButton.click();
        }
      );
    });
  }

  static changeUI() {
    const regexChangeUI =
      /((?:.+)?wwwperf\.brandeu(?:author)?lb\.ford\.com)((?:\/)?(?:editor\.html|cf#)?\/)(content(?:.+)?)/gm;

    var authorUI = url.replace(regexChangeUI, "$2");
    var newUrl;

    if (authorUI == "/editor.html/")
      newUrl = url.replace(regexChangeUI, "$1/cf#/$3");
    else newUrl = url.replace(regexChangeUI, "$1/editor.html/$3");

    window.open(newUrl, "_parent");
  }

  static openPropertiesTouchUI() {
    window.open(
      url.replace(
        regexAuthor,
        "https://wwwperf.brandeuauthorlb.ford.com/mnt/overlay/wcm/core/content/sites/properties.html?item=$1"
      )
    );
  }

  static FixMarket(market) {
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

  static FixLocalLanguage(localLanguage, market, toAuthor) {
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

  static waitForElm(selector) {
    return new Promise((resolve) => {
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
    });
  }
}
