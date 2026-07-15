
const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");

if (toggle && nav) {
  toggle.addEventListener("click", () => nav.classList.toggle("open"));
}

document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const form = document.querySelector("#contactForm");

if (form) {
  const submitButton = document.querySelector("#submitButton");
  const formStatus = document.querySelector("#formStatus");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    formStatus.className = "form-status";
    formStatus.textContent = "";

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      companySize: String(formData.get("size") || "").trim(),
      processToImprove: String(formData.get("message") || "").trim(),
      website: String(formData.get("website") || "").trim()
    };

    if (!payload.name || !payload.email || !payload.processToImprove) {
      formStatus.className = "form-status error";
      formStatus.textContent = "Please complete your name, email, and the process you would like to improve.";
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Sending…";

    try {
      const response = await fetch("/.netlify/functions/submit-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || "We could not submit your inquiry.");
      }

      form.reset();
      formStatus.className = "form-status success";
      formStatus.textContent = "Thanks — your inquiry has been received. We’ll be in touch soon.";
    } catch (error) {
      formStatus.className = "form-status error";
      formStatus.textContent = error.message || "Something went wrong. Please try again.";
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Send Inquiry →";
    }
  });
}
