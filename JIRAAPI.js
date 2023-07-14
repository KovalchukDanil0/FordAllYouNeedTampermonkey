const regexRemoveSpaces = /^\s+|\s+$|\s+(?=\s)/gm;

class JIRA {
  static get ticketMarket() {
    return document
      .querySelector("#customfield_13300-val")
      .textContent.replace(regexRemoveSpaces, "");
  }

  static get ticketLocalLanguage() {
    return document
      .querySelector("#customfield_15000-val")
      .textContent.replace(regexRemoveSpaces, "");
  }

  static get ticketTitle() {
    return document
      .querySelector("#summary-val")
      .textContent.replace(regexRemoveSpaces, "");
  }

  static get ticketNumber() {
    return document
      .querySelector("#parent_issue_summary")
      .getAttribute("data-issue-key")
      .match(/ESM-\w+/gm);
  }
}
