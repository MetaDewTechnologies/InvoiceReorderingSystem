package Security.InvoiceSecurity.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="invoice_details")
public class InvoiceDetailDTO {
    @Id
    @GeneratedValue
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
            name="is_invoice_generated",
            nullable = false
    )
    private boolean isInvoiceGenerated;
    @Column(
            name="is_invoice_completed",
            nullable = false
    )
    private boolean isInvoiceCompleted;
    @Column(
            name="is_reordered",
            nullable = false
    )
    private boolean isReordered;

    @OneToMany(mappedBy = "invoiceDetail", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<InvoiceItemDetailDTO> invoiceItems;




}
