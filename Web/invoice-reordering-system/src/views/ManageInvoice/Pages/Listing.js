import React, { useState, useEffect } from 'react';
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
  MenuItem,
  InputLabel,
  CardHeader,
  Button,
  FormControl
} from '@material-ui/core';
import Page from '../../../components/Page';
import PageHeader from '../../Common/PageHeader'
// import services from '../Services';
import { useNavigate } from 'react-router-dom';
import { trackPromise } from 'react-promise-tracker';
import MaterialTable from "material-table";
// import authService from '../../../utils/permissionAuth';
import { LoadingComponent } from '../../../utils/newLoader';
import services from '../Services';

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

const screenCode = 'RETAILERREGISTRATION';
export default function ManageInvoiceListing(props) {
  const classes = useStyles();
  const [roomNo, setRoomNo] = useState({
    roomNumber:''
  })
  const [invoiceData, setInvoiceData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();
  let encryptedID = "";
  const handleClick = () => {
    encryptedID = btoa('0');
    navigate('/app/manageInvoices/addEdit/' + encryptedID);
  }

  useEffect(() => {
    // trackPromise(
      // getPermission(),
      //GetRetailorDetailsByMobileNumber()
    // );
  }, []);

//   async function getPermission() {
//     var permissions = await authService.getPermissionsByScreen(screenCode);
//     var isAuthorized = permissions.find(p => p.permissionCode == 'VIEWRETAILERREGISTRATION');

//     if (isAuthorized === undefined) {
//       navigate('/404');
//     }
//   }

  async function GetInvoiceDetailsByRoomNumber() {
    setInvoiceData([])
    var result = await services.GetInvoiceDetailsByRoomNumber(roomNo.roomNumber);
    const updatedItems = [];
    if(result.length>0){
      for (const item of result) {
        const updatedItem = {
          ...item,
          arrivalDate: item.arrivalDate.split('T')[0],
          departureDate : item.departureDate.split('T')[0]
        };
        updatedItems.push(updatedItem);
      }
    }
    setInvoiceData(updatedItems)
  }

  const EditInvoiceDetails = (invoiceId) => {
    encryptedID = btoa(invoiceId.toString());
    navigate('/app/manageInvoices/addEdit/' + encryptedID);
  }

  function handleChange(e) {
    const target = e.target;
    const value = target.value
    setRoomNo({
      ...roomNo,
      [e.target.name]: value
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
            customLabel = "New Billing"
          />
        </Grid>
      </Grid>
    )
  }

  return (
    <Page
      className={classes.root}
      title="View Bills"
    >
        <LoadingComponent />
      <Container maxWidth={false}>
        <Box mt={0}>
          <Card>
            <CardHeader
              title={cardTitle("View Bills")}
            />
            <PerfectScrollbar>
              <Divider />
              <CardContent >
                <Grid container spacing={3}>
                  <Grid item md={4} xs={12}>
                    <FormControl variant="outlined" fullWidth label="Room Number *">
                      <TextField
                        //error={Boolean(touched.mobilenumber && errors.mobilenumber)}
                        fullWidth
                        //helperText={touched.mobilenumber && errors.mobilenumber}
                        name="roomNumber"
                        label="Room Number *"
                        //onBlur={handleBlur}
                        onChange={(e) => handleChange(e)}
                        value={roomNo.roomNumber}
                        variant="outlined"
                        size='small'
                      />
                    </FormControl>
                  </Grid>
                <Grid item md={4} xs={12}>
                    <Button
                      type="button"
                      size='medium'
                      variant="contained"
                      style={{ marginLeft: '1rem', color:'#FFFFFF', backgroundColor:"#489EE7"}}
                      onClick={() => trackPromise(GetInvoiceDetailsByRoomNumber())}
                    >
                      Search
                    </Button>
                </Grid>
              </Grid>
              </CardContent>
              {(invoiceData.length > 0) ?
                <Box minWidth={1050} style={{margin:'1rem'}}>
                  <MaterialTable
                    title="Invoice"
                    columns={[
                      { title: 'Reservation Num.', field: 'reservationNum' },
                      { title: 'Room Num', field: 'roomNum' },
                      { title: 'Arrival Date', field: 'arrivalDate' },
                      { title: 'Departure Date', field: 'departureDate' },
                      { title: 'Balance Payments', field: 'payments' },
                      { title: 'Customer Name', field: 'customerName' },
                    ]}
                    data={invoiceData}
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
                        icon: 'mode',
                        tooltip: 'Edit Invoice',
                        onClick: (event, rowData) => { EditInvoiceDetails(rowData.invoiceId) }
                      },
                    ]}
                  />
                </Box>
                : null}
            </PerfectScrollbar>
          </Card>
        </Box>
      </Container>
    </Page>
  );
};

