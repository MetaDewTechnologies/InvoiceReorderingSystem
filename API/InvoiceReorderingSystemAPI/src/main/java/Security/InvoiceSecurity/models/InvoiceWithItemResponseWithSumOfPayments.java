package Security.InvoiceSecurity.models;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceWithItemResponseWithSumOfPayments {
    private InvoiceWithItemsResponse invoiceWithItemsResponse;
    private BigDecimal sumOfPayments;
}
