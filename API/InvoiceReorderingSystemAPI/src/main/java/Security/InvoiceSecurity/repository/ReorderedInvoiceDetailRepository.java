package Security.InvoiceSecurity.repository;

import Security.InvoiceSecurity.models.InvoiceDetailDTO;
import Security.InvoiceSecurity.models.ReorderedInvoiceDetailDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

// ReorderedInvoiceDetailRepository.java
@Repository
public interface ReorderedInvoiceDetailRepository extends JpaRepository<ReorderedInvoiceDetailDTO, Integer> {
    boolean existsByInvoiceDetailnew(InvoiceDetailDTO invoiceDetail);

    boolean existsByInvoiceDetailnew_InvoiceId(Integer invoiceId);
}

