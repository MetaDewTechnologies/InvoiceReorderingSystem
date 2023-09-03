package Security.InvoiceSecurity.models;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DateRange {
   // private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSSSSS");

    private LocalDateTime arrivalDate;
    private LocalDateTime departureDate;

//    public void setArrivalDate(String arrivalDate) {
//        this.arrivalDate = LocalDateTime.parse(arrivalDate, DATE_TIME_FORMATTER);
//    }
//
//    public void setDepartureDate(String departureDate) {
//        this.departureDate = LocalDateTime.parse(departureDate, DATE_TIME_FORMATTER);
//    }

}