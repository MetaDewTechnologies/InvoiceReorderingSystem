import React from "react";
import {
  Box, TableBody, TableCell, TableContainer, TableHead, TableRow, Table, Grid
} from '@material-ui/core';

export default class ComponentToPrint extends React.Component {
  render() {
    var totalDebit = 0;
    let totalCredit = 0;
    const itemsData = [
      {
        date:'2023-03-23',
        description: 'This is a sample item description for testing',
        comment: 'sample comment',
        debit: 234,
        credit:0
      }
    ]//this.props.companyData;
    // const total = this.props.total;
    // const searchData = this.props.searchData;

    itemsData.forEach(data => {
      totalDebit += data.debit; // Replace 'debit' with the actual property name
      totalCredit += data.credit; // Replace 'credit' with the actual property name
    });
    return (
      <div style={{marginLeft:'100px',marginRight:'75px', marginTop:'50px'}}>
        <div>&nbsp;</div>
        <Box>
            <Box mb={3} style={{display:'flex' ,justifyContent:'center'}}>
                <img style={{ width: 250, height: 155, marginLeft: 0, marginBottom: 10 }} src="/static/images/logo/clientLogo.jpg" alt="logo" />
            </Box>
            <Grid container>
                <Grid item md={8} xs={12}>
                <div className="col pb-4 pt-4 pl-2">
                <h2 style={{ paddingBottom: '10px' }}><left>Kiha Beach</left></h2>
                <div className="col" align={'left'} style={{ paddingBottom: '10px' }}><b>Reservation ID: </b> {""}</div>
                <div className="col" align={'left'} style={{ paddingBottom: '10px' }}><b>Room Number: </b> {""}</div>
                <div className="col" align={'left'} style={{ paddingBottom: '10px' }}><b>Arrival Date: </b> {""}</div>
                <div className="col" align={'left'} style={{ paddingBottom: '10px' }}><b>Departure Date: </b> {""}</div>
                <div className="col" align={'left'} style={{ paddingBottom: '10px' }}><b>Cashier: </b> {""}</div>
                <div className="col" align={'left'} style={{ paddingBottom: '10px' }}><b>Invoice Date: </b> {""}</div>
                <h3 style={{ paddingBottom: '10px' }}><left>Erika Adorjan</left></h3>
                <h3><left>COPY OF INVOICE:</left></h3>
                <div>&nbsp;</div>
                </div>
                </Grid>
                <Grid md={4} xs={12}>
                <div className="col pb-4 pt-4 pl-2">
                <h3 style={{ paddingBottom: '10px' }}><left>Billing Profile</left></h3>
                <div className="col" align={'left'} style={{ paddingBottom: '10px' }}><b>Name : </b> {""}</div>
                <div>&nbsp;</div>
                </div>
                </Grid>
            </Grid>
        </Box>
        <div>
          <Box minWidth={400}>
            <TableContainer>
              <Table aria-label="caption table">
                <TableHead >
                  <TableRow style={{borderTop: '1px solid black'}}>
                    <TableCell align={'center'} style={{ borderBottom: "1px solid black" }}>{'Date'}</TableCell>
                    <TableCell align={'center'} style={{ borderBottom: "1px solid black" }}>{'Description'}</TableCell>
                    <TableCell align={'center'} style={{ borderBottom: "1px solid black" }}>{'Comment'}</TableCell>
                    <TableCell align={'center'} style={{ borderBottom: "1px solid black" }}>{'Debit'}</TableCell>
                    <TableCell align={'center'} style={{ borderBottom: "1px solid black" }}>{'Credit'}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {itemsData && itemsData.map((data, index) => (
                    <TableRow key={index}>
                      <TableCell align={'left'} component="th" scope="row" style={{ borderBottom: "none" }}>
                        {data.date.split('T')[0]}
                      </TableCell>
                      <TableCell align={'center'} component="th" scope="row" style={{ borderBottom: "none" }}>
                        {data.description}
                      </TableCell>
                      <TableCell align={'center'} component="th" scope="row" style={{ borderBottom: "none" }}>
                        {data.comment}
                      </TableCell>
                      <TableCell align={'center'} component="th" scope="row" style={{ borderBottom: "none" }}>
                        {data.debit}
                      </TableCell>
                      <TableCell align={'center'} component="th" scope="row" style={{ borderBottom: "none" }}>
                        {data.credit}
                      </TableCell>
                    </TableRow>
                  ))}
                    <TableRow>
                    <TableCell colSpan={3} align={'right'}>{'Total'}</TableCell>
                    <TableCell align={'center'}>{totalDebit.toFixed(2)}</TableCell>
                    <TableCell align={'center'}>{totalCredit.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </div>
      </div>
    );
  }
}
