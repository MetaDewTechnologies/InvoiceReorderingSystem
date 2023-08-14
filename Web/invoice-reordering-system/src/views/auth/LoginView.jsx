import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import Page from '../../components/Page';
// import services from './Services';
import { trackPromise } from 'react-promise-tracker';
import { LoadingComponent } from '../../utils/newLoader';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    paddingBottom: theme.spacing(10),
    paddingTop: theme.spacing(5),
    marginTop:theme.spacing(10),
    marginBottom:theme.spacing(10),
    marginLeft: theme.spacing(35),
    marginRight:theme.spacing(35),
    height:'auto'
  }
}));

const LoginView = () => {
  const classes = useStyles();
  // const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    username: "",
    password: ""

  });
  const [isHidden, setIsHidden] = useState(false)

  const [messageModel, setmessageModel] = useState([]);

  async function login(values) {
    let result = await services.login(values);
    if (result.statusCode == "Error") {
      setIsHidden(true);
      setmessageModel(result.message);
      return;
    }
    // sessionStorage.setItem('token', result.data);
    // navigate('/newLoader');
  }

  return (
    <Page
      className={classes.root}
      title="Login"
      display="flex"
    >
      <LoadingComponent/>
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              username: userDetails.username,
              password: userDetails.password
            }}
            validationSchema={Yup.object().shape({
              username: Yup.string().max(255).required('Username is required'),
              password: Yup.string().max(255).required('Password is required')
            })}
            onSubmit={(e) => trackPromise(login(e))}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values
            }) => (
              <form onSubmit={handleSubmit}>
                <Box mb={3}>
                  <img style={{ width: 200, height: 115, marginLeft: 0, marginBottom: 20 }} src="/static/images/logo/clientLogo.jpg" alt="login" />
                </Box>
                <Grid
                  item
                  xs={12}
                  md={12}
                >
                  {isHidden ? <Alert severity="error">
                    <AlertTitle>Error: <strong>{messageModel}</strong></AlertTitle>

                  </Alert> : null}
                </Grid>
                <TextField
                  error={Boolean(touched.username && errors.username)}
                  fullWidth
                  helperText={touched.username && errors.username}
                  label="Username"
                  margin="normal"
                  name="username"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.username}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="Password"
                  margin="normal"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.password}
                  variant="outlined"
                />
                <Box my={2} style={{marginTop:12}}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    LOGIN
                  </Button>
                </Box>
                <Box style={{marginTop:15}}>
                  <Typography color={"textSecondary"}>META DEW TECHNOLOGIES</Typography>
                  <Typography color={"textSecondary"}>Customer Support:071 733 6065</Typography>
                </Box>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  );
};

export default LoginView;
