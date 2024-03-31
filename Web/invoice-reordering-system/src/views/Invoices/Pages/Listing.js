import React, { useState, useEffect, useRef } from "react";
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
} from "@material-ui/core";
import Page from "../../../components/Page";
import services from "../Services";
import { trackPromise } from "react-promise-tracker";
import MaterialTable from "material-table";
import { useFormik, Form, FormikProvider } from "formik";
import * as Yup from "yup";
import { LoadingComponent } from "../../../utils/newLoader";
import CreatePDF from "../../ManageInvoice/Pages/CreatePDF";
import { useReactToPrint } from "react-to-print";

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
  colorCancel: {
    backgroundColor: "red",
  },
  colorRecordAndNew: {
    backgroundColor: "#FFBE00",
  },
  colorRecord: {
    backgroundColor: "green",
  },
}));

export default function Invoices(props) {
  const classes = useStyles();
  const [invoiceList, setInvoiceList] = useState({
    fromdate: "",
    todate: "",
  });
  const componentRef = useRef();
  const [isViewTable, setIsViewTable] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [selectedRows, setSelectedRows] = useState("");
  const [gTax, setGTax] = useState("");
  const [print, setprint] = useState(false);
  const [cashierName, setCashierName] = useState("");
  const [invoiceID, setInvoiceID] = useState("");

  const ProductSaveSchema = Yup.object().shape({
    fromdate: Yup.date().required("From Date is required"),
    todate: Yup.date().required("To Date is required"),
  });

  const formik = useFormik({
    initialValues: {
      fromdate: invoiceList.fromdate,
      todate: invoiceList.todate,
    },
    validationSchema: ProductSaveSchema,
    onSubmit: (values) => {
      trackPromise(SearchData());
    },
  });

  const { errors, setValues, touched, handleSubmit, values } = formik;
  const [totalNet, setTotalNet] = useState({
    total: 0,
  });

  useEffect(() => {
    setInvoices([]);
  }, [formik.values.fromdate || formik.values.todate]);

  function handleChange(e) {
    const target = e.target;
    const value = target.value;
    setValues({
      ...values,
      [e.target.name]: value,
    });
  }

  function cardTitle(titleName) {
    return (
      <Grid container spacing={1}>
        <Grid item md={10} xs={12}>
          {titleName}
        </Grid>
      </Grid>
    );
  }

  async function SearchData() {
    let model = {
      arrivalDate: new Date(formik.values.fromdate),
      departureDate: new Date(formik.values.todate),
    };
    var response = await services.getInvoicesByDateRange(model);
    var filteredResponse = response.filter(
      (item) => item.invoiceDetail.isReordered == true
    );
    const modifiedInvoices = filteredResponse.map((invoice) => {
      if (invoice.invoiceDetail.isInvoiceGenerated === true) {
        return { ...invoice, status: "Printed" };
      } else if (
        invoice.invoiceDetail.isReordered === true &&
        invoice.invoiceDetail.isInvoiceGenerated === false
      ) {
        return { ...invoice, status: "To Be Printed" };
      } else if (invoice.invoiceDetail.isReordered === false) {
        return { ...invoice, status: "Reorder Process Pending" };
      } else {
        return invoice;
      }
    });
    const modifiedDates = modifiedInvoices.map((item) => {
      return {
        ...item,
        invoiceId: item.invoiceDetail.invoiceId,
        reservationNum: item.invoiceDetail.reservationNum,
        roomNum: item.invoiceDetail.roomNum,
        customerName: item.invoiceDetail.customerName,
        arrivalDate: item.invoiceDetail.arrivalDate.split("T")[0],
        departureDate: item.invoiceDetail.departureDate.split("T")[0],
        greenTax: item.invoiceDetail.greenTax,
        isReordered: item.invoiceDetail.isReordered,
        invoiceItems: item.invoiceItems.map((item) => {
          return {
            ...item,
            debit: item.paymentType === "Debit" ? item.amount : "",
            credit: item.paymentType === "Credit" ? item.amount : "",
          };
        }),
      };
    });
    const name = sessionStorage.getItem("userName");
    setCashierName(name);
    setInvoices(modifiedDates);
    setIsViewTable(false);
  }

  const clearFields = () => {
    formik.resetForm();
    setInvoiceList({
      ...invoiceList,
    });
    setInvoices([]);
    setTotalNet({ total: 0 });
  };

  async function customHandlePrint(row) {
    const gTax = await services.getGreenTaxByInvoiceId(row.invoiceId);
    setGTax(gTax);
    const response = await services.handleCreateInvoice(row.invoiceId);
    setInvoiceID(response);
    setprint(true);
    setSelectedRows(row);
  }

  useEffect(() => {
    if (selectedRows != "") {
      setprint(false);
      handlePrint();
    }
  }, [selectedRows, print]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return (
    <Page className={classes.root} title="Invoices">
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
                <CardHeader title={cardTitle("Invoices")} />
                <PerfectScrollbar>
                  <Divider />
                  <CardContent style={{ marginBottom: "2rem" }}>
                    <Grid container spacing={4}>
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
                        >
                          Search
                        </Button>
                        &nbsp;
                        <Button
                          style={{ color: "#489EE7" }}
                          type="button"
                          variant="outlined"
                          onClick={clearFields}
                        >
                          Clear
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <CardContent>
                    <Box minWidth={1050}>
                      <Box minWidth={1050}>
                        <MaterialTable
                          hidden={isViewTable}
                          columns={[
                            {
                              title: "Reservation No.",
                              align: "left",
                              field: "reservationNum",
                            },
                            {
                              title: "Room No.",
                              align: "center",
                              field: "roomNum",
                            },
                            {
                              title: "Arrival Date",
                              align: "center",
                              field: "arrivalDate",
                            },
                            {
                              title: "Departure Date",
                              align: "center",
                              field: "departureDate",
                            },
                            {
                              title: "Customer Name",
                              align: "center",
                              field: "customerName",
                            },
                            {
                              title: "Status",
                              align: "center",
                              field: "status",
                            },
                          ]}
                          data={invoices}
                          title="Invoice List"
                          options={{
                            exportButton: false,
                            cellStyle: { textAlign: "left" },
                            columnResizable: false,
                            addRowPosition: "first",
                            headerStyle: { textAlign: "left", height: "1%" },
                            actionsColumnIndex: -1,
                          }}
                          actions={[
                            {
                              icon: "print",
                              tooltip: "Print Invoice",
                              onClick: (event, rowData) => {
                                customHandlePrint(rowData);
                              },
                            },
                          ]}
                        />
                      </Box>
                    </Box>
                    {selectedRows.invoiceDetail !== "" ? (
                      <div hidden={true}>
                        <CreatePDF
                          ref={componentRef}
                          invoiceData={selectedRows !== "" ? selectedRows : ""}
                          itemData={
                            selectedRows.invoiceItems
                              ? selectedRows.invoiceItems
                              : []
                          }
                          // invoiceDetail={
                          //   selectedRows.invoiceDetail !== ""
                          //     ? selectedRows.invoiceDetail
                          //     : ""
                          // }
                          greenTax={gTax}
                          cashierName={cashierName}
                          invoiceID={invoiceID}
                        />
                      </div>
                    ) : (
                      ""
                    )}
                  </CardContent>
                </PerfectScrollbar>
              </Card>
            </Box>
          </Form>
        </FormikProvider>
      </Container>
    </Page>
  );
}
