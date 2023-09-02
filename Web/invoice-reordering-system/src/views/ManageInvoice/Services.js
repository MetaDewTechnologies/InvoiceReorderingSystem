import { CommonPost,CommonGetAxios,CommonPostAxios } from '../../helpers/HttpClient';

export default {
    saveInvoice,
    getInvoiceDetailsByID,
    GetInvoiceDetailsByRoomNumber,
    updateInvoice,
    handleCompleteBilling,
    handlePermission
};

async function saveInvoice(data) {
    const response = await CommonPostAxios('/api/v1/create-with-items', null, data);
    return response;
}
async function updateInvoice(data,invoiceId) {
    const response = await CommonPostAxios('/api/v1/update', invoiceId, data);
    return response;
}

async function getInvoiceDetailsByID(invoiceId){
    const response = await CommonGetAxios('/api/v1',invoiceId)
    return response;
}

async function GetInvoiceDetailsByRoomNumber(roomNum){
    const response = await CommonGetAxios('/api/v1/room-invoices', roomNum);
    return response
}

async function handleCompleteBilling(invoiceId){
    const response = await CommonPostAxios('/api/v1/complete-invoice',invoiceId,null);
    return response;
}

async function handlePermission(data){
    const response = await CommonPostAxios('/api/v1/special-authenticate',null,data);
    return response;
}