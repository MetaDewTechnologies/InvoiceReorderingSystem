package Security.InvoiceSecurity.models;

import Security.InvoiceSecurity.models.InvoiceDetailDTO;
import Security.InvoiceSecurity.models.InvoiceItemDetailDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class InvoiceResponseForResNum {

    private InvoiceDetailDTO invoiceDetail;
    private List<InvoiceItemDetailDTO> invoiceItems;
}
