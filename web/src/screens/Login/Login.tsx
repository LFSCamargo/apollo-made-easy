import * as React from 'react';
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Button,
  Typography,
  withStyles,
  TextField,
} from '@material-ui/core';
import { Mutation } from 'react-apollo';
import { RouterProps } from 'react-router';
import gql from 'graphql-tag';

const styles = {
  card: {
    maxWidth: 345,
    margin: 20,
  },
  media: {
    objectFit: 'cover',
  },
  container: {
    display: 'flex',
    width: '100vw',
    height: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
  },
  margin: {
    // marginTop: 10,
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  input: {
    marginTop: 10,
    width: '100%',
  },
  cards: {
    display: 'flex',
    alignItems: 'flex-start',
  }
};

const login = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

const register = gql`
  mutation Register($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password) {
      token
    }
  }
`;

interface IProps extends RouterProps {
  classes: any;
}

interface IState {
  name: string,
  email: string,
  password: string,
  emailLogin: string,
  passwordLogin: string,
}

class Login extends React.Component<IProps, IState> {
  state = {
    name: '',
    email: '',
    password: '',
    emailLogin: '',
    passwordLogin: '',
  };

  handleChange = (name: string) => (event: React.SyntheticEvent) => {
    // @ts-ignore
    this.setState({
      // @ts-ignore
      [name]: event.target.value,
    });
  };

  login = (callback: Function) => {
    if (!this.state.emailLogin || !this.state.passwordLogin) {
      return alert('Fill all the fields');
    }

    callback();
  };

  register = (callback: Function) => {
    if (!this.state.password || !this.state.email || !this.state.name) {
      return alert('Fill all the fields');
    }

    callback()
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <div className={classes.cards}>
          <Mutation mutation={login}>
            {(login, { data }) => (
              <Card className={classes.card}>
                <CardActionArea>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      Login
                    </Typography>
                    <Typography component="p">
                      Login to continue on Twitter
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <div className={classes.margin}>
                  <TextField
                    className={classes.input}
                    id="standard-name"
                    label="Email"
                    value={this.state.emailLogin}
                    onChange={this.handleChange('emailLogin')}
                    type="email"
                  />
                  <TextField
                    className={classes.input}
                    id="standard-name"
                    label="Password"
                    type="password"
                    value={this.state.passwordLogin}
                    onChange={this.handleChange('passwordLogin')}
                  />
                </div>
                <CardActions>
                  <Button onClick={() => this.login(() => {
                    login({
                      variables: {
                        email: this.state.emailLogin,
                        password: this.state.passwordLogin,
                      }
                    }).then((res: any) => {
                        const { token } = res.data.login;
                        localStorage.setItem('token', token);
                        this.props.history.push('/home');
                      }).catch((e: Error) => alert(e.message))
                  })} size="small" color="primary">
                    Login
                  </Button>
                </CardActions>
              </Card>
            )}
          </Mutation>
          <Mutation mutation={register}>
            {(register) => (
              <Card className={classes.card}>
              <CardActionArea>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    Register
                  </Typography>
                  <Typography component="p">
                    Register to continue on Twitter
                  </Typography>
                </CardContent>
              </CardActionArea>
              <div className={classes.margin}>
                <TextField
                  className={classes.input}
                  id="standard-name"
                  label="Email"
                  value={this.state.email}
                  onChange={this.handleChange('email')}
                  type="email"
                />
                <TextField
                  className={classes.input}
                  id="standard-name"
                  label="Name"
                  value={this.state.name}
                  onChange={this.handleChange('name')}
                />
                <TextField
                  className={classes.input}
                  id="standard-name"
                  label="Password"
                  type="password"
                  value={this.state.password}
                  onChange={this.handleChange('password')}
                />
              </div>
              <CardActions>
                <Button onClick={() => this.register(() => {
                  register({
                    variables: {
                      email: this.state.email,
                      name: this.state.name,
                      password: this.state.password
                    }
                  }).catch((e) => alert(e.message)).then((res: any) => {
                    const { token } = res.data.register;
                    localStorage.setItem('token', token);
                    this.props.history.push('/home');
                  })
                })} size="small" color="primary">
                  Register
                </Button>
              </CardActions>
            </Card>
            )}
          </Mutation>
        </div>
      </div>
    );
  }
}

// @ts-ignore
export default withStyles(styles)(Login);
