package Security.InvoiceSecurity.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompleteInvoiceRequest {

    private String cashierName;
    private BigDecimal payment;
}
