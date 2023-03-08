import React, { Component, Fragment } from 'react';
// import openSocket from 'socket.io-client';

import Post from '../../components/Feed/Post/Post';
import Button from '../../components/Button/Button';
import FeedEdit from '../../components/Feed/FeedEdit/FeedEdit';
import Input from '../../components/Form/Input/Input';
import Paginator from '../../components/Paginator/Paginator';
import Loader from '../../components/Loader/Loader';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';
import './Feed.css';

class Feed extends Component {
  state = {
    isEditing: false,
    posts: [],
    totalPosts: 0,
    editPost: null,
    status: '',
    postPage: 1,
    postsLoading: true,
    editLoading: false
  };

  componentDidMount() {
    const graphqlQuery = {
      query: `
        {
          user {
            status
          }
        }
      `
    };

    fetch('http://localhost:8080/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.props.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphqlQuery),
    })
      .then(res => {
        return res.json();
      })
      .then(resData => {
        if (resData.errors) {
          throw new Error('Failed to fetch user status.');
        }

        this.setState({ status: resData.data.user.status });
      })
      .catch(this.catchError);

    this.loadPosts();

    /**
     * Connecting the client to the socket. This
     * function takes the server address as it's
     * parameter
    */
    // const socket = openSocket('http://localhost:8080');

    /**
     * Adding a listener on the websocket for the `posts`
     * event name which is emitted from the server
    */
    // socket.on('posts', data => {
    //   const { action, post } = data;

    //   switch (action) {
    //     case 'create':
    //       this.addPost(post);

    //       break;

    //     case 'update':
    //       this.updatePost(post);
          
    //       break;

    //     case 'delete':
    //       this.loadPosts();
          
    //       break;
      
    //     default:
    //       break;
    //   }
    // });
  }

  addPost = post => {
    this.setState(prevState => {
      const updatedPosts = [ ...prevState.posts ];

      if (prevState.postPage === 1) {
        updatedPosts.pop();
        updatedPosts.unshift(post);
      }

      return {
        ...prevState,
        posts: updatedPosts,
        totalPosts: prevState.totalPosts + 1,
      }
    });
  };

  updatePost = post => {
    this.setState(prevState => {
      const updatedPosts = [ ...prevState.posts ];
      const updatedPostIndex = updatedPosts.findIndex(updatedPost => updatedPost._id === post._id)

      if (updatedPostIndex > -1) {
        updatedPosts[updatedPostIndex] = post;
      }

      return {
        ...prevState,
        posts: updatedPosts,
      };
    });
  }

  loadPosts = direction => {
    if (direction) {
      this.setState({ postsLoading: true, posts: [] });
    }

    let page = this.state.postPage;

    if (direction === 'next') {
      page++;
      this.setState({ postPage: page });
    }

    if (direction === 'previous') {
      page--;
      this.setState({ postPage: page });
    }

    const graphqlQuery = {
      query: `
        query FetchPost($page: Int!) {
          allposts(page: $page) {
            posts {
              _id
              title
              content
              imageUrl
              creator {
                name
              }
              createdAt
            }
            totalItems
          }
        }
      `,
      variables: {
        page: page
      },
    };

    fetch(`http://localhost:8080/graphql`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.props.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphqlQuery),
    })
      .then(res => {
        // if (res.status !== 200) {
        //   throw new Error('Failed to fetch posts.');
        // }
        return res.json();
      })
      .then(resData => {
        if (resData.errors) {
          throw new Error('Failed to fetch posts.');
        }

        const { posts, totalItems } = resData.data.allposts;

        this.setState({
          posts: posts.map(post => ({
            ...post,
            imagePath: post.imageUrl,
          })),
          totalPosts: totalItems,
          postsLoading: false
        });
      })
      .catch(this.catchError);
  };

  statusUpdateHandler = event => {
    event.preventDefault();

    const graphqlQuery = {
      query: `
        mutation UpdateUserStatus($userStatus: String!) {
          updateStatus(status: $userStatus) {
            _id
          }
        }
      `,
      variables: {
        userStatus: this.state.status,
      },
    };

    fetch('http://localhost:8080/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.props.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphqlQuery),
    })
      .then(res => {
        return res.json();
      })
      .then(resData => {
        if (resData.errors) {
          throw new Error("Can't update status!");
        }

        console.log(resData);
      })
      .catch(this.catchError);
  };

  newPostHandler = () => {
    this.setState({ isEditing: true });
  };

  startEditPostHandler = postId => {
    this.setState(prevState => {
      const loadedPost = { ...prevState.posts.find(p => p._id === postId) };

      return {
        isEditing: true,
        editPost: loadedPost
      };
    });
  };

  cancelEditHandler = () => {
    this.setState({ isEditing: false, editPost: null });
  };

  finishEditHandler = postData => {
    this.setState({
      editLoading: true
    });
    // Set up data (with image!)
    const formData = new FormData();
    const { title, content, image } = postData;

    formData.append('image', image);

    if (this.state.editPost) {
      formData.append('oldImagePath', this.state.editPost.imagePath);
    }

    fetch('http://localhost:8080/post-image', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${this.props.token}`,
      },
      body: formData,
    })
      .then(response => response.json())
      .then(fileData => {
        const uploadedImageUrl = fileData.filePath || 'undefined';

        const graphqlQuery = {
          query: `
            mutation CreateNewPost($title: String!, $content: String!, $imageUrl: String!) {
              createPost(postInputData: { title: $title, content: $content, imageUrl: $imageUrl }) {
                _id
                title
                content
                imageUrl
                creator {
                  name
                }
                createdAt
              }
            }
          `,
          variables: {
            title,
            content,
            imageUrl: uploadedImageUrl,
          }
        };

        if (this.state.editPost) {
          graphqlQuery.query = `
            mutation UpdateExistingPost($postId: ID!, $title: String!, $content: String!, $imageUrl: String!) {
              updatePost(postId: $postId, postInputData: { title: $title, content: $content, imageUrl: $imageUrl }) {
                _id
                title
                content
                imageUrl
                creator {
                  name
                }
                createdAt
              }
            }
          `
          graphqlQuery.variables = {
            postId: this.state.editPost._id,
            title,
            content,
            imageUrl: uploadedImageUrl,
          }
        }

        return fetch('http://localhost:8080/graphql', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.props.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(graphqlQuery),
        });
      })
      .then(res => {
        // if (res.status !== 200 && res.status !== 201) {
        //   throw new Error('Creating or editing a post failed!');
        // }
        return res.json();
      })
      .then(resData => {
        if (resData.errors && resData.errors[0].status === 422) {
          throw new Error(
            "Validation failed. Make sure the title, content and image are filled!"
          );
        }

        if (resData.errors) {
          throw new Error(
            "Sorry, an error occurred while creating post"
          );
        }

        const responseField = this.state.editPost ? 'updatePost' : 'createPost';

        const { _id, title, content, imageUrl, creator, createdAt } = resData.data[responseField];

        const post = {
          _id,
          title,
          content,
          imageUrl,
          creator,
          createdAt
        };

        this.setState(prevState => {
          let updatedPosts = [ ...prevState.posts ];
          let updatedTotalPosts = prevState.totalPosts;

          if (prevState.editPost) {
            const postIndex = prevState.posts.findIndex(post => post._id === prevState.editPost._id);

            updatedPosts[postIndex] = post;
          } else {
            updatedTotalPosts += 1;

            if (prevState.posts.length >= 2) {
              updatedPosts.pop();
            }
            updatedPosts.unshift(post);
          }
          
          return {
            posts: updatedPosts,
            isEditing: false,
            editPost: null,
            editLoading: false,
            totalPosts: updatedTotalPosts,
          };
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          isEditing: false,
          editPost: null,
          editLoading: false,
          error: err
        });
      });
  };

  statusInputChangeHandler = (input, value) => {
    this.setState({ status: value });
  };

  deletePostHandler = postId => {
    this.setState({ postsLoading: true });

    const graphqlQuery = {
      query: `
        mutation {
          deletePost(postId: "${postId}")
        }
      `
    };

    fetch(`http://localhost:8080/graphql`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.props.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphqlQuery),
    })
      .then(res => {
        return res.json();
      })
      .then(resData => {
        if (resData.errors) {
          throw new Error('Deleting a post failed!');
        }

        console.log('deletePostHandler: ', resData);
        // this.setState(prevState => {
        //   const updatedPosts = prevState.posts.filter(p => p._id !== postId);
        //   return { posts: updatedPosts, postsLoading: false };
        // });

        this.loadPosts();
      })
      .catch(err => {
        console.log(err);
        this.setState({ postsLoading: false });
      });
  };

  errorHandler = () => {
    this.setState({ error: null });
  };

  catchError = error => {
    this.setState({ error: error });
  };

  render() {
    return (
      <Fragment>
        <ErrorHandler error={this.state.error} onHandle={this.errorHandler} />
        <FeedEdit
          editing={this.state.isEditing}
          selectedPost={this.state.editPost}
          loading={this.state.editLoading}
          onCancelEdit={this.cancelEditHandler}
          onFinishEdit={this.finishEditHandler}
        />
        <section className="feed__status">
          <form onSubmit={this.statusUpdateHandler}>
            <Input
              type="text"
              placeholder="Your status"
              control="input"
              onChange={this.statusInputChangeHandler}
              value={this.state.status}
            />
            <Button mode="flat" type="submit">
              Update
            </Button>
          </form>
        </section>
        <section className="feed__control">
          <Button mode="raised" design="accent" onClick={this.newPostHandler}>
            New Post
          </Button>
        </section>
        <section className="feed">
          {this.state.postsLoading && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Loader />
            </div>
          )}
          {this.state.posts.length <= 0 && !this.state.postsLoading ? (
            <p style={{ textAlign: 'center' }}>No posts found.</p>
          ) : null}
          {!this.state.postsLoading && (
            <Paginator
              onPrevious={this.loadPosts.bind(this, 'previous')}
              onNext={this.loadPosts.bind(this, 'next')}
              lastPage={Math.ceil(this.state.totalPosts / 2)}
              currentPage={this.state.postPage}
            >
              {this.state.posts.map(post => (
                <Post
                  key={post._id}
                  id={post._id}
                  author={post.creator.name}
                  date={new Date(post.createdAt).toLocaleDateString('en-US')}
                  title={post.title}
                  image={post.imageUrl}
                  content={post.content}
                  onStartEdit={this.startEditPostHandler.bind(this, post._id)}
                  onDelete={this.deletePostHandler.bind(this, post._id)}
                />
              ))}
            </Paginator>
          )}
        </section>
      </Fragment>
    );
  }
}

export default Feed;
