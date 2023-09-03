import { CommonPost,CommonGetAxios,CommonPostAxios } from '../../helpers/HttpClient';

export default{
    getInvoicesByDateRange,
    reorderingInvoices
}

async function getInvoicesByDateRange(data){
    const response = await CommonPostAxios('/api/v1/completed-invoices', null, data);
    return response;
}

async function reorderingInvoices(data){
    const response = await CommonPostAxios('',null,data)
}