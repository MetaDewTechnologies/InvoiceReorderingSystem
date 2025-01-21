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
  Typography,
  FormControl,
} from "@material-ui/core";
import Page from "../../../components/Page";
import services from "../Services";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import PageHeader from "../../Common/PageHeader";
import { useAlert } from "react-alert";
import { LoadingComponent } from "../../../utils/newLoader";
import { trackPromise } from "react-promise-tracker";
// import authService from '../../../utils/permissionAuth';
// import tokenService from '../../../utils/tokenDecoder';
import MaterialTable from "material-table";
import ReactToPrint from "react-to-print";
import { useReactToPrint } from "react-to-print";
import CreatePDF from "./CreatePDF";
import TemporyBillPDF from "./TemporyPDF";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
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

export default function InvoiceAddEdit(props) {
  const componentRef = useRef();
  const [title, setTitle] = useState("Add Bill");
  const [isUpdate, setIsUpdate] = useState(false);
  const classes = useStyles();

  function DateFormatter(date) {
    var year = date.getFullYear();
    var month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
    var day = date.getDate().toString().padStart(2, "0");
    var hours = date.getHours().toString().padStart(2, "0");
    var minutes = date.getMinutes().toString().padStart(2, "0");
    var formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    return formattedDateTime;
  }

  const [invoiceData, setInvoiceData] = useState({
    reservationNum: "",
    roomNum: "",
    arrivalDate: DateFormatter(new Date()),
    departureDate: new Date().toISOString().split("T")[0],
    customerName: "",
    customerEmail: "",
    address: "",
    city: "",
    country: "",
    bookingType: "0",
    count: "0",
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
    count: "0",
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
    serviceCharge: 0,
    governmentTax: 0,
  });
  const [ItemDataList, setItemDataList] = useState([]);
  const [isDisableButton, setIsDisableButton] = useState(false);
  const [isCompleteBilling, setIsCompleteBilling] = useState(false);
  const [isPrintRequested, setIsPrintRequested] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [removeData, setRemoveData] = useState("");
  const [printRequest, setPrintRequest] = useState(false);
  const [removeRequest, setRemoveRequest] = useState(false);
  const [invoiceID, setInvoiceID] = useState("");
  const [gTax, setGTax] = useState("");
  const [cashierName, setCashierName] = useState("");
  const [checkoutItemList, setCheckoutItemList] = useState([]);
  const [print, setprint] = useState(false);
  const [openBillSettle, setOpenBillSettle] = useState(false);
  const [paymentToBePaid, setPaymentToBePaid] = useState(0);
  const [isSettledBill, setIsSettledBill] = useState(false);
  const [isItemAddToEdit, setIsItemAddToEdit] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [sumOfPayments, setSumOfPayments] = useState(0);
  const [isInvoiceGenerated, setIsInvoiceGenerated] = useState(false)
  const [isInvoiceCompleted, setIsInvoiceCompleted] = useState(false)
  const [finalPaymentMethod, setFinalPaymentMethod] = useState("Cash")
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/app/manageInvoices/listing/");
  };

  const alert = useAlert();
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

  useEffect(() => {
    setItemData({
      ...itemData,
      serviceCharge: (itemData.amount * (10 / 100)).toFixed(2),
      governmentTax: (itemData.amount * (16 / 100)).toFixed(2),
    });
    let total =
      parseFloat(itemData.amount) +
      parseFloat(itemData.amount * (10 / 100)) +
      parseFloat(itemData.amount * (16 / 100));

    setTotalAmount(total.toFixed(2) || 0);
  }, [itemData.amount]);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  async function getGreenTax() {
    const gTax = await services.getGreenTaxByInvoiceId(
      atob(invoiceId.toString())
    );
    setGTax(gTax);
  }
  async function handlePermission() {
    const data = {
      username: userName,
      password: password,
    };
    let response = await services.handlePermission(data);
    if (
      response.successCode === "SUCCESS" &&
      (response.role === "ADMIN" || response.role === "ACCOUNTANT")
    ) {
      if (printRequest) {
        handleClose();
        setIsPrintRequested(true);
        const response = await services.handleCreateInvoice(
          atob(invoiceId.toString())
        );
        setInvoiceID(response);
        alert.success("Permission Granted");
      }
      if (removeRequest) {
        const dataDelete = [...ItemDataList];
        const index = removeData.tableData.id;
        var deletedValue = dataDelete.splice(index, 1)[0];
        var result = await services.deleteInvoiceItem(deletedValue.itemId);
        if (result.statusCode == "SUCCESS") {
          alert.success(result.message);
        } else {
          alert.success(result.message);
        }
        setItemDataList([...dataDelete]);
        alert.success("Permission Granted");
        handleClose();
      }
    } else {
      handleClose();
      alert.error("Permission denied!");
    }
    const name = sessionStorage.getItem("userName");
    setCashierName(name);
  }
  async function getInvoiceDetails(invoiceId) {
    let response = await services.getInvoiceDetailsByID(invoiceId);
    setTitle("Update Bill");
    const invoiceDetails = response.invoiceWithItemsResponse.invoiceDetail;
    setSumOfPayments(response.sumOfPayments);
    setIsInvoiceCompleted(invoiceDetails.isInvoiceCompleted)
    setIsInvoiceGenerated(invoiceDetails.isInvoiceGenerated)
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
      arrivalDate: DateFormatter(new Date(invoiceDetails.arrivalDate)),
      count: invoiceDetails.count,
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
      count: invoiceDetails.count,
    });
    const itemData = response.invoiceWithItemsResponse.invoiceItems;
    const updatedItems = [];
    var filteredResponse = [];
    if (itemData.length > 0) {
      for (const item of itemData) {
        const updatedItem = {
          ...item,
          date: item.date.split("T")[0],
          debit: item.paymentType === "Debit" ? item.amount : "",
          credit: item.paymentType === "Credit" ? item.amount : "",
          paymentMethod: item.paymentMethod,
        };
        updatedItems.push(updatedItem);
      }
      filteredResponse = updatedItems.filter((item) => item.isActive == true);
    }
    setItemDataList(filteredResponse);
    setCheckoutItemList(filteredResponse);
    setIsUpdate(true);
  }

  async function saveInvoice(values) {
    const updatedItems = [];
    if (ItemDataList.length > 0) {
      for (const item of ItemDataList) {
        const updatedItem = {
          ...item,
          date: new Date(item.date),
          isActive: true,
        };
        updatedItems.push(updatedItem);
      }
    }
    if (isUpdate === true) {
      let updateModel = {
        invoiceDetail: {
          invoiceId: parseInt(atob(invoiceId.toString())),
          reservationNum: values.reservationNum,
          roomNum: values.roomNum,
          arrivalDate: values.arrivalDate,
          departureDate: new Date(values.departureDate),
          customerName: values.customerName,
          customerEmail: values.customerEmail,
          address: values.address,
          city: values.city,
          country: values.country,
          isInvoiceGenerated: false,
          isInvoiceCompleted: false,
          isReordered: false,
          bookingType: values.bookingType == "1" ? "Online" : "Direct",
          count: values.count,
        },
        invoiceItems: updatedItems.length == 0 ? null : updatedItems,
      };
      let response = await services.updateInvoice(
        updateModel,
        atob(invoiceId.toString())
      );
      if (response.statusCode === "SUCCESS") {
        alert.success(response.message);
        setIsDisableButton(true);
        navigate("/app/manageInvoices/listing");
      } else {
        alert.error(response.message);
      }
    } else {
      let saveModel = {
        invoiceDetail: {
          reservationNum: values.reservationNum,
          roomNum: values.roomNum,
          arrivalDate: values.arrivalDate,
          departureDate: new Date(values.departureDate),
          customerName: values.customerName,
          customerEmail: values.customerEmail,
          address: values.address,
          city: values.city,
          country: values.country,
          isInvoiceGenerated: false,
          isInvoiceCompleted: false,
          isReordered: false,
          bookingType: values.bookingType == "1" ? "Online" : "Direct",
          count: values.count,
        },
        invoiceItems: updatedItems.length == 0 ? null : updatedItems,
      };
      let response = await services.saveInvoice(saveModel);

      if (response.statusCode === "SUCCESS") {
        alert.success(response.message);
        setIsDisableButton(true);
        setItemDataList([]);
        navigate("/app/manageInvoices/listing");
      } else {
        alert.error(response.message);
      }
    }
  }

  function handleChange1(e) {
    const target = e.target;
    const value = target.value;
    setInvoiceData({
      ...invoiceData,
      [e.target.name]: value,
    });
  }

  function handleChange2(e) {
    const target = e.target;
    const value = target.value;
    setItemData({
      ...itemData,
      [e.target.name]: value,
    });
  }
  function handleChange3(e) {
    const target = e.target;
    const value = target.value;
    setFinalPaymentMethod(value)
  }

  function handleClickEdit(data) {
    setIsItemAddToEdit(true);
    const dataDelete = [...ItemDataList];
    const index = data.tableData.id;
    var deletedValue = dataDelete.splice(index, 1)[0];
    setItemDataList([...dataDelete]);
    setItemData({
      itemId: data.itemId,
      date: data.date,
      description: data.description,
      comment: data.comment,
      paymentType: data.paymentType,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      cashier: data.cashier,
    });
  }

  async function handleClickRemove(data) {
    setRemoveData(data);
    if (data.itemId) {
      setRemoveRequest(true);
      handleClickOpen();
    } else {
      const dataDelete = [...ItemDataList];
      const index = data.tableData.id;
      var deletedValue = dataDelete.splice(index, 1)[0];
      setItemDataList([...dataDelete]);
    }
  }

  async function handleCompleteBilling() {
    const cashierName = sessionStorage.getItem("userName");
    const response = await services.handleCompleteBilling(
      atob(invoiceId.toString()),
      cashierName,
      paymentToBePaid,
      finalPaymentMethod
    );
    if (response.statusCode === "SUCCESS") {
      alert.success(response.message);
      setIsCompleteBilling(true);
      setIsInvoiceCompleted(true)
    } else {
      alert.error(response.message);
    }
  }

  async function handlePrintRequest() {
    setPrintRequest(true);
    handleClickOpen();
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

  function addInvoiceData() {
    setIsItemAddToEdit(false);
    let dataModel = {
      itemId: itemData.itemId,
      date: itemData.date,
      description: itemData.description,
      comment: itemData.comment,
      paymentType: itemData.paymentType,
      debit: itemData.paymentType === "Debit" ? itemData.amount : "",
      credit: itemData.paymentType === "Credit" ? itemData.amount : "",
      amount: parseFloat(itemData.amount),
      paymentMethod: itemData.paymentMethod,
      cashier: itemData.cashier,
      governmentTax: itemData.governmentTax,
      serviceCharge: itemData.serviceCharge,
      isActive: true,
    };
    setItemDataList((ItemDataList) => [...ItemDataList, dataModel]);
    setItemData({
      date: new Date().toISOString().split("T")[0],
      description: "",
      comment: "",
      paymentType: "Debit",
      amount: "0",
      paymentMethod: "1",
      cashier: "",
    });
  }

  function handleBillPrint() {
    handleCompleteBilling();
    setIsSettledBill(true);
    setOpenBillSettle(false);
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

  async function handleSettleBillPopup() {
    var grTax = 0;
    if (isSettledBill) {
      setPaymentToBePaid(0.0);
      setOpenBillSettle(true);
    } else {
      const greenTaxresponse = await services.saveGreenTax(
        atob(invoiceId.toString())
      );
      if (greenTaxresponse) {
        grTax = greenTaxresponse.invoiceDetail.greenTax;
        setGTax(grTax);
        let totalCredit = 0;
        checkoutItemList.forEach((data) => {
          totalCredit +=
            data.credit !== ""
              ? data.credit + data.serviceCharge + data.governmentTax
              : 0;
        });
        setPaymentToBePaid(totalCredit + grTax - sumOfPayments);
        setOpenBillSettle(true);
      } else {
        alert.error("Error in completing bill");
      }
    }
  }
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
              count: invoiceData.count,
            }}
            validationSchema={Yup.object().shape({
              reservationNum: Yup.string().required(
                "Reservation Number is required"
              ),
              roomNum: Yup.string().required("Room Number is required"),
              customerName: Yup.string().required("Customer Name is required"),
              customerEmail: Yup.string()
                .required("Customer Email is required")
                .matches(
                  /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                  "Enter a valid email"
                ),
              count: Yup.string()
                .required("Count is required")
                .matches(/^-?[0-9]+$/, "Only allow whole numbers"),
              address: Yup.string().required("Address is required"),
              bookingType: Yup.number()
                .required("Booking Type is required")
                .min("1", "Booking Type is required"),
            })}
            onSubmit={saveInvoice}
            enableReinitialize
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values,
              props,
            }) => (
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
                              error={Boolean(
                                touched.reservationNum && errors.reservationNum
                              )}
                              fullWidth
                              helperText={
                                touched.reservationNum && errors.reservationNum
                              }
                              name="reservationNum"
                              onBlur={handleBlur}
                              onChange={(e) => handleChange1(e)}
                              value={invoiceData.reservationNum}
                              variant="outlined"
                              disabled={isUpdate}
                              size="small"
                            />
                          </Grid>
                          <Grid item md={6} xs={12}>
                            <InputLabel shrink id="roomNum">
                              Room Number *
                            </InputLabel>
                            <TextField
                              error={Boolean(touched.roomNum && errors.roomNum)}
                              fullWidth
                              helperText={touched.roomNum && errors.roomNum}
                              name="roomNum"
                              onBlur={handleBlur}
                              onChange={(e) => handleChange1(e)}
                              value={invoiceData.roomNum}
                              variant="outlined"
                              disabled={isDisableButton}
                              size="small"
                            />
                          </Grid>
                          <Grid item md={6} xs={12}>
                            <InputLabel shrink id="arrivalDate">
                              Arrival Date *
                            </InputLabel>
                            <FormControl variant="outlined" fullWidth>
                              <TextField
                                error={Boolean(
                                  touched.arrivalDate && errors.arrivalDate
                                )}
                                fullWidth
                                helperText={
                                  touched.arrivalDate && errors.arrivalDate
                                }
                                name="arrivalDate"
                                type="datetime-local"
                                InputLabelProps={{ shrink: true }}
                                value={invoiceData.arrivalDate}
                                onChange={(e) => handleChange1(e)}
                                onBlur={handleBlur}
                                variant="outlined"
                                size="small"
                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={6} xs={12}>
                            <InputLabel shrink id="departureDate">
                              Departure Date *
                            </InputLabel>
                            <FormControl variant="outlined" fullWidth>
                              <TextField
                                error={Boolean(
                                  touched.departureDate && errors.departureDate
                                )}
                                fullWidth
                                helperText={
                                  touched.departureDate && errors.departureDate
                                }
                                name="departureDate"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={invoiceData.departureDate}
                                onChange={(e) => handleChange1(e)}
                                onBlur={handleBlur}
                                variant="outlined"
                                size="small"
                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={6} xs={12}>
                            <InputLabel shrink id="customerName">
                              Customer Name *
                            </InputLabel>
                            <TextField
                              error={Boolean(
                                touched.customerName && errors.customerName
                              )}
                              fullWidth
                              helperText={
                                touched.customerName && errors.customerName
                              }
                              name="customerName"
                              onBlur={handleBlur}
                              onChange={(e) => handleChange1(e)}
                              value={invoiceData.customerName}
                              variant="outlined"
                              disabled={isDisableButton}
                              inputProps={{ maxLength: 20 }}
                              size="small"
                            />
                          </Grid>
                          <Grid item md={6} xs={12}>
                            <InputLabel shrink id="customerEmail">
                              Customer Email *
                            </InputLabel>
                            <TextField
                              error={Boolean(
                                touched.customerEmail && errors.customerEmail
                              )}
                              fullWidth
                              helperText={
                                touched.customerEmail && errors.customerEmail
                              }
                              name="customerEmail"
                              onBlur={handleBlur}
                              onChange={(e) => handleChange1(e)}
                              value={invoiceData.customerEmail}
                              variant="outlined"
                              disabled={isDisableButton}
                              size="small"
                            />
                          </Grid>
                          <Grid item md={6} xs={12}>
                            <InputLabel shrink id="address">
                              Address *
                            </InputLabel>
                            <TextField
                              error={Boolean(touched.address && errors.address)}
                              fullWidth
                              helperText={touched.address && errors.address}
                              name="address"
                              onBlur={handleBlur}
                              onChange={(e) => handleChange1(e)}
                              value={invoiceData.address}
                              variant="outlined"
                              disabled={isDisableButton}
                              inputProps={{ maxLength: 200 }}
                              size="small"
                            />
                          </Grid>
                          <Grid item md={6} xs={12}>
                            <InputLabel shrink id="city">
                              City
                            </InputLabel>
                            <TextField
                              error={Boolean(touched.city && errors.city)}
                              fullWidth
                              helperText={touched.city && errors.city}
                              name="city"
                              onBlur={handleBlur}
                              onChange={(e) => handleChange1(e)}
                              value={invoiceData.city}
                              variant="outlined"
                              disabled={isDisableButton}
                              inputProps={{ maxLength: 200 }}
                              size="small"
                            />
                          </Grid>
                          <Grid item md={6} xs={12}>
                            <InputLabel shrink id="country">
                              Country
                            </InputLabel>
                            <TextField
                              error={Boolean(touched.country && errors.country)}
                              fullWidth
                              helperText={touched.country && errors.country}
                              name="country"
                              onBlur={handleBlur}
                              onChange={(e) => handleChange1(e)}
                              value={invoiceData.country}
                              variant="outlined"
                              disabled={isDisableButton}
                              inputProps={{ maxLength: 200 }}
                              size="small"
                            />
                          </Grid>
                          <Grid item md={6} xs={12}>
                            <InputLabel shrink id="bookingType">
                              Booking Type *
                            </InputLabel>
                            <TextField
                              select
                              error={Boolean(
                                touched.bookingType && errors.bookingType
                              )}
                              fullWidth
                              size="small"
                              helperText={
                                touched.bookingType && errors.bookingType
                              }
                              name="bookingType"
                              onBlur={handleBlur}
                              onChange={(e) => handleChange1(e)}
                              value={invoiceData.bookingType}
                              variant="outlined"
                              id="bookingType"
                            >
                              <MenuItem value="0">
                                --Select Booking Type--
                              </MenuItem>
                              <MenuItem value="1">Online</MenuItem>
                              <MenuItem value="2">Direct</MenuItem>
                              <MenuItem value="3">Agent</MenuItem>
                            </TextField>
                          </Grid>
                          <Grid item xs={6}>
                            <InputLabel shrink id="count">
                              People Count *
                            </InputLabel>
                            <TextField
                              error={Boolean(touched.count && errors.count)}
                              fullWidth
                              helperText={touched.count && errors.count}
                              size="small"
                              name="count"
                              id="count"
                              onBlur={handleBlur}
                              onChange={(e) => handleChange1(e)}
                              value={invoiceData.count}
                              variant="outlined"
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                      <Divider />
                      <Formik
                        initialValues={{
                          date: itemData.date,
                          description: itemData.description,
                          comment: itemData.comment,
                          paymentType: itemData.paymentType,
                          amount: itemData.amount,
                          paymentMethod: itemData.paymentMethod,
                          cashier: itemData.cashier,
                          serviceCharge: itemData.serviceCharge,
                          governmentTax: itemData.governmentTax,
                        }}
                        validationSchema={Yup.object().shape({
                          description: Yup.string().required(
                            "Description is required"
                          ),
                          amount: Yup.string()
                            .required("Amount is required")
                            .matches(
                              /^-?[0-9]*(\.[0-9]{0,2})?$/,
                              "Only allow numbers with atmost two decimal places"
                            ),
                          cashier: Yup.string().required("Cashier is required"),
                          paymentMethod:
                            itemData.paymentMethod === "0" &&
                            itemData.paymentType !== "Credit"
                              ? Yup.number()
                                  .required("Payment method is required")
                                  .min("1", "Payment method is required")
                              : null,
                        })}
                        enableReinitialize
                        onSubmit={addInvoiceData}
                      >
                        {({
                          errors,
                          handleBlur,
                          touched,
                          values,
                          handleSubmit: AddFieldData,
                        }) => (
                          <Form>
                            <CardContent>
                              <Box style={{ marginBottom: 20 }}>
                                <Typography color={"textPrimary"} variant="h5">
                                  Add Items
                                </Typography>
                              </Box>
                              <Grid
                                container
                                spacing={3}
                                style={{ marginBottom: 10 }}
                              >
                                <Grid item md={6} xs={12}>
                                  <InputLabel shrink id="date">
                                    Date *
                                  </InputLabel>
                                  <FormControl variant="outlined" fullWidth>
                                    <TextField
                                      error={Boolean(
                                        touched.date && errors.date
                                      )}
                                      fullWidth
                                      helperText={touched.date && errors.date}
                                      name="date"
                                      type="date"
                                      InputLabelProps={{ shrink: true }}
                                      value={itemData.date}
                                      onChange={(e) => handleChange2(e)}
                                      onBlur={handleBlur}
                                      variant="outlined"
                                      size="small"
                                      InputProps={{
                                        inputProps: {
                                          min: invoiceData.arrivalDate,
                                          max: invoiceData.departureDate,
                                        },
                                      }}
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item md={6} xs={12}>
                                  <InputLabel shrink id="description">
                                    Description *
                                  </InputLabel>
                                  <TextField
                                    error={Boolean(
                                      touched.description && errors.description
                                    )}
                                    helperText={
                                      touched.description && errors.description
                                    }
                                    fullWidth
                                    name="description"
                                    onBlur={handleBlur}
                                    onChange={(e) => handleChange2(e)}
                                    size="small"
                                    value={itemData.description}
                                    variant="outlined"
                                  />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                  <InputLabel shrink id="comment">
                                    Comment
                                  </InputLabel>
                                  <TextField
                                    fullWidth
                                    name="comment"
                                    onBlur={handleBlur}
                                    onChange={(e) => handleChange2(e)}
                                    size="small"
                                    value={itemData.comment}
                                    variant="outlined"
                                  />
                                </Grid>
                                <Grid
                                  item
                                  md={6}
                                  xs={12}
                                  container
                                  alignItems="center"
                                >
                                  <Grid item xs={3}>
                                    <InputLabel shrink id="paymentType">
                                      Type
                                    </InputLabel>
                                    <TextField
                                      select
                                      // error={Boolean(touched.identityTypeID && errors.identityTypeID)}
                                      // helperText={touched.identityTypeID && errors.identityTypeID}
                                      fullWidth
                                      size="small"
                                      onBlur={handleBlur}
                                      id="paymentType"
                                      name="paymentType"
                                      value={itemData.paymentType}
                                      variant="outlined"
                                      onChange={(e) => handleChange2(e)}
                                    >
                                      <MenuItem value="Debit">Debit</MenuItem>
                                      <MenuItem value="Credit">Credit</MenuItem>
                                    </TextField>
                                  </Grid>
                                  <Grid item xs={9}>
                                    <InputLabel shrink id="amount">
                                      Amount *
                                    </InputLabel>
                                    <TextField
                                      error={Boolean(
                                        touched.amount && errors.amount
                                      )}
                                      fullWidth
                                      helperText={
                                        touched.amount && errors.amount
                                      }
                                      size="small"
                                      name="amount"
                                      id="amount"
                                      onBlur={handleBlur}
                                      onChange={(e) => handleChange2(e)}
                                      value={itemData.amount}
                                      variant="outlined"
                                    />
                                  </Grid>
                                </Grid>
                                <Grid item md={6} xs={12}>
                                  <InputLabel shrink id="paymentMethod">
                                    Payment Method *
                                  </InputLabel>
                                  <TextField
                                    select
                                    error={Boolean(
                                      touched.paymentMethod &&
                                        errors.paymentMethod
                                    )}
                                    fullWidth
                                    size="small"
                                    helperText={
                                      touched.paymentMethod &&
                                      errors.paymentMethod
                                    }
                                    name="paymentMethod"
                                    onBlur={handleBlur}
                                    onChange={(e) => handleChange2(e)}
                                    value={itemData.paymentMethod}
                                    variant="outlined"
                                    id="paymentMethod"
                                    disabled={itemData.paymentType === "Credit"}
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
                                <Grid item md={6} xs={12}>
                                  <InputLabel shrink id="description">
                                    Cashier *
                                  </InputLabel>
                                  <TextField
                                    error={Boolean(
                                      touched.cashier && errors.cashier
                                    )}
                                    helperText={
                                      touched.cashier && errors.cashier
                                    }
                                    fullWidth
                                    name="cashier"
                                    onBlur={handleBlur}
                                    onChange={(e) => handleChange2(e)}
                                    size="small"
                                    value={itemData.cashier}
                                    variant="outlined"
                                  />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                  <InputLabel shrink id="serviceCharge">
                                    Service Charge
                                  </InputLabel>
                                  <TextField
                                    fullWidth
                                    name="serviceCharge"
                                    size="small"
                                    value={itemData.serviceCharge}
                                    disabled
                                    variant="outlined"
                                  />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                  <InputLabel shrink id="governmentTax">
                                    Government Tax
                                  </InputLabel>
                                  <TextField
                                    fullWidth
                                    name="governmentTax"
                                    size="small"
                                    value={itemData.governmentTax}
                                    disabled
                                    variant="outlined"
                                  />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                  <Typography
                                    style={{
                                      fontWeight: "Bold",
                                      fontSize: "18px",
                                    }}
                                  >
                                    Total:{parseFloat(totalAmount)}
                                  </Typography>
                                </Grid>
                              </Grid>
                              <Box
                                display="flex"
                                justifyContent="flex-end"
                                style={{ paddingBottom: 10 }}
                              >
                                <Button
                                  variant="contained"
                                  type="button"
                                  style={{
                                    color: "#FFFFFF",
                                    backgroundColor: "#489EE7",
                                  }}
                                  onClick={AddFieldData}
                                >
                                  Add
                                </Button>
                              </Box>
                            </CardContent>
                          </Form>
                        )}
                      </Formik>
                      <Box minWidth={1000}>
                        <MaterialTable
                          title="Multiple Actions Preview"
                          columns={[
                            { title: "Date", field: "date" },
                            { title: "Description", field: "description" },
                            { title: "Comment", field: "comment" },
                            { title: "Debit", field: "debit" },
                            { title: "Credit", field: "credit" },
                            { title: "Governemt Tax", field: "governmentTax" },
                            { title: "Service Charge", field: "serviceCharge" },
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
                          actions={[
                            {
                              icon: "delete",
                              tooltip: "Remove",
                              onClick: (event, rowData) =>
                                handleClickRemove(rowData),
                            },
                            {
                              icon: "edit",
                              tooltip: "Edit",
                              disabled: isItemAddToEdit,
                              onClick: (event, rowData) =>
                                handleClickEdit(rowData),
                            },
                          ]}
                        />
                      </Box>
                      <Box display="flex" justifyContent="flex-end" p={2}>
                        <Button
                          style={{
                            color: !isCompleteBilling ? "#FFFFFF" : "",
                            backgroundColor: !isCompleteBilling
                              ? "#489EE7"
                              : "",
                          }}
                          disabled={
                            isSubmitting || isDisableButton || isCompleteBilling
                          }
                          type="submit"
                          variant="contained"
                        >
                          {isUpdate === true ? "Update" : "Save"}
                        </Button>
                      </Box>
                      {isUpdate === true ? (
                        <Box display="flex" justifyContent="flex-start" p={2}>
                          {!(isInvoiceCompleted)?
                          <Button
                           style={{
                              color: "#FFFFFF",
                              backgroundColor: "#489EE7",
                            }}
                            id="btnRecord"
                            variant="contained"
                            onClick={handleSettleBillPopup}
                          >
                            Settle the bill
                          </Button>: null}
                          &nbsp;
                          {!(isInvoiceGenerated) && isInvoiceCompleted?  
                            <Button
                              style={{
                                color: "#FFFFFF",
                                backgroundColor: "#489EE7",
                              }}
                              variant="contained"
                              onClick={() => {
                                handlePrintRequest();
                              }}
                            >
                              Print Request
                            </Button>
                          : null}
                          &nbsp;
                          {isPrintRequested === true ? (
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
                              {/* &nbsp;
                              <Button
                                style={{
                                  color: isCompleteBilling ? "#FFFFFF" : "",
                                  backgroundColor: isCompleteBilling
                                    ? "#56E58F"
                                    : "",
                                }}
                                variant="contained"
                                // onClick={handleEmailSend}
                              >
                                Email
                              </Button> */}
                            </Box>
                          ) : null}
                        </Box>
                      ) : null}
                    </PerfectScrollbar>
                  </Card>
                </Box>
              </form>
            )}
          </Formik>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Permission</DialogTitle>
            <DialogContent>
              <DialogContentText>
                To complete this invoice, please enter accountant email address
                and password here.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="UserName"
                label="Username"
                type="email"
                fullWidth
                required
                onChange={(e) => setUserName(e.target.value)}
              />
              <TextField
                autoFocus
                margin="dense"
                id="password"
                label="Password"
                type="password"
                fullWidth
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={handlePermission} color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={openBillSettle}
            onClose={() => setOpenBillSettle(false)}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Settle the bill</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Green Tax : {parseFloat(gTax).toFixed(2)}
              </DialogContentText>
              <DialogContentText>
                Balance to be paid : {parseFloat(paymentToBePaid).toFixed(2)}
              </DialogContentText>
              <TextField
                select
                fullWidth
                size="small"
                name="finalPaymentMethod"
                onChange={(e) => handleChange3(e)}
                value={finalPaymentMethod}
                variant="outlined"
                id="finalPaymentMethod"
                required
              >
                <MenuItem value="Cash">Cash</MenuItem>
                <MenuItem value="Card">Card</MenuItem>
                <MenuItem value="Bank Transfer">
                  Bank Transfer
                </MenuItem>
              </TextField>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenBillSettle(false)} color="primary">
                Cancel
              </Button>
              <Button
                onClick={handleBillPrint}
                color="primary"
                variant="contained"
              >
                Settle and print
              </Button>
              <div hidden={true}>
                <TemporyBillPDF
                  ref={componentRef}
                  invoiceData={checkoutInvoiceData}
                  itemData={checkoutItemList}
                  greenTax={gTax}
                />
              </div>
            </DialogActions>
          </Dialog>
        </Container>
      </Page>
    </Fragment>
  );
}
