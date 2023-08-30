package Security.InvoiceSecurity.service;

import Security.InvoiceSecurity.models.*;
import Security.InvoiceSecurity.repository.InvoiceDetailRepository;
import Security.InvoiceSecurity.repository.InvoiceItemDetailRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InvoiceDetailService {

    private final InvoiceDetailRepository invoiceDetailRepository;
    private final InvoiceItemDetailRepository invoiceItemDetailRepository;

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

    public InvoiceWithItemsResponse getInvoiceWithItemsById(Integer invoiceId) {
        InvoiceDetailDTO invoiceDetail = invoiceDetailRepository.findInvoiceDetailWithItemsById(invoiceId);
        if (invoiceDetail == null) {
            return null; // Return null if invoice not found
        }
        return new InvoiceWithItemsResponse(invoiceDetail, invoiceItemDetailRepository.findByInvoiceDetail_InvoiceId(invoiceId));
    }

        //updateInvoices
    public InvoiceWithItemsResponse updateInvoice(Integer invoiceId, InvoiceWithItemsRequest request) {
        InvoiceDetailDTO existingInvoiceDetail = invoiceDetailRepository.findById(invoiceId).orElse(null);

        if (existingInvoiceDetail == null) {
            return null; // Invoice not found
        }

        // Update InvoiceDetailDTO properties
        InvoiceDetailDTO updatedInvoiceDetail = request.getInvoiceDetail();
        existingInvoiceDetail.setRoomNum(updatedInvoiceDetail.getRoomNum());
        existingInvoiceDetail.setCustomerName(updatedInvoiceDetail.getCustomerName());
        existingInvoiceDetail.setAddress(updatedInvoiceDetail.getAddress());
        // ... Update other properties ...

        invoiceDetailRepository.save(existingInvoiceDetail);

        // Update InvoiceItemDetailDTOs if provided
        List<InvoiceItemDetailDTO> updatedInvoiceItems = request.getInvoiceItems();
        if (updatedInvoiceItems != null) {
            for (InvoiceItemDetailDTO updatedItem : updatedInvoiceItems) {
                Optional<InvoiceItemDetailDTO> existingItemOptional = invoiceItemDetailRepository.findById(updatedItem.getItemId());
                existingItemOptional.ifPresent(existingItem -> {
                    // Update InvoiceItemDetailDTO properties
                    existingItem.setDescription(updatedItem.getDescription());
                    existingItem.setAmount(updatedItem.getAmount());
                    // ... Update other properties ...

                    invoiceItemDetailRepository.save(existingItem);
                });
            }
        }

        return new InvoiceWithItemsResponse(existingInvoiceDetail, updatedInvoiceItems);
    }

}
