import React,{useState,useEffect,useContext} from 'react'
import {useParams,useHistory} from 'react-router-dom'
import "./Profile.css"
import {db} from '../firebase'
import { doc, collection,where,query,arrayUnion, arrayRemove,updateDoc,onSnapshot,orderBy } from "firebase/firestore";
import Header from '../Components/Header/Header'
import Post from '../Components/Post/Post';
import PostDisplayProfile from '../Components/PostDisplayProfile/PostDisplayProfile';
import {Context} from '../Context'
import Avatar from '@mui/material/Avatar'
import GridOnIcon from '@mui/icons-material/GridOn';
import ViewDayOutlinedIcon from '@mui/icons-material/ViewDayOutlined';
import NavBarDown from '../Components/NavBarDown/NavBarDown';
import Skeleton from '@mui/material/Skeleton';
import { createTheme } from '@mui/material';
import FooterLow from '../Components/FooterLow/FooterLow'

function Profile(){
    const [profile,setProfile]=useState(null)
    const [postsProfile,setPostsProfile]=useState([])
    const [grid,setGrid]=useState(true)
    const {profileId} = useParams()
    const {user} = useContext(Context)
    const history=useHistory()

    const themeSekleton = createTheme({
        breakpoints:{
            values:{
                xs: 400,
                sm: 500,
                md: 700,
                lg: 840,
                xl: 1536,
            }
        }
    })
    const skeletonStyles = (themeSekleton)=>({
        [themeSekleton.breakpoints.down('sm')]:{
            height:100
        },
        [themeSekleton.breakpoints.up('sm')]:{
            height:150
        },
        [themeSekleton.breakpoints.between('md','lg')]:{
            height:200
        },
        [themeSekleton.breakpoints.up('lg')]:{
            height:250
        },
    })
    const theme = createTheme({
        breakpoints:{
            values:{
                xs:0,
                sm:700,
                md:1000,
            }
        }
    })
    const styles = (theme)=>({
        [theme.breakpoints.down('sm')]:{
            width:75,
            height:75
        },
        [theme.breakpoints.up('sm')]:{
            width:150,
            height:150,
            marginRight:50
        }
    })

    function handleUnfollow(){
        const followRef = doc(db,'users',user.uid)
        const followedRef = doc(db,'users',profileId)
        updateDoc(followedRef,{
            followers:arrayRemove(user.uid)
        })
        updateDoc(followRef,{
            following:arrayRemove(profileId)
        })
    }

    function handleFollow(){
        const followRef = doc(db,'users',user.uid)
        const followedRef = doc(db,'users',profileId)
        updateDoc(followedRef,{
            followers:arrayUnion(user.uid)
        })
        updateDoc(followRef,{
            following:arrayUnion(profileId)
        })
    }

    useEffect(()=>{
    /* Get posts data from db*/
        const q = query(collection(db, "posts"), where('uid','==',profileId),orderBy("timePosted", "desc"));
        const unsubscribe = onSnapshot(q,(querySnapshot)=>{
        const dataArray = []
        querySnapshot.forEach((doc) => {
                dataArray.push({id:doc.id,data:doc.data()})
            });
            setPostsProfile(dataArray)
        });
        return unsubscribe
    },[profileId])

    useEffect(()=>{
        /*Get data about user from db*/
        const unsub = onSnapshot(doc(db, "users", profileId), (doc) => {
            setProfile(doc.data())
        });
        return unsub
    },[profileId])
    
   

    if(!profile||!user){
       return <div className='skeletonProfileContainer'>
            <Header user={user}/>
            <div className='skeletonAvatarContainer'>
            <div className='skeletonAvatar'>
            <Skeleton variant='circular' animation='wave' theme={theme} sx={styles}/>
            <div className='skeletonAvatarInfo'>
            <Skeleton animation='wave' variant="text" width={'100%'} height={'25px'}/>
            <Skeleton animation='wave' variant="text" width={'100%'} height={'25px'}/>
            <Skeleton animation='wave' variant="text" width={'100%'} height={'25px'}/>
            <Skeleton animation='wave' variant="text" width={'100%'} height={'25px'}/>
            </div>
            </div>
            <Skeleton animation='wave' variant="rectangular" sx={{marginTop:'20px'}} width={'100%'} height={'40px'}/>
            </div>
            <div className='skeletonProfilePosts'>
            <Skeleton theme={themeSekleton} sx={skeletonStyles} animation='wave' variant='rectangular' />
            <Skeleton theme={themeSekleton} sx={skeletonStyles} animation='wave' variant='rectangular' />
            <Skeleton theme={themeSekleton} sx={skeletonStyles} animation='wave' variant='rectangular' />
            <Skeleton theme={themeSekleton} sx={skeletonStyles} animation='wave' variant='rectangular' />
            <Skeleton theme={themeSekleton} sx={skeletonStyles} animation='wave' variant='rectangular' />
            <Skeleton theme={themeSekleton} sx={skeletonStyles} animation='wave' variant='rectangular' />
            <Skeleton theme={themeSekleton} sx={skeletonStyles} animation='wave' variant='rectangular' />
            <Skeleton theme={themeSekleton} sx={skeletonStyles} animation='wave' variant='rectangular' />
            <Skeleton theme={themeSekleton} sx={skeletonStyles} animation='wave' variant='rectangular' />
            </div>
            <NavBarDown user={user} home={false} border={'1px solid black'}/>
           </div>
    }
    return (
        <div className='profileContainer'>
           
            <div>
            <Header user={user}/>
            <div className='profileTop'>
                <Avatar src={profile.photoURL} theme={theme} sx={styles} />
                <div className='profileTopFollowers'>
                
                <h2 className='profileTopName'>{profile.displayName}</h2>
                {profileId!==user.uid&&!profile.followers.includes(user.uid)?
                <button onClick={handleFollow} className='followButton'>Follow</button>:
                profileId===user.uid? 
                <button onClick={()=>history.push(`/EditProfile/${profileId}`)} className='optionsButton'>Edit Profile</button>:
                <button onClick={handleUnfollow} className='unfollowButton'>Unfollow</button>}
                    <div className='postsProfile'>
                        <p className='statsNumber'>{postsProfile.length}</p>
                        <p className='statsName'>posts</p>
                    </div>
                    <div className='followers'>
                        <p className='statsNumber'>{profile.followers.length}</p>
                        <p className='statsName'>followers</p>
                    </div>
                    <div className='following'>
                        <p className='statsNumber'>{profile.following.length}</p>
                        <p className='statsName'>following</p>
                    </div>
                    <p className='profileBio'>{profile.bio}</p>
                </div>
                
            </div>
              
            <div className='profileOptions'>
            <GridOnIcon onClick={()=>setGrid(true)} sx={grid?{width:30,height:30,color:'rgb(80, 124, 255)',cursor:'pointer'}:{width:30,height:30,color:'rgb(214, 214, 214)',cursor:'pointer'}}/>
            <ViewDayOutlinedIcon onClick={()=>setGrid(false)} sx={grid?{width:30,height:30,color:'rgb(214, 214, 214)',cursor:'pointer'}:{width:30,height:30,color:'rgb(80, 124, 255)',cursor:'pointer'}}/>
            </div>
            
            {grid?<div className='postsDisplay'>
                {postsProfile.map(post=><PostDisplayProfile key={post.id} item={post}/>)}
            </div>:
            <div className='postsProfileContiner'>
            {postsProfile.map(data=><Post key={data.id} data={data} user={user} goToPost={true} userData={profile}/>)}
            </div>
            }
            </div>
            <FooterLow homePageBig={false}/>
            <NavBarDown user={user} home={false} border={'1px solid black'}/>
        </div>
    )
}

export default Profile