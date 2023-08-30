package Security.InvoiceSecurity.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceWithItemsResponse {
    private InvoiceDetailDTO invoiceDetail;
    private List<InvoiceItemDetailDTO> invoiceItems;
}
