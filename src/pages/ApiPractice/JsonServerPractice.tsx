import React, {useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function JsonServerPractice(){
    const [userData, setuserData] = useState([]);
    const[loading, setLoading]= useState(false);
    const navigate = useNavigate();
    const url='http://localhost:3000/users';
    useEffect(
        ()=>{
            setLoading(true);
            UserDataFn();
        }, []
    )
    async function UserDataFn(){
        let Mydata = await fetch(url);
        let MydataJson = await Mydata.json(); 
        setuserData(MydataJson);
        setLoading(false);
    }
    console.log(userData)
    
    const deleteUser=async(id)=>{
        let response = await fetch(url+'/'+id, {
            method: 'delete'
        })
        response = response.json()
        if(response){
            alert("Record Deleted")
            UserDataFn()
        }
    }
    const editUser = (id)=>{
        navigate("/edit/"+id)
    }
    return(
        <div>
            <ul className='nav-list'>
                <li>
                    <Link to="/jsonserverpractice">Json Server Practice</Link>
                </li>
                <li>
                    <Link to="/adduser">Add User</Link>
                </li>
            </ul>
            <h1 className='main_heading'>Integrate Json Server API and Loader </h1>
            <ul className='user-list user-list-head'>
                <li>Name</li>
                <li>Age</li>
                <li>Email</li>
                <li> 
                    Action
                </li>
            </ul>
            {
                !loading ?
                    userData && userData.map((data)=>( 
                            <ul key={data.name} className='user-list'>
                                <li>{data.name}</li>
                                <li>{data.age}</li>
                                <li>{data.email}</li>
                                <li> 
                                    <button onClick={()=>deleteUser(data.id)}>Delete</button> 
                                    <button onClick={()=>editUser(data.id)}>Edit</button> 
                                </li>
                            </ul>
                    ))
                : <h1>Data Loading...</h1>
            }
        </div>
    )
}

