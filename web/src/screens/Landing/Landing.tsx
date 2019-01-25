import * as React from 'react';
import { Paper, List, Typography, ListItem, Avatar, ListItemText, Theme, withStyles, TextField, Button, CircularProgress } from '@material-ui/core';
import { graphql, compose, GraphqlQueryControls, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import idx from 'idx';
import * as gravatar from 'gravatar';
import { Landing_posts } from './__generated__/Landing';

const styles = (theme: Theme) => ({
  text: {
    paddingTop: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    margin: 10,
  },
  margin: {
    margin: 40,
  },
  button: {
    marginLeft: 30,
    marginBottom: 20,
  },
  paper: {
    marginTop: 40,
    marginBottom: 40,
    width: 800
  },
  paperTweets: {
    marginBottom: 40,
    width: 800
  },
  input: {
    marginLeft: 30,
    marginRight: 100,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing.unit * 2,
  },
  subHeader: {
    backgroundColor: theme.palette.background.paper,
  },
  appBar: {
    top: 'auto',
    bottom: 0,
  },
  toolbar: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fabButton: {
    position: 'absolute',
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: '0 auto',
  },
  container: {
    width: '100vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  size: {
    width: 800,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

const addpost = gql`
  mutation AddPost($title: String!, $description: String!) {
    addPost(title: $title, description: $description) {
      _id
      title
      description
      user {
        email
      }
    }
  }
`;

interface Data extends GraphqlQueryControls {
  posts: Landing_posts
}

interface IProps {
  classes: any;
  data: Data
}
class Landing extends React.Component<IProps> {
  state = {
    title: '',
    body: '',
    isFetchingEnd: false,
  }

  handleChange = (name: string) => (event: React.SyntheticEvent) => {
    // @ts-ignore
    this.setState({
      // @ts-ignore
      [name]: event.target.value,
    });
  };

  fetchMore = () => {
    const { posts } = this.props.data;
    const { count } = posts;

    if (this.state.isFetchingEnd) {
      return
    }

    this.setState({
      isFetchingEnd: true,
    });

    const newCount = (count || 0) + 10;

    return this.props.data
      .fetchMore({
        variables: { first: newCount },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          return {
            ...previousResult,
            posts: fetchMoreResult.posts,
          }
        },
      })
      .then(() => this.setState({
        isFetchingEnd: false
      })).catch((e) => alert(e));
  };

  gravatarURL = (accountName: string) => gravatar.url(accountName, { s: '100', r: 'x', d: 'retro' }, true)

  addPost = (callback: Function) => {
    if (!this.state.title || !this.state.body) {
      alert('Please fill all the fields before continue')
    }
    callback();
  };

  render() {
    const { loading } = this.props.data;
    const { classes } = this.props;

    console.log(this.props);

    const edges = idx(this.props.data, _ => _.posts.edges) || [];

    return (
      <div className={classes.container}>
        <Mutation mutation={addpost}>
          {(addPost) => (
            <Paper square className={classes.paper}>
              <Typography className={classes.text} variant="h5" gutterBottom>
                What's in your mind
              </Typography>
              <List className={classes.list}>
                <TextField
                  className={classes.input}
                  id="standard-name"
                  label="Title"
                  value={this.state.title}
                  onChange={this.handleChange('title')}
                />
                <TextField
                  id="standard-multiline-flexible"
                  label="Body"
                  multiline
                  rowsMax="4"
                  value={this.state.body}
                  onChange={this.handleChange('body')}
                  className={classes.input}
                  margin="normal"
                />
              </List>
              <Button onClick={() => this.addPost(() => {
                addPost({
                  variables: {
                    title: this.state.title,
                    description: this.state.body,
                  },
                  refetchQueries: ['Landing'],
                })
              })} variant="contained" color="primary" className={classes.button}>
                Tweet
              </Button>
            </Paper>
          )}
        </Mutation>
        {loading && <CircularProgress className={classes.margin} />}
        {!loading && <Paper square className={classes.paperTweets}>
          <Typography className={classes.text} variant="h5" gutterBottom>
            Twitter
          </Typography>
          <List className={classes.list}>
            {edges.map((element) => (
              <React.Fragment key={element._id}>
                <ListItem button>
                  <Avatar alt="Profile Picture" src={this.gravatarURL(element.user.email)} />
                  <ListItemText primary={element.title} secondary={element.description} />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
          {!this.props.data.posts.hasNextPage && <div className={classes.size}>
            {!this.state.isFetchingEnd ? (
              <Button onClick={this.fetchMore} variant="contained" color="primary" className={classes.button}>
                Load More
              </Button>
            ) : (
              <CircularProgress className={classes.margin} />
            )}
          </div>}
        </Paper>}
      </div>
    );
  }
}

const query = gql`
  query Landing($first: Int = 10) {
    posts(first: $first) {
      count
      hasNextPage
      edges {
        _id
        title
        description
        user {
          email
        }
      }
    }
  }
`

export default compose(
  // @ts-ignore
  withStyles(styles),
  graphql(query),
)(Landing);
