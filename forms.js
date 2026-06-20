(function () {
  const configs = {
    registration: {
      key: "mml2026Registrations",
      fields: ["submittedAt", "fullName", "email", "affiliation", "category", "presentation", "title", "academicFile", "evidenceFile", "notes"]
    },
    contact: {
      key: "mml2026ContactInquiries",
      fields: ["submittedAt", "topic", "recipient", "name", "email", "subject", "message"]
    }
  };

  function getRows(config) {
    try {
      return JSON.parse(localStorage.getItem(config.key) || "[]");
    } catch (error) {
      return [];
    }
  }

  function saveRow(config, row) {
    const rows = getRows(config);
    rows.push(row);
    localStorage.setItem(config.key, JSON.stringify(rows));
    return rows;
  }

  function formDataToObject(form) {
    const values = Object.fromEntries(new FormData(form).entries());
    form.querySelectorAll('input[type="file"]').forEach((input) => {
      values[input.name] = Array.from(input.files).map((file) => file.name).join("; ");
    });
    return values;
  }

  function selectedRecipient(form) {
    const select = form.querySelector("#topic");
    if (!select) return "";
    return select.options[select.selectedIndex].dataset.email || "";
  }

  function openMailDraft(row) {
    const body = [
      "Name: " + row.name,
      "Email: " + row.email,
      "Topic: " + row.topic,
      "",
      row.message
    ].join("\n");
    const url = "mailto:" + encodeURIComponent(row.recipient) +
      "?subject=" + encodeURIComponent("MML 2026: " + row.subject) +
      "&body=" + encodeURIComponent(body);
    window.location.href = url;
  }

  document.querySelectorAll(".data-form").forEach((form) => {
    const type = form.dataset.formType;
    const config = configs[type];
    const status = form.querySelector(".form-status");

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const row = formDataToObject(form);
      row.submittedAt = new Date().toISOString();

      if (type === "contact") {
        row.recipient = selectedRecipient(form);
      }

      saveRow(config, row);
      status.textContent = type === "registration"
        ? "Registration received. Please keep attachments ready for the organizing team's follow-up email."
        : "Inquiry saved in this browser. Your email app will open with the message.";

      if (type === "contact") {
        openMailDraft(row);
      }

      form.reset();
    });
  });
})();
