import { CommonGetAxios, CommonPostAxios } from "../../helpers/HttpClient";

export default {
  saveInvoice,
  getInvoiceDetailsByID,
  GetInvoiceDetailsByRoomNumber,
  updateInvoice,
  handleCompleteBilling,
  handlePermission,
  deleteInvoiceItem,
  handleCreateInvoice,
  saveGreenTax,
  getGreenTaxByInvoiceId,
  getBillsByDateRange,
  addPaymentData,
  getPaymentDetails,
};

async function saveInvoice(data) {
  const response = await CommonPostAxios(
    "/api/v1/create-with-items",
    null,
    data
  );
  return response;
}
async function updateInvoice(data, invoiceId) {
  const response = await CommonPostAxios("/api/v1/update", invoiceId, data);
  return response;
}

async function getInvoiceDetailsByID(invoiceId) {
  const response = await CommonGetAxios("/api/v1", invoiceId);
  return response;
}

async function GetInvoiceDetailsByRoomNumber(roomNum) {
   const roomNumber = roomNum == "" ? "" : roomNum
   const model = {
     roomNumber : roomNumber
   }
  const response = await CommonPostAxios("/api/v1/room-invoices", null, model);
  return response;
}

async function handleCompleteBilling(invoiceId, cashierName, paymentToBePaid, finalPaymentMethod) {
  const model = {
    cashierName: cashierName,
    payment: paymentToBePaid,
    finalPaymentMethod: finalPaymentMethod
  };
  const response = await CommonPostAxios(
    "/api/v1/complete-invoice",
    invoiceId,
    model
  );
  return response;
}

async function handlePermission(data) {
  const response = await CommonPostAxios(
    "/api/v1/special-authenticate",
    null,
    data
  );
  return response;
}

async function deleteInvoiceItem(itemId) {
  const response = await CommonPostAxios(
    "/api/v1/deactivate-item",
    itemId,
    null
  );
  return response;
}

async function handleCreateInvoice(invoiceId) {
  const response = await CommonPostAxios(
    "/api/v1/reorder-invoice",
    invoiceId,
    null
  );
  return response;
}

async function saveGreenTax(invoiceId) {
  const response = await CommonPostAxios("/api/v1/greenTax", invoiceId, null);
  return response;
}
async function getGreenTaxByInvoiceId(invoiceId) {
  const response = await CommonPostAxios(
    "/api/v1/checkGreenTax",
    invoiceId,
    null
  );
  return response;
}
async function getBillsByDateRange(model) {
  const response = await CommonPostAxios("/api/v1/all-invoices", null, model);
  return response;
}
async function addPaymentData(model) {
  const response = await CommonPostAxios(
    "/api/v1/payment-invoices",
    null,
    model
  );
  return response;
}

async function getPaymentDetails(invoiceId) {
  const response = await CommonGetAxios("/api/v1/allPayment", invoiceId);
  return response;
}
