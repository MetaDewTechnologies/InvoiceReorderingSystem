import { CommonGetAxios, CommonPostAxios } from "../../helpers/HttpClient";

export default {
  getInvoicesByDateRange,
  reorderingInvoices,
  getPaymentDetails
};

async function getInvoicesByDateRange(data) {
  const response = await CommonPostAxios(
    "/api/v1/completed-invoices",
    null,
    data
  );
  return response;
}

async function reorderingInvoices(data) {
  const response = await CommonPostAxios(
    "/api/v1/reorder-invoices",
    null,
    data
  );
  return response;
}

async function getPaymentDetails(invoiceId) {
  const response = await CommonGetAxios("/api/v1/allPayment", invoiceId);
  return response;
}