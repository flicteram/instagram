import React,{useContext,useState,useEffect} from "react";
import './SignIn.css'
import logo from '../Components/Images/instagramLogo.png'
import {Context} from '../Context'
import {auth} from '../firebase'
import {signInWithPopup,GoogleAuthProvider} from 'firebase/auth'
import iphoneImage from '../Components/Images/iphoneimage.jpg'
import showImages from "../showImages";


function SignIn(){
    const [index,setIndex]=useState(0)
    const {setUser}=useContext(Context)
    const provider = new GoogleAuthProvider()

    function nextSlide(){
        if(index<showImages.length-1){
            setIndex(index+1)
        }
        else{
           setIndex(0)
        }
    }

    useEffect(()=>{
        const intervalId = setInterval(nextSlide,5000)

        return ()=>clearInterval(intervalId)
    },[index])
        

    function handleClick(){
        signInWithPopup(auth,provider)
            .then((result)=>{
                setUser(result.user)
            })
            .catch((error)=>{
                alert(error.message)
            })
    }
    return( 
    <div className='signInContainer'>
        <div className='iphoneContainer'>
            <img src={iphoneImage} className='iphonePic'/>
            {showImages.map((item,ind)=>(
                <img key={ind} src={item.image} alt={'Preview'} className={index===ind?'iphoneContent':'iphoneContentNoDisplay'}/>
                )
            )}
        </div>
        
        <div className='signInInner'>
        <img src={logo} className='signInLogo' alt='Instagram Logo'/>
        <button className='signInButton' onClick={handleClick}>Sign In</button>  
        </div>
    </div>
    )
}

export default SignIn