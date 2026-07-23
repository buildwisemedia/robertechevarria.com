(function () {
  "use strict";

  var ENDPOINT = "https://bwm-form-handler.robert-ba0.workers.dev/robertechevarria/newsletter";

  function analyticsEvent(name, detail) {
    if (typeof window.gtag === "function") {
      window.gtag("event", name, detail);
      return;
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: name }, detail));
  }

  function attribution() {
    var params = new URLSearchParams(window.location.search);
    var keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid"];
    var data = {
      referrer: document.referrer || "",
      landing_page: window.location.href
    };
    keys.forEach(function (key) {
      var value = params.get(key);
      if (value) data[key] = value;
    });
    return data;
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-newsletter-signup]").forEach(function (form) {
      var button = form.querySelector(".df-signup__button");
      var statusNode = form.querySelector(".df-signup__status");
      var started = false;
      var locationName = form.getAttribute("data-signup-location") || "unknown";

      function markStarted() {
        if (started) return;
        started = true;
        analyticsEvent("newsletter_signup_start", {
          list_name: "the_dark_factory",
          signup_location: locationName
        });
      }

      form.addEventListener("focusin", markStarted);
      form.addEventListener("submit", async function (event) {
        event.preventDefault();
        markStarted();
        if (!button || !statusNode) return;

        button.disabled = true;
        button.textContent = "Joining…";
        statusNode.textContent = "";
        statusNode.removeAttribute("data-state");

        var payload = Object.assign({
          email: form.elements.email.value.trim(),
          name: form.elements.name.value.trim(),
          consent: form.elements.consent.checked,
          business_url: form.elements.business_url.value
        }, attribution());

        try {
          var response = await fetch(ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          var result = await response.json().catch(function () { return {}; });
          if (!response.ok || !result.ok) {
            throw new Error(result.error || "Could not join the list.");
          }

          form.reset();
          button.textContent = "You’re on the list";
          statusNode.textContent = "The next issue will land in your inbox.";
          statusNode.setAttribute("data-state", "success");
          analyticsEvent("newsletter_signup", {
            method: "website",
            list_name: "the_dark_factory",
            signup_location: locationName
          });
        } catch (error) {
          button.disabled = false;
          button.textContent = "Send me the next issue";
          statusNode.textContent = error && error.message
            ? error.message
            : "Could not join the list. Try again in a moment.";
          statusNode.setAttribute("data-state", "error");
          analyticsEvent("newsletter_signup_error", {
            list_name: "the_dark_factory",
            signup_location: locationName
          });
        }
      });
    });
  });
})();
