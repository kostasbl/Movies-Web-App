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
import MovieCard from "./Components/MovieCard.jsx"
import {useDebounce} from 'react-use'
import {updateSearchCount} from './appwrite.js'
import {getTrendingMovies} from './appwrite.js'



const API_BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY= import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
    method:"GET",
    headers:{
        accept: 'application/json',
        Authorization: 'Bearer ' + API_KEY
    }
}


const App = () => {
    const [searchTerm, setSearchTerm] =useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [movieList,setMovieList] =useState([]);
    const [isLoading,setLoading]=useState(false);
    const [debouncedSearchTerm,setDebouncedSearchTerm]=useState('');
    const [trendingMovies,setTrendingMovies]=useState([]);

    //DeBounce the searrch term to prevent making to many api requests for each letter i add in the search bar
    //by waiting for the user to stop typing for 500ms
    useDebounce(()=> setDebouncedSearchTerm(searchTerm),1000,[searchTerm])

    const fetchMovies = async (query=" ") => {
        setLoading(true);
        setErrorMessage("");
        try{
            const endpointURL = query?`${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`:`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
            const response = await fetch(endpointURL,API_OPTIONS);

            if(!response.ok){
                throw new Error("Could not fetch movies without any results.");
            }

            const data = await response.json();
            console.log(data)
            if(data.response=='False'){
                setErrorMessage("failed to fetch movie");
                setMovieList([])
                return;
            }

            setMovieList(data.results || []);
            if(query && data.results.length>0){
                await updateSearchCount(query,data.results[0]);
            }
        }catch (error) {
            console.log("Error: ", error);
            setErrorMessage("Error fetching movies!!");
        }finally {
            setLoading(false);
        }
    }

    const loadTrendingMovies = async () => {
        try{
            const movies =await getTrendingMovies();
            setTrendingMovies(movies);
        }catch (error){
            console.log(error);
        }
    }

    useEffect(() => {
        fetchMovies(debouncedSearchTerm);
    }, [debouncedSearchTerm])  //when search term changes that method got called

    useEffect(() => {
        loadTrendingMovies();
    }, []);//on;y gets called at the start one time

    return (
        <main>
            <div className="pattern"/>
            <div className="wrapper">
                <header>
                    <img  src="./hero-img.png" alt="Hero"/>
                    <h1>Find <span className="text-gradient">Movies</span>You'll Enjoy Without the Hassle </h1>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </header>
                {trendingMovies.length>0 && (
                    <section className="trending">
                        <h2>
                            Trending Movies
                        </h2>
                        <ul>
                            {trendingMovies.map((movie,index)=>(
                                <li key={movie.$id}>
                                    <p>{index+1}</p>
                                    <img src={movie.poster_url} alt={movie.title}/>
                                </li>
                            ))}
                        </ul>
                    </section>
                ) }
                <section className="all-movies">
                    <h2 >All movies</h2>
                    {isLoading ? (
                        <Spinner/>
                    ):errorMessage?(<p className="text-red-500">{errorMessage}</p>):(
                        <ul>
                            {movieList.map((movie)=>(
                                <MovieCard key={movie.id} movie={movie}/>
                            ))}
                        </ul>
                    )}
                </section>

            </div>
        </main>
    )
}
export default App






