/* =========================================
   MUSLIM YOUTH ADRA
   Supabase Database Connection
========================================= */

// 1. Your Supabase Project URL
const SUPABASE_URL = "https://jdvmhhrzaxrigojwgfv.supabase.co";

// 2. Paste your PUBLIC/PUBLISHABLE key here
// It starts with: sb_publishable_...
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_S11K_1s9Th4fG0XIif-A9A_YmUxQl38";


// Create Supabase client
const { createClient } = supabase;

const db = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);


// =========================================
// FORM ELEMENTS
// =========================================

const reportForm = document.getElementById("reportForm");
const caseResult = document.getElementById("caseResult");
const caseIdBox = document.getElementById("caseId");
const printCaseButton = document.getElementById("printCase");


// =========================================
// CASE ID
// =========================================

function generateCaseId() {
  const year = new Date().getFullYear();

  const random = Math.floor(
    100000 + Math.random() * 900000
  );

  return `MYA-${year}-${random}`;
}


// =========================================
// CREATE CASE
// =========================================

reportForm.addEventListener("submit", async function (event) {

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


  // Basic validation
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


  // Check that key has been added
  if (
    !SUPABASE_PUBLISHABLE_KEY ||
    SUPABASE_PUBLISHABLE_KEY ===
    "PASTE_YOUR_PUBLISHABLE_KEY_HERE"
  ) {
    alert("Supabase Publishable Key is not configured yet.");
    return;
  }


  // Generate Case ID
  const newCaseId = generateCaseId();


  // Disable button while saving
  const submitButton =
    reportForm.querySelector("button[type='submit']");

  submitButton.disabled = true;
  submitButton.textContent = "Saving Case...";


  // =========================================
  // SAVE CASE TO SUPABASE
  // =========================================

  const { data, error } = await db
    .from("reports")
    .insert([
      {
        case_id: newCaseId,

        content_url: contentUrl,

        platform: platform,

        content_type: contentType,

        account_username: account || null,

        incident_date: incidentDate,

        category: category,

        description: description,

        reporter_name: reporterName || null,

        reporter_contact: reporterContact || null,

        status: "Submitted"
      }
    ])
    .select()
    .single();


  // =========================================
  // ERROR
  // =========================================

  if (error) {

    console.error(error);

    alert(
      "Case save nahi hua.\n\n" +
      "Please check your Supabase connection."
    );

    submitButton.disabled = false;
    submitButton.textContent = "🚨 Create Case";

    return;
  }


  // =========================================
  // SUCCESS
  // =========================================

  caseIdBox.textContent = data.case_id;

  caseResult.classList.remove("hidden");

  caseResult.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });


  // Save latest case locally for Print
  localStorage.setItem(
    "muslimYouthAdraCase",
    JSON.stringify({
      caseId: data.case_id,
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
      createdAt: data.created_at
    })
  );


  submitButton.disabled = false;
  submitButton.textContent = "🚨 Create Case";

});


// =========================================
// PRINT / SAVE CASE
// =========================================

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

      <title>
        MUSLIM YOUTH ADRA - ${escapeHTML(data.caseId)}
      </title>

      <style>

        body {
          font-family: Arial, sans-serif;
          padding: 40px;
          color: #17231b;
          line-height: 1.6;
        }

        h1 {
          color: #075b36;
        }

        h2 {
          color: #075b36;
          border-bottom: 1px solid #ccc;
          padding-bottom: 6px;
          margin-top: 30px;
        }

        .case {
          display: inline-block;
          background: #f1f7f3;
          border: 2px dashed #075b36;
          padding: 12px 18px;
          font-size: 20px;
          font-weight: bold;
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
          background: #f7f7f7;
          padding: 15px;
          border-left: 4px solid #075b36;
        }

        .notice {
          margin-top: 30px;
          padding: 15px;
          background: #fff8dc;
          border-left: 4px solid #c69a00;
          font-size: 13px;
        }

        footer {
          margin-top: 50px;
          padding-top: 15px;
          border-top: 1px solid #ccc;
          font-size: 11px;
        }

      </style>

    </head>

    <body>

      <h1>MUSLIM YOUTH ADRA</h1>

      <p>Online Content Report / Case Record</p>

      <div class="case">
        CASE ID: ${escapeHTML(data.caseId)}
      </div>


      <h2>Reported Content</h2>

      <div class="row">
        <span class="label">Platform:</span>
        ${escapeHTML(data.platform)}
      </div>

      <div class="row">
        <span class="label">Content Type:</span>
        ${escapeHTML(data.contentType)}
      </div>

      <div class="row">
        <span class="label">Account / Username:</span>
        ${escapeHTML(data.account || "Not provided")}
      </div>

      <div class="row">
        <span class="label">Incident Date:</span>
        ${escapeHTML(data.incidentDate)}
      </div>

      <div class="row">
        <span class="label">Category:</span>
        ${escapeHTML(data.category)}
      </div>

      <div class="row">
        <span class="label">Original URL:</span>
        ${escapeHTML(data.contentUrl)}
      </div>


      <h2>Description</h2>

      <div class="description">
        ${escapeHTML(data.description)}
      </div>


      <h2>Evidence</h2>

      <p>
        Evidence files selected:
        <strong>${data.evidenceCount}</strong>
      </p>

      <p>
        Keep original evidence files safely.
      </p>


      <h2>Reporter Information</h2>

      <div class="row">
        <span class="label">Name:</span>
        ${escapeHTML(data.reporterName || "Not provided")}
      </div>

      <div class="row">
        <span class="label">Contact:</span>
        ${escapeHTML(data.reporterContact || "Not provided")}
      </div>


      <div class="notice">

        This document records information supplied by the reporter.
        It does not determine guilt or make a legal finding.
        Authorities and platforms should independently review
        the evidence and circumstances.

      </div>


      <footer>

        MUSLIM YOUTH ADRA<br>
        created by @be.like_sahil

      </footer>


      <script>

        window.onload = function() {
          window.print();
        };

      <\/script>

    </body>

    </html>

  `);

  printWindow.document.close();

});


// =========================================
// HTML SECURITY
// =========================================

function escapeHTML(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}
