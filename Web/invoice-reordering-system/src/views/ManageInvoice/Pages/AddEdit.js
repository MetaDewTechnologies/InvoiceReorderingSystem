import React, { useState, useEffect, Fragment } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
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
  Switch,
  CardHeader,
  MenuItem,
  Typography,
  FormControl
} from '@material-ui/core';
import Page from '../../../components/Page';
import services from '../Services';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, validateYupSchema ,Form} from 'formik';
import * as Yup from "yup";
import PageHeader from '../../Common/PageHeader';
import { useAlert } from "react-alert";
import { LoadingComponent } from '../../../utils/newLoader';
import { trackPromise } from 'react-promise-tracker';
// import authService from '../../../utils/permissionAuth';
// import tokenService from '../../../utils/tokenDecoder';
import MaterialTable from "material-table";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  avatar: {
    marginRight: theme.spacing(2)
  }

}));

export default function InvoiceAddEdit(props) {
  const [title, setTitle] = useState("Inprogress Invoices")
  const [isUpdate, setIsUpdate] = useState(false);
  const classes = useStyles();
  const [invoiceData, setInvoiceData] = useState({
      reservationNumber:'',
      roomNumber:'',
      arrivalDate:new Date(),
      departureDate:new Date(),
      customerName:'',
      customerEmail:'',
      address:'',
      city:'',
      country:''
  });
  const [itemData, setItemData] = useState({
    date: new Date()
    .toISOString()
    .slice(0, 10),
    description:"",
    comment: "",
    settlementType: "1",
    settlement:"",
    paymentMethod:"0",
    cashier:""
  })
  const [ItemDataList, setItemDataList] = useState([])
  const [isDisableButton, setIsDisableButton] = useState(false)
  const [selectedRow, setSelectedRow] = useState()

  const navigate = useNavigate();
  const handleClick = () => {

    navigate('/app/manageInvoices/listing/');
  }

  const [permissionList, setPermissions] = useState({
    isGroupFilterEnabled: false,
    isFactoryFilterEnabled: false
  });
  const alert = useAlert();
  const { invoiceID } = useParams();
  let decrypted = 0;

  useEffect(() => {
    decrypted = atob(invoiceID.toString());
    if (decrypted != 0) {
      trackPromise(
        getInvoiceDetails(decrypted)
      )
    }
  }, []);


  // async function getPermissions() {
  //   var permissions = await authService.getPermissionsByScreen(screenCode);
  //   var isAuthorized = permissions.find(p => p.permissionCode == 'ADDEDITROUTE');

  //   if (isAuthorized === undefined) {
  //     navigate('/404');
  //   }

  //   var isGroupFilterEnabled = permissions.find(p => p.permissionCode == 'GROUPDROPDOWN');
  //   var isFactoryFilterEnabled = permissions.find(p => p.permissionCode == 'FACTORYDROPDOWN');

  //   setPermissions({
  //     ...permissionList,
  //     isGroupFilterEnabled: isGroupFilterEnabled !== undefined,
  //     isFactoryFilterEnabled: isFactoryFilterEnabled !== undefined,
  //   });

  //   setRoute({
  //     ...route,
  //     groupID: parseInt(tokenService.getGroupIDFromToken()),
  //     factoryID: parseInt(tokenService.getFactoryIDFromToken())
  //   })
  // }


  // async function getProductsForDropDown() {
  //   const product = await services.getProductsByFactoryID(invoiceData.factoryID);
  //   setProducts(product);
  // }

  async function getInvoiceDetails(invoiceID) {
    // let response = await services.getRouteDetailsByID(routeID);
    // let data = response[0];
    // setTitle("Update Invoice");
    // data.transportRate = data.transportRate.toFixed(2)
    // setInvoiceData(data);
    setIsUpdate(true);
  }

  async function saveRoute(values) {
    if (isUpdate === true) {
      let updateModel = {
        routeID: atob(invoiceID.toString()),
        routeCode: values.routeCode,
        routeName: values.routeName,
        routeLocation: values.routeLocation,
        transportRate: values.transportRate,
        targetCrop: values.targetCrop,
        productID: values.productID,
        isActive: values.isActive,
        factoryID: values.factoryID,
        groupID: values.groupID
      }
      let response = await services.updateRoute(updateModel);
      if (response.statusCode === "Success") {
        alert.success(response.message);
        setIsDisableButton(true);
        navigate('/app/division/listing');
      }
      else {
        alert.error(response.message);
      }
    }

    else {
      let response = await services.saveRoute(values);

      if (response.statusCode === "Success") {
        alert.success(response.message);
        setIsDisableButton(true);
        navigate('/app/division/listing');
      }
      else {
        alert.error(response.message);
      }
    }
  }

  function generateDropDownMenu(data) {
    let items = []
    if (data != null) {
      for (const [key, value] of Object.entries(data)) {
        items.push(<MenuItem key={key} value={key}>{value}</MenuItem>);
      }
    }
    return items
  }

  function handleChange1(e) {
    const target = e.target;
    const value = target.value
    setInvoiceData({
      ...invoiceData,
      [e.target.name]: value
    });
  }

  function handleChange2(e) {
    const target = e.target;
    const value = target.value
    setItemData({
      ...itemData,
      [e.target.name]: value
    });
  }

  function handleClickEdit (data){
    const dataDelete = [...ItemDataList];
    const index = data.tableData.id;
    var deletedValue =dataDelete.splice(index, 1)[0];
    setSelectedRow(deletedValue);
    setItemDataList([...dataDelete])
    setIsUpdate(true)
    setItemData({
      date : data.date != null ?data.date.split('T')[0]:"",
      description : data.description,
      comment : data.comment,
      settlementType : data.settlementType,
      settlement : data.settlement,
      paymentMethod : data.paymentMethod,
      cashier : data.cashier
    })
  }

  async function handleClickRemove(data) {
    const dataDelete = [...ItemDataList];
    const index = data.tableData.id;
    var deletedValue =dataDelete.splice(index, 1)[0]
    // if(dataDelete.length ==0 ){
    //   var response = await services.deleteInvoiceItem(deletedValue.ItemID)
    //   if (response.statusCode == "Success") {
    //     alert.success(response.message);}
    //   setDeleteGTN(false);
    //   navigate('/app/GoodTransferNote/listing');
    // }
    // if(deletedValue.agentGTNDetailID){
    //   var response = await services.deleteAgentGTNItem(deletedValue.agentGTNDetailID)
    //   if (response.statusCode == "Success") {
    //     alert.success(response.message);}
    // }
    setItemDataList([...dataDelete]);
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
          />
        </Grid>
      </Grid>
    )
  }

  function AddFieldData() {
    let dataModel = {
      date: itemData.date,
      description:itemData.description,
      comment: itemData.comment,
      settlementType: itemData.settlementType,
      debit:itemData.settlementType === '1'? itemData.settlement:'',
      credit:itemData.settlementType === '2'? itemData.settlement:'',
      settlement: itemData.settlement,
      paymentMethod:itemData.paymentMethod,
      cashier:itemData.cashier
    }
    setItemDataList(ItemDataList => [...ItemDataList, dataModel]);
    setItemData({
      date: new Date()
      .toISOString()
      .slice(0, 10),
      description:"",
      comment: "",
      settlementType: "1",
      settlement:"",
      paymentMethod:"1",
      cashier:""
    })
  }

  return (
    <Fragment>
      <LoadingComponent />
      <Page className={classes.root} title={title}>
        <Container maxWidth={false}>
          <Formik
            initialValues={{
              reservationNumber: invoiceData.reservationNumber,
              roomNumber: invoiceData.roomNumber,
              arrivalDate: invoiceData.arrivalDate,
              departureDate: invoiceData.departureDate,
              customerName: invoiceData.customerName,
              customerEmail: invoiceData.customerEmail,
              address: invoiceData.address,
              city: invoiceData.city,
              country: invoiceData.country,
            }}
            validationSchema={
              Yup.object().shape({
                reservationNumber : Yup.string().required('Reservation Number is required'),
                roomNumber : Yup.string().required("Room Number is required"),
                customerName: Yup.string().required("Customer Name is required"),
                customerEmail: Yup.string().required("Customer Email is required").matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Enter a valid email'),
                address : Yup.string().required("Address is required")
              })
            }
            onSubmit={saveRoute}
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
              props
            }) => (
              <form onSubmit={handleSubmit}>
                <Box mt={0}>
                  <Card>
                    <CardHeader
                      title={cardTitle(title)}
                    />
                    <PerfectScrollbar>
                      <Divider />
                      <CardContent>
                        <Grid container spacing={3}>
                        <Grid item md={6} xs={12}>
                            <InputLabel shrink id="reservationNumber">
                              Reservation Number *
                            </InputLabel>
                            <TextField
                              error={Boolean(touched.reservationNumber && errors.reservationNumber)}
                              fullWidth
                              helperText={touched.reservationNumber && errors.reservationNumber}
                              name="reservationNumber"
                              onBlur={handleBlur}
                              onChange={(e) => handleChange1(e)}
                              value={invoiceData.reservationNumber}
                              variant="outlined"
                              disabled={isDisableButton}
                              size="small"
                            />
                          </Grid>
                        <Grid item md={6} xs={12}>
                            <InputLabel shrink id="roomNumber">
                              Room Number *
                            </InputLabel>
                            <TextField
                              error={Boolean(touched.roomNumber && errors.roomNumber)}
                              fullWidth
                              helperText={touched.roomNumber && errors.roomNumber}
                              name="roomNumber"
                              onBlur={handleBlur}
                              onChange={(e) => handleChange1(e)}
                              value={invoiceData.roomNumber}
                              variant="outlined"
                              disabled={isDisableButton}
                              size="small"
                            />
                          </Grid>
                        <Grid item md={6} xs={12}>
                        <InputLabel shrink id="arrivalDate">
                          Arrival Date *
                        </InputLabel>
                        <FormControl
                          variant="outlined"
                          fullWidth
                        >
                          <TextField
                            error={Boolean(touched.arrivalDate && errors.arrivalDate)}
                            fullWidth
                            helperText={touched.arrivalDate && errors.arrivalDate}
                            name="arrivalDate"
                            defaultValue={new Date()
                              .toISOString()
                              .slice(0, 10)}
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={itemData.arrivalDate}
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
                        <FormControl
                          variant="outlined"
                          fullWidth
                        >
                          <TextField
                            error={Boolean(touched.departureDate && errors.departureDate)}
                            fullWidth
                            helperText={touched.departureDate && errors.departureDate}
                            name="departureDate"
                            defaultValue={new Date()
                              .toISOString()
                              .slice(0, 10)}
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={itemData.departureDate}
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
                              error={Boolean(touched.customerName && errors.customerName)}
                              fullWidth
                              helperText={touched.customerName && errors.customerName}
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
                              error={Boolean(touched.customerEmail && errors.customerEmail)}
                              fullWidth
                              helperText={touched.customerEmail && errors.customerEmail}
                              name="customerEmail"
                              onBlur={handleBlur}
                              onChange={(e) => handleChange1(e)}
                              value={invoiceData.customerEmail}
                              variant="outlined"
                              disabled={isDisableButton}
                              inputProps={{ maxLength: 20 }}
                              size="small"
                            />
                          </Grid>
                        <Grid item md={6} xs={12}>
                            <InputLabel shrink id="address">
                              Address
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
                              inputProps={{ maxLength: 20 }}
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
                              inputProps={{ maxLength: 20 }}
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
                              inputProps={{ maxLength: 20 }}
                              size="small"
                            />
                          </Grid>
                        </Grid>
                      </CardContent> 
                    <Divider/>
                    <Formik
                      initialValues={{
                          date: itemData.date,
                          description : itemData.description,
                          comment : itemData.comment,
                          settlementType : itemData.settlementType,
                          settlement: itemData.settlement,
                          paymentMethod: itemData.paymentMethod,
                          cashier : itemData.cashier
                      }}
                      validationSchema={
                          Yup.object().shape({
                              description : Yup.string().required("Description is required"),
                              settlement:Yup.string().required("Amount is required").matches(/^[0-9]*(\.[0-9]{0,2})?$/, 'Only allow numbers with atmost two decimal places'),
                              cashier: Yup.number().required("Cashier is required").min("1",'Cashier is required'),
                              paymentMethod:itemData.settlementType ==="1"? Yup.number().required("Payment method is required").min("1",'Payment method is required'):null,
                          })
                      }
                      enableReinitialize
                      onSubmit={AddFieldData}
                  >
                      {({
                          errors,
                          handleBlur,
                          touched,
                          values,
                      }) => (
                      <Form>
                      <CardContent>
                      <Box style={{marginBottom:20}}>
                      <Typography color={"textPrimary"} variant="h5">Add Items</Typography>
                      </Box>
                        <Grid container spacing={3} style={{marginBottom:10}}>
                        <Grid item md={6} xs={12}>
                        <InputLabel shrink id="date">
                          Date *
                        </InputLabel>
                        <FormControl
                          variant="outlined"
                          fullWidth
                        >
                          <TextField
                            error={Boolean(touched.date && errors.date)}
                            fullWidth
                            helperText={touched.date && errors.date}
                            name="date"
                            defaultValue={new Date()
                              .toISOString()
                              .slice(0, 10)}
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={itemData.date}
                            onChange={(e) => handleChange2(e)}
                            onBlur={handleBlur}
                            variant="outlined"
                            size="small"
                          />
                        </FormControl>
                      </Grid>
                          <Grid item md={6} xs={12}>
                            <InputLabel shrink id="description">
                              Description *
                            </InputLabel>
                            <TextField
                              error={Boolean(touched.description && errors.description)}
                              helperText={touched.description && errors.description}
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
                          <Grid item md={6} xs={12}  container alignItems="center">
                          <Grid item xs={3}>
                            <InputLabel shrink id="settlementType">
                              Type 
                            </InputLabel>
                            <TextField select
                              // error={Boolean(touched.identityTypeID && errors.identityTypeID)}
                              // helperText={touched.identityTypeID && errors.identityTypeID}
                              fullWidth
                              size='small'
                              onBlur={handleBlur}
                              id="settlementType"
                              name="settlementType"
                              value={itemData.settlementType}
                              variant="outlined"
                              onChange={(e) => handleChange2(e)}
                            >
                              <MenuItem value="1">Debit</MenuItem>
                              <MenuItem value="2">Credit</MenuItem>
                            </TextField>
                          </Grid>
                          <Grid item xs={9}>
                            <InputLabel shrink id="settlement">
                              Amount *
                            </InputLabel>
                            <TextField
                              error={Boolean(touched.settlement && errors.settlement)}
                              fullWidth
                              helperText={touched.settlement && errors.settlement}
                              size='small'
                              name="settlement"
                              id="settlement"
                              onBlur={handleBlur}
                              onChange={(e) => handleChange2(e)}
                              value={itemData.settlement}
                              variant="outlined"
                            />
                          </Grid>
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <InputLabel shrink id="paymentMethod">
                              Payment Method *
                            </InputLabel>
                            <TextField select
                              error={Boolean(touched.paymentMethod && errors.paymentMethod)}
                              fullWidth
                              size="small"
                              helperText={touched.paymentMethod && errors.paymentMethod}
                              name="paymentMethod"
                              onBlur={handleBlur}
                              onChange={(e) => handleChange2(e)}
                              value={itemData.paymentMethod}
                              variant="outlined"
                              id="paymentMethod"
                              disabled={itemData.settlementType ==='2'}
                            >
                              <MenuItem value="0">--Select Payment Method--</MenuItem>
                              <MenuItem value="1">Cash</MenuItem>
                              <MenuItem value="2">Card</MenuItem>
                            </TextField>
                          </Grid> 
                        <Grid item md={6} xs={12}>
                            <InputLabel shrink id="cashier">
                              Cashier *
                            </InputLabel>
                            <TextField select
                              error={Boolean(touched.cashier && errors.cashier)}
                              fullWidth
                              size="small"
                              helperText={touched.cashier && errors.cashier}
                              name="cashier"
                              onBlur={handleBlur}
                              onChange={(e) => handleChange1(e)}
                              value={itemData.cashier}
                              variant="outlined"
                              id="cashier"
                            >
                              <MenuItem value="0">--Select Cashier--</MenuItem>
                              {generateDropDownMenu()}
                            </TextField>
                          </Grid> 
                        </Grid>
                        <Box display="flex" justifyContent="flex-end" style={{paddingBottom:10}} >
                          <Button
                            variant="contained"
                            type="submit"
                            style={{color:'#FFFFFF', backgroundColor:"#489EE7"}}
                          >
                            Add
                          </Button>
                        </Box>
                      </CardContent>
                      </Form>)}
                      </Formik>
                        <Box minWidth={1000} >
                          <MaterialTable
                            title="Multiple Actions Preview"
                            columns={[
                              { title: 'Date', field: 'date' },
                              { title: 'Description', field: 'description' },
                              { title: 'Comment', field: 'comment' },
                              { title: 'Debit', field:'debit'},
                              { title: 'Credit', field: 'credit' }
                            ]}
                            data={ItemDataList}
                            options={{
                              exportButton: false,
                              showTitle: false,
                              headerStyle: { textAlign: "left", height: '1%' },
                              cellStyle: { textAlign: "left" },
                              columnResizable: false,
                              actionsColumnIndex: -1
                            }}
                            actions={[
                              {
                                icon: 'delete',
                                tooltip: 'Remove',
                                onClick: (event, rowData) => handleClickRemove(rowData)
                              },
                              {
                                icon: 'edit',
                                tooltip: 'Edit',
                                onClick: (event, rowData) => handleClickEdit(rowData)
                              }
                            ]}
                          />
                        </Box>
                      <Box display="flex" justifyContent="flex-end" p={2}>
                        <Button
                          style={{color:'#FFFFFF', backgroundColor:"#489EE7"}}
                          disabled={isSubmitting || isDisableButton}
                          type="submit"
                          variant="contained"
                        >
                          {isUpdate == true ? "Update" : "Save"}
                        </Button>
                      </Box>
                      {isUpdate == true? (
                      <Box display="flex" justifyContent="flex-start" p={2}>
                        <Button
                          style={{color:'#FFFFFF', backgroundColor:"#489EE7"}}
                          variant="contained"
                          // onClick={handleCompleteInvoice}
                        >
                          Complete Invoice
                        </Button>
                        &nbsp;
                        <Button
                          style={{color:'#FFFFFF', backgroundColor:"#F10909"}}
                          variant="contained"
                          // onClick={handlePdfGenerate}
                        >
                          PDF
                        </Button>
                        &nbsp;
                        <Button
                          style={{color:'#FFFFFF', backgroundColor:"#56E58F"}}
                          variant="contained"
                          // onClick={handleEmailSend}
                        >
                          Email
                        </Button>
                      </Box>):null}
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
};
