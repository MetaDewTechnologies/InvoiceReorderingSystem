package Security.InvoiceSecurity.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaymentDetailResponse {
    private BigDecimal total;
    private BigDecimal remain;
    private List<PaymentDetails> paymentDetails;
}
