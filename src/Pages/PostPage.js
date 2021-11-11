import React,{useState,useEffect, useContext} from "react";
import {db} from '../firebase'
import { doc, onSnapshot,query,getDocs,collection,where} from "firebase/firestore";
import './PostPage.css'
import Post from '../Components/Post/Post'
import {useParams,useHistory} from 'react-router-dom'
import {Context} from '../Context'
import Nav from "../Components/Nav/Nav";
import NavBarDown from "../Components/NavBarDown/NavBarDown";
import LinearProgress from '@mui/material/LinearProgress';
import PostDisplayProfile from '../Components/PostDisplayProfile/PostDisplayProfile'
import FooterLow from "../Components/FooterLow/FooterLow";

function PostPage(){
    const history = useHistory()
    const {postId}=useParams()
    const [postInfo,setPostInfo]=useState({})
    const [morePosts,setMorePosts]=useState([])
    const {user} = useContext(Context)
    const [loading,setLoading]=useState(true)

    async function getRelevantPosts(){
        const q = query(collection(db,'posts'),where('uid','==',postInfo.data.uid))
        const querySnapshot = await getDocs(q)
        const postsArray= []
        querySnapshot.forEach((doc)=>{
        postsArray.push({id:doc.id,data:doc.data()})
        })
        setMorePosts(postsArray)
    }
    
    useEffect(()=>{
        /* Get post data */
        setLoading(true)
        const unsub = onSnapshot(doc(db,'posts',postId),(doc)=>{
            setPostInfo({data:doc.data(),id:doc.id})
            setLoading(false)
        })
        return unsub
    },[postId])

    useEffect(()=>{
        if(postInfo.data){
        getRelevantPosts()
        }
    },[postInfo])

    function handleGoBack(){
        history.goBack()
    }
    function goToProfile(){
        history.push(`/profile/${user.uid}`)
    }

    if(loading){
        return <LinearProgress sx={{width:'100%'}}/>
    }
    return(
    <div className='postPageContainer'>
        
        <Nav title={'Photo'} user={user} leftNav={handleGoBack} rightNav={goToProfile}/>
        <div className='postPagePostContainer'>
            {postInfo.data&&<Post data={postInfo} user={user} isLoading={loading} postPage={true}/>}
        </div>
        <div className='postPageMorePostsFromContainer'>
            <h4>More posts from <span className='morePostsGoToProfile' onClick={()=>history.push(`/profile/${postInfo.data.uid}`)}>{postInfo.data.username}</span></h4>
            <div className='postPageMorePostsContainer'>
                {morePosts.slice(0,7).filter(post=>post.id!==postId).map(item=><PostDisplayProfile item={item}/>)}
            </div>
        </div>
        
        <FooterLow/>
        <NavBarDown user={user} home={true} goToPost={false}/>
    </div>
    )
}

export default PostPage