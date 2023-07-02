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

class AEM {
  constructor(height, width) {
    this.height = height;
    this.width = width;
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

  get area() {
    return this.calcArea();
  }

  calcArea() {
    return this.height * this.width;
  }

  *getSides() {
    yield this.height;
    yield this.width;
    yield this.height;
    yield this.width;
  }
}
