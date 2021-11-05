import React,{useContext} from "react";
import './SignIn.css'
import logo from '../Components/Images/instagramLogo.png'
import {Context} from '../Context'
import {auth} from '../firebase'
import {signInWithPopup,GoogleAuthProvider} from 'firebase/auth'


function SignIn(){
    const {setUser}=useContext(Context)
    const provider = new GoogleAuthProvider()

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
        <img src={logo} className='signInLogo' alt='Instagram Logo'/>
        <button className='signInButton' onClick={handleClick}>Sign In</button>    
    </div>
    )
}

export default SignIn