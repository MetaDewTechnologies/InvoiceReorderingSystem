package Security.InvoiceSecurity.service;

import Security.InvoiceSecurity.models.*;
import Security.InvoiceSecurity.repository.InvoiceDetailRepository;
import Security.InvoiceSecurity.repository.InvoiceItemDetailRepository;
import Security.InvoiceSecurity.repository.ReorderedInvoiceDetailRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InvoiceDetailService {

    private final InvoiceDetailRepository invoiceDetailRepository;
    private final InvoiceItemDetailRepository invoiceItemDetailRepository;
    private final ReorderedInvoiceDetailRepository reorderedInvoiceDetailRepository;

    public InvoiceDetailDTO saveInvoiceDetail(InvoiceDetailDTO invoiceDetail) {
        Integer invoiceId = invoiceDetail.getInvoiceId();
        String roomNum = invoiceDetail.getRoomNum();
        //boolean exist = invoiceDetailRepository.areAllInvoicesCompletedForRoom(roomNum);

        if (invoiceId != null && invoiceDetailRepository.existsById(invoiceId)) {
            //invoiceDetail.equals(null);
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
        existingInvoiceDetail.setArrivalDate(updatedInvoiceDetail.getArrivalDate());
        existingInvoiceDetail.setDepartureDate(updatedInvoiceDetail.getDepartureDate());
        existingInvoiceDetail.setAddress(updatedInvoiceDetail.getAddress());
        existingInvoiceDetail.setCity(updatedInvoiceDetail.getCity());
        existingInvoiceDetail.setCountry(updatedInvoiceDetail.getCountry());
        existingInvoiceDetail.setIsInvoiceCompleted(updatedInvoiceDetail.getIsInvoiceCompleted());
        existingInvoiceDetail.setIsInvoiceGenerated(updatedInvoiceDetail.getIsInvoiceGenerated());
        existingInvoiceDetail.setIsReordered(updatedInvoiceDetail.getIsReordered());

        // ... Update other properties ...

        invoiceDetailRepository.save(existingInvoiceDetail);

        // Update InvoiceItemDetailDTOs if provided
        // Update InvoiceItemDetailDTOs if provided
        List<InvoiceItemDetailDTO> updatedInvoiceItems = request.getInvoiceItems();
        if (updatedInvoiceItems != null) {
            for (InvoiceItemDetailDTO updatedItem : updatedInvoiceItems) {
                if (updatedItem.getItemId() == null) {
                    // New item, create and save it
                    InvoiceItemDetailDTO newItem = new InvoiceItemDetailDTO();
                    newItem.setDate(updatedItem.getDate());
                    newItem.setDescription(updatedItem.getDescription());
                    newItem.setComment(updatedItem.getComment());
                    newItem.setPaymentType(updatedItem.getPaymentType());
                    newItem.setAmount(updatedItem.getAmount());
                    newItem.setPaymentMethod(updatedItem.getPaymentMethod());
                    newItem.setCashier(updatedItem.getCashier());
                    newItem.setIsActive(updatedItem.getIsActive());
                    newItem.setInvoiceDetail(existingInvoiceDetail);

                    // ... Set other properties ...

                    invoiceItemDetailRepository.save(newItem);
                } else {
                    Optional<InvoiceItemDetailDTO> existingItemOptional = invoiceItemDetailRepository.findById(updatedItem.getItemId());
                    existingItemOptional.ifPresent(existingItem -> {
                        // Update existing item properties
                        existingItem.setDate(updatedItem.getDate());
                        existingItem.setDescription(updatedItem.getDescription());
                        existingItem.setComment(updatedItem.getComment());
                        existingItem.setPaymentType(updatedItem.getPaymentType());
                        existingItem.setAmount(updatedItem.getAmount());
                        existingItem.setPaymentMethod(updatedItem.getPaymentMethod());
                        existingItem.setCashier(updatedItem.getCashier());
                        existingItem.setIsActive(updatedItem.getIsActive());

                        // ... Update other properties ...

                        invoiceItemDetailRepository.save(existingItem);
                    });
                }
                }
            }

            return new InvoiceWithItemsResponse(existingInvoiceDetail, updatedInvoiceItems);
        }


    public boolean markInvoiceCompleted(Integer invoiceId) {
        Optional<InvoiceDetailDTO> invoiceDetailOptional = invoiceDetailRepository.findById(invoiceId);

        if (invoiceDetailOptional.isPresent()) {
            InvoiceDetailDTO invoiceDetail = invoiceDetailOptional.get();
            invoiceDetail.setIsInvoiceCompleted(true);
            invoiceDetailRepository.save(invoiceDetail);
            return true;
        }

        return false;
    }

    public Integer markInvoiceGeneratedCompletedReordered(Integer invoiceId) {
        Optional<InvoiceDetailDTO> invoiceDetailOptional = invoiceDetailRepository.findById(invoiceId);

        if (invoiceDetailOptional.isPresent()) {
            InvoiceDetailDTO invoiceDetail = invoiceDetailOptional.get();
            invoiceDetail.setIsInvoiceGenerated(true);
            invoiceDetail.setIsInvoiceCompleted(true);
            invoiceDetail.setIsReordered(true);
            invoiceDetail.setInvoiceGeneratedDate(LocalDateTime.now());

            // Update the existing InvoiceDetailDTO
            invoiceDetailRepository.save(invoiceDetail);

            // Check if the invoiceId already exists in reordered_invoice_details
            if (reorderedInvoiceDetailRepository.existsByInvoiceDetailnew(invoiceDetail)) {
                return null; // InvoiceId already exists in reordered_invoice_details
            }

            // Create a new ReorderedInvoiceDetailDTO
            ReorderedInvoiceDetailDTO reorderedInvoiceDetail = new ReorderedInvoiceDetailDTO();
            reorderedInvoiceDetail.setInvoiceDetailnew(invoiceDetail);

            // Save the reordered invoiceDetail and get the reorderedInvoiceId
            reorderedInvoiceDetailRepository.save(reorderedInvoiceDetail);
            return reorderedInvoiceDetail.getReorderedInvoiceId();
        }

        return null;
    }

    public Integer areAllInvoicesCompletedForRoom(String roomNum) {
        return invoiceDetailRepository.areAllInvoicesCompletedForRoom(roomNum);
    }

    public List<InvoiceDetailDTO> getCompletedInvoicesBetweenDates(LocalDateTime arrivalDate,LocalDateTime depatureDate){

        return invoiceDetailRepository.findCompletedInvoicesBetweenDates(arrivalDate,depatureDate);
    }

    public boolean reorderInvoices(ReorderInvoiceRequest request) {
        List<Integer> invoiceIds = request.getInvoiceIds();

        for (Integer invoiceId : invoiceIds) {
            Optional<InvoiceDetailDTO> invoiceDetailOptional = invoiceDetailRepository.findById(invoiceId);

            if (invoiceDetailOptional.isPresent()) {
                InvoiceDetailDTO invoiceDetail = invoiceDetailOptional.get();

                if (!invoiceDetail.getIsReordered()) {
                    // Mark the invoice as reordered
                    invoiceDetail.setIsReordered(true);
                    invoiceDetailRepository.save(invoiceDetail);

                    // Create a new ReorderedInvoiceDetailDTO
                    ReorderedInvoiceDetailDTO reorderedInvoiceDetail = new ReorderedInvoiceDetailDTO();
                    if(reorderedInvoiceDetailRepository.existsByInvoiceDetailnew_InvoiceId(invoiceId)){
                        return false;
                    }else {
                        reorderedInvoiceDetail.setInvoiceDetailnew(invoiceDetail);

                        // Save the reordered invoiceDetail
                        reorderedInvoiceDetailRepository.save(reorderedInvoiceDetail);
                    }
                }
            }else{
                return false;
            }
        }
        return true;
    }
}
