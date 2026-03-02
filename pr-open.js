// PR Open Snippet Copier
//
// Bookmarklet that copies a formatted PR snippet to your clipboard from a
// GitHub pull request page. Output format:
//   :pr-open: [PR Title](https://github.com/...) (+123 -45)
//
// Setup:
//   1. Copy the bookmarklet to your clipboard:
//      bash <(curl -s https://raw.githubusercontent.com/johncorser-sdx/sdx-bookmarklets/main/install.sh) pr-open
//
//   2. Create a new bookmark in Chrome (right-click bookmarks bar → "Add page")
//   3. Name it "PR Open"
//   4. Paste clipboard contents as the URL
//
// BOOKMARKLET:
// javascript:(function(){const issueTemplate=":pr-open: [{issue}]({link}) ({diff})";const normalizeWhitespace=(value)=>value.replace(/\s+/g," ").trim();const normalizeNumberText=(value)=>value.replace(/\u2212/g,"-").replace(/\s+/g,"");const getIssueTitle=()=>{const newTitle=document.querySelector('h1[data-component="PH_Title"]');if(newTitle)return normalizeWhitespace(newTitle.textContent||"");const legacyTitle=document.querySelector("bdi.js-issue-title");if(legacyTitle)return normalizeWhitespace(legacyTitle.textContent||"");return""};const getDiffStat=()=>{const candidateTexts=Array.from(document.querySelectorAll('span[aria-hidden="true"]')).map(el=>normalizeNumberText(el.textContent||""));const additions=candidateTexts.find(text=>/^\+\d+$/.test(text));const deletions=candidateTexts.find(text=>/^-?\d+$/.test(text)&&text.startsWith("-"));if(additions||deletions){return[additions,deletions].filter(Boolean).join(" ")}const srOnly=document.querySelector(".sr-only");if(srOnly){const match=srOnly.textContent.match(/(\d+)\s+additions?.*?(\d+)\s+deletions?/i);if(match)return`+${match[1]} -${match[2]}`}const legacyDiff=document.querySelector(".diffstat");if(legacyDiff)return normalizeWhitespace(legacyDiff.textContent||"");return""};function copyIssueToClipboard(template){const issueTitle=getIssueTitle();const diffStat=getDiffStat();const issueLink=window.location.href;const md=issueTitle&&diffStat&&issueLink?template.replace("{issue}",issueTitle).replace("{link}",issueLink).replace("{diff}",diffStat):"";if(md)copyTextToClipboard(md);else console.warn("Unable to build PR snippet.")}function copyTextToClipboard(text){const textArea=document.createElement("textarea");textArea.style.position="fixed";textArea.style.top=0;textArea.style.left=0;textArea.style.width="2em";textArea.style.height="2em";textArea.style.padding=0;textArea.style.border="none";textArea.style.outline="none";textArea.style.boxShadow="none";textArea.style.background="transparent";textArea.value=text;document.body.appendChild(textArea);textArea.select();try{document.execCommand("copy")}catch(error){console.log("Unable to copy to clipboard:",error)}document.body.removeChild(textArea)}copyIssueToClipboard(issueTemplate)})();

javascript: (function () {
  const issueTemplate = ":pr-open: [{issue}]({link}) ({diff})";

  const normalizeWhitespace = (value) => value.replace(/\s+/g, " ").trim();
  const normalizeNumberText = (value) =>
    value.replace(/\u2212/g, "-").replace(/\s+/g, "");

  const getIssueTitle = () => {
    const newTitle = document.querySelector('h1[data-component="PH_Title"]');
    if (newTitle) return normalizeWhitespace(newTitle.textContent || "");
    const legacyTitle = document.querySelector("bdi.js-issue-title");
    if (legacyTitle) return normalizeWhitespace(legacyTitle.textContent || "");
    return "";
  };

  const getDiffStat = () => {
    const candidateTexts = Array.from(
      document.querySelectorAll('span[aria-hidden="true"]')
    ).map((el) => normalizeNumberText(el.textContent || ""));
    const additions = candidateTexts.find((text) => /^\+\d+$/.test(text));
    const deletions = candidateTexts.find(
      (text) => /^-?\d+$/.test(text) && text.startsWith("-")
    );
    if (additions || deletions) {
      return [additions, deletions].filter(Boolean).join(" ");
    }
    const srOnly = document.querySelector(".sr-only");
    if (srOnly) {
      const match = srOnly.textContent.match(
        /(\d+)\s+additions?.*?(\d+)\s+deletions?/i
      );
      if (match) return `+${match[1]} -${match[2]}`;
    }
    const legacyDiff = document.querySelector(".diffstat");
    if (legacyDiff) return normalizeWhitespace(legacyDiff.textContent || "");
    return "";
  };

  function copyIssueToClipboard(template) {
    const issueTitle = getIssueTitle();
    const diffStat = getDiffStat();
    const issueLink = window.location.href;
    const md =
      issueTitle && diffStat && issueLink
        ? template
            .replace("{issue}", issueTitle)
            .replace("{link}", issueLink)
            .replace("{diff}", diffStat)
        : "";
    if (md) copyTextToClipboard(md);
    else console.warn("Unable to build PR snippet.");
  }

  function copyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.style.position = "fixed";
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = 0;
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
    } catch (error) {
      console.log("Unable to copy to clipboard:", error);
    }
    document.body.removeChild(textArea);
  }

  copyIssueToClipboard(issueTemplate);
})();
