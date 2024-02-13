package Security.InvoiceSecurity.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "invoice_item")
@SequenceGenerator(
        name = "invoice_item_id_sequence",
        sequenceName = "invoice_item_id_sequence",
        allocationSize = 1
)
public class InvoiceItemDetailDTO {
    @Id
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "invoice_item_id_sequence"
    )
    @Column(name = "item_id")
    private Integer itemId;

    @NonNull
    private LocalDateTime date;

    @NonNull
    private String description;

    private String comment;

    @NonNull
    private String paymentType;

    @NonNull
    private BigDecimal amount;

    @NonNull
    private String paymentMethod;

    @NonNull
    private String cashier;
    private BigDecimal governmentTax;
    private BigDecimal serviceCharge;
    private Boolean isActive;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id")
    private InvoiceDetailDTO invoiceDetail; // This establishes the relationship


    // Override the toString() method without referencing invoiceDetail
    @Override
    public String toString() {
        return "InvoiceItemDetailDTO{" +
                "itemId=" + itemId +
                ", date=" + date +
                ", description='" + description + '\'' +
                ", comment='" + comment + '\'' +
                ", paymentType='" + paymentType + '\'' +
                ", amount=" + amount +
                ", paymentMethod='" + paymentMethod + '\'' +
                ", cashier='" + cashier + '\'' +
                ", isActive=" + isActive +
                '}';
    }
}
