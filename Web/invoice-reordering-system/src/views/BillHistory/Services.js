import { CommonPostAxios, CommonGetAxios } from "../../helpers/HttpClient";

export default {
  getInvoicesByDateRange,
  getGreenTaxByInvoiceId,
  getInvoiceDetailsByID,
};

async function getInvoicesByDateRange(data) {
  const response = await CommonPostAxios(
    "/api/v1/completed-invoices",
    null,
    data
  );
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
async function getInvoiceDetailsByID(invoiceId) {
  const response = await CommonGetAxios("/api/v1", invoiceId);
  return response;
}
