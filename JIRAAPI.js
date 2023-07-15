const regexJira = /jira\.uhub\.biz\/browse\//gm;

const regexRemoveSpaces = /^\s+|\s+$|\s+(?=\s)/gm;

class JIRA {
  static get ifJira() {
    return url.match(regexJira);
  }

  static get buttonsContainer() {
    return document.querySelector(
      "#stalker > div > div.command-bar > div > div > div > div.aui-toolbar2-primary"
    );
  }

  static get createWFButton() {
    var button = document.querySelector("#assign-issue").cloneNode(true);

    button.removeAttribute("id");
    button.removeAttribute("href");

    button.title = "Create WF";
    button.className = "aui-button";

    button.textContent = "Create WF";

    return button;
  }

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
