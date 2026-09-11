/* =================================
   MUSLIM YOUTH ADRA
   Website Functionality
================================= */

const reportForm = document.getElementById("reportForm");
const caseResult = document.getElementById("caseResult");
const caseIdBox = document.getElementById("caseId");
const printCaseButton = document.getElementById("printCase");


/* =================================
   GENERATE CASE ID
================================= */

function generateCaseId() {
  const now = new Date();

  const year = now.getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);

  return `MYA-${year}-${random}`;
}


/* =================================
   FORM SUBMIT
================================= */

reportForm.addEventListener("submit", function (event) {

  event.preventDefault();

  const contentUrl =
    document.getElementById("contentUrl").value.trim();

  const platform =
    document.getElementById("platform").value;

  const contentType =
    document.getElementById("contentType").value;

  const account =
    document.getElementById("account").value.trim();

  const incidentDate =
    document.getElementById("incidentDate").value;

  const category =
    document.getElementById("category").value;

  const description =
    document.getElementById("description").value.trim();

  const reporterName =
    document.getElementById("reporterName").value.trim();

  const reporterContact =
    document.getElementById("reporterContact").value.trim();

  const evidenceInput =
    document.getElementById("evidence");


  /* Basic validation */

  if (
    !contentUrl ||
    !platform ||
    !contentType ||
    !incidentDate ||
    !category ||
    !description
  ) {
    alert("Please fill all required fields.");
    return;
  }


  /* Create case */

  const newCaseId = generateCaseId();

  caseIdBox.textContent = newCaseId;


  /* Store case information locally */

  const caseData = {
    caseId: newCaseId,
    contentUrl: contentUrl,
    platform: platform,
    contentType: contentType,
    account: account,
    incidentDate: incidentDate,
    category: category,
    description: description,
    reporterName: reporterName,
    reporterContact: reporterContact,
    evidenceCount: evidenceInput.files.length,
    createdAt: new Date().toISOString()
  };


  localStorage.setItem(
    "muslimYouthAdraCase",
    JSON.stringify(caseData)
  );


  /* Show result */

  caseResult.classList.remove("hidden");

  caseResult.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

});


/* =================================
   PRINT / SAVE CASE
================================= */

printCaseButton.addEventListener("click", function () {

  const savedCase =
    localStorage.getItem("muslimYouthAdraCase");

  if (!savedCase) {
    alert("No case found.");
    return;
  }

  const data = JSON.parse(savedCase);


  const printWindow = window.open(
    "",
    "_blank",
    "width=900,height=700"
  );

  if (!printWindow) {
    alert("Please allow pop-ups for this website.");
    return;
  }


  printWindow.document.write(`

    <!DOCTYPE html>

    <html>

    <head>

      <title>MUSLIM YOUTH ADRA - Case ${data.caseId}</title>

      <style>

        body {
          font-family: Arial, sans-serif;
          padding: 40px;
          color: #17231b;
          line-height: 1.6;
        }

        h1 {
          color: #075b36;
          margin-bottom: 5px;
        }

        h2 {
          color: #075b36;
          border-bottom: 1px solid #ccc;
          padding-bottom: 6px;
          margin-top: 30px;
        }

        .case {
          background: #f1f7f3;
          border: 2px dashed #075b36;
          padding: 12px;
          font-size: 20px;
          font-weight: bold;
          display: inline-block;
          margin: 15px 0;
        }

        .row {
          margin: 8px 0;
        }

        .label {
          font-weight: bold;
        }

        .description {
          white-space: pre-wrap;
          background: #f7f7f7
