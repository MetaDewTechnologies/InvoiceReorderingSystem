import React from "react";
import {
  Box,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Table,
  Grid,
  Divider,
} from "@material-ui/core";

export default class ComponentToPrint extends React.Component {
  render() {
    const invoiceID = this.props.invoiceID;
    const invoiceData = this.props.invoiceData;
    const itemData = this.props.itemData;
    const greenTax = this.props.greenTax;
    const cashierName = this.props.cashierName;

    var totalDebit = 0;
    let totalCredit = 0;
    itemData.forEach((data) => {
      totalDebit += data.debit !== "" ? data.debit : 0;
      totalCredit += data.credit !== "" ? data.credit : 0;
    });
    const totalPayments = totalCredit + totalDebit;
    const serviceCharge = (totalPayments * 10) / 100;
    const governmentTax = ((totalPayments + serviceCharge) * 16) / 100;
    const totalGrossTaxes =
      totalPayments + serviceCharge + greenTax + governmentTax;
    const totalNetTaxes = totalPayments;
    const totalTax = serviceCharge + greenTax + governmentTax;
    const taxData = [
      {
        taxDetail: "Service Charge",
        taxes: serviceCharge,
        net: totalPayments,
        gross: totalPayments + serviceCharge,
      },
      {
        taxDetail: "Green Tax",
        taxes: greenTax,
        net: "0",
        gross: greenTax,
      },
      {
        taxDetail: "Government Service Tax",
        taxes: governmentTax,
        net: "0",
        gross: governmentTax,
      },
    ];
    return (
      <div
        style={{
          marginLeft: "100px",
          marginRight: "75px",
          marginTop: "50px",
          fontFamily: "sans-serif",
        }}
      >
        <div>&nbsp;</div>
        <Box>
          <Box mb={3} style={{ display: "flex", justifyContent: "center" }}>
            <img
              style={{
                width: 250,
                height: 155,
                marginLeft: 0,
                marginBottom: 10,
              }}
              src="/static/images/logo/clientLogo.jpg"
              alt="logo"
            />
          </Box>
          <Grid container>
            <Grid item md={8} xs={6}>
              <div className="col pb-4 pt-4 pl-2">
                <div
                  className="col"
                  align={"left"}
                  style={{ paddingBottom: "10px" }}
                >
                  <b>Reservation ID: </b> {invoiceData.reservationNum}
                </div>
                <div
                  className="col"
                  align={"left"}
                  style={{ paddingBottom: "10px" }}
                >
                  <b>Room Number: </b> {invoiceData.roomNum}
                </div>
                <div
                  className="col"
                  align={"left"}
                  style={{ paddingBottom: "10px" }}
                >
                  <b>Arrival Date: </b> {invoiceData.arrivalDate}
                </div>
                <div
                  className="col"
                  align={"left"}
                  style={{ paddingBottom: "10px" }}
                >
                  <b>Departure Date: </b> {invoiceData.departureDate}
                </div>
                <div
                  className="col"
                  align={"left"}
                  style={{ paddingBottom: "10px" }}
                >
                  <b>Cashier: </b> {cashierName}
                </div>
                <div
                  className="col"
                  align={"left"}
                  style={{ paddingBottom: "10px" }}
                >
                  <b>Invoice Date: </b> {new Date().toISOString().split("T")[0]}
                </div>
                <div>&nbsp;</div>
              </div>
            </Grid>
            <Grid md={4} xs={6}>
              <div className="col pb-4 pt-4 pl-2">
                {/* <h3 style={{ paddingBottom: "10px" }}>
                  <left>Billing Profile</left>
                </h3>
                <div
                  className="col"
                  align={"left"}
                  style={{ paddingBottom: "10px" }}
                >
                  <b>Name : </b> {invoiceData.customerName}
                </div> */}
                <div>&nbsp;</div>
              </div>
            </Grid>
          </Grid>
        </Box>
        <div>
          <Box minWidth={400}>
            <TableContainer>
              <Table aria-label="caption table">
                <TableHead>
                  <TableRow style={{ borderTop: "1px solid black"}}>
                    <TableCell
                      align={"center"}
                      padding="none"
                      style={{ borderBottom: "1px solid black" , padding:'10px'}}
                    >
                      {"Date"}
                    </TableCell>
                    <TableCell
                      align={"center"}
                      padding="none"
                      style={{ borderBottom: "1px solid black", padding:'10px'}}
                    >
                      {"Description"}
                    </TableCell>
                    <TableCell
                      align={"center"}
                      padding="none"
                      style={{ borderBottom: "1px solid black",padding:'10px' }}
                    >
                      {"Comment"}
                    </TableCell>
                    <TableCell
                      align={"center"}
                      padding="none"
                      style={{ borderBottom: "1px solid black",padding:'10px' }}
                    >
                      {"Debit"}
                    </TableCell>
                    <TableCell
                      align={"center"}
                      padding="none"
                      style={{ borderBottom: "1px solid black",padding:'10px' }}
                    >
                      {"Credit"}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {itemData &&
                    itemData.map((data, index) => (
                      <TableRow key={index}>
                        <TableCell
                          align={"left"}
                          component="th"
                          scope="row"
                          padding="none"
                          style={{ borderBottom: "none", paddingTop:'10px'}}
                        >
                          {data.date.split("T")[0]}
                        </TableCell>
                        <TableCell
                          align={"center"}
                          component="th"
                          scope="row"
                          padding="none"
                          style={{ borderBottom: "none", paddingTop:'10px'}}
                        >
                          {data.description}
                        </TableCell>
                        <TableCell
                          align={"center"}
                          component="th"
                          scope="row"
                          padding="none"
                          style={{ borderBottom: "none", paddingTop:'10px'}}
                        >
                          {data.comment}
                        </TableCell>
                        <TableCell
                          align={"center"}
                          component="th"
                          scope="row"
                          padding="none"
                          style={{ borderBottom: "none", paddingTop:'10px'}}
                        >
                          {data.debit !== ""
                            ? parseFloat(data.debit).toFixed(2)
                            : ""}
                        </TableCell>
                        <TableCell
                          align={"center"}
                          component="th"
                          scope="row"
                          padding="none"
                          style={{ borderBottom: "none",paddingTop:'10px'}}
                        >
                          {data.credit !== ""
                            ? parseFloat(data.credit).toFixed(2)
                            : ""}
                        </TableCell>
                      </TableRow>
                    ))}
                  <TableRow>
                    <TableCell colSpan={3} align={"right"}>
                      {"Total"}
                    </TableCell>
                    <TableCell align={"center"}>
                      {parseFloat(totalDebit).toFixed(2)}
                    </TableCell>
                    <TableCell align={"center"}>
                      {parseFloat(totalCredit).toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Box
            maxWidth="60%"
            display="flex"
            justifyContent="flex-end"
            style={{ paddingTop: "10px", marginLeft: "40%" }}
          >
            <TableContainer style={{ maxWidth: "100%" }}>
              <Table>
                <TableHead>
                  <TableRow style={{ borderTop: "1px solid black",padding:'10px' }}>
                    <TableCell
                      align={"center"}
                      padding="none"
                      style={{ borderBottom: "1px solid black",padding:'10px' }}
                    >
                      {"Tax Details"}
                    </TableCell>
                    <TableCell
                      align={"center"}
                      padding="none"
                      style={{ borderBottom: "1px solid black",padding:'10px' }}
                    >
                      {"Taxes"}
                    </TableCell>
                    <TableCell
                      align={"center"}
                      padding="none"
                      style={{ borderBottom: "1px solid black",padding:'10px' }}
                    >
                      {"Net"}
                    </TableCell>
                    <TableCell
                      align={"center"}
                      padding="none"
                      style={{ borderBottom: "1px solid black",padding:'10px' }}
                    >
                      {"Gross"}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {taxData &&
                    taxData.map((data, index) => (
                      <TableRow key={index}>
                        <TableCell
                          align={"left"}
                          component="th"
                          scope="row"
                          padding="none"
                          style={{ borderBottom: "none",paddingTop:'10px' }}
                        >
                          {data.taxDetail}
                        </TableCell>
                        <TableCell
                          align={"center"}
                          component="th"
                          scope="row"
                          padding="none"
                          style={{ borderBottom: "none",paddingTop:'10px' }}
                        >
                          {parseFloat(data.taxes).toFixed(2)}
                        </TableCell>
                        <TableCell
                          align={"center"}
                          component="th"
                          scope="row"
                          padding="none"
                          style={{ borderBottom: "none",paddingTop:'10px' }}
                        >
                          {data.net}
                        </TableCell>
                        <TableCell
                          align={"center"}
                          component="th"
                          scope="row"
                          padding="none"
                          style={{ borderBottom: "none",paddingTop:'10px' }}
                        >
                          {parseFloat(data.gross).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  <TableRow>
                    <TableCell colSpan={1} align={"right"}>
                      {"Total Tax"}
                    </TableCell>
                    <TableCell align={"center"}>
                      {parseFloat(totalTax).toFixed(2)}
                    </TableCell>
                    <TableCell align={"center"}>
                      {parseFloat(totalNetTaxes).toFixed(2)}
                    </TableCell>
                    <TableCell align={"center"}>{parseFloat(totalGrossTaxes).toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            style={{
              border: "1px solid",
              padding: "5px 10px 5px 10px",
              width: "60%",
              marginLeft: "40%",
              marginTop: "20px",
            }}
          >
            <h3>Open Balance</h3>
            {/* <h3>{parseInt(totalGrossTaxes - totalDebit).toFixed(2)}</h3> */}
            <h3>{parseFloat(0.00).toFixed(2)}</h3>
          </Box>
          <Box
            maxWidth="70%"
            display="flex"
            style={{ paddingTop: "5px", marginLeft: "40%" }}
          >
            <h5 style={{ paddingBottom: "10px" }}>
              TAX INVOICE TIN No: 1047945GST501
            </h5>
          </Box>
          <Divider style={{ background: "black" }} />
          <Box style={{ paddingTop: "5px" }}>
            <Grid container>
              <Grid item md={6} xs={6}>
                <div
                  className="col"
                  align={"left"}
                  style={{ paddingBottom: "10px" }}
                >
                  kiha beach
                </div>
                <div
                  className="col"
                  align={"left"}
                  style={{ paddingBottom: "10px" }}
                >
                  Dharavandhoo, Maldives
                </div>
                <div
                  className="col"
                  align={"left"}
                  style={{ paddingBottom: "10px" }}
                >
                  Dharavandhoo
                </div>
                <div
                  className="col"
                  align={"left"}
                  style={{ paddingBottom: "10px" }}
                >
                  Maldives
                </div>
              </Grid>
              <Grid item md={6} xs={6}>
                <div
                  className="col"
                  align={"left"}
                  style={{ paddingBottom: "10px" }}
                >
                  Telephone: +960 7779667
                </div>
                <div
                  className="col"
                  align={"left"}
                  style={{ paddingBottom: "10px" }}
                >
                  Fax: +960 7779667
                </div>
                <div
                  className="col"
                  align={"left"}
                  style={{ paddingBottom: "10px" }}
                >
                  Email: reservations@kihabeach.com
                </div>
                <div
                  className="col"
                  align={"left"}
                  style={{ paddingBottom: "10px" }}
                >
                  Website: http://kihabeach.com/
                </div>
              </Grid>
            </Grid>
          </Box>
        </div>
      </div>
    );
  }
}
