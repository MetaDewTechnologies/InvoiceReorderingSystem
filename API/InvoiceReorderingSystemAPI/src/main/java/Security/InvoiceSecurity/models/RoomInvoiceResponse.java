package Security.InvoiceSecurity.models;

import lombok.*;

import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomInvoiceResponse {
    private Integer invoiceId;
    private String reservationNum;
    private String roomNum;
    private LocalDateTime arrivalDate;
    private LocalDateTime departureDate;
    private String customerName;
}
