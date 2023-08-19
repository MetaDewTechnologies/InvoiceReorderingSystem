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
  MenuItem
} from '@material-ui/core';
import Page from 'src/components/Page';
import services from '../Services';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, validateYupSchema } from 'formik';
import * as Yup from "yup";
import PageHeader from 'src/views/Common/PageHeader';
import { useAlert } from "react-alert";
import { LoadingComponent } from '../../../utils/newLoader';
import { trackPromise } from 'react-promise-tracker';
import authService from '../../../utils/permissionAuth';
import tokenService from '../../../utils/tokenDecoder';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';
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
var screenCode = "ROUTE"

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      decimalScale={2}
      isNumericString

    />
  );
}
NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default function DivisionAddEdit(props) {
  const [title, setTitle] = useState("Add Division")
  const [isUpdate, setIsUpdate] = useState(false);
  const [isDisableButton, setIsDisableButton] = useState(false);
  const classes = useStyles();
  const [factories, setFactories] = useState();
  const [products, setProducts] = useState();
  const [groups, setGroups] = useState();
  const [route, setRoute] = useState({
    groupID: '0',
    factoryID: '0',
    routeName: '',
    routeCode: '',
    routeLocation: '',
    transportRate: '',
    targetCrop: '',
    productID: '0',
    isActive: true,
  });
  const [FieldData, setFieldData] = useState({
    field: "",
    area: "",
    numberOfTrees: "",
    monthlyTargetCropDiv: ""
  })
  const [FieldDataList, setFieldDataList] = useState([])
  const [routeIsActive, setRouteIsActive] = useState(true);
  const navigate = useNavigate();
  const handleClick = () => {

    navigate('/app/division/listing');

  }

  const [permissionList, setPermissions] = useState({
    isGroupFilterEnabled: false,
    isFactoryFilterEnabled: false
  });
  const alert = useAlert();
  const { routeID } = useParams();
  let decrypted = 0;

  useEffect(() => {
    getPermissions();
    getGroupsForDropdown();
  }, []);

  useEffect(() => {
    trackPromise(
      getfactoriesForDropDown()
    );
  }, [route.groupID]);

  useEffect(() => {
    decrypted = atob(routeID.toString());
    if (decrypted != 0) {
      trackPromise(
        getGroupDetails(decrypted)
      )
    }
  }, []);

  useEffect(() => {
    trackPromise(
      getfactoriesForDropDown()
    );
  }, []);

  useEffect(() => {
    trackPromise(
      getProductsForDropDown()
    );
  }, [route.factoryID]);

  async function getPermissions() {
    var permissions = await authService.getPermissionsByScreen(screenCode);
    var isAuthorized = permissions.find(p => p.permissionCode == 'ADDEDITROUTE');

    if (isAuthorized === undefined) {
      navigate('/404');
    }

    var isGroupFilterEnabled = permissions.find(p => p.permissionCode == 'GROUPDROPDOWN');
    var isFactoryFilterEnabled = permissions.find(p => p.permissionCode == 'FACTORYDROPDOWN');

    setPermissions({
      ...permissionList,
      isGroupFilterEnabled: isGroupFilterEnabled !== undefined,
      isFactoryFilterEnabled: isFactoryFilterEnabled !== undefined,
    });

    setRoute({
      ...route,
      groupID: parseInt(tokenService.getGroupIDFromToken()),
      factoryID: parseInt(tokenService.getFactoryIDFromToken())
    })
  }

  async function getfactoriesForDropDown() {
    const factory = await services.getfactoriesForDropDown(route.groupID);
    setFactories(factory);
  }

  async function getProductsForDropDown() {
    const product = await services.getProductsByFactoryID(route.factoryID);
    setProducts(product);
  }

  async function getGroupDetails(routeID) {
    let response = await services.getRouteDetailsByID(routeID);
    let data = response[0];
    setTitle("Update Division");
    data.transportRate = data.transportRate.toFixed(2)
    setRoute(data);
    setIsUpdate(true);
    setRouteIsActive(response[0]);

  }

  async function getGroupsForDropdown() {
    const groups = await services.getGroupsForDropdown();
    setGroups(groups);
  }

  async function saveRoute(values) {
    if (isUpdate == true) {
      let updateModel = {
        routeID: atob(routeID.toString()),
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
      if (response.statusCode == "Success") {
        alert.success(response.message);
        setIsDisableButton(true);
        navigate('/app/division/listing');
      }
      else {
        setRoute({
          ...route,
          isActive: routeIsActive
        });
        alert.error(response.message);
      }
    }

    else {
      let response = await services.saveRoute(values);

      if (response.statusCode == "Success") {
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
    setRoute({
      ...route,
      [e.target.name]: value
    });
  }

  function handleChange2(e) {
    const target = e.target;
    const value = target.value
    setFieldData({
      ...FieldData,
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
          />
        </Grid>
      </Grid>
    )
  }


  function AddFieldData() {

    let dataModel = {
      field: FieldData.field,
      area: FieldData.area,
      numberOfTrees: FieldData.numberOfTrees,
      monthlyTargetCrop: FieldData.monthlyTargetCropDiv
    }

    setFieldDataList(FieldDataList => [...FieldDataList, dataModel]);
    setFieldData({
      field: "",
      area: "",
      numberOfTrees: "",
      monthlyTargetCropDiv: ""
    })
  }

  return (
    <Fragment>
      <LoadingComponent />
      <Page className={classes.root} title={title}>
        <Container maxWidth={false}>
          <Formik
            initialValues={{
              groupID: route.groupID,
              factoryID: route.factoryID,
              routeName: route.routeName,
              routeCode: route.routeCode,
              routeLocation: route.routeLocation,
              transportRate: route.transportRate,
              targetCrop: route.targetCrop,
              productID: route.productID,
              isActive: route.isActive,

            }}
            validationSchema={
              Yup.object().shape({
                groupID: Yup.number().required('Group required').min("1", 'Group required'),
                factoryID: Yup.number().required('Estate required').min("1", 'Estate required'),
                routeName: Yup.string().max(255).matches(/^[a-zA-Z\d\s]+$/, 'Special Characters Not Allowed').required('RouteName required'),
                routeCode: Yup.string().max(2, "RouteCode must be at most 2 characters").required('RouteCode required').matches(/^[0-9\b]+$/, 'Only allow numbers'),
                routeLocation: Yup.string().max(255).matches(/^[a-zA-Z\d\s\,\.\/]+$/, 'Special Characters and Numbers Not Allowed').required('RouteLocation required'),
                transportRate: Yup.string().required('TransportRate required').matches(/^\s*(?=.*[0-9])\d*(?:\.\d{1,2})?\s*$/, 'TransportRate Should Contain Only Numbers with 2 decimals'),
                targetCrop: Yup.string().required('TargetCrop required').matches(/^[0-9]+([.][0-9]+)?$/, 'TargetCrop Should Contain Only Numbers'),
                productID: Yup.number().required('Product required').min("1", 'Product required'),
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
                          <Grid item md={4} xs={12}>
                            <InputLabel shrink id="groupID">
                              Group *
                            </InputLabel>
                            <TextField select
                              error={Boolean(touched.groupID && errors.groupID)}
                              fullWidth
                              helperText={touched.groupID && errors.groupID}
                              name="groupID"
                              onBlur={handleBlur}
                              onChange={(e) => handleChange1(e)}
                              value={values.groupID}
                              variant="outlined"
                              id="groupID"
                              InputProps={{
                                readOnly: isUpdate || !permissionList.isGroupFilterEnabled ? true : false,
                              }}
                            >
                              <MenuItem value="0">--Select Group--</MenuItem>
                              {generateDropDownMenu(groups)}
                            </TextField>
                          </Grid>
                          <Grid item md={4} xs={12}>
                            <InputLabel shrink id="factoryID">
                              Estate *
                            </InputLabel>
                            <TextField select
                              error={Boolean(touched.factoryID && errors.factoryID)}
                              fullWidth
                              helperText={touched.factoryID && errors.factoryID}
                              name="factoryID"
                              onBlur={handleBlur}
                              onChange={(e) => handleChange1(e)}
                              value={route.factoryID}
                              variant="outlined"
                              id="factoryID"
                              InputProps={{
                                readOnly: isUpdate || !permissionList.isFactoryFilterEnabled ? true : false,
                              }}
                            >
                              <MenuItem value="0">--Select Estate--</MenuItem>
                              {generateDropDownMenu(factories)}
                            </TextField>
                          </Grid>
                          <Grid item md={4} xs={12}>
                            <InputLabel shrink id="productID">
                              Product *
                            </InputLabel>
                            <TextField select
                              error={Boolean(touched.productID && errors.productID)}
                              fullWidth
                              helperText={touched.productID && errors.productID}
                              name="productID"
                              onBlur={handleBlur}
                              onChange={(e) => handleChange1(e)}
                              value={route.productID}
                              variant="outlined"
                              id="productID"
                              InputProps={{
                                readOnly: isUpdate ? true : false,
                              }}
                            >
                              <MenuItem value="0">--Select Product--</MenuItem>
                              {generateDropDownMenu(products)}
                            </TextField>
                          </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                          <Grid item md={4} xs={12}>
                            <InputLabel shrink id="routeCode">
                              Division Code *
                            </InputLabel>
                            <TextField
                              error={Boolean(touched.routeCode && errors.routeCode)}
                              fullWidth
                              helperText={touched.routeCode && errors.routeCode}
                              name="routeCode"
                              onBlur={handleBlur}
                              onChange={(e) => handleChange1(e)}
                              value={route.routeCode}
                              variant="outlined"
                              disabled={isDisableButton}
                              InputProps={{
                                readOnly: isUpdate ? true : false,
                              }}
                            />
                          </Grid>
                          <Grid item md={4} xs={12}>
                            <InputLabel shrink id="routeName">
                              Division Name *
                            </InputLabel>
                            <TextField
                              error={Boolean(touched.routeName && errors.routeName)}
                              fullWidth
                              helperText={touched.routeName && errors.routeName}
                              name="routeName"
                              onBlur={handleBlur}
                              onChange={(e) => handleChange1(e)}
                              value={route.routeName}
                              variant="outlined"
                              disabled={isDisableButton}
                              inputProps={{ maxLength: 20 }}
                            />
                          </Grid>
                          <Grid item md={4} xs={12}>
                            <InputLabel shrink id="routeLocation">
                              Division Location *
                            </InputLabel>
                            <TextField
                              error={Boolean(touched.routeLocation && errors.routeLocation)}
                              fullWidth
                              helperText={touched.routeLocation && errors.routeLocation}
                              name="routeLocation"
                              onBlur={handleBlur}
                              onChange={(e) => handleChange1(e)}
                              value={route.routeLocation}
                              variant="outlined"
                              disabled={isDisableButton}
                              inputProps={{ maxLength: 30 }}
                            />
                          </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                          {/* <Grid item md={4} xs={12}>
                            <InputLabel shrink id="transportRate">
                              Transport Rate(Rs.) *
                            </InputLabel>
                            <TextField
                              error={Boolean(touched.transportRate && errors.transportRate)}
                              fullWidth
                              helperText={touched.transportRate && errors.transportRate}
                              name="transportRate"
                              onBlur={handleBlur}
                              onChange={(e) => handleChange1(e)}
                              value={route.transportRate}
                              variant="outlined"
                              disabled={isDisableButton}
                            />
                          </Grid> */}
                          <Grid item md={4} xs={12}>
                            <InputLabel shrink id="targetCrop">
                              Monthly Target Crop(KG) *
                            </InputLabel>
                            <TextField
                              error={Boolean(touched.targetCrop && errors.targetCrop)}
                              fullWidth
                              helperText={touched.targetCrop && errors.targetCrop}
                              name="targetCrop"
                              onBlur={handleBlur}
                              onChange={(e) => handleChange1(e)}
                              value={route.targetCrop}
                              variant="outlined"
                              disabled={isDisableButton}
                            />
                          </Grid>
                        </Grid>

                        <Grid container spacing={3}>
                          <Grid item md={4} xs={12}>
                            <InputLabel shrink id="isActive">
                              Active
                            </InputLabel>
                            <Switch
                              checked={values.isActive}
                              onChange={handleChange}
                              name="isActive"
                              disabled={isDisableButton}
                            />
                          </Grid>
                        </Grid>



                        <Grid container spacing={3}>
                          <Grid item md={3} xs={12}>
                            <InputLabel shrink id="field">
                              Field
                            </InputLabel>
                            <TextField
                              fullWidth
                              name="field"
                              onBlur={handleBlur}
                              onChange={(e) => handleChange2(e)}
                              value={FieldData.field}
                              variant="outlined"
                            />
                          </Grid>

                          <Grid item md={3} xs={12}>
                            <InputLabel shrink id="area">
                              Area (hectare / acre)
                            </InputLabel>
                            <TextField
                              fullWidth
                              name="area"
                              onBlur={handleBlur}
                              onChange={(e) => handleChange2(e)}
                              value={FieldData.area}
                              variant="outlined"
                            />
                          </Grid>

                          <Grid item md={3} xs={12}>
                            <InputLabel shrink id="numberOfTrees">
                              Number of Trees
                            </InputLabel>
                            <TextField
                              fullWidth
                              name="numberOfTrees"
                              onBlur={handleBlur}
                              onChange={(e) => handleChange2(e)}
                              value={FieldData.numberOfTrees}
                              variant="outlined"
                            />
                          </Grid>

                          <Grid item md={3} xs={12}>
                            <InputLabel shrink id="monthlyTargetCropDiv">
                              Target Crop(KG) *
                            </InputLabel>
                            <TextField
                              fullWidth
                              name="monthlyTargetCropDiv"
                              onBlur={handleBlur}
                              onChange={(e) => handleChange2(e)}
                              value={FieldData.monthlyTargetCropDiv}
                              variant="outlined"
                            />
                          </Grid>
                        </Grid>

                        <Box display="flex" justifyContent="flex-end" p={2}>
                          <Button
                            color="primary"
                            variant="contained"
                            onClick={() => AddFieldData()}
                          >
                            Add
                          </Button>
                        </Box>


                        <Box minWidth={1000} hidden={FieldDataList.length === 0}>
                          <MaterialTable
                            title="Multiple Actions Preview"
                            columns={[
                              { title: 'Field', field: 'field' },
                              { title: 'Area', field: 'area' },
                              { title: 'Number of Trees', field: 'numberOfTrees' },
                              { title: 'Target Crop', field: 'monthlyTargetCrop' }

                            ]}
                            data={FieldDataList}
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
                                // onClick: (event, routeData) => handleClickEdit(routeData.routeID)
                              }
                            ]}
                          />
                        </Box>
                      </CardContent>
                      <Box display="flex" justifyContent="flex-end" p={2}>
                        <Button
                          color="primary"
                          disabled={isSubmitting || isDisableButton}
                          type="submit"
                          variant="contained"
                        >
                          {isUpdate == true ? "Update" : "Save"}
                        </Button>
                      </Box>
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
