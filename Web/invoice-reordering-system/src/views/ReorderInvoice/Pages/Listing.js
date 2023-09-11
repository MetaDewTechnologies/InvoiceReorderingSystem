import React, { useState, useEffect, useRef } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
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
  MenuItem,
} from '@material-ui/core';
import Page from '../../../components/Page';
import services from '../Services';
import { useNavigate } from 'react-router-dom';
import { trackPromise } from 'react-promise-tracker';
import MaterialTable from 'material-table';
import { useFormik, Form, FormikProvider, Formik } from 'formik';
import * as Yup from 'yup';
import { LoadingComponent } from '../../../utils/newLoader';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { useAlert } from "react-alert";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  colorCancel: {
    backgroundColor: 'red'
  },
  colorRecordAndNew: {
    backgroundColor: '#FFBE00'
  },
  colorRecord: {
    backgroundColor: 'green'
  }
}));

export default function ReorderInvoice(props) {
  const alert = useAlert();
  const classes = useStyles();
  const [invoiceList, setInvoiceList] = useState({
    fromdate: '',
    todate: ''
  });
  const navigate = useNavigate();
  const componentRef = useRef();
  const [isViewTable, setIsViewTable] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [open, setOpen] = useState(false)
  const [ItemDataList, setItemDataList] = useState([])

  const ProductSaveSchema = Yup.object().shape({
    fromdate: Yup.date().required('From Date is required'),
    todate: Yup.date().required('To Date is required')
  });

  const formik = useFormik({
    initialValues: {
      fromdate: invoiceList.fromdate,
      todate: invoiceList.todate
    },
    validationSchema: ProductSaveSchema,
    onSubmit: values => {
      trackPromise(SearchData());
    }
  });

  const {
    errors,
    setValues,
    touched,
    handleSubmit,
    values
  } = formik;
  const [totalNet, setTotalNet] = useState({
    total: 0
  });

  useEffect(() => {
    setInvoices([])
  }, [formik.values.fromdate || formik.values.todate]);

  const handleSelectionChange = (rows) => {
    setSelectedRows(rows);
  };

  function handleChange(e) {
    const target = e.target;
    const value = target.value;
    setValues({
      ...values,
      [e.target.name]: value
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
      departureDate: new Date(formik.values.todate)
    };
    var response = await services.getInvoicesByDateRange(model);
    const modifiedInvoices = response.map((invoice) => {
      if (invoice.invoiceDetail.isInvoiceGenerated === true) {
        return { ...invoice, status: 'Invoice Printed' };
      }
      else if(invoice.invoiceDetail.isReordered === true && invoice.invoiceDetail.isInvoiceGenerated === false){
        return {...invoice, status:'Process Executed - To Be Printed'}
      }
      else if(invoice.invoiceDetail.isReordered === false){
        return {...invoice, status:'Reorder Process Pending'}
      }
       else {
        return invoice;
      }
    });
    const modifiedDates = modifiedInvoices.map((item)=>{
      return { ...item, 
                invoiceId: item.invoiceDetail.invoiceId,
                reservationNum: item.invoiceDetail.reservationNum,
                roomNum: item.invoiceDetail.roomNum,
                arrivalDate: item.invoiceDetail.arrivalDate.split('T')[0],
                departureDate: item.invoiceDetail.departureDate.split('T')[0]}
    })
    setInvoices(modifiedDates);
    setIsViewTable(false);
  }
  const handleClose = () => {
    setOpen(false);
  };
  function handleView(data){
    setItemDataList(data.invoiceItems)
    setOpen(true)
  }
  async function handleReordering(){
    const arrayOfInvoiceIds = selectedRows.map((obj) => obj.invoiceId);
    const model ={
      invoiceIds:arrayOfInvoiceIds
    }
    const response = await services.reorderingInvoices(model)
    if(response.statusCode==='SUCCESS'){
      alert.success(response.message);
    }else{
      alert.success("Error in reordering");
    }
    clearFields();
  }
  const clearFields = () => {
    formik.resetForm();
  };

  const actions = [
    {
      icon: () => <VisibilityIcon />,
      tooltip: <p>View Payments</p>,
      onClick: (event, rowData) => handleView(rowData),
      position: "row"
    }
  ];

  return (
    <Page className={classes.root} title="Reorder Invoices">
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
                <CardHeader title={cardTitle('Reorder Invoices')} />
                <PerfectScrollbar>
                  <Divider />
                  <CardContent style={{ marginBottom: '2rem' }}>
                    <Grid container spacing={4}>
                      <Grid item md={4} xs={12}>
                        <FormControl
                          variant="outlined"
                          fullWidth
                          label="fromdate"
                        >
                          <TextField
                            error={Boolean(
                              touched.fromdate && errors.fromdate
                            )}
                            fullWidth
                            helperText={touched.fromdate && errors.fromdate}
                            name="fromdate"
                            label="From Date *"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={formik.values.fromdate}
                            onChange={e => handleChange(e)}
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
                            onChange={e => handleChange(e)}
                            value={formik.values.todate}
                            variant="outlined"
                            size="small"
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={4} xs={12}>
                        <Button
                          style={{color:'#FFFFFF', backgroundColor:"#489EE7"}}
                          type="submit"
                          variant="contained"
                        >
                          Search
                        </Button>
                        &nbsp;
                        <Button
                          style={{color:'#489EE7'}}
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
                  <Box minWidth={1050} >
                    <Box minWidth={1050} >
                      <MaterialTable
                        actions={actions}
                        hidden={isViewTable}
                        title="Multiple Actions Preview"
                        columns={[
                          { title: 'Reservation No.', align: 'left', field: 'reservationNum' },
                          { title: 'Room No.', align: 'center', field: 'roomNum' },
                          { title: 'Arrival Date', align: 'center', field: 'arrivalDate' },
                          { title: 'Departure Date', align: 'center', field: 'departureDate' },
                          { title: 'Status', align: 'center', field: 'status'}
                        ]}
                        data={invoices}
                        title="Invoice List"
                        options={{
                          exportButton: false,
                          cellStyle: { textAlign: 'left' },
                          columnResizable: false,
                          addRowPosition: "first",
                          headerStyle: { textAlign: "left", height: '1%' },
                          actionsColumnIndex: -1,
                          selection:true,
                          selectionProps: rowData => ({
                            disabled: rowData.invoiceDetail.isReordered ===  true || rowData.invoiceDetail.isInvoiceGenerated === true,
                            color: 'primary'
                          })
                        }}
                        onSelectionChange={(e) => handleSelectionChange(e)}
                      />
                    </Box>
                  <Box display="flex" justifyContent="flex-end" p={2}>
                    <Button
                    style={{color:selectedRows.length>0?'#FFFFFF':'', backgroundColor:selectedRows.length>0?"#489EE7":''}}
                    variant="contained"
                    onClick={() => handleReordering()}
                    disabled={selectedRows.length==0}
                    >
                    Reorder
                    </Button>
                </Box>
                </Box>
                </CardContent>
                </PerfectScrollbar>
              </Card>
            </Box>
          </Form>
        </FormikProvider>
        <Dialog maxWidth  open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Payment Details</DialogTitle>
            <DialogContent>
              <Box minWidth={1000} >
                          <MaterialTable
                            title="Multiple Actions Preview"
                            columns={[
                              { title: 'Date', field: 'date' },
                              { title: 'Description', field: 'description' },
                              { title: 'Comment', field: 'comment' },
                              { title: 'Amount', field:'amount'},
                              { title: 'Payment Method', field: 'paymentMethod' },
                              { title: 'Payment Type', field: 'paymentType' },
                              { title: 'Cashier', field: 'cashier' }
                            ]}
                            data={ItemDataList}
                            options={{
                              exportButton: false,
                              showTitle: false,
                              headerStyle: { textAlign: "left" },
                              cellStyle: { textAlign: "left" },
                              columnResizable: false,
                            }}
                          />
                        </Box>
            </DialogContent>
          </Dialog>
      </Container >
    </Page >
  );
}
