package Security.InvoiceSecurity.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="payment_details")
@SequenceGenerator(
        name = "payment_id_sequence",
        sequenceName = "payment_id_sequence",
        allocationSize = 1
)
public class PaymentDetails {

    @Id
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "payment_id_sequence"
    )
    @Column(
            name="payment_id"
    )
    private Integer paymentId;
    private LocalDateTime paymentDateTime;
    private String paymentMethod;
    private Integer invoiceId;
    @Column(columnDefinition = "NUMERIC(19, 2) DEFAULT 0.0")
    private BigDecimal amount = BigDecimal.ZERO;
    @OneToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "invoice_id", referencedColumnName = "invoiceId", unique = true)
    private InvoiceDetailDTO paymentDetail;

}
