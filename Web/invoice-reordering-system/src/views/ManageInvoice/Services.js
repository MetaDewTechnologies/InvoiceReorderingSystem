import { CommonPost,CommonPostAxios } from '../../helpers/HttpClient';

export default {
    saveInvoice
};


async function saveInvoice(data) {
    const response = await CommonPost('/api/v1/create-with-items', null, data);
    return response;
}