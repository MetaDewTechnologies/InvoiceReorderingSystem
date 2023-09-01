package Security.InvoiceSecurity.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PdfResponse {


    private String reservationNum;
    private String roomNum;
    private LocalDateTime arrivalDate;
    private LocalDateTime departureDate;
    private String customerName;
    private String cashier;

}
