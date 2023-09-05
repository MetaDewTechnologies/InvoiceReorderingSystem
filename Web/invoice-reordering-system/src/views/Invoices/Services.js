import {CommonPostAxios } from '../../helpers/HttpClient';

export default{
    getInvoicesByDateRange,
    handleCreateInvoice
}

async function getInvoicesByDateRange(data){
    const response = await CommonPostAxios('/api/v1/completed-invoices', null, data);
    return response;
}
async function handleCreateInvoice(invoiceId){
    const response = await CommonPostAxios('/api/v1/reorder-invoice',invoiceId,null)
    return response
}