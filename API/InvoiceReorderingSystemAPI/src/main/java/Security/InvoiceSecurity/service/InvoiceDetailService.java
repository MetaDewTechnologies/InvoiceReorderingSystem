package Security.InvoiceSecurity.service;

import Security.InvoiceSecurity.models.InvoiceDetailDTO;
import Security.InvoiceSecurity.models.RoomInvoiceResponse;
import Security.InvoiceSecurity.repository.InvoiceDetailRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InvoiceDetailService {

    private final InvoiceDetailRepository invoiceDetailRepository;

    public InvoiceDetailDTO saveInvoiceDetail(InvoiceDetailDTO invoiceDetail) {
        Integer invoiceId = invoiceDetail.getInvoiceId();
        if (invoiceId != null && invoiceDetailRepository.existsById(invoiceId)) {
            return invoiceDetail; // Return existing entity
        }
        return invoiceDetailRepository.save(invoiceDetail);
    }

//    public InvoiceDetailDTO getInvoiceDetailById(Integer invoiceId) {
//        return invoiceDetailRepository.findById(invoiceId).orElse(null);
//    }

    public List<InvoiceDetailDTO> getInvoiceDetailsByReservationNum(String reservationNum) {
        return invoiceDetailRepository.findByReservationNum(reservationNum);
    }



    public List<RoomInvoiceResponse> getRoomInvoicesByRoomNum(String roomNum) {
        return invoiceDetailRepository.findRoomInvoicesByRoomNumAndNotCompleted(roomNum);
    }

}
