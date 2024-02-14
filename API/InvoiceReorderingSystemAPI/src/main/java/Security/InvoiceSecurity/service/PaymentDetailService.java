package Security.InvoiceSecurity.service;

import Security.InvoiceSecurity.models.PaymentDetails;
import Security.InvoiceSecurity.repository.PaymentDetailRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class PaymentDetailService {
    private final PaymentDetailRepository paymentDetailRepository;

//    if (invoiceId != null && invoiceDetailRepository.existsById(invoiceId)) {
//        //invoiceDetail.equals(null);
//        return invoiceDetail; // Return existing entity
//    }
//
//            return invoiceDetailRepository.save(invoiceDetail);

    public boolean paymentDetailAdd(PaymentDetails request) {
        paymentDetailRepository.save(request);
        return true;
    }

    public BigDecimal sumOfPayment(Integer invoiceId){
       return paymentDetailRepository.sumAmountForPayment(invoiceId);
    }
}
