package Security.InvoiceSecurity.repository;

import Security.InvoiceSecurity.models.InvoiceItemDetailDTO;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvoiceItemDetailRepository extends JpaRepository<InvoiceItemDetailDTO, Integer> {

    List<InvoiceItemDetailDTO> findByInvoiceDetail_InvoiceId(Integer invoiceId);

}
