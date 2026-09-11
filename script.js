// =====================================================================
// Deeper Life Campus Fellowship — First Timer form behaviour
//
// This form sends replies automatically by email using EmailJS, a free
// service that lets a plain HTML/CSS/JS site send email with no backend
// server. The visitor never has to open WhatsApp or their mail app —
// clicking "Submit reply" is the only step.
//
// -----------------------------------------------------------------
// SETUP: EDIT THE FOUR VALUES BELOW
// -----------------------------------------------------------------
// 1. Go to https://www.emailjs.com and create a free account.
// 2. Under "Email Services", connect the Gmail (or other) address that
//    should RECEIVE the submissions. This gives you a SERVICE ID.
// 3. Under "Email Templates", create a template. Add these variables
//    to the template body: {{name}} {{department}} {{hostel}} {{phone}}
//    {{takeaway}} {{prayer}} {{nextweek}}. This gives you a TEMPLATE ID.
// 4. Under "Account" > "General", copy your PUBLIC KEY.
// 5. Paste all three below, replacing the placeholder text.
// -----------------------------------------------------------------
const EMAILJS_PUBLIC_KEY  = "YOUR_PUBLIC_KEY";   // <-- from EmailJS "Account" page
const EMAILJS_SERVICE_ID  = "YOUR_SERVICE_ID";   // <-- from EmailJS "Email Services" page
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";  // <-- from EmailJS "Email Templates" page
// =====================================================================

emailjs.init(EMAILJS_PUBLIC_KEY);

const form        = document.getElementById('firstTimerForm');
const statusMsg    = document.getElementById('statusMsg');
const submitButton = document.getElementById('submitReply');

function showStatus(text, isError){
  statusMsg.textContent = text;
  statusMsg.hidden = false;
  statusMsg.classList.toggle('error', !!isError);
}

function clearFieldError(fieldEl){ fieldEl.classList.remove('invalid'); }
function setFieldError(fieldEl){ fieldEl.classList.add('invalid'); }

function validate(){
  let firstInvalid = null;
  const requiredTextFields = ['name', 'department', 'hostel', 'phone', 'takeaway'];

  requiredTextFields.forEach(function(key){
    const fieldEl = form.querySelector('[data-field="' + key + '"]');
    const input   = fieldEl.querySelector('input, textarea');
    if (!input.value.trim()){
      setFieldError(fieldEl);
      if (!firstInvalid) firstInvalid = fieldEl;
    } else {
      clearFieldError(fieldEl);
    }
  });

  const nextWeekField  = form.querySelector('[data-field="nextweek"]');
  const nextWeekChosen = form.querySelector('input[name="nextweek"]:checked');
  if (!nextWeekChosen){
    setFieldError(nextWeekField);
    if (!firstInvalid) firstInvalid = nextWeekField;
  } else {
    clearFieldError(nextWeekField);
  }

  if (firstInvalid){
    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return !firstInvalid;
}

function buildTemplateParams(){
  const get = function(id){ return document.getElementById(id).value.trim(); };
  const nextWeek = form.querySelector('input[name="nextweek"]:checked').value;

  return {
    name: get('name'),
    department: get('department'),
    hostel: get('hostel'),
    phone: get('phone'),
    takeaway: get('takeaway'),
    prayer: get('prayer') || "—",
    nextweek: nextWeek
  };
}

submitButton.addEventListener('click', function(){
  if (!validate()){
    showStatus("Please fill in all required fields before sending.", true);
    return;
  }

  const params = buildTemplateParams();

  submitButton.disabled = true;
  submitButton.textContent = "Sending...";

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params)
    .then(function(){
      showStatus("Thank you, " + params.name + " — your details have been sent. We'll be in touch soon!");
      submitButton.textContent = "Sent ✓";
      form.reset();
      document.querySelectorAll('.field').forEach(clearFieldError);
    })
    .catch(function(error){
      console.error('EmailJS error:', error);
      showStatus("Something went wrong sending your details. Please try again in a moment.", true);
      submitButton.disabled = false;
      submitButton.textContent = "Submit reply";
    });
});
