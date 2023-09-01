package Security.InvoiceSecurity.repository;

import Security.InvoiceSecurity.models.ReorderedInvoiceDetailDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// ReorderedInvoiceDetailRepository.java
@Repository
public interface ReorderedInvoiceDetailRepository extends JpaRepository<ReorderedInvoiceDetailDTO, Integer> {
}

