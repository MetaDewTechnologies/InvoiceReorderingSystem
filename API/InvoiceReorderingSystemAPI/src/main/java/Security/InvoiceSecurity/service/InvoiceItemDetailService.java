package Security.InvoiceSecurity.service;

import Security.InvoiceSecurity.models.InvoiceItemDetailDTO;
import Security.InvoiceSecurity.repository.InvoiceItemDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InvoiceItemDetailService {
    private final InvoiceItemDetailRepository invoiceItemDetailRepository;

    @Autowired
    public InvoiceItemDetailService(InvoiceItemDetailRepository invoiceItemDetailRepository) {
        this.invoiceItemDetailRepository = invoiceItemDetailRepository;
    }

    public InvoiceItemDetailDTO saveInvoiceItemDetail(InvoiceItemDetailDTO invoiceItemDetail) {
        return invoiceItemDetailRepository.save(invoiceItemDetail);
    }

    public List<InvoiceItemDetailDTO> getInvoiceItemsByInvoiceId(Integer invoiceId) {
        return invoiceItemDetailRepository.findByInvoiceDetail_InvoiceId(invoiceId);
    }
}
