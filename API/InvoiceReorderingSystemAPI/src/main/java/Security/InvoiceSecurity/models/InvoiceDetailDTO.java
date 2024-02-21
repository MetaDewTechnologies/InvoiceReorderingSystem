package Security.InvoiceSecurity.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="invoice_details")
@SequenceGenerator(
        name = "invoice_id_sequence",
        sequenceName = "invoice_id_sequence",
        allocationSize = 1
)
public class InvoiceDetailDTO {
    @Id
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "invoice_id_sequence"
    )
    @Column(
            name="invoice_id"
    )
    private Integer invoiceId;
    @Column(
            name="reservation_num",
            nullable = false
    )
    private String reservationNum;
    @Column(
            name="room_num",
            nullable = false
    )
    private String roomNum;
    @Column(
            name="arrival_date",
            nullable = false
    )
    private LocalDateTime arrivalDate;
    @Column(
            name="departure_date",
            nullable = false
    )
    private LocalDateTime departureDate;
    @Column(
            name="customer_name",
            nullable = false
    )
    private String customerName;
    @Column(
            name="customer_email",
            nullable = false
    )
    private String customerEmail;
    @Column(
            name="address",
            nullable = false
    )
    private String address;

    private String city;
    private String country;

    @Column(
            name="bookingType",
            nullable = false
    )
    private String bookingType;
    @Column(
            name="is_invoice_generated",
            nullable = false
    )
    private Boolean isInvoiceGenerated;
    @Column(
            name="is_invoice_completed",
            nullable = false
    )
    private Boolean isInvoiceCompleted;
    @Column(
            name="is_reordered",
            nullable = false
    )
    private Boolean isReordered;
    @Column(
            name="invoice_generated_date"

    )
    private LocalDateTime invoiceGeneratedDate;
    private String cashierName;
    private BigDecimal greenTax;
    private Integer count;
    @JsonIgnore
    @OneToMany(mappedBy = "invoiceDetail", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<InvoiceItemDetailDTO> invoiceItems;

@OneToOne(mappedBy = "invoiceDetailnew", cascade = CascadeType.ALL, fetch = FetchType.LAZY, optional = false)
//@JoinColumn(name = "invoice_id", referencedColumnName = "invoiceId")
private ReorderedInvoiceDetailDTO reorderedInvoiceDetail;

@OneToOne(mappedBy = "paymentDetail", cascade = CascadeType.ALL, fetch = FetchType.LAZY, optional = false)
private PaymentDetails paymentDetails;


}
