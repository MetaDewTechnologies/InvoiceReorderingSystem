import React, { useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  Box,
  Card,
  makeStyles,
  Container,
  Divider,
  CardContent,
  Grid,
  TextField,
  CardHeader,
  Button,
  FormControl,
  Typography,
  InputLabel,
  MenuItem,
} from "@material-ui/core";
import Page from "../../../components/Page";
import PageHeader from "../../Common/PageHeader";
import { useNavigate } from "react-router-dom";
import { trackPromise } from "react-promise-tracker";
import MaterialTable from "material-table";
import { LoadingComponent } from "../../../utils/newLoader";
import services from "../Services";
import { useFormik, Form, FormikProvider, Formik } from "formik";
import VisibilityIcon from "@material-ui/icons/Visibility";
import * as Yup from "yup";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

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
export default function ManageInvoiceListing(props) {
  const classes = useStyles();
  const [roomNo, setRoomNo] = useState({
    roomNumber: "",
  });
  const [open, setOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState([]);
  const dateRange = {
    fromdate: "",
    todate: "",
  };
  const [paymentData, setPaymentData] = useState({
    paymentAmount: "0",
    paymentMethod: "0",
  });
  const navigate = useNavigate();
  let encryptedID = "";
  const handleClick = () => {
    encryptedID = btoa("0");
    navigate("/app/manageInvoices/addEdit/" + encryptedID);
  };

  const DateSaveScheme = Yup.object().shape({
    fromdate: Yup.date().required("From Date is required"),
    todate: Yup.date().required("To Date is required"),
  });

  const formik = useFormik({
    initialValues: {
      fromdate: dateRange.fromdate,
      todate: dateRange.todate,
    },
    validationSchema: DateSaveScheme,
    onSubmit: (values) => {
      trackPromise(SearchData());
    },
  });
  function handleChange(e) {
    const target = e.target;
    const value = target.value;
    setValues({
      ...values,
      [e.target.name]: value,
    });
  }

  const clearFields = () => {
    formik.resetForm();
  };
  const { errors, setValues, touched, handleSubmit, values } = formik;

  async function SearchData() {
    let model = {
      arrivalDate: new Date(formik.values.fromdate),
      departureDate: new Date(formik.values.todate),
    };
    var response = await services.getBillsByDateRange(model);
    const newBillArray = response.map((item) => {
      return {
        ...item,
        arrivalDate: item.invoiceDetail.arrivalDate,
        departureDate: item.invoiceDetail.departureDate,
        customerName: item.invoiceDetail.customerName,
        roomNum: item.invoiceDetail.roomNum,
        reservationNum: item.invoiceDetail.reservationNum,
        invoiceId: item.invoiceDetail.invoiceId,
      };
    });
    const updatedItems = [];
    if (newBillArray.length > 0) {
      for (const item of newBillArray) {
        const updatedItem = {
          ...item,
          arrivalDate: item.arrivalDate.split("T")[0],
          departureDate: item.departureDate.split("T")[0],
        };
        updatedItems.push(updatedItem);
      }
    }
    setInvoiceData(updatedItems);
  }

  async function GetInvoiceDetailsByRoomNumber() {
    setInvoiceData([]);
    var result = await services.GetInvoiceDetailsByRoomNumber(
      roomNo.roomNumber
    );
    const updatedItems = [];
    if (result.length > 0) {
      for (const item of result) {
        const updatedItem = {
          ...item,
          arrivalDate: item.arrivalDate.split("T")[0],
          departureDate: item.departureDate.split("T")[0],
        };
        updatedItems.push(updatedItem);
      }
    }
    setInvoiceData(updatedItems);
  }

  const EditInvoiceDetails = (invoiceId) => {
    encryptedID = btoa(invoiceId.toString());
    navigate("/app/manageInvoices/addEdit/" + encryptedID);
  };

  function handleRoomNoChange(e) {
    const value = e.target.value;
    setRoomNo({
      ...roomNo,
      [e.target.name]: value,
    });
  }

  function cardTitle(titleName) {
    return (
      <Grid container spacing={1}>
        <Grid item md={10} xs={12}>
          {titleName}
        </Grid>
        <Grid item md={2} xs={12}>
          <PageHeader
            onClick={handleClick}
            isEdit={true}
            customLabel="New Billing"
          />
        </Grid>
      </Grid>
    );
  }

  function handleView(data) {
    setOpen(true);
    console.log(data);
  }
  const actions = [
    {
      icon: () => <VisibilityIcon />,
      tooltip: <p>Payments</p>,
      onClick: (event, rowData) => handleView(rowData),
      position: "row",
    },
    {
      icon: "mode",
      tooltip: "Edit Invoice",
      onClick: (event, rowData) => {
        EditInvoiceDetails(rowData.invoiceId);
      },
    },
  ];
  function handleClose() {
    setOpen(false);
  }
  function addPaymentData() {
    console.log(paymentData);
  }
  function handleChange2(e) {
    const target = e.target;
    const value = target.value;
    setPaymentData({
      ...paymentData,
      [e.target.name]: value,
    });
  }
  return (
    <Page className={classes.root} title="View Bills">
      <LoadingComponent />
      <Container maxWidth={false}>
        <FormikProvider value={formik}>
          <Form
            autoComplete="off"
            disabled={!(formik.isValid && formik.dirty)}
            noValidate
            onSubmit={handleSubmit}
          >
            <Box mt={0}>
              <Card>
                <CardHeader title={cardTitle("View Bills")} />
                <PerfectScrollbar>
                  <Divider />
                  <CardContent>
                    <Grid container spacing={4}>
                      <Grid item md={4} xs={12}>
                        <FormControl
                          variant="outlined"
                          fullWidth
                          label="Room Number *"
                        >
                          <TextField
                            fullWidth
                            name="roomNumber"
                            label="Room Number *"
                            onChange={(e) => handleRoomNoChange(e)}
                            value={roomNo.roomNumber}
                            variant="outlined"
                            size="small"
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={4} xs={12}>
                        <Button
                          type="button"
                          size="medium"
                          variant="contained"
                          style={{
                            color: "#FFFFFF",
                            backgroundColor: "#489EE7",
                          }}
                          onClick={() =>
                            trackPromise(GetInvoiceDetailsByRoomNumber())
                          }
                        >
                          Search
                        </Button>
                      </Grid>
                    </Grid>
                    <Grid container spacing={3} style={{ paddingTop: "5px" }}>
                      <Grid item md={4} xs={12}>
                        <FormControl
                          variant="outlined"
                          fullWidth
                          label="fromdate"
                        >
                          <TextField
                            error={Boolean(touched.fromdate && errors.fromdate)}
                            fullWidth
                            helperText={touched.fromdate && errors.fromdate}
                            name="fromdate"
                            label="From Date *"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={formik.values.fromdate}
                            onChange={(e) => handleChange(e)}
                            variant="outlined"
                            size="small"
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={4} xs={12}>
                        <FormControl
                          variant="outlined"
                          fullWidth
                          label="todate"
                        >
                          <TextField
                            error={Boolean(touched.todate && errors.todate)}
                            fullWidth
                            helperText={touched.todate && errors.todate}
                            name="todate"
                            label="To Date *"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            onChange={(e) => handleChange(e)}
                            value={formik.values.todate}
                            variant="outlined"
                            size="small"
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={4} xs={12}>
                        <Button
                          style={{
                            color: "#FFFFFF",
                            backgroundColor: "#489EE7",
                          }}
                          type="submit"
                          variant="contained"
                          size="medium"
                        >
                          Search
                        </Button>
                        &nbsp;
                        <Button
                          style={{ color: "#489EE7" }}
                          type="button"
                          variant="outlined"
                          size="medium"
                          onClick={clearFields}
                        >
                          Clear
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                  {invoiceData.length > 0 ? (
                    <Box minWidth={1050} style={{ margin: "1rem" }}>
                      <MaterialTable
                        title="Invoice"
                        columns={[
                          {
                            title: "Reservation Num.",
                            field: "reservationNum",
                          },
                          { title: "Room Num", field: "roomNum" },
                          { title: "Arrival Date", field: "arrivalDate" },
                          { title: "Departure Date", field: "departureDate" },
                          { title: "Customer Name", field: "customerName" },
                        ]}
                        data={invoiceData}
                        options={{
                          exportButton: false,
                          showTitle: false,
                          headerStyle: { textAlign: "left", height: "1%" },
                          cellStyle: { textAlign: "left" },
                          columnResizable: false,
                          actionsColumnIndex: -1,
                        }}
                        actions={actions}
                      />
                    </Box>
                  ) : null}
                </PerfectScrollbar>
              </Card>
            </Box>
          </Form>
        </FormikProvider>
        <Dialog
          maxWidth
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Payment Details</DialogTitle>
          <DialogContent>
            <PerfectScrollbar>
              <Box minWidth={1000}>
                <MaterialTable
                  title="Multiple Actions Preview"
                  columns={[
                    { title: "Date", field: "" },
                    { title: "Amount", field: "" },
                    { title: "Payment Method", field: "" },
                  ]}
                  // data={ItemDataList}
                  options={{
                    exportButton: false,
                    showTitle: false,
                    headerStyle: { textAlign: "left" },
                    cellStyle: { textAlign: "left" },
                    columnResizable: false,
                  }}
                />
              </Box>
              <CardContent>
                <Grid container spacing={4}>
                  <Grid item md={4} xs={12}>
                    <Typography
                      style={{
                        fontSize: "18px",
                      }}
                    >
                      Total Amount:{}
                    </Typography>
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <Typography
                      style={{
                        fontSize: "18px",
                      }}
                    >
                      Payments:{}
                    </Typography>
                  </Grid>
                  <Grid item md={4} xs={12}>
                    {" "}
                    <Typography
                      style={{
                        fontSize: "18px",
                      }}
                    >
                      Due Payments:{}
                    </Typography>
                  </Grid>
                </Grid>
                <Box style={{ marginBottom: 20, marginTop: 20 }}>
                  <Typography color={"textPrimary"} variant="h4">
                    Payment :
                  </Typography>
                </Box>
                <Formik
                  initialValues={{
                    paymentAmount: paymentData.paymentAmount,
                    paymentMethod: paymentData.paymentMethod,
                  }}
                  validationSchema={Yup.object().shape({
                    paymentAmount: Yup.string()
                      .required("Amount is required")
                      .matches(
                        /^-?[0-9]*(\.[0-9]{0,2})?$/,
                        "Only allow numbers with atmost two decimal places"
                      ),
                    paymentMethod:
                      paymentData.paymentMethod === "0"
                        ? Yup.number()
                            .required("Payment method is required")
                            .min("Credit", "Payment method is required")
                        : null,
                  })}
                  enableReinitialize
                  onSubmit={addPaymentData}
                >
                  {({
                    errors,
                    handleBlur,
                    touched,
                    handleSubmit: AddPaymentData,
                  }) => (
                    <Form>
                      <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                          <InputLabel shrink id="paymentAmount">
                            Amount *
                          </InputLabel>
                          <TextField
                            fullWidth
                            error={Boolean(
                              touched.paymentAmount && errors.paymentAmount
                            )}
                            fullWidth
                            helperText={
                              touched.paymentAmount && errors.paymentAmount
                            }
                            size="small"
                            name="paymentAmount"
                            id="paymentAmount"
                            onBlur={handleBlur}
                            onChange={(e) => handleChange2(e)}
                            value={paymentData.paymentAmount}
                            variant="outlined"
                            required
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <InputLabel shrink id="paymentMethod">
                            Payment Method *
                          </InputLabel>
                          <TextField
                            select
                            error={Boolean(
                              touched.paymentMethod && errors.paymentMethod
                            )}
                            fullWidth
                            size="small"
                            helperText={
                              touched.paymentMethod && errors.paymentMethod
                            }
                            name="paymentMethod"
                            onBlur={handleBlur}
                            onChange={(e) => handleChange2(e)}
                            value={paymentData.paymentMethod}
                            variant="outlined"
                            id="paymentMethod"
                          >
                            <MenuItem value="0">
                              --Select Payment Method--
                            </MenuItem>
                            <MenuItem value="Cash">Cash</MenuItem>
                            <MenuItem value="Card">Card</MenuItem>
                            <MenuItem value="Bank Transfer">
                              Bank Transfer
                            </MenuItem>
                          </TextField>
                        </Grid>
                      </Grid>
                      <Box
                        display="flex"
                        justifyContent="flex-end"
                        style={{ paddingBottom: 10, marginTop: 10 }}
                      >
                        <Button
                          variant="contained"
                          type="button"
                          style={{
                            color: "#FFFFFF",
                            backgroundColor: "#489EE7",
                          }}
                          onClick={AddPaymentData}
                        >
                          Add
                        </Button>
                      </Box>
                    </Form>
                  )}
                </Formik>
              </CardContent>
            </PerfectScrollbar>
          </DialogContent>
        </Dialog>
      </Container>
    </Page>
  );
}
