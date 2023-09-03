import {CommonPostAxios } from '../../helpers/HttpClient';

export default{
    getInvoicesByDateRange
}

async function getInvoicesByDateRange(data){
    const response = await CommonPostAxios('/api/v1/completed-invoices', null, data);
    return response;
}