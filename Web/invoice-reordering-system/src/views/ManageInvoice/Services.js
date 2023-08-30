import { CommonPost,CommonGetAxios,CommonPostAxios } from '../../helpers/HttpClient';

export default {
    saveInvoice,
    getInvoiceDetailsByID,
    GetInvoiceDetailsByRoomNumber
};

async function saveInvoice(data) {
    const response = await CommonPostAxios('/api/v1/create-with-items', null, data);
    return response;
}

async function getInvoiceDetailsByID(invoiceId){
    const response = await CommonGetAxios('/api/v1/search',invoiceId)
    return response;
}

async function GetInvoiceDetailsByRoomNumber(roomNum){
    const response = await CommonGetAxios('/api/v1/room-invoices', roomNum);
    return response
}