import { CommonPostAxios, CommonGetAxios } from "../../helpers/HttpClient";

export default {
  getInvoicesByDateRange,
  handleCreateInvoice,
  saveGreenTax,
  getGreenTaxByInvoiceId,
};

async function getInvoicesByDateRange(data) {
  const response = await CommonPostAxios(
    "/api/v1/completed-invoices",
    null,
    data
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

async function saveGreenTax(invoiceId, model) {
  const response = await CommonPostAxios("/api/v1/greenTax", invoiceId, model);
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
