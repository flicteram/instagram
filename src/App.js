import './App.css';
import React from 'react';
import {Switch,Route} from 'react-router-dom'
import SignIn from './Pages/SignIn';
import Home from './Pages/Home';
import NewPost from './Pages/NewPost'
import CommentPage from './Pages/CommentPage'
import Profile from './Pages/Profile';
import EditProfile from './Pages/EditProfile';
import PostPage from './Pages/PostPage'


function App() {

  return (
    <div className='appContainer'>
    <Switch >
      <Route exact path='/'>
        <Home/>
      </Route>  
      <Route path='/signin'>
        <SignIn/>
      </Route>
      <Route path='/newPost'>
        <NewPost/>
      </Route>
      <Route path='/comments/:postId'>
        <CommentPage/>
      </Route>
      <Route path='/profile/:profileId'>
        <Profile/>
      </Route>
      <Route path='/EditProfile/:profileId'>
        <EditProfile/>
      </Route>
      <Route path='/post/:postId'>
        <PostPage/>
      </Route>
    </Switch>
    </div>
  );
}

export default App;
