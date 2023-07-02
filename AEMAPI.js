const regexWorkflow =
  /(?:.+)?wwwperf\.brandeuauthorlb\.ford\.com(?:\/(?:cf#|editor\.html))?\/etc\/workflow\/packages\/ESM\/\w\w(?:\/\w\w\w\w)?\/(.+)\.html(?:.+)?/gm;

class AEM {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }

  static get rwf() {
    return regexWorkflow;
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
