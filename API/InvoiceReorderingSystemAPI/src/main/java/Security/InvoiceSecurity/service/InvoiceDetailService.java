package Security.InvoiceSecurity.service;

import Security.InvoiceSecurity.models.*;
import Security.InvoiceSecurity.repository.InvoiceDetailRepository;
import Security.InvoiceSecurity.repository.InvoiceItemDetailRepository;
import Security.InvoiceSecurity.repository.PaymentDetailRepository;
import Security.InvoiceSecurity.repository.ReorderedInvoiceDetailRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InvoiceDetailService {

    private final InvoiceDetailRepository invoiceDetailRepository;
    private final InvoiceItemDetailRepository invoiceItemDetailRepository;
    private final ReorderedInvoiceDetailRepository reorderedInvoiceDetailRepository;
    private final PaymentDetailRepository paymentDetailRepository;

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

    public void checkOutTimeSet(Integer invoiceId) {
        Optional<InvoiceDetailDTO> invoiceDetailOptional = invoiceDetailRepository.findById(invoiceId);

        if (invoiceDetailOptional.isPresent()) {
            InvoiceDetailDTO invoiceDetail = invoiceDetailOptional.get();
            invoiceDetail.setDepartureDate(LocalDateTime.now());
            invoiceDetailRepository.save(invoiceDetail);
        }

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
        if (paymentDetailRepository.existsPaymentDetailsByInvoiceId(invoiceId)){

           // invoiceDetail.setPaymentDetails(paymentDetailRepository.getPaymentDetailsByInvoiceId(invoiceId));

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
        existingInvoiceDetail.setCount(updatedInvoiceDetail.getCount());
//        existingInvoiceDetail.setGovernmentTax(updatedInvoiceDetail.getGovernmentTax());
//        existingInvoiceDetail.setServiceCharge(updatedInvoiceDetail.getServiceCharge());

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
                    newItem.setGovernmentTax(updatedItem.getGovernmentTax());
                    newItem.setServiceCharge(updatedItem.getServiceCharge());
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
                        existingItem.setGovernmentTax(updatedItem.getGovernmentTax());
                        existingItem.setServiceCharge(updatedItem.getServiceCharge());

                        // ... Update other properties ...

                        invoiceItemDetailRepository.save(existingItem);
                    });
                }
                }
            }

            return new InvoiceWithItemsResponse(existingInvoiceDetail, updatedInvoiceItems);
        }


    public boolean markInvoiceCompleted(Integer invoiceId,String cashierName) {
        Optional<InvoiceDetailDTO> invoiceDetailOptional = invoiceDetailRepository.findById(invoiceId);

        if (invoiceDetailOptional.isPresent()) {
            InvoiceDetailDTO invoiceDetail = invoiceDetailOptional.get();
            invoiceDetail.setIsInvoiceCompleted(true);
            invoiceDetail.setCashierName(cashierName);
            invoiceDetailRepository.save(invoiceDetail);
            return true;
        }

        return false;
    }

    public boolean greenTaxInserting(Integer invoiceId){
        Optional<InvoiceDetailDTO> invoiceDetailOptional = invoiceDetailRepository.findById(invoiceId);

        if (invoiceDetailOptional.isPresent()) {
            InvoiceDetailDTO invoiceDetail = invoiceDetailOptional.get();
            Duration duration = Duration.between(invoiceDetail.getArrivalDate(),invoiceDetail.getDepartureDate());
            int count = invoiceDetail.getCount();
            long totalHours = duration.toHours();
            int totalHoursInt = (int) totalHours;
            if(totalHoursInt>=12){
                long twelveHourPeriods = (long)Math.floor(duration.toHours() / 12.0);
              BigDecimal greenTaxFinal = BigDecimal.valueOf(twelveHourPeriods*3*count);
              invoiceDetail.setGreenTax(greenTaxFinal);
            }
            else {
                invoiceDetail.setGreenTax(BigDecimal.valueOf(0));

            }
            invoiceDetailRepository.save(invoiceDetail);
            return true;
        }

        return false;
    }

    public boolean greenTaxCheck(Integer invoiceId){
        Optional<InvoiceDetailDTO> invoiceDetailOptional = invoiceDetailRepository.findById(invoiceId);

        if (invoiceDetailOptional.isPresent()) {
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
                return reorderedInvoiceDetailRepository.reorderInvoiceId(invoiceId);
               // return null; // InvoiceId already exists in reordered_invoice_details
            }

            // Create a new ReorderedInvoiceDetailDTO
            ReorderedInvoiceDetailDTO reorderedInvoiceDetail = new ReorderedInvoiceDetailDTO();
            reorderedInvoiceDetail.setInvoiceDetailnew(invoiceDetail);

            // Save the reordered invoiceDetail and get the reorderedInvoiceId
            reorderedInvoiceDetailRepository.save(reorderedInvoiceDetail);
            return reorderedInvoiceDetail.getReorderedInvoiceId();
        }

        return reorderedInvoiceDetailRepository.reorderInvoiceId(invoiceId);
    }

    public Integer areAllInvoicesCompletedForRoom(String roomNum) {
        return invoiceDetailRepository.areAllInvoicesCompletedForRoom(roomNum);
    }

    public List<InvoiceWithItemsResponse> getCompletedInvoicesBetweenDates(LocalDateTime arrivalDate,LocalDateTime departureDate){
        List<InvoiceDetailDTO> invoiceDetailDTOList = invoiceDetailRepository.findCompletedInvoicesBetweenDates(arrivalDate, departureDate);
        List<InvoiceWithItemsResponse> responseList = new ArrayList<>();

        for (InvoiceDetailDTO invoiceDetail : invoiceDetailDTOList) {
            Integer id = invoiceDetail.getInvoiceId();
            List<InvoiceItemDetailDTO> invoiceItemDetailDTOList = invoiceItemDetailRepository.findByInvoiceDetail_InvoiceId(id);
            Integer reorderId = reorderedInvoiceDetailRepository.reorderInvoiceId(id);
            // Create an InvoiceWithItemsResponse object and add it to the responseList
            InvoiceWithItemsResponse response = new InvoiceWithItemsResponse(invoiceDetail, invoiceItemDetailDTOList);
            responseList.add(response);
        }

        return responseList;

    }
    //2024
    public List<InvoiceWithItemsResponse> getAllInvoicesBetweenDates(LocalDateTime arrivalDate,LocalDateTime departureDate){
        List<InvoiceDetailDTO> invoiceDetailDTOList = invoiceDetailRepository.findAllInvoicesBetweenDates(arrivalDate, departureDate);
        List<InvoiceWithItemsResponse> responseList = new ArrayList<>();

        for (InvoiceDetailDTO invoiceDetail : invoiceDetailDTOList) {
            Integer id = invoiceDetail.getInvoiceId();
            List<InvoiceItemDetailDTO> invoiceItemDetailDTOList = invoiceItemDetailRepository.findByInvoiceDetail_InvoiceId(id);
            Integer reorderId = reorderedInvoiceDetailRepository.reorderInvoiceId(id);
            // Create an InvoiceWithItemsResponse object and add it to the responseList
            InvoiceWithItemsResponse response = new InvoiceWithItemsResponse(invoiceDetail, invoiceItemDetailDTOList);
            responseList.add(response);
        }

        return responseList;

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

    public List<InvoiceWithItemsResponse> getAllInvoicesByID(Integer invoiceId){
        List<InvoiceDetailDTO> invoiceDetailDTOList = invoiceDetailRepository.findInvoiceByID(invoiceId);
        List<InvoiceWithItemsResponse> responseList = new ArrayList<>();

        for (InvoiceDetailDTO invoiceDetail : invoiceDetailDTOList) {
            Integer id = invoiceDetail.getInvoiceId();
            List<InvoiceItemDetailDTO> invoiceItemDetailDTOList = invoiceItemDetailRepository.findByInvoiceDetail_InvoiceId(id);
            Integer reorderId = reorderedInvoiceDetailRepository.reorderInvoiceId(id);
            // Create an InvoiceWithItemsResponse object and add it to the responseList
            InvoiceWithItemsResponse response = new InvoiceWithItemsResponse(invoiceDetail, invoiceItemDetailDTOList);
            responseList.add(response);
        }

        return responseList;

    }

//    public ResponseEntity<PaymentDetailResponse> getPaymentDetails(Integer invoiceId){
//        PaymentDetailResponse paymentDetailResponse = new PaymentDetailResponse(); // Instantiate the response object
//            BigDecimal sumOfCredits = invoiceDetailRepository.sumOfCreditForBill(invoiceId);
//            BigDecimal sumOfDebits = invoiceDetailRepository.sumOfDebitForBill(invoiceId);
//            BigDecimal sumOfPayments= sumOfCredits.add(sumOfDebits);
//            BigDecimal payment = paymentDetailRepository.sumAmountForPayment(invoiceId);
//            BigDecimal remain = sumOfDebits.add(payment);
//            paymentDetailResponse.setTotal(sumOfPayments);
//            paymentDetailResponse.setRemain(remain);
//            return ResponseEntity.ok(paymentDetailResponse);
//
//
//    }

    public ResponseEntity<PaymentDetailResponse> getPaymentDetails(Integer invoiceId) {
        PaymentDetailResponse paymentDetailResponse = new PaymentDetailResponse();

        // Initialize variables to hold payment amounts
        BigDecimal sumOfCredits = BigDecimal.ZERO;
        BigDecimal sumOfDebits = BigDecimal.ZERO;
        BigDecimal payment = BigDecimal.ZERO;

        // Check if invoiceId is not null before retrieving sums from repositories
        if (invoiceId != null) {
            sumOfCredits = invoiceDetailRepository.sumOfCreditForBill(invoiceId);
            sumOfCredits = (sumOfCredits != null) ? sumOfCredits : BigDecimal.ZERO;
            sumOfDebits = invoiceDetailRepository.sumOfDebitForBill(invoiceId);
            sumOfDebits = (sumOfDebits != null) ? sumOfDebits : BigDecimal.ZERO;
            if (paymentDetailRepository.existsPaymentDetailsByInvoiceId(invoiceId)) {
                payment = paymentDetailRepository.sumAmountForPayment(invoiceId);
            }
        }

        // Calculate total and remaining amounts
        BigDecimal sumOfPayments = sumOfCredits.add(sumOfDebits);
        BigDecimal remain = sumOfDebits.add(payment);

        List<PaymentDetails> paymentDetailsList = paymentDetailRepository.findAllPaymentByInvoiceId(invoiceId);

        // Set total and remain in the response object
        paymentDetailResponse.setTotal(sumOfPayments != null ? sumOfPayments : BigDecimal.ZERO);
        paymentDetailResponse.setRemain(remain != null ? remain : BigDecimal.ZERO);
        paymentDetailResponse.setPaymentDetails(paymentDetailsList);

        return ResponseEntity.ok(paymentDetailResponse);
    }

}
