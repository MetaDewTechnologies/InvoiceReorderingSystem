package Security.InvoiceSecurity.repository;

import Security.InvoiceSecurity.models.InvoiceDetailDTO;
import Security.InvoiceSecurity.models.RoomInvoiceResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface InvoiceDetailRepository extends JpaRepository<InvoiceDetailDTO, Integer> {

    List<InvoiceDetailDTO> findByReservationNum(String reservationNum);

    @Query("SELECT new Security.InvoiceSecurity.models.RoomInvoiceResponse(" +
            "invoiceId, reservationNum, roomNum, arrivalDate, departureDate, customerName) " +
            "FROM InvoiceDetailDTO WHERE roomNum = :roomNum AND isInvoiceCompleted = false")
    List<RoomInvoiceResponse> findRoomInvoicesByRoomNumAndNotCompleted(String roomNum);


    @Query("SELECT i FROM InvoiceDetailDTO i LEFT JOIN FETCH i.invoiceItems WHERE i.invoiceId = :invoiceId")
    InvoiceDetailDTO findInvoiceDetailWithItemsById(@Param("invoiceId") Integer invoiceId);


//    @Query("SELECT COUNT(i) = COUNT(CASE WHEN i.isInvoiceCompleted = true THEN 1 ELSE NULL END) " +
//            "FROM InvoiceDetailDTO i WHERE i.roomNum = :roomNum")
//    boolean areAllInvoicesCompletedForRoom(@Param("roomNum") String roomNum);

    @Query("SELECT COUNT(*) FROM InvoiceDetailDTO i WHERE i.roomNum = :roomNum AND i.isInvoiceCompleted = false")
    Integer areAllInvoicesCompletedForRoom(@Param("roomNum") String roomNum);


    // Add a custom query to fetch reordered invoices within a date range with isInvoiceCompleted as true
    @Query("SELECT i FROM InvoiceDetailDTO i LEFT JOIN FETCH i.invoiceItems WHERE i.isInvoiceCompleted = true AND " +
            "i.arrivalDate >= :arrivalDate AND i.departureDate <= :departureDate")
    List<InvoiceDetailDTO> findCompletedInvoicesBetweenDates(
            @Param("arrivalDate") LocalDateTime arrivalDate,
            @Param("departureDate") LocalDateTime departureDate
    );
    @Query("SELECT i FROM InvoiceDetailDTO i LEFT JOIN FETCH i.invoiceItems WHERE i.isInvoiceCompleted = false AND " +
            "i.arrivalDate >= :arrivalDate AND i.departureDate <= :departureDate")
    List<InvoiceDetailDTO> findAllInvoicesBetweenDates(
            @Param("arrivalDate") LocalDateTime arrivalDate,
            @Param("departureDate") LocalDateTime departureDate
    );

    @Query("SELECT i FROM InvoiceDetailDTO i LEFT JOIN FETCH i.invoiceItems WHERE i.isInvoiceCompleted = true AND " +
            "i.invoiceId = :invoiceId")
    List<InvoiceDetailDTO> findInvoiceByID(
            @Param("invoiceId") Integer invoiceId
    );

    @Query("SELECT SUM(item.amount + item.governmentTax + item.serviceCharge) FROM InvoiceDetailDTO invoice " +
            "JOIN invoice.invoiceItems item " +
            "WHERE item.paymentType IN ('credit') " +
            "AND item.isActive = True " +
            "AND invoice.invoiceId = :invoiceId " +
            "GROUP BY invoice.invoiceId")
    BigDecimal sumOfCreditForBill(
            @Param("invoiceId") Integer invoiceId
    );

    @Query("SELECT SUM(item.amount + item.governmentTax + item.serviceCharge) FROM InvoiceDetailDTO invoice " +
            "JOIN invoice.invoiceItems item " +
            "WHERE item.paymentType IN ('debit') " +
            "AND item.isActive = True " +
            "AND invoice.invoiceId = :invoiceId " +
            "GROUP BY invoice.invoiceId")
    BigDecimal sumOfDebitForBill(
            @Param("invoiceId") Integer invoiceId
    );

//    @Query("SELECT SUM(item.amount) FROM InvoiceDetailDTO invoice " +
//            "JOIN invoice.invoiceItems item " +
//            "WHERE item paymentType IN ('debit') " +
//            "AND item.isActive = True " +
//            "AND invoice.invoiceId = :invoiceId " +
//            "GROUP BY invoice.invoiceId")
//    BigDecimal sumOfGovernmentTaxForBill(
//            @Param("invoiceId") Integer invoiceId
//    );
}

