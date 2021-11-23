import React,{useContext,useState,useEffect} from "react";
import './SignIn.css'
import logo from '../Components/Images/instagramLogo.png'
import {Context} from '../Context'
import {auth} from '../firebase'
import {signInWithPopup,GoogleAuthProvider} from 'firebase/auth'
import iphoneImage from '../Components/Images/iphoneimage.png'
import showImages from "../showImagesPhone";
import macImage from '../Components/Images/macImage.png'
import showImagesDesktop from '../showImagesDesktop'



function SignIn(){
    const [index,setIndex]=useState(0)
    const {setUser}=useContext(Context)
    const provider = new GoogleAuthProvider()

    function nextSlide(length){
        if(index<length-1){
            setIndex(index+1)
        }
        else{
           setIndex(0)
        }
    }

    useEffect(()=>{
        const intervalId = setInterval(()=>nextSlide(showImages.length||showImagesDesktop.length),5000)

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
        <div className='previewContainer'>
            <div className='iphoneContainer'>
            <img src={iphoneImage} className='iphonePic'/>
            {showImages.map((photo,ind)=>(
                <img key={ind} src={photo.image} alt={'Preview'} className={index===ind?'iphoneContent':'iphoneContentNoDisplay'}/>
                )
            )}
            </div>
            
            <div className='desktopContainer'>
            <img src={macImage} className='macImage'/>
            {showImagesDesktop.map((photo,ind)=>(
                <img src={photo.image} className={index===ind?'desktopImage':'desktopImageNoDisplay'}/>
            )
            )}
            
            </div>

        </div>
        
        <div className='signInInner'>
        <img src={logo} className='signInLogo' alt='Instagram Logo'/>
        <button className='signInButton' onClick={handleClick}>Sign In</button>  
        </div>
    </div>
    )
}

export default SignIn