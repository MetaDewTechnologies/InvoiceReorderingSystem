import React, { useState, useEffect, Fragment, useRef } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  Box,
  Card,
  Grid,
  TextField,
  makeStyles,
  Container,
  Button,
  CardContent,
  Divider,
  InputLabel,
  CardHeader,
  MenuItem,
  FormControl,
} from "@material-ui/core";
import Page from "../../../components/Page";
import services from "../Services";
import { useNavigate, useParams } from "react-router-dom";
import { Formik } from "formik";
import PageHeader from "../../Common/PageHeader";
import { LoadingComponent } from "../../../utils/newLoader";
import { trackPromise } from "react-promise-tracker";
import MaterialTable from "material-table";
import ReactToPrint from "react-to-print";
import { useReactToPrint } from "react-to-print";
// import CreatePDF from "./CreatePDF";
import TemporyBillPDF from "./TemporyPDF";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  avatar: {
    marginRight: theme.spacing(2),
  },
}));

export default function InvoiceAddEdit(props) {
  const componentRef = useRef();
  const [title, setTitle] = useState("View Bill");
  const [isUpdate, setIsUpdate] = useState(false);
  const classes = useStyles();
  const [invoiceData, setInvoiceData] = useState({
    reservationNum: "",
    roomNum: "",
    arrivalDate: new Date().toISOString().split("T")[0],
    departureDate: new Date().toISOString().split("T")[0],
    customerName: "",
    customerEmail: "",
    address: "",
    city: "",
    country: "",
    bookingType: "0",
  });
  const [checkoutInvoiceData, setCheckoutInvoiceData] = useState({
    reservationNum: "",
    roomNum: "",
    arrivalDate: new Date().toISOString().split("T")[0],
    departureDate: new Date().toISOString().split("T")[0],
    customerName: "",
    customerEmail: "",
    address: "",
    city: "",
    country: "",
    bookingType: "0",
  });
  const [itemData, setItemData] = useState({
    itemId: null,
    date: new Date().toISOString().split("T")[0],
    description: "",
    comment: "",
    paymentType: "Debit",
    amount: "0",
    paymentMethod: "0",
    cashier: "",
  });
  const [ItemDataList, setItemDataList] = useState([]);
  const [gTax, setGTax] = useState("");
  const [checkoutItemList, setCheckoutItemList] = useState([]);
  const [print, setprint] = useState(false);

  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/app/billHistory/listing/");
  };

  const { invoiceId } = useParams();
  let decrypted = 0;

  useEffect(() => {
    decrypted = atob(invoiceId.toString());
    if (decrypted != 0) {
      trackPromise(getInvoiceDetails(decrypted));
      getGreenTax();
    }
  }, []);

  useEffect(() => {
    setItemData({
      ...itemData,
      paymentMethod: "0",
    });
  }, [itemData.paymentType]);

  async function getGreenTax() {
    const gTax = await services.getGreenTaxByInvoiceId(
      atob(invoiceId.toString())
    );
    setGTax(gTax);
  }

  async function getInvoiceDetails(invoiceId) {
    console.log(invoiceId);
    let response = await services.getcompletedInvoiceDetailsByID(invoiceId);
    console.log("res :", response);
    const invoiceDetails = response.invoiceDetail;
    setInvoiceData({
      ...invoiceData,
      reservationNum: invoiceDetails.reservationNum,
      roomNum: invoiceDetails.roomNum,
      departureDate: invoiceDetails.departureDate.split("T")[0],
      customerName: invoiceDetails.customerName,
      customerEmail: invoiceDetails.customerEmail,
      address: invoiceDetails.address,
      city: invoiceDetails.city,
      country: invoiceDetails.country,
      bookingType: invoiceDetails.bookingType == "Online" ? "1" : "2",
      arrivalDate: invoiceDetails.arrivalDate.split("T")[0],
    });
    setCheckoutInvoiceData({
      ...invoiceData,
      reservationNum: invoiceDetails.reservationNum,
      roomNum: invoiceDetails.roomNum,
      departureDate: invoiceDetails.departureDate.split("T")[0],
      customerName: invoiceDetails.customerName,
      customerEmail: invoiceDetails.customerEmail,
      address: invoiceDetails.address,
      city: invoiceDetails.city,
      country: invoiceDetails.country,
      bookingType: invoiceDetails.bookingType == "Online" ? "1" : "2",
      arrivalDate: invoiceDetails.arrivalDate.split("T")[0],
    });
    const itemData = response.invoiceItems;
    const updatedItems = [];
    var filteredResponse = [];
    if (itemData.length > 0) {
      for (const item of itemData) {
        const updatedItem = {
          ...item,
          date: item.date.split("T")[0],
          debit: item.paymentType === "Debit" ? item.amount : "",
          credit: item.paymentType === "Credit" ? item.amount : "",
          paymentMethod: item.paymentMethod === "0" ? "" : item.paymentMethod,
        };
        updatedItems.push(updatedItem);
      }
      filteredResponse = updatedItems.filter((item) => item.isActive == true);
    }
    setItemDataList(filteredResponse);
    setCheckoutItemList(filteredResponse);
    setIsUpdate(true);
  }

  function cardTitle(titleName) {
    return (
      <Grid container spacing={1}>
        <Grid item md={10} xs={12}>
          {titleName}
        </Grid>
        <Grid item md={2} xs={12}>
          <PageHeader onClick={handleClick} />
        </Grid>
      </Grid>
    );
  }

  function handleBillPrint() {
    setprint(true);
  }
  useEffect(() => {
    if (print) {
      setprint(false);
      handlePrint();
    }
  }, [print]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <Fragment>
      <LoadingComponent />
      <Page className={classes.root} title={title}>
        <Container maxWidth={false}>
          <Formik
            initialValues={{
              reservationNum: invoiceData.reservationNum,
              roomNum: invoiceData.roomNum,
              arrivalDate: invoiceData.arrivalDate,
              departureDate: invoiceData.departureDate,
              customerName: invoiceData.customerName,
              customerEmail: invoiceData.customerEmail,
              address: invoiceData.address,
              city: invoiceData.city,
              country: invoiceData.country,
              bookingType: invoiceData.bookingType,
            }}
            enableReinitialize
          >
            {({ errors, handleBlur, handleSubmit, touched }) => (
              <form onSubmit={handleSubmit}>
                <Box mt={0}>
                  <Card>
                    <CardHeader title={cardTitle(title)} />
                    <PerfectScrollbar>
                      <Divider />
                      <CardContent>
                        <Grid container spacing={3}>
                          <Grid item md={6} xs={12}>
                            <InputLabel shrink id="reservationNum">
                              Reservation Number *
                            </InputLabel>
                            <TextField
                              fullWidth
                              name="reservationNum"
                              onBlur={handleBlur}
                              value={invoiceData.reservationNum}
                              variant="outlined"
                              InputProps={{ readOnly: true }}
                              size="small"
                            />
                          </Grid>
                          <Grid item md={6} xs={12}>
                            <InputLabel shrink id="roomNum">
                              Room Number *
                            </InputLabel>
                            <TextField
                              fullWidth
                              name="roomNum"
                              onBlur={handleBlur}
                              value={invoiceData.roomNum}
                              variant="outlined"
                              size="small"
                              InputProps={{ readOnly: true }}
                            />
                          </Grid>
                          <Grid item md={6} xs={12}>
                            <InputLabel shrink id="arrivalDate">
                              Arrival Date *
                            </InputLabel>
                            <FormControl variant="outlined" fullWidth>
                              <TextField
                                name="arrivalDate"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={invoiceData.arrivalDate}
                                onBlur={handleBlur}
                                variant="outlined"
                                size="small"
                                InputProps={{ readOnly: true }}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={6} xs={12}>
                            <InputLabel shrink id="departureDate">
                              Departure Date *
                            </InputLabel>
                            <FormControl variant="outlined" fullWidth>
                              <TextField
                                fullWidth
                                name="departureDate"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={invoiceData.departureDate}
                                onBlur={handleBlur}
                                variant="outlined"
                                size="small"
                                InputProps={{ readOnly: true }}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={6} xs={12}>
                            <InputLabel shrink id="customerName">
                              Customer Name *
                            </InputLabel>
                            <TextField
                              fullWidth
                              InputProps={{ readOnly: true }}
                              name="customerName"
                              onBlur={handleBlur}
                              value={invoiceData.customerName}
                              variant="outlined"
                              inputProps={{ maxLength: 20 }}
                              size="small"
                            />
                          </Grid>
                          <Grid item md={6} xs={12}>
                            <InputLabel shrink id="customerEmail">
                              Customer Email *
                            </InputLabel>
                            <TextField
                              fullWidth
                              InputProps={{ readOnly: true }}
                              name="customerEmail"
                              onBlur={handleBlur}
                              value={invoiceData.customerEmail}
                              variant="outlined"
                              size="small"
                            />
                          </Grid>
                          <Grid item md={6} xs={12}>
                            <InputLabel shrink id="address">
                              Address *
                            </InputLabel>
                            <TextField
                              InputProps={{ readOnly: true }}
                              fullWidth
                              name="address"
                              onBlur={handleBlur}
                              value={invoiceData.address}
                              variant="outlined"
                              size="small"
                            />
                          </Grid>
                          <Grid item md={6} xs={12}>
                            <InputLabel shrink id="city">
                              City
                            </InputLabel>
                            <TextField
                              fullWidth
                              name="city"
                              onBlur={handleBlur}
                              value={invoiceData.city}
                              variant="outlined"
                              InputProps={{ readOnly: true }}
                              size="small"
                            />
                          </Grid>
                          <Grid item md={6} xs={12}>
                            <InputLabel shrink id="country">
                              Country
                            </InputLabel>
                            <TextField
                              fullWidth
                              name="country"
                              onBlur={handleBlur}
                              value={invoiceData.country}
                              variant="outlined"
                              InputProps={{ readOnly: true }}
                              size="small"
                            />
                          </Grid>
                          <Grid item md={6} xs={12}>
                            <InputLabel shrink id="bookingType">
                              Booking Type *
                            </InputLabel>
                            <TextField
                              select
                              fullWidth
                              size="small"
                              InputProps={{ readOnly: true }}
                              name="bookingType"
                              onBlur={handleBlur}
                              value={invoiceData.bookingType}
                              variant="outlined"
                              id="bookingType"
                            >
                              <MenuItem value="0">--No Booking Type--</MenuItem>
                              <MenuItem value="1">Online</MenuItem>
                              <MenuItem value="2">Direct</MenuItem>
                              <MenuItem value="3">Agent</MenuItem>
                            </TextField>
                          </Grid>
                        </Grid>
                      </CardContent>
                      <Divider />
                      <Box minWidth={1000}>
                        <MaterialTable
                          title="Items"
                          columns={[
                            { title: "Date", field: "date" },
                            { title: "Description", field: "description" },
                            { title: "Comment", field: "comment" },
                            { title: "Debit", field: "debit" },
                            { title: "Credit", field: "credit" },
                            { title: "Payment Method", field: "paymentMethod" },
                            { title: "Cahier", field: "cashier" },
                          ]}
                          data={ItemDataList}
                          options={{
                            exportButton: false,
                            showTitle: false,
                            headerStyle: { textAlign: "left", height: "1%" },
                            cellStyle: { textAlign: "left" },
                            columnResizable: false,
                            actionsColumnIndex: -1,
                          }}
                        />
                      </Box>
                      {isUpdate === true ? (
                        <Box display="flex" justifyContent="flex-start" p={2}>
                          <Button
                            onClick={handleBillPrint}
                            color="primary"
                            variant="contained"
                          >
                            PDF
                          </Button>
                          <div hidden={true}>
                            <TemporyBillPDF
                              ref={componentRef}
                              invoiceData={checkoutInvoiceData}
                              itemData={checkoutItemList}
                              greenTax={gTax}
                            />
                          </div>
                          {/* {isPrintRequested === true ? (
                            <Box>
                              <ReactToPrint
                                documentTitle={"Kiha Beach"}
                                trigger={() => (
                                  <Button
                                    style={{
                                      color: isCompleteBilling ? "#FFFFFF" : "",
                                      backgroundColor: isCompleteBilling
                                        ? "#FF0000"
                                        : "",
                                    }}
                                    color="primary"
                                    id="btnRecord"
                                    variant="contained"
                                  >
                                    PDF
                                  </Button>
                                )}
                                content={() => componentRef.current}
                              />
                              <div hidden={true}>
                                <CreatePDF
                                  ref={componentRef}
                                  invoiceData={checkoutInvoiceData}
                                  itemData={checkoutItemList}
                                  invoiceID={invoiceID}
                                  greenTax={gTax}
                                  cashierName={cashierName}
                                />
                              </div>
                            </Box>
                          ) : null} */}
                        </Box>
                      ) : null}
                    </PerfectScrollbar>
                  </Card>
                </Box>
              </form>
            )}
          </Formik>
        </Container>
      </Page>
    </Fragment>
  );
}
