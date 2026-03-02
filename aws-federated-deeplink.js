// AWS Federated Deeplink Generator
//
// Bookmarklet that generates an IAM Identity Center (SSO) federated deeplink
// to the current AWS Console page with the current account and role.
//
// Extracts account ID and role name from the aws-userInfo cookie (falls back
// to scraping the nav bar), then copies a deeplink to your clipboard.
//
// Setup:
//   1. Copy the bookmarklet to your clipboard:
//      gh api repos/johncorser-sdx/sdx-bookmarklets/contents/aws-federated-deeplink.js -q '.content' | base64 -d | head -1 | sed -n 's|^// ||p' | head -1 | pbcopy
//
//      Or with a single command:
//      bash <(curl -s https://raw.githubusercontent.com/johncorser-sdx/sdx-bookmarklets/main/install.sh) aws-federated-deeplink
//
//   2. Create a new bookmark in Chrome (right-click bookmarks bar → "Add page")
//   3. Name it "Generate Deeplink"
//   4. Paste clipboard contents as the URL
//
// BOOKMARKLET:
// javascript:void(function(){var acct,role,cookie=(document.cookie.match(/aws-userInfo=([^;]+)/)||[])[1];if(cookie){try{var info=JSON.parse(decodeURIComponent(cookie));var arn=info.arn||'';acct=(arn.match(/:(\d{12}):/)||[])[1];role=(arn.match(/AWSReservedSSO_([^_]+)_/)||[])[1]}catch(e){}}if(!acct||!role){var el=document.querySelector('[data-testid="awsc-nav-account-menu-button"]');var txt=el?el.textContent:'';if(!acct)acct=(txt.match(/(\d{12})/)||[])[1];if(!role)role=(txt.match(/AWSReservedSSO_([^_\/\s]+)/)||[])[1]}if(!acct||!role){alert('Could not extract account ('+acct+') or role ('+role+') from page');return}var url='https://d-9067d6a758.awsapps.com/start/#/console?account_id='+acct+'&role_name='+encodeURIComponent(role)+'&destination='+encodeURIComponent(location.href);navigator.clipboard.writeText(url).then(function(){var d=document.createElement('div');d.textContent='Deeplink copied to clipboard';d.style.cssText='position:fixed;top:10px;right:10px;z-index:99999;padding:12px 20px;background:#4CAF50;color:#fff;border-radius:6px;font:bold 14px/1.4 system-ui,sans-serif;box-shadow:0 2px 8px rgba(0,0,0,.3)';document.body.appendChild(d);setTimeout(function(){d.remove()},2500)},function(){prompt('Copy this deeplink:',url)})})()

javascript: void (function () {
  var acct, role;

  // Primary: parse the aws-userInfo cookie
  var cookie = (document.cookie.match(/aws-userInfo=([^;]+)/) || [])[1];
  if (cookie) {
    try {
      var info = JSON.parse(decodeURIComponent(cookie));
      var arn = info.arn || "";
      // ARN format: arn:aws:sts::ACCOUNT_ID:assumed-role/AWSReservedSSO_RoleName_hex/user
      acct = (arn.match(/:(\d{12}):/) || [])[1];
      role = (arn.match(/AWSReservedSSO_([^_]+)_/) || [])[1];
    } catch (e) {}
  }

  // Fallback: scrape the account menu button in the nav bar
  if (!acct || !role) {
    var el = document.querySelector(
      '[data-testid="awsc-nav-account-menu-button"]'
    );
    var txt = el ? el.textContent : "";
    if (!acct) acct = (txt.match(/(\d{12})/) || [])[1];
    if (!role)
      role = (txt.match(/AWSReservedSSO_([^_\/\s]+)/) || [])[1];
  }

  if (!acct || !role) {
    alert(
      "Could not extract account (" + acct + ") or role (" + role + ") from page"
    );
    return;
  }

  var url =
    "https://d-9067d6a758.awsapps.com/start/#/console?account_id=" +
    acct +
    "&role_name=" +
    encodeURIComponent(role) +
    "&destination=" +
    encodeURIComponent(location.href);

  navigator.clipboard.writeText(url).then(
    function () {
      var d = document.createElement("div");
      d.textContent = "Deeplink copied to clipboard";
      d.style.cssText =
        "position:fixed;top:10px;right:10px;z-index:99999;padding:12px 20px;background:#4CAF50;color:#fff;border-radius:6px;font:bold 14px/1.4 system-ui,sans-serif;box-shadow:0 2px 8px rgba(0,0,0,.3)";
      document.body.appendChild(d);
      setTimeout(function () {
        d.remove();
      }, 2500);
    },
    function () {
      prompt("Copy this deeplink:", url);
    }
  );
})();
