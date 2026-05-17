import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function UserAdd(){
    const [name, setName] = useState('')
    const [age, setAge] = useState('')
    const [email, setEmail] = useState('')
    
    const createUser=async()=>{
        console.log(name, age, email)
        const url = 'http://localhost:3000/users'
        let response = await fetch(url, {
            method: "Post",
            body: JSON.stringify({name,email,age})
        })

        response = await response.json();
        if(response){
            alert("new user added")
        }
    }
    return(
        <div style={{textAlign: "center"}}>
            <ul className='nav-list'>
                <li>
                    <Link to="/jsonserverpractice">Json Server Practice</Link>
                </li>
                <li>
                    <Link to="/adduser">Add User</Link>
                </li>
            </ul>
            <h1 className='main_heading'> Add New User</h1>
            <input type='text' 
            onChange={(event)=>setName(event.target.value)} 
            placeholder='enter name' />
            <br /> <br/>
            <input type='text' 
            onChange={(event)=>setAge(event.target.value)}
            placeholder='enter age' />
            <br /> <br/>
            <input type='text' 
            onChange={(event)=>setEmail(event.target.value)}
            placeholder='enter email' />
            <br /> <br/>
            <button onClick={createUser}>Add User</button>
        </div>
    )
}