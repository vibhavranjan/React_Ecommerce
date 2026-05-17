import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
export default function EditUser(){
    const {id} = useParams();
    const [name, setName] = useState('') 
    const [age, setAge] = useState('')
    const [email, setEmail] = useState('')
    const url = 'http://localhost:3000/users/'+id;
    const navigate = useNavigate();
    useEffect(()=>{
        getUserData()
    }, [])
    
    const getUserData=async()=>{
        
        let response = await fetch(url);
        response = await response.json()

        setName(response.name)
        setAge(response.age)
        setEmail(response.email)
        
    }
    const updateUserData=async() => {
        console.log(name, age, email);
        let response = await fetch(url,{
            method: "Put",
            body: JSON.stringify({name, age, email})
        })
        response = await response.json()
        console.log(response);
        if(response){
            alert("User Data Updated");
            navigate('/jsonserverpractice')
        }
    }
    return(
        <div style={{textAlign: 'center'}}>
            <h1 className='main_heading'>Edit User Details</h1>
            <input type="text" placeholder='User Name' value={name} onChange={(event)=>setName(event.target.value)} />
            <br /> <br />
            <input type="text" placeholder='User Email' value={email} onChange={(event)=>setEmail(event.target.value)} />
            <br /> <br />
            <input type="text" placeholder='User Age' value={age} onChange={(event)=>setAge(event.target.value)} />
            <br /> <br />
            <button onClick={updateUserData}>Update User</button>
        </div>
    )
}