const url = window.location.href;
const parentUrl =
  window.location != window.parent.location
    ? document.referrer
    : document.location.href;

const regexWorkflow =
  /(?:.+)?wwwperf\.brandeuauthorlb\.ford\.com\/etc\/workflow\/packages\/ESM\/\w\w\w\w(?:\/\w\w)?\/(.+)\.html(?:.+)?/gm;
const regexJira = /jira\.uhub\.biz\/browse\//gm;
const regexWCMWorkflows =
  /wwwperf\.brandeuauthorlb\.ford\.com\/miscadmin#\/etc\/workflow\/packages\/ESM\//gm;
const regexResourceResolver =
  /wwwperf\.brandeuauthorlb\.ford\.com\/etc\/guxacc\/tools\/resource\-resolver\-tool/gm;

const regexLive =
  /(?:.+)?(?:secure|www)(?:\.(\w\w))?\.ford\.(\w\w)(?:\.(\w\w))?(?:.+)?/gm;
const regexPerf =
  /(?:.+)?www(perf|prod)(?:-beta)?-(\w\w)(\w\w)?\.brandeulb\.ford\.com(?:.+)?/gm;
const regexAuthor =
  /(?:.+)?wwwperf\.brandeu(?:author)?lb\.ford\.com(\/content\/guxeu(?:-beta)?\/(\w\w|mothersite)\/(\w\w)_\w\w\/(?:.+)?)\.html/gm;
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

class AEM {
  static get regexWorkflow() {
    return regexWorkflow;
  }

  static get ifWorkflow() {
    return url.match(regexWorkflow);
  }

  static get regexJira() {
    return regexJira;
  }

  static get ifJira() {
    return url.match(regexJira);
  }

  static get regexWCMWorkflows() {
    return regexWCMWorkflows;
  }

  static get ifWCMWorkflows() {
    return url.match(regexWCMWorkflows);
  }

  static get regexResourceResolver() {
    return regexResourceResolver;
  }

  static get ifResourceResolver() {
    return url.match(regexResourceResolver);
  }

  static get regexLive() {
    return regexLive;
  }

  static ifLive = url.match(regexLive);

  static get regexPerf() {
    return regexPerf;
  }

  static ifPerf = url.replace(regexPerf, "$1") == "perf";
  static ifProd = url.replace(regexPerf, "$1") == "prod";

  static get regexAuthor() {
    return regexAuthor;
  }

  static ifAuthor = url.match(regexAuthor);

  static isMarketInBeta(market) {
    if (marketsInBeta.some((link) => market.includes(link))) return true;
    return false;
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

  static addBetaToLink(link) {
    const regexDetermineBeta = /(.+)?(\/content\/guxeu(?:-beta)?\/(?:.+)?)/gm;
    if (link.includes("/guxeu-beta/")) {
      link = link.replace(regexDetermineBeta, "$1/editor.html$2");
    } else {
      link = link.replace(regexDetermineBeta, "$1/cf#$2");
    }
    return link;
  }

  static changeUI() {
    const regexChangeUI =
      /(?:.+)?wwwperf\.brandeu(?:author)?lb\.ford\.com((?:\/)?(?:editor\.html|cf#)?\/)content(?:.+)?/gm;

    var authorUI = parentUrl.replace(regexChangeUI, "$2");
    var newUrl;

    if (authorUI == "editor.html") {
      newUrl = parentUrl.replace(regexChangeUI, "$1cf#$3");
    } else {
      newUrl = parentUrl.replace(regexChangeUI, "$1editor.html$3");
    }

    window.open(newUrl, "_parent");
  }

  static openPropertiesTouchUI() {
    window.open(
      url.replace(
        regexAuthor,
        "https://wwwperf.brandeuauthorlb.ford.com/mnt/overlay/wcm/core/content/sites/properties.html?item=$2"
      )
    );
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
