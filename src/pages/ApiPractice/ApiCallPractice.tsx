// import React, { useEffect, useState } from 'react'

// export default function ApiCallPractice(){
//     const [usersData, setUserData] = useState([]);
//     useEffect(()=>{
//         getUsersData();
//     },[])
//     async function getUsersData(){
//         const url = 'https://dummyjson.com/users';
//         let response = await fetch(url)
//         let data = await response.json()
//         setUserData(data.users)
//     }
//     console.log(usersData)
//     return(
//         <div>
//             <h1>Fetch method to get api</h1>
//             {
//                 usersData && usersData.map((user)=>(
//                     <ul key={user.id}>
//                         <li>{user.firstName}</li>
//                         <li>{user.lastName}</li>
//                         <li>{user.age}</li>
//                     </ul>
//                 ))
//             }
//         </div>
//     )
// }

import React, { useEffect, useState } from 'react';

export default function ApiCallPractice(){
    const [usersData, setusersData] = useState([]);
    useEffect(() =>{
        getUsersData();
    }, [])
    async function getUsersData(){
        const url = 'https://dummyjson.com/users';
        let response = await fetch(url)
        let data = await response.json()
        setusersData(data.users)
    }
    return(
        <div>
            <h1 className='main_heading'>Fetch method to get api</h1>
            <ul className='user-list user-list-head'>
                <li>First Name</li>
                <li>Last Name</li>
                <li>Age</li>
            </ul>
            {
                usersData && usersData.map((user)=>(
                    <ul key={user.id} className='user-list'>
                        <li>{user.firstName}</li>
                        <li>{user.lastName}</li>
                        <li>{user.age}</li>
                    </ul>
                ))
            }
        </div>
    )
}



