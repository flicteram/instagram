import React,{useEffect,useState} from "react";
import './Post.css'
import ModalPost from '../Modal/ModalPost'
import {useHistory} from 'react-router-dom'
import { doc,orderBy,updateDoc,increment,arrayUnion,arrayRemove,Timestamp,collection,onSnapshot,query,addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Avatar from '@mui/material/Avatar'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import Skeleton from '@mui/material/Skeleton';
import { createTheme } from '@mui/material';

function Post({data,user,goToPost,postPage}){
    const history = useHistory()
    const [postComments,setPostComments]=useState([])
    const [userData,setUserData]=useState(null)
    const [loading,setLoading]=useState(true)
    const [commentText,setCommentText]=useState('')
    const postsRef = doc(db,'posts',data.id)

    const themeComment = createTheme({
        breakpoints: {
          values: {
            xs: 0,
            sm: 770,
            md: 900,
            lg: 1200,
            xl: 1536,
          },
        },
      });
    
    const stylesLow = (theme)=>({
        [theme.breakpoints.down('sm')]:{
            width:28,
            height:28,
            marginLeft:'5px'
            ,cursor:'pointer'
        },
        [theme.breakpoints.up('sm')]:{
            display:'none'
        }
    })

    const stylesHigh = (theme)=>({
        [theme.breakpoints.down('sm')]:{
            display:'none'
        },
        [theme.breakpoints.up('sm')]:{
            width:28,
            height:28,
            marginLeft:'5px',
            cursor:'pointer'
        }
    })

    async function handlePostComment(e){
        e.preventDefault()
        const commentRef = collection(db,`posts`,data.id,'comments')
        const whoCommentedRef = doc(db,'posts',data.id)
        await addDoc(commentRef,{
                username:user.displayName,
                timestamp:Timestamp.now(),
                commentText:commentText,
                userPhoto:user.photoURL,
                userId:user.uid
            })
        await updateDoc(whoCommentedRef,{
            whoCommented:arrayUnion(user.uid),
            commentsCount:increment(1)
        })
        setCommentText('')
    }
    function timeAgoComment(timePosted){
        const minutes = Math.round((Timestamp.now().seconds-timePosted)/60)
        if(minutes<1){
            return 'JUST NOW'
        }
        else if (minutes>=1&&minutes<60){
            return `${minutes}m`
        }
        else if (minutes>=60&&minutes<=1440) {
            return `${Math.floor(minutes/60)}h`
        }
        else {
            return `${Math.floor(minutes/1440)}d`
        }
    }

    function timeAgo(){
        const time = Math.round((Timestamp.now().seconds-data.data.timePosted.seconds)/60)
        if(time>=60&&time<120){
            return `${Math.floor(time/60)} HOUR AGO`
        }
        else if(time>=120&&time<1440){
            return `${Math.floor(time/60)} HOURS AGO`
        }
        else if (time<1){
            return `${Timestamp.now().seconds-data.data.timePosted.seconds} SECONDS AGO`
        }
        else if (time===0){
            return `JUST NOW`
        }
        else if (time===1){
            return `1 MINUTE AGO`
        }
        else if(time<60){
            return `${time} MINUTES AGO`
        }
        else if(time>=1440&&time<2880){
            return `${Math.floor(time/1440)} DAY AGO`
        }
        else {
            return `${Math.floor(time/1440)} DAYS AGO`
        }
    }
    async function handleDislike(){
        await updateDoc(postsRef, {
            likes: increment(-1),
            whoLiked:arrayRemove(user.uid)
        });
    }

    async function handleLikes(){
        if(!data.data.whoLiked.includes(user.uid)){
        await updateDoc(postsRef, {
            likes: increment(1),
            whoLiked:arrayUnion(user.uid)
        });
    }
    }
    useEffect(()=>{
        /*Get comments*/
        const commentRef = query(collection(db,`posts/${data.id}/comments`),orderBy("timestamp", "desc"))
        const change = onSnapshot(commentRef,(querySnapshot)=>{
            const commentsArray=[]
            querySnapshot.forEach((doc) => {
            commentsArray.push(doc.data())
        });
        setPostComments(commentsArray)
        })
        return change
    },[data.id])
    

    useEffect(()=>{
        const getUserData = onSnapshot(doc(db,'users',data.data.uid),(doc)=>{
            setUserData(doc.data())
            setLoading(false)
        })
        return getUserData
    },[])
    
    if(loading&&!postPage){
        return <div className='skeletonPostContainer'>
            <div className='skeletonPostAvatar'>
            <Skeleton variant='circular' sx={{width:50,height:50}}/>
            <Skeleton sx={{width:"80%",height:'25px',marginLeft:'10px'}}/>
            </div>
            <Skeleton variant='rectangular' sx={{height:'200px',marginTop:'10px'}}/>
            <div className='skeletonReactionsPost'>
            <Skeleton variant='text' sx={{width:'100px'}}/>
            <Skeleton variant='text' sx={{width:'50px'}}/>
            <Skeleton variant='text' sx={{width:'100%'}}/>
            <Skeleton variant='text' sx={{width:'100px'}}/>
            </div>
        </div>
             
    }
    return(
        <div className={postPage?'postsContainerPostPage':'postsContainer'}>
            <div style={{display:'flex',flexDirection:'column',width:'100%',alignSelf:'center'}}>
            <div className={postPage?'postAvatarContainerPostPage':'postAvatarContainer'}>
                <div className='postAvatar'>
                    <Avatar onClick={()=>history.push(`/profile/${data.data.uid}`)} src={data.data.userPhoto} sx={{width:35,height:35,cursor:'pointer'}}/>
                    <h4 onClick={()=>history.push(`/profile/${data.data.uid}`)} className='userPost'>{data.data.username}</h4>
                </div>
                <ModalPost data={data} user={user} userData={userData} goToPost={goToPost}/>
            </div>
            <img src={data.data.postPhoto} alt={data.data.username} className={postPage?'postPicturePostPage':'postPicture'}/>
            </div>
            {/*ONLY FOR POST PAGE*/}
            <div className={postPage&&'reactionsContainerPostPage'}>
                <div className={postPage?'postAvatarContainerBigPostPage':'postAvatarContainerBig'}>
                        <div className='postAvatarPostPage'>
                        <Avatar onClick={()=>history.push(`/profile/${data.data.uid}`)} src={data.data.userPhoto} sx={{width:35,height:35,cursor:'pointer'}}/>
                        <h4 onClick={()=>history.push(`/profile/${data.data.uid}`)} className='userPost'>{data.data.username}</h4>
                        </div>
                 <ModalPost data={data} user={user} userData={userData} goToPost={goToPost}/>
                </div>
               {postPage&&<div className='commentsPostPageContainer'>
                            <div className='postPagePostDescription'>
                                <div className='postPageUserPostDescription'>
                                <Avatar onClick={()=>history.push(`/profile/${data.data.uid}`)} sx={{width:35,height:35,cursor:'pointer'}} src={data.data.userPhoto}/>
                                <p> <span onClick={()=>history.push(`/profile/${data.data.uid}`)} className='postPageUsernamePostDescription'>{data.data.username}</span> <span className='postDescriptionPostPageText'>{data.data.text}</span></p>
                                </div>
                                <p className='timeAgoCommentPostPage'>{timeAgoComment(data.data.timePosted.seconds)}</p>
                            </div>
                {postComments.map(comment=>(
                            <div key={comment.timestamp.seconds} className='commentPostPage'>
                                <div className='commentsTextPostPage'>
                                <Avatar onClick={()=>history.push(`/profile/${comment.userId}`)} src={comment.userPhoto} sx={{width:35,height:35,cursor:'pointer'}}/>
                                <p> <span onClick={()=>history.push(`/profile/${comment.userId}`)} className='commentsPostPageUsername'>{comment.username}</span> <span className='commentUnderPostText'>{comment.commentText}</span></p>
                                </div>
                                <p className='timeAgoCommentPostPage'>{timeAgoComment(comment.timestamp.seconds)}</p>
                            </div>
                            
                        ))}
                </div>}
                {/*ONLY FOR POST PAGE*/}
                <div>
                    <div className={postPage?'reactionsPostPage':'reactions'}>
                        <div className='reactiosLeft'>
                            {data.data.whoLiked.includes(user.uid)?
                            <FavoriteOutlinedIcon sx={{width:28,height:28,color:'rgb(245, 61, 61)',cursor:'pointer'}} onClick={handleDislike}/>:
                            <FavoriteBorderOutlinedIcon onClick={handleLikes} sx={{width:28,height:28,cursor:'pointer'}}/>}
                            <ModeCommentOutlinedIcon onClick={()=>history.push(`/comments/${data.id}`)} theme={themeComment} sx={stylesLow}/>
                            <ModeCommentOutlinedIcon onClick={()=>history.push(`/post/${data.id}`)} theme={themeComment} sx={stylesHigh}/>
                            </div>
                        </div>
                        <p className='likes'>{data.data.likes===1?`${data.data.likes} like`:`${data.data.likes} likes`}</p>
                        <p className={postPage?'postDescriptionAllPostPage':'postDescriptionAll'}><span onClick={()=>history.push(`/profile/${data.data.uid}`)} className='postDescriptionUsername'>{data.data.username}</span><span className='postText'>{data.data.text}</span></p>
                        {postComments.length>1&&
                        <div>
                        <p onClick={()=>history.push(`/comments/${data.id}`)} className={postPage?'viewAllCommentsPostPageLow':'viewAllCommentsLow'}>View all {postComments.length} comments</p>
                        <p onClick={()=>history.push(`/post/${data.id}`)} className={postPage?'viewAllCommentsPostPageBig':'viewAllCommentsBig'}>View all {postComments.length} comments</p>
                        </div>}

                        {postComments.slice(0,2).map(comment=>(
                            <p key={comment.timestamp.seconds} className={postPage?'commentUnderPostPage':'commentUnderPost'}><span onClick={()=>history.push(`/profile/${comment.userId}`)} className='commentPostUsername'>{comment.username}</span> <span className='commentUnderPostText'>{comment.commentText}</span></p>
                        ))}
                        <p className={postPage?'postedTimePostPageDown':'postedTime'}>{timeAgo()}</p>
                        <form onSubmit={e=>handlePostComment(e)} className='addCommentPostBig'>
                            <input value={commentText} onChange={e=>setCommentText(e.target.value)} placeholder='Add a comment...'/>
                            <button disabled={commentText.trim()===''}>Post</button>
                        </form>
                    </div>
                </div>
        </div>
    )
}

export default Post