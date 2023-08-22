import React from "react";
import {
  Box, TableBody, TableCell, TableContainer, TableHead, TableRow, Table
} from '@material-ui/core';


export default class ComponentToPrint extends React.Component {

  render() {
    const companyData = ''//this.props.companyData;
    // const total = this.props.total;
    // const searchData = this.props.searchData;


    return (
      <div>
        <h3><center><u>Input Company Wise Sales Report</u></center></h3>
        <div>&nbsp;</div>
        <div className="row pb-4 pt-4 pl-2">
          <div className="col" align={'center'}><b>Input Company: </b> {""}</div>
          <div className="col" align={'center'}><b>From Date: </b> {""}</div>
          <div className="col" align={'center'}><b>To Date: </b> {""}</div>
          <div className="col" align={'center'}><b>Total Sales: </b> {""}</div>
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          <div>&nbsp;</div>

          <div>&nbsp;</div>
        </div>
        <div>&nbsp;</div>
        <div>
          <Box minWidth={1050}>
            <TableContainer>
              <Table aria-label="caption table">
                <TableHead>
                  <TableRow>


                    <TableCell align={'center'}>{'Order Number'}</TableCell>
                    <TableCell align={'center'}>{'Agent Name'}</TableCell>
                    <TableCell align={'center'}>{'Retailer Name'}</TableCell>
                    <TableCell align={'center'}>{'Product Name'}</TableCell>
                    <TableCell align={'center'}>{'Quantity'}</TableCell>
                    <TableCell align={'left'}>{'Order Place Date '}</TableCell>
                    <TableCell align={'center'}>{'Total Value '}</TableCell>


                  </TableRow>
                </TableHead>
                <TableBody>
                  {companyData && companyData.map((data, index) => (
                    <TableRow key={index}>
                      <TableCell align={'center'} component="th" scope="row" style={{ borderBottom: "none" }}>
                        {data.orderNumber}
                      </TableCell>
                      <TableCell align={'center'} component="th" scope="row" style={{ borderBottom: "none" }}>
                        {data.agentName}
                      </TableCell>
                      <TableCell align={'center'} component="th" scope="row" style={{ borderBottom: "none" }}>
                        {data.firstName}
                      </TableCell>
                      <TableCell align={'center'} component="th" scope="row" style={{ borderBottom: "none" }}>
                        {data.itemName}
                      </TableCell>
                      <TableCell align={'center'} component="th" scope="row" style={{ borderBottom: "none" }}>
                        {data.quantity}
                      </TableCell>
                      <TableCell align={'left'} component="th" scope="row" style={{ borderBottom: "none" }}>
                        {data.orderPlaceDate.split('T')[0]}
                      </TableCell>
                      <TableCell align={'center'} component="th" scope="row" style={{ borderBottom: "none" }}>
                        {data.value.toFixed(2)}
                      </TableCell>

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </div>
      </div>
    );
  }
}
