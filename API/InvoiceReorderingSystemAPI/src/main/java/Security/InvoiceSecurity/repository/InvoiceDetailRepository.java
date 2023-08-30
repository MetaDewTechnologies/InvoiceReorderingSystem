package Security.InvoiceSecurity.repository;

import Security.InvoiceSecurity.models.InvoiceDetailDTO;
import Security.InvoiceSecurity.models.RoomInvoiceResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface InvoiceDetailRepository extends JpaRepository<InvoiceDetailDTO, Integer> {

    List<InvoiceDetailDTO> findByReservationNum(String reservationNum);

    @Query("SELECT new Security.InvoiceSecurity.models.RoomInvoiceResponse(" +
            "invoiceId,reservationNum, roomNum, arrivalDate, departureDate, customerName) " +
            "FROM InvoiceDetailDTO WHERE roomNum = :roomNum AND isInvoiceCompleted = false")
    List<RoomInvoiceResponse> findRoomInvoicesByRoomNumAndNotCompleted(String roomNum);
}
