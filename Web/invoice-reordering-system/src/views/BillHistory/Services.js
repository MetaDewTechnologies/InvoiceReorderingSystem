import { CommonPostAxios, CommonGetAxios } from "../../helpers/HttpClient";

export default {
  getInvoicesByDateRange,
  getGreenTaxByInvoiceId,
  getcompletedInvoiceDetailsByID,
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
async function getcompletedInvoiceDetailsByID(invoiceId) {
  const response = await CommonGetAxios(
    "/api/v1/completedInvoices",
    invoiceId,
    null
  );
  return response[0];
}
