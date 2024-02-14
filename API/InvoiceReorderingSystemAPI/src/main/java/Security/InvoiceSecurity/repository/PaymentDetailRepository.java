package Security.InvoiceSecurity.repository;

import Security.InvoiceSecurity.models.InvoiceItemDetailDTO;
import Security.InvoiceSecurity.models.PaymentDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface PaymentDetailRepository extends JpaRepository<PaymentDetails, Integer> {

    boolean existsPaymentDetailsByInvoiceId(Integer invoiceId);

    @Query("SELECT SUM(payment.amount) FROM PaymentDetails payment WHERE payment.invoiceId = :invoiceId")
    BigDecimal sumAmountForPayment(@Param("invoiceId") Integer invoiceId);

    List<PaymentDetails> findAllPaymentByInvoiceId(Integer invoiceId);

    PaymentDetails getPaymentDetailsByInvoiceId(Integer invoiceId);
}
