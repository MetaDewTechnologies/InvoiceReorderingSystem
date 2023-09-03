import { CommonPost,CommonGetAxios,CommonPostAxios } from '../../helpers/HttpClient';

export default{
    getInvoicesByDateRange
}

async function getInvoicesByDateRange(data){
    console.log("dta", data);
    const response = await CommonPostAxios('', null, data);
    return response;
}