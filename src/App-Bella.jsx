//import { useState, useEffect } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
//import './App.css'

//const Card =({title})=>{
 //   const [count,setCount] = useState(0);
 //   const [hasLiked,setHasLiked] = useState(false);

  //  useEffect(()=>{
   //     console.log(`${title} has been liked: ${hasLiked}`);
 //   },[hasLiked]); //this will run whenever hasLiked changes
 //   useEffect(()=>{
 //       console.log(`${title} has rendered`);
//    },[]); //this will run only once when the component mounts
    //return(
    //    <div className="card" onClick={()=>setCount(count+1)}>
        //    <h2 className="text-3xl font-bold underline">{title} <br/> {count ? count : null}</h2>
      //      <button onClick={()=>setHasLiked(!hasLiked)}>{hasLiked?"Liked":"Like"}</button>
    //    </div>
  //  )
//}

//const App = () => {

 // return (
//    <div className="card-container">
//        <Card title="star wars " rating={5} isCool={true} />
//        <Card title="inception"/>
//        <Card title="the matrix" />
//    </div>
//  )
//}

//export default App

import React from 'react'
import Search from "./Components/Search.jsx"
import Spinner from "./Components/Spinner.jsx"
import {useState,useEffect} from 'react'
import MovieCard from "./Components/Mo