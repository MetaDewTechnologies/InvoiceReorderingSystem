package Security.InvoiceSecurity;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class DateUtils {
    private static final DateTimeFormatter databaseFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter requestFormatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

//    public static LocalDateTime parseDatabaseDateTime(String dateTimeStr) {
//        return LocalDateTime.parse(dateTimeStr, databaseFormatter);
//    }

    public static String formatRequestDateTime(LocalDateTime dateTime) {
        return dateTime.format(requestFormatter);
    }

    private static final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public static LocalDateTime parseDatabaseDateTime(String dateString) {
        try {
            // Parse the input string into a LocalDateTime using the dateFormatter
            return LocalDateTime.parse(dateString, dateFormatter);
        } catch (Exception e) {
            // Handle any parsing exceptions here, such as invalid date formats
            e.printStackTrace();
            return null; // Return null if parsing fails
        }
    }
}

