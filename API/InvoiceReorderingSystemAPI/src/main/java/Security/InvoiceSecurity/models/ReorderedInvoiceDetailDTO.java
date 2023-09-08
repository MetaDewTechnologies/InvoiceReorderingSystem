package Security.InvoiceSecurity.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "reordered_invoice_details")
@SequenceGenerator(
        name = "reorder_invoice_id_sequence",
        sequenceName = "reorder_invoice_id_sequence",
        allocationSize = 1
)
public class ReorderedInvoiceDetailDTO {
    @Id
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "reorder_invoice_id_sequence"
    )
    @Column(name = "reordered_invoice_id")
    private Integer reorderedInvoiceId;


    @OneToOne(fetch = FetchType.LAZY)
   // @JoinColumn(name = "invoice_id", referencedColumnName = "invoiceId", unique = true)
    private InvoiceDetailDTO invoiceDetailnew;


}
