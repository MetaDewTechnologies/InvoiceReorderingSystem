package Security.InvoiceSecurity.controller;

import Security.InvoiceSecurity.models.*;
import Security.InvoiceSecurity.service.InvoiceDetailService;
import Security.InvoiceSecurity.service.InvoiceItemDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;


@RestController
@RequestMapping("api/v1")
@RequiredArgsConstructor
public class InvoiceController {
    private final InvoiceDetailService invoiceDetailService;
    private final InvoiceItemDetailService invoiceItemDetailService;


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

        InvoiceDetailDTO savedInvoiceDetail = invoiceDetailService.saveInvoiceDetail(invoiceDetail);

        if (invoiceDetail == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        if (invoiceItems != null) {
            for (InvoiceItemDetailDTO item : invoiceItems) {
                item.setInvoiceDetail(savedInvoiceDetail);
                invoiceItemDetailService.saveInvoiceItemDetail(item);
            }
        }
        InvoiceResponse invoiceResponse=new InvoiceResponse();
        invoiceResponse.setMessage("Successfully Insert");
        invoiceResponse.setStatusCode("SUCCESS");


        return new ResponseEntity<>(invoiceResponse, HttpStatus.CREATED);
    }

    @GetMapping("/room-invoices/{roomNum}")
    public ResponseEntity<List<RoomInvoiceResponse>> getRoomInvoicesByRoomNum(@PathVariable String roomNum) {
        List<RoomInvoiceResponse> roomInvoices = invoiceDetailService.getRoomInvoicesByRoomNum(roomNum);

        if (roomInvoices.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(roomInvoices, HttpStatus.OK);
    }
}
