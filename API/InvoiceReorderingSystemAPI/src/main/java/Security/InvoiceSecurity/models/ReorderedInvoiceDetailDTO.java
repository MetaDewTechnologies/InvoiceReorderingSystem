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
public class ReorderedInvoiceDetailDTO {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "reordered_invoice_id_sequence")
    @Column(name = "reordered_invoice_id")
    private Integer reorderedInvoiceId;


    @OneToOne(fetch = FetchType.LAZY)
    //@JoinColumn(name = "invoice_id", referencedColumnName = "invoiceId", unique = true)
    private InvoiceDetailDTO invoiceDetailnew;


}
