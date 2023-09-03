package Security.InvoiceSecurity.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReorderedInvoiceResponse {
    private Integer invoiceId;
    private String reservationNum;
    private String roomNum;
    private LocalDateTime departureDate;
    private String customerName;
    private String customerEmail;
    private String address;
    private String city;
    private String country;
    private String bookingType;
    private Boolean isInvoiceGenerated;
    private Boolean isInvoiceCompleted;
    private Boolean isReordered;
    private LocalDateTime invoiceGeneratedDate;

}
