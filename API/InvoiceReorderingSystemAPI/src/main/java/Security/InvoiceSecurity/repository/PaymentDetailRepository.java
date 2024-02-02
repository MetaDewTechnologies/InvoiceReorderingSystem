package Security.InvoiceSecurity.repository;

import Security.InvoiceSecurity.models.InvoiceItemDetailDTO;
import Security.InvoiceSecurity.models.PaymentDetails;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentDetailRepository extends JpaRepository<PaymentDetails, Integer> {

}
