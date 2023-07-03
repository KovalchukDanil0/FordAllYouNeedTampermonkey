const url = window.location.href;

const regexWorkflow =
  /(?:.+)?wwwperf\.brandeuauthorlb\.ford\.com(?:\/(?:cf#|editor\.html))?\/etc\/workflow\/packages\/ESM\/\w\w(?:\/\w\w\w\w)?\/(.+)\.html(?:.+)?/gm;
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
  /(?:.+)?wwwperf\.brandeu(?:author)?lb\.ford\.com(?:\/(editor\.html|cf#))?\/content\/guxeu(?:-beta)?\/(\w\w|mothersite)\/(\w\w)_\w\w\/(?:.+)?/gm;

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
  static ifLive = url.match(regexLive);
  static ifPerf = url.replace(regexPerf, "$1") == "perf";
  static ifProd = url.replace(regexPerf, "$1") == "prod";
  static ifAuthor = url.match(regexAuthor);

  static isMarketInBeta(market) {
    if (marketsInBeta.some((link) => market.includes(link))) return true;
    return false;
  }

  static get regexWorkflow() {
    return regexWorkflow;
  }

  static get regexJira() {
    return regexJira;
  }

  static get regexWCMWorkflows() {
    return regexWCMWorkflows;
  }

  static get regexResourceResolver() {
    return regexResourceResolver;
  }

  static get regexLive() {
    return regexLive;
  }

  static get regexPerf() {
    return regexPerf;
  }

  static get regexAuthor() {
    return regexAuthor;
  }

  static createWF(WFTitle, WFName) {
    if (!url.match(regexWCMWorkflows)) return;
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

  static addBetaToLink(link) {
    const regexDetermineBeta =
      /(.+)?(\/(?:editor\.html|cf#))?(\/content\/guxeu(?:-beta)?\/(?:.+)?)/gm;
    if (link.includes("/guxeu-beta/")) {
      link = link.replace(regexDetermineBeta, "$1/editor.html$3");
    } else {
      link = link.replace(regexDetermineBeta, "$1/cf#$3");
    }
    return link;
  }
}
