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
    const invoiceData = this.props.invoiceData;
    const itemData = this.props.itemData;
    const greenTax = this.props.greenTax;

    let totalDebit = 0;
    let totalCredit = 0;
    let governmentTax = 0;
    let serviceCharge = 0;
    itemData.forEach((data) => {
      totalDebit += data.debit !== "" ? data.debit : 0;
      totalCredit += data.credit !== "" ? data.credit : 0;
      governmentTax += data.governmentTax !== "" ? data.governmentTax : 0;
      serviceCharge += data.serviceCharge !== "" ? data.serviceCharge : 0;
    });
    const totalPayments = totalCredit + totalDebit;
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
            <div className="col pb-4 pt-4 pl-2">
              <h2>Temporary Bill</h2>
            </div>
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
                <div>&nbsp;</div>
              </div>
            </Grid>
            <Grid md={4} xs={6}>
              <div className="col pb-4 pt-4 pl-2">
                <h3 style={{ paddingBottom: "10px" }}>
                  <left>Billing Profile</left>
                </h3>
                <div
                  className="col"
                  align={"left"}
                  style={{ paddingBottom: "10px" }}
                >
                  <b>Name : </b> {invoiceData.customerName}
                </div>
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
                  <TableRow style={{ borderTop: "1px solid black" }}>
                    <TableCell
                      align={"center"}
                      style={{ borderBottom: "1px solid black" }}
                    >
                      {"Date"}
                    </TableCell>
                    <TableCell
                      align={"center"}
                      style={{ borderBottom: "1px solid black" }}
                    >
                      {"Description"}
                    </TableCell>
                    <TableCell
                      align={"center"}
                      style={{ borderBottom: "1px solid black" }}
                    >
                      {"Comment"}
                    </TableCell>
                    <TableCell
                      align={"center"}
                      style={{ borderBottom: "1px solid black" }}
                    >
                      {"Debit"}
                    </TableCell>
                    <TableCell
                      align={"center"}
                      style={{ borderBottom: "1px solid black" }}
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
                          style={{ borderBottom: "none" }}
                        >
                          {data.date.split("T")[0]}
                        </TableCell>
                        <TableCell
                          align={"center"}
                          component="th"
                          scope="row"
                          style={{ borderBottom: "none" }}
                        >
                          {data.description}
                        </TableCell>
                        <TableCell
                          align={"center"}
                          component="th"
                          scope="row"
                          style={{ borderBottom: "none" }}
                        >
                          {data.comment}
                        </TableCell>
                        <TableCell
                          align={"center"}
                          component="th"
                          scope="row"
                          style={{ borderBottom: "none" }}
                        >
                          {data.debit !== ""
                            ? parseFloat(data.debit).toFixed(2)
                            : ""}
                        </TableCell>
                        <TableCell
                          align={"center"}
                          component="th"
                          scope="row"
                          style={{ borderBottom: "none" }}
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
                  <TableRow style={{ borderTop: "1px solid black" }}>
                    <TableCell
                      align={"center"}
                      style={{ borderBottom: "1px solid black" }}
                    >
                      {"Other Charges"}
                    </TableCell>
                    <TableCell
                      align={"center"}
                      style={{ borderBottom: "1px solid black" }}
                    >
                      {"Amount"}
                    </TableCell>
                    <TableCell
                      align={"center"}
                      style={{ borderBottom: "1px solid black" }}
                    >
                      {"Net"}
                    </TableCell>
                    <TableCell
                      align={"center"}
                      style={{ borderBottom: "1px solid black" }}
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
                          style={{ borderBottom: "none" }}
                        >
                          {data.taxDetail}
                        </TableCell>
                        <TableCell
                          align={"center"}
                          component="th"
                          scope="row"
                          style={{ borderBottom: "none" }}
                        >
                          {parseFloat(data.taxes).toFixed(2)}
                        </TableCell>
                        <TableCell
                          align={"center"}
                          component="th"
                          scope="row"
                          style={{ borderBottom: "none" }}
                        >
                          {parseFloat(data.net).toFixed(2)}
                        </TableCell>
                        <TableCell
                          align={"center"}
                          component="th"
                          scope="row"
                          style={{ borderBottom: "none" }}
                        >
                          {parseFloat(data.gross).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  <TableRow>
                    <TableCell colSpan={1} align={"right"}>
                      {"Total"}
                    </TableCell>
                    <TableCell align={"center"}>
                      {parseFloat(totalTax).toFixed(2)}
                    </TableCell>
                    <TableCell align={"center"}>
                      {parseFloat(totalNetTaxes).toFixed(2)}
                    </TableCell>
                    <TableCell align={"center"}>{totalGrossTaxes}</TableCell>
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
            <h3>0.00</h3>
          </Box>
        </div>
      </div>
    );
  }
}
