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
} from "@material-ui/core";

export default class ComponentToPrint extends React.Component {
  render() {
    //const invoiceID = this.props.invoiceID;
    const invoiceData = this.props.invoiceData;
    const itemData = this.props.itemData;
    const greenTax = this.props.greenTax;
    const invoiceDetails = this.props.invoiceDetail;
    //const cashierName = this.props.cashierName;

    var totalDebit = 0;
    let totalCredit = 0;
    let governmentTax = 0;
    let serviceCharge = 0;
    let totalDebitWithTax = 0;
    let totalCreditWithTax = 0;

    itemData.forEach((data) => {
      totalDebit += data.debit !== "" ? data.debit : 0;
      totalCredit += data.credit !== "" ? data.credit : 0;
      totalDebitWithTax +=
        data.debit !== ""
          ? data.debit + data.governmentTax + data.serviceCharge
          : 0;
      totalCreditWithTax +=
        data.credit !== ""
          ? data.credit + data.governmentTax + data.serviceCharge
          : 0;
      governmentTax += data.governmentTax !== "" ? data.governmentTax : 0;
      serviceCharge += data.serviceCharge !== "" ? data.serviceCharge : 0;
    });
    const totalPayments = totalCredit + totalDebit;
    const totalTax = governmentTax + serviceCharge;
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
          <Grid container style={{ fontSize: "12px" }}>
            <Grid item md={8} xs={6}>
              <div
                className="col"
                align={"left"}
                style={{ paddingBottom: "10px" }}
              >
                <p>{invoiceDetails ? invoiceDetails.address : ""}</p>
              </div>
              <div
                className="col"
                align={"left"}
                style={{ paddingBottom: "10px" }}
              >
                <p>{invoiceDetails ? invoiceDetails.city : ""}</p>
              </div>
              <div
                className="col"
                align={"left"}
                style={{ paddingBottom: "10px" }}
              >
                <p>{invoiceDetails ? invoiceDetails.country : ""}</p>
              </div>
              <Grid container>
                <Grid item xs={6}>
                  <div className="col pl-2">
                    <div
                      className="col"
                      align={"left"}
                      style={{ paddingBottom: "10px" }}
                    >
                      <p>Folio No:</p>
                    </div>
                    <div
                      className="col"
                      align={"left"}
                      style={{ paddingBottom: "10px" }}
                    >
                      <p>AR Number:</p>
                    </div>
                    <div
                      className="col"
                      align={"left"}
                      style={{ paddingBottom: "10px" }}
                    >
                      <p>Guest Name:</p>
                    </div>
                    <div>&nbsp;</div>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div
                    className="col"
                    align={"left"}
                    style={{ paddingBottom: "10px" }}
                  >
                    <p>{"0000"}</p>
                  </div>
                  <div
                    className="col"
                    align={"left"}
                    style={{ paddingBottom: "10px" }}
                  >
                    <p>{"0000"}</p>
                  </div>
                  <div
                    className="col"
                    align={"left"}
                    style={{ paddingBottom: "10px" }}
                  >
                    <p>{invoiceData.customerName}</p>
                  </div>
                </Grid>
              </Grid>
            </Grid>
            <Grid item md={8} xs={3}>
              <div className="col pb-4 pt-4 pl-2">
                <div
                  className="col"
                  align={"left"}
                  style={{ paddingBottom: "10px" }}
                >
                  <p>Room Number:</p>
                </div>
                <div
                  className="col"
                  align={"left"}
                  style={{ paddingBottom: "10px" }}
                >
                  <p>Arrival:</p>
                </div>
                <div
                  className="col"
                  align={"left"}
                  style={{ paddingBottom: "10px" }}
                >
                  <p>Departure:</p>
                </div>
                <div
                  className="col"
                  align={"left"}
                  style={{ paddingBottom: "10px" }}
                >
                  <p>Page: </p>
                </div>
                <div
                  className="col"
                  align={"left"}
                  style={{ paddingBottom: "10px" }}
                >
                  <div
                    className="col"
                    align={"left"}
                    style={{ paddingBottom: "10px" }}
                  >
                    <p>Date/Time:</p>
                  </div>
                  <p>Customer Ref:</p>
                </div>
                <div>&nbsp;</div>
              </div>
            </Grid>
            <Grid item xs={3}>
              <div
                className="col"
                align="left"
                style={{ paddingBottom: "10px" }}
              >
                <p>{invoiceData.roomNum}</p>
              </div>
              <div
                className="col"
                align="left"
                style={{ paddingBottom: "10px" }}
              >
                <p>{invoiceData.arrivalDate}</p>
              </div>
              <div
                className="col"
                align="left"
                style={{ paddingBottom: "10px" }}
              >
                <p>{invoiceData.departureDate}</p>
              </div>
              <div
                className="col"
                align="left"
                style={{ paddingBottom: "10px" }}
              >
                <p>{"1 of 1"}</p>
              </div>
              <div
                className="col"
                align="left"
                style={{ paddingBottom: "10px" }}
              >
                <p>{new Date().toISOString().split("T")[0]}</p>
              </div>
              <div
                className="col"
                align="left"
                style={{ paddingBottom: "10px" }}
              >
                <p> {invoiceData.reservationNum}</p>
              </div>
            </Grid>
          </Grid>
        </Box>
        <div>
          <Box minWidth={400}>
            <TableContainer>
              <Table aria-label="caption table">
                <TableHead style={{ backgroundColor: "#e0e0e0" }}>
                  <TableRow style={{ borderTop: "1px solid black" }}>
                    <TableCell
                      align={"center"}
                      padding="none"
                      style={{
                        borderBottom: "1px solid black",
                        padding: "10px",
                        fontSize: "12px",
                      }}
                    >
                      {"Date"}
                    </TableCell>
                    <TableCell
                      align={"center"}
                      padding="none"
                      style={{
                        borderBottom: "1px solid black",
                        padding: "10px",
                        fontSize: "12px",
                      }}
                    >
                      {"Description"}
                    </TableCell>
                    <TableCell
                      align={"center"}
                      padding="none"
                      style={{
                        borderBottom: "1px solid black",
                        padding: "10px",
                        fontSize: "12px",
                      }}
                    >
                      {"Reference"}
                    </TableCell>
                    <TableCell
                      align={"right"}
                      padding="none"
                      style={{
                        borderBottom: "1px solid black",
                        padding: "10px",
                        fontSize: "12px",
                      }}
                    >
                      {"Debit"}
                    </TableCell>
                    <TableCell
                      align={"right"}
                      padding="none"
                      style={{
                        borderBottom: "1px solid black",
                        padding: "10px",
                        fontSize: "12px",
                      }}
                    >
                      {"Credit"}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody style={{ borderBottom: "1px solid black" }}>
                  {itemData &&
                    itemData.map((data, index) => (
                      <TableRow key={index}>
                        <TableCell
                          align={"center"}
                          component="th"
                          scope="row"
                          padding="none"
                          style={{
                            borderBottom: "none",
                            paddingTop: "10px",
                            fontSize: "12px",
                          }}
                        >
                          {data.date.split("T")[0]}
                        </TableCell>
                        <TableCell
                          align={"center"}
                          component="th"
                          scope="row"
                          padding="none"
                          style={{
                            borderBottom: "none",
                            paddingTop: "10px",
                            fontSize: "12px",
                          }}
                        >
                          {data.description}
                        </TableCell>
                        <TableCell
                          align={"center"}
                          component="th"
                          scope="row"
                          padding="none"
                          style={{
                            borderBottom: "none",
                            paddingTop: "10px",
                            fontSize: "12px",
                          }}
                        >
                          {data.cashier}
                        </TableCell>
                        <TableCell
                          align={"right"}
                          component="th"
                          scope="row"
                          padding="none"
                          style={{
                            borderBottom: "none",
                            paddingTop: "10px",
                            fontSize: "12px",
                          }}
                        >
                          {data.debit !== ""
                            ? "$" +
                              parseFloat(
                                data.debit +
                                  data.serviceCharge +
                                  data.governmentTax
                              ).toFixed(2)
                            : ""}
                        </TableCell>
                        <TableCell
                          align={"right"}
                          component="th"
                          scope="row"
                          padding="none"
                          style={{
                            borderBottom: "none",
                            paddingTop: "10px",
                            fontSize: "12px",
                          }}
                        >
                          {data.credit !== ""
                            ? "$" +
                              parseFloat(
                                data.credit +
                                  data.serviceCharge +
                                  data.governmentTax
                              ).toFixed(2)
                            : ""}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Grid container style={{ paddingTop: "5px", fontSize: "12px" }}>
              <Grid item xs={6}></Grid>
              <Grid item xs={6}>
                <Grid container>
                  <Grid item xs={4}>
                    <div
                      className="col"
                      align={"left"}
                      style={{
                        paddingBottom: "10px",
                        marginLeft: "22px",
                      }}
                    >
                      <p>Total</p>
                    </div>
                  </Grid>
                  <Grid item xs={4}>
                    <div
                      className="col"
                      align={"right"}
                      style={{
                        paddingBottom: "10px",
                        marginLeft: "22px",
                      }}
                    >
                      <p>$ {totalDebitWithTax.toFixed(2)}</p>
                    </div>
                  </Grid>
                  <Grid item xs={4}>
                    <div
                      className="col"
                      align={"right"}
                      style={{
                        paddingBottom: "10px",
                        marginLeft: "22px",
                      }}
                    >
                      <p>$ {totalCreditWithTax.toFixed(2)}</p>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
          <Grid container style={{ marginTop: "10px" }}>
            <Grid item md={8} xs={6}>
              <div
                className="col"
                align={"left"}
                style={{ paddingBottom: "10px", fontSize: "11px" }}
              >
                <p>
                  I agree that my liability for the account is not waived and
                  agree to <br />
                  be held personally responsible in the event that the
                  <br /> indicated person, company or association fails to pay
                  <br />
                  all or part of these charges
                </p>
              </div>
            </Grid>
            <Grid item md={8} xs={6}>
              <Grid container style={{ fontSize: "12px" }}>
                <Grid item xs={5}>
                  <div
                    className="col"
                    align={"left"}
                    style={{
                      paddingBottom: "10px",
                      marginLeft: "22px",
                    }}
                  >
                    Vatable Amount
                  </div>
                </Grid>
                <Grid item xs={3}>
                  <div
                    className="col"
                    align={"right"}
                    style={{
                      paddingBottom: "10px",
                      marginLeft: "22px",
                    }}
                  >
                    $ {totalPayments.toFixed(2)}
                  </div>
                </Grid>
                <Grid item xs={4}></Grid>
                <Grid item xs={5}>
                  <div
                    className="col"
                    align={"left"}
                    style={{
                      paddingBottom: "10px",
                      marginLeft: "22px",
                    }}
                  >
                    T-GST Amount
                  </div>
                </Grid>
                <Grid item xs={3}>
                  <div
                    className="col"
                    align={"right"}
                    style={{
                      paddingBottom: "10px",
                      marginLeft: "22px",
                    }}
                  >
                    $ {totalTax.toFixed(2)}
                  </div>
                </Grid>
                <Grid item xs={4}></Grid>
                <Grid item xs={4}>
                  <div
                    className="col"
                    align={"left"}
                    style={{
                      paddingBottom: "10px",
                      marginLeft: "22px",
                    }}
                  >
                    Balance
                  </div>
                </Grid>
                <Grid item xs={4}>
                  <div
                    className="col"
                    align={"right"}
                    style={{
                      paddingBottom: "10px",
                      marginLeft: "22px",
                    }}
                  >
                    $ {(totalPayments + totalTax).toFixed(2)}
                  </div>
                </Grid>
                <Grid item xs={4}></Grid>
              </Grid>
            </Grid>
          </Grid>
          <Box maxWidth="70%" display="flex" style={{ paddingTop: "30px" }}>
            <div style={{ paddingBottom: "10px", fontSize: "12px" }}>
              Signature : ............................................
            </div>
          </Box>
          <Box
            style={{ paddingTop: "5px", textAlign: "center", fontSize: "12px" }}
          >
            <div className="col" style={{ paddingBottom: "7px" }}>
              <b>Kiha Beach</b>
            </div>
            <div className="col" style={{ paddingBottom: "7px" }}>
              <b>Dharavandhoo, Maldives.</b>
            </div>
            <div className="col" style={{ paddingBottom: "7px" }}>
              Contact number: +960 7795533 - Email: reservations@kihabeach.com.
            </div>
            <div className="col" style={{ paddingBottom: "7px" }}>
              www.kihabeach.com
            </div>
          </Box>
        </div>
      </div>
    );
  }
}
