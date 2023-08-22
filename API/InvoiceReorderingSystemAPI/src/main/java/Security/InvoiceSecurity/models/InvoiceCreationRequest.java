package Security.InvoiceSecurity.models;

import jakarta.annotation.Nullable;
import lombok.Data;

import java.util.List;
@Data
public class InvoiceCreationRequest {

    private InvoiceDetailDTO invoiceDetail;
    @Nullable
    private List<InvoiceItemDetailDTO> invoiceItems;
}
