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
            return new ResponseEntity<>(invoiceResponse ,HttpStatus.OK);
        }
        else{
            InvoiceDetailDTO savedInvoiceDetail = invoiceDetailService.saveInvoiceDetail(invoiceDetail);

            if (invoiceDetail == null) {
                InvoiceResponse invoiceResponse=new InvoiceResponse();
                invoiceResponse.setMessage("Not Inserted");
                invoiceResponse.setStatusCode("ERROR");
                return new ResponseEntity<>(invoiceResponse ,HttpStatus.OK);
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

        InvoiceWithItemsResponse invoiceWithItems = invoiceDetailService.getInvoiceWithItemsById(invoiceId);
        if (invoiceWithItems == null) {
            InvoiceResponse updatedInvoiceResponse = new InvoiceResponse();
            updatedInvoiceResponse.setStatusCode("ERROR");
            updatedInvoiceResponse.setMessage("Not updated.No such Invoice ID");
            return new ResponseEntity<>(updatedInvoiceResponse,HttpStatus.NOT_FOUND);
        }
        String roomNum = request.getInvoiceDetail().getRoomNum();
        String prevRoomNum = invoiceWithItems.getInvoiceDetail().getRoomNum();

        if (prevRoomNum.equals(roomNum)) {
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

//
        }
        Integer exist = invoiceDetailService.areAllInvoicesCompletedForRoom(roomNum);
        if(exist > 0){
            InvoiceResponse invoiceResponse=new InvoiceResponse();
            invoiceResponse.setMessage("This room not available");
            invoiceResponse.setStatusCode("ERROR");
            return new ResponseEntity<>(invoiceResponse ,HttpStatus.BAD_REQUEST);
        }
       // InvoiceWithItemsResponse updatedInvoice = invoiceDetailService.updateInvoice(invoiceId, request);
        InvoiceResponse updatedInvoiceResponse = new InvoiceResponse();
        updatedInvoiceResponse.setStatusCode("SUCCESS");
        updatedInvoiceResponse.setMessage("Updated Successfully.");

        return new ResponseEntity<>(updatedInvoiceResponse, HttpStatus.OK);
    }

    @CrossOrigin
    @PostMapping ("/complete-invoice/{invoiceId}")
    public ResponseEntity<?> markInvoiceAsCompleted(@PathVariable Integer invoiceId , @RequestBody CompleteInvoiceRequest request) {

        boolean success = invoiceDetailService.markInvoiceCompleted(invoiceId,request.getCashierName());

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
    @CrossOrigin
    @PostMapping("/reorder-invoice/{invoiceId}")
    public ResponseEntity<?> reorderInvoice(@PathVariable Integer invoiceId) {
        Integer reorderedInvoiceId = invoiceDetailService.markInvoiceGeneratedCompletedReordered(invoiceId);

        if (reorderedInvoiceId != null) {
            // Return the reorderedInvoiceId
            return ResponseEntity.ok(reorderedInvoiceId);
        } else {
            return ResponseEntity.ok(invoiceId);
        }
    }

    @CrossOrigin
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

    @CrossOrigin
    @PostMapping("/deactivate-item/{itemId}")
    public ResponseEntity<?> deactivateItem(@PathVariable Integer itemId) {
        boolean success = invoiceItemDetailService.deactivateItem(itemId);

        if (success) {
            InvoiceResponse invoiceResponse=new InvoiceResponse();
            invoiceResponse.setMessage("Successfully Deleted");
            invoiceResponse.setStatusCode("SUCCESS");
            return ResponseEntity.ok(invoiceResponse);

        } else {
            return ResponseEntity.status(HttpStatus.OK)
                    .body("Item already deleted or not exist");
        }
    }

    @CrossOrigin
    @PostMapping("/completed-invoices")
    public ResponseEntity<List<InvoiceWithItemsResponse>> getCompletedInvoicesBetweenDates(
            @RequestBody DateRange dateRange) {

        LocalDateTime arrivalDate = dateRange.getArrivalDate();
        LocalDateTime departureDate = dateRange.getDepartureDate();



        if (dateRange.getArrivalDate() == null || dateRange.getDepartureDate() == null) {
            // Handle missing or invalid date values
            return ResponseEntity.badRequest().build();
        }

        List<InvoiceWithItemsResponse> completedInvoices = invoiceDetailService.getCompletedInvoicesBetweenDates(

                arrivalDate,
                departureDate
        );

        if (completedInvoices.isEmpty()) {
            return ResponseEntity.ok(completedInvoices);
        }

for(InvoiceWithItemsResponse invoiceWithItemsResponse: completedInvoices){
invoiceWithItemsResponse.getInvoiceDetail().setReorderedInvoiceDetail(null);
//invoiceDetail.setReorderedInvoiceDetail(null);
}
        return ResponseEntity.ok(completedInvoices);
    }

    @CrossOrigin
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

    @PostMapping("/greenTax/{invoiceId}")
    public ResponseEntity<?> forGreenTaxInvoice(@PathVariable Integer invoiceId, @RequestBody GreenTaxRequest request) {
        Boolean success = invoiceDetailService.greenTaxInserting(invoiceId,request.getGreenTax());
        if(success) {
            InvoiceWithItemsResponse invoiceWithItems = invoiceDetailService.getInvoiceWithItemsById(invoiceId);
            return ResponseEntity.ok(invoiceWithItems);
        }

        else{
            InvoiceResponse invoiceResponse = new InvoiceResponse();
        invoiceResponse.setMessage("Cannot insert green tax");
        invoiceResponse.setStatusCode("ERROR");
        return ResponseEntity.ok(invoiceResponse);
        }

    }
    @PostMapping("/checkGreenTax/{invoiceId}")
    public ResponseEntity<?> checkGreenTaxValue(@PathVariable Integer invoiceId){
        Boolean success = invoiceDetailService.greenTaxCheck(invoiceId);
        if(success) {
            InvoiceWithItemsResponse invoiceWithItems = invoiceDetailService.getInvoiceWithItemsById(invoiceId);
            return ResponseEntity.ok(invoiceWithItems.getInvoiceDetail().getGreenTax());
        }
        else
            return ResponseEntity.ok(0);
    }


}
