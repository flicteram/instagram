import React,{useContext,useEffect,useState} from "react";
import "./Home.css"
import { useHistory } from "react-router-dom";
import { db } from "../firebase";
import Header from "../Components/Header/Header";
import Stories from "../Components/Stories/Stories";
import Post from "../Components/Post/Post";
import NavBarDown from '../Components/NavBarDown/NavBarDown'
import Footer from "../Components/Footer/Footer";
import FooterLow from "../Components/FooterLow/FooterLow";
import Avatar from '@mui/material/Avatar'
import { collection, onSnapshot,query,orderBy,doc,setDoc,getDoc } from "firebase/firestore";
import {Context} from '../Context'
import {auth} from '../firebase'
import { signOut } from "firebase/auth";
import { LinearProgress } from "@mui/material";

function Home(){
    const {user}=useContext(Context)
    const [postData,setPostData]=useState([])
    const history=useHistory()

    function handleLogOut(){
        signOut(auth)
        .catch((error)=>{
            alert(error.message)
        })
    }

    async function createUser(){
            if(user){
                const docRef= doc(db,'users',user.uid)
                const docSnap = await getDoc(docRef)
                if(!docSnap.exists()){
                    setDoc(docRef,{
                        displayName:user.displayName,
                        photoURL:user.photoURL,
                        uid:user.uid,
                        followers:[],
                        following:[]
                    })
                }
            }
        }
    useEffect(()=>{
        createUser()
    },[])
    useEffect(()=>{
        //Get DB data
        const q = query(collection(db, "posts"),orderBy("timePosted", "desc"))
        const unsubscribe = onSnapshot(q,(querySnapshot)=>{
           setPostData(querySnapshot.docs.map(item=>({id:item.id,data:item.data()})))
        })
        return unsubscribe
    },[])

    if(postData.length===0){
        return <div>
            <Header user={user} isHome={true}/>
            <LinearProgress sx={{zIndex:1001}}/>
            </div>
    }

    return (
        <div className='homeContainer'>
            <Header user={user} isHome={true}/>
            <div className='homeContainerInner'>
                <div className='homePostsContainer'>
                <Stories user={user}/>
                {postData.map(data=><Post key={data.id} data={data} user={user} goToPost={true}/>)}
                </div>
                <div className='homeRightContainerBig'>
                    <div className='homeRightAvatarContainer'>
                        <div className='homeRightAvatarInner'>
                            <Avatar sx={{width:70,height:70}} src={user.photoURL}/>
                            <div className='homeRightUserContainer'>
                            <h5>{user.displayName}</h5>
                            <button onClick={()=>history.push(`/profile/${user.uid}`)} className='goToProfileHomeButton'>Go to profile</button>
                            </div>
                        </div>

                        <button onClick={handleLogOut} className='homeRightSignOut'>Sign out</button>
                        
                    </div>
                    <Footer/>
                </div>
                
            </div>
            <FooterLow homePageBig={true}/>
            <NavBarDown user={user} home={true}/>
        </div>
    )
}

export default Home