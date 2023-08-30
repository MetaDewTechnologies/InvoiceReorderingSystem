package Security.InvoiceSecurity.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceWithItemsRequest {
    private InvoiceDetailDTO invoiceDetail;
    private List<InvoiceItemDetailDTO> invoiceItems;
}
