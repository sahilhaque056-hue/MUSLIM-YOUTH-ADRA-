const form = document.getElementById("reportForm");
const successMessage = document.getElementById("successMessage");
const caseId = document.getElementById("caseId");

form.addEventListener("submit", function (event) {

    event.preventDefault();

    // Generate a simple case number
    const randomNumber = Math.floor(10000 + Math.random() * 90000);

    const date = new Date();

    const year = date.getFullYear();

    const generatedCaseId =
        "MYA-" + year + "-" + randomNumber;

    caseId.textContent =
        "Case ID: " + generatedCaseId;

    // Hide form
    form.style.display = "none";

    // Show confirmation
    successMessage.style.display = "block";

    // Scroll to confirmation
    successMessage.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

});
