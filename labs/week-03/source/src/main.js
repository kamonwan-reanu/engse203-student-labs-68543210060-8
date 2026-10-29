const form = document.querySelector("#request-form");
const status = document.querySelector("#form-status");
const detailsCount = document.querySelector("#details-count"); 

const previewName = document.querySelector("#preview-name");
const previewType = document.querySelector("#preview-type");
const previewDetails = document.querySelector("#preview-details");
const requestList = document.querySelector("#request-list");

let total = 0;
let pending = 0;
let approved = 0;

const count = {
  total: document.querySelector("#total-count"),
  pending: document.querySelector("#pending-count"),
  approved: document.querySelector("#approved-count"),
};

function readForm(formElement) {
  return Object.fromEntries(new FormData(formElement).entries());
}

function renderPreview(data) {
  const requesterName = (data.requesterName || "").trim();
  const requestType = data.requestType || "";
  const detailsContent = (data.details || "").trim();

  previewName.textContent = requesterName || "ยังไม่ระบุชื่อ";
  previewType.textContent = requestType || "ยังไม่เลือกประเภท";
  previewDetails.textContent = detailsContent || "ยังไม่มีรายละเอียด";
  detailsCount.textContent = `${detailsContent.length} ตัวอักษร`; 
}

function validate(data) {
  const errors = {};
  if ((data.requesterName || "").trim().length < 2) {
    errors.requesterName = "กรุณากรอกชื่อผู้ขอรับบริการ";
  }
  if (!data.requestType) {
    errors.requestType = "กรุณาเลือกประเภทคําขอ";
  }
  if ((data.details || "").trim().length < 10) {
    errors.details = "กรุณาอธิบายอย่างน้อย 10 ตัวอักษร";
  }
  return errors;
}

function renderErrors(errors) {
  for (const name of ["requesterName", "requestType", "details"]) {
    const field = form.elements[name];
    const output = document.querySelector(`#${name}-error`);
    const message = errors[name] ?? "";
    
    if (output && field) {
      output.textContent = message;
      field.setAttribute("aria-invalid", String(Boolean(message)));
    }
  }
}

form.addEventListener("input", (event) => {
  const data = readForm(event.currentTarget);
  renderPreview(data);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  handleSubmit(event.currentTarget);
});

function handleSubmit(formElement) {
  const data = readForm(formElement);
  const errors = validate(data);
  
  renderErrors(errors);
  
  if (Object.keys(errors).length > 0) {
    renderStatus("invalid", "กรุณาตรวจสอบข้อมูลที่ระบุ");
    return;
  }
  
  addRequest(data);
  renderStatus("success", "บันทึกคําขอเรียบร้อย");
  formElement.reset();
  renderPreview(readForm(formElement));
}

function renderStatus(state, message) {
  if (status) {
    status.dataset.state = state;
    status.textContent = message;
  }
}

function addRequest(data) {
  const item = document.createElement("li");
  const title = document.createElement("strong");
  const detailsSpan = document.createElement("span");
  
  title.textContent = `${data.requesterName} • ${data.requestType}`;
  detailsSpan.textContent = data.details;

  const approveBtn = document.createElement("button");
  approveBtn.textContent = "Approve";
  approveBtn.type = "button";

  approveBtn.addEventListener("click", () => {
    pending--;
    approved++;
    updateStage();
    approveBtn.remove();
    item.classList.add("approved");
  });

  item.append(title, detailsSpan, approveBtn);
  requestList.prepend(item);
  
  total++;
  pending++;
  updateStage();
}

function updateStage() {
  if (count.total && count.pending && count.approved) {
      count.total.textContent = total;
      count.pending.textContent = pending;
      count.approved.textContent = approved;
  }
}

console.log("LAB 3 starter ready");
updateStage();