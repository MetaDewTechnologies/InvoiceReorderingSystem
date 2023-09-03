package Security.InvoiceSecurity.controller;

import Security.InvoiceSecurity.auth.AuthenticationRequest;
import Security.InvoiceSecurity.auth.AuthenticationService;
import Security.InvoiceSecurity.models.*;
import Security.InvoiceSecurity.service.InvoiceDetailService;
import Security.InvoiceSecurity.service.InvoiceItemDetailService;
import Security.InvoiceSecurity.service.TestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@RestController
@RequestMapping("api/v1")
@RequiredArgsConstructor
public class InvoiceController {
    private final InvoiceDetailService invoiceDetailService;
    private final InvoiceItemDetailService invoiceItemDetailService;

    private final TestService testservice;


    @GetMapping("/search/{reservationNum}")
    public ResponseEntity<List<InvoiceResponseForResNum>> getInvoiceDetailsWithItemsByReservationNum(@PathVariable String reservationNum) {
        List<InvoiceDetailDTO> invoiceDetails = invoiceDetailService.getInvoiceDetailsByReservationNum(reservationNum);

        if (invoiceDetails.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        List<InvoiceResponseForResNum> responses = new ArrayList<>();

        for (InvoiceDetailDTO invoiceDetail : invoiceDetails) {
            List<InvoiceItemDetailDTO> invoiceItems = invoiceItemDetailService.getInvoiceItemsByInvoiceId(invoiceDetail.getInvoiceId());

            responses.add(new InvoiceResponseForResNum(invoiceDetail, invoiceItems));
        }

        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/create-with-items")
    public ResponseEntity<InvoiceResponse> createInvoiceWithItems(@RequestBody InvoiceCreationRequest request) {
        InvoiceDetailDTO invoiceDetail = request.getInvoiceDetail();
        List<InvoiceItemDetailDTO> invoiceItems = request.getInvoiceItems();
        String roomNum = invoiceDetail.getRoomNum();
        Integer exist = invoiceDetailService.areAllInvoicesCompletedForRoom(roomNum);
        if(exist > 0){
            InvoiceResponse invoiceResponse=new InvoiceResponse();
            invoiceResponse.setMessage("This room not available");
            invoiceResponse.setStatusCode("ERROR");
            return new ResponseEntity<>(invoiceResponse ,HttpStatus.BAD_REQUEST);
        }
        else{
            InvoiceDetailDTO savedInvoiceDetail = invoiceDetailService.saveInvoiceDetail(invoiceDetail);

            if (invoiceDetail == null) {
                InvoiceResponse invoiceResponse=new InvoiceResponse();
                invoiceResponse.setMessage("Not Inserted");
                invoiceResponse.setStatusCode("ERROR");
                return new ResponseEntity<>(invoiceResponse ,HttpStatus.BAD_REQUEST);
            }

            if (invoiceItems != null) {
                for (InvoiceItemDetailDTO item : invoiceItems) {
                    item.setInvoiceDetail(savedInvoiceDetail);
                    invoiceItemDetailService.saveInvoiceItemDetail(item);
                }
            }
            InvoiceResponse invoiceResponse=new InvoiceResponse();
            invoiceResponse.setMessage("Successfully Inserted");
            invoiceResponse.setStatusCode("SUCCESS");


            return new ResponseEntity<>(invoiceResponse, HttpStatus.CREATED);
        }

    }

    @CrossOrigin
    @GetMapping("/room-invoices/{roomNum}")
    public ResponseEntity<List<RoomInvoiceResponse>> getRoomInvoicesByRoomNum(@PathVariable String roomNum) {
        List<RoomInvoiceResponse> roomInvoices = invoiceDetailService.getRoomInvoicesByRoomNum(roomNum);

        if (roomInvoices.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(roomInvoices, HttpStatus.OK);
    }

    @CrossOrigin
    @GetMapping("/{invoiceId}")
    public ResponseEntity<InvoiceWithItemsResponse> getInvoiceWithItemsById(@PathVariable Integer invoiceId) {
        InvoiceWithItemsResponse invoiceWithItems = invoiceDetailService.getInvoiceWithItemsById(invoiceId);

        if (invoiceWithItems == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(invoiceWithItems, HttpStatus.OK);
    }


    @CrossOrigin
    @PostMapping("/update/{invoiceId}")
    public ResponseEntity<InvoiceResponse> updateInvoice(@PathVariable Integer invoiceId, @RequestBody InvoiceWithItemsRequest request) {
       String roomNum = request.getInvoiceDetail().getRoomNum();
        InvoiceWithItemsResponse invoiceWithItems = invoiceDetailService.getInvoiceWithItemsById(invoiceId);
        String prevRoomNum = invoiceWithItems.getInvoiceDetail().getRoomNum();


        InvoiceWithItemsResponse updatedInvoice = invoiceDetailService.updateInvoice(invoiceId, request);

        InvoiceResponse updatedInvoiceResponse = new InvoiceResponse();

        if (updatedInvoice == null) {
            updatedInvoiceResponse.setStatusCode("ERROR");
            updatedInvoiceResponse.setMessage("Not updated.No such Invoice ID");
            return new ResponseEntity<>(updatedInvoiceResponse,HttpStatus.NOT_FOUND);
        }

        updatedInvoiceResponse.setStatusCode("SUCCESS");
        updatedInvoiceResponse.setMessage("Updated Successfully.");

        return new ResponseEntity<>(updatedInvoiceResponse, HttpStatus.OK);
    }

    @PostMapping ("/complete-invoice/{invoiceId}")
    public ResponseEntity<?> markInvoiceAsCompleted(@PathVariable Integer invoiceId) {
        boolean success = invoiceDetailService.markInvoiceCompleted(invoiceId);

        if (success) {
            InvoiceResponse invoiceResponse=new InvoiceResponse();
            invoiceResponse.setMessage("Successfully Completed");
            invoiceResponse.setStatusCode("SUCCESS");
            return ResponseEntity.ok(invoiceResponse);
        } else {
            InvoiceResponse invoiceResponse=new InvoiceResponse();
            invoiceResponse.setMessage("Uncompleted");
            invoiceResponse.setStatusCode("ERROR");
            return ResponseEntity.ok(invoiceResponse);
        }
    }



    // InvoiceController.java
    @PostMapping("/reorder-invoice/{invoiceId}")
    public ResponseEntity<?> reorderInvoice(@PathVariable Integer invoiceId) {
        Integer reorderedInvoiceId = invoiceDetailService.markInvoiceGeneratedCompletedReordered(invoiceId);

        if (reorderedInvoiceId != null) {
            // Return the reorderedInvoiceId
            return ResponseEntity.ok(reorderedInvoiceId);
        } else {
            return ResponseEntity.status(HttpStatus.OK)
                    .body("Invoice is already reordered.");
        }
    }


    @PostMapping("/special-authenticate")
    public ResponseEntity<SpecialInvoiceAuthenticationResponse> specialAuthenticate(
            @RequestBody AuthenticationRequest request
    ) {
        SpecialInvoiceAuthenticationResponse response = testservice.specialAuthenticate(request);

        if ("SUCCESS".equals(response.getSuccessCode())) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(response);
        }
    }

    @PostMapping("/deactivate-item/{itemId}")
    public ResponseEntity<String> deactivateItem(@PathVariable Integer itemId) {
        boolean success = invoiceItemDetailService.deactivateItem(itemId);

        if (success) {
            return ResponseEntity.ok("Item deleted successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.OK)
                    .body("Item already deleted or not exist");
        }
    }

    @PostMapping("/completed-invoices")
    public ResponseEntity<List<InvoiceDetailDTO>> getCompletedInvoicesBetweenDates(
            @RequestBody DateRange dateRange) {

        LocalDateTime arrivalDate = dateRange.getArrivalDate();
        LocalDateTime departureDate = dateRange.getDepartureDate();



        if (dateRange.getArrivalDate() == null || dateRange.getDepartureDate() == null) {
            // Handle missing or invalid date values
            return ResponseEntity.badRequest().build();
        }

        List<InvoiceDetailDTO> completedInvoices = invoiceDetailService.getCompletedInvoicesBetweenDates(

                arrivalDate,
                departureDate
        );

        if (completedInvoices.isEmpty()) {
            return ResponseEntity.ok(completedInvoices);
        }
        for(InvoiceDetailDTO invoiceDetail : completedInvoices){
            invoiceDetail.setReorderedInvoiceDetail(null);
        }
        return ResponseEntity.ok(completedInvoices);
    }

    @PostMapping("/reorder-invoices")
    public ResponseEntity<?> reorderInvoices(@RequestBody ReorderInvoiceRequest request) {

        boolean success = invoiceDetailService.reorderInvoices(request);
        if(success) {
            InvoiceResponse invoiceResponse = new InvoiceResponse();
            invoiceResponse.setMessage("Reordered Successfully");
            invoiceResponse.setStatusCode("SUCCESS");
            return ResponseEntity.ok(invoiceResponse);
        }else{
            InvoiceResponse invoiceResponse = new InvoiceResponse();
            invoiceResponse.setMessage("Cannot Reorder");
            invoiceResponse.setStatusCode("ERROR");
            return ResponseEntity.ok(invoiceResponse);
        }
    }

}
