package Security.InvoiceSecurity.models;

import jakarta.persistence.SequenceGenerator;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReorderInvoiceRequest {
    private List<Integer> invoiceIds;
}
