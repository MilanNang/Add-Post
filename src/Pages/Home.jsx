import React,{useState,useEffect} from 'react'
import {Container,PostCard } from '../componet/Index'
import appWriteService from '../appwrite/config'
import authService from '../appwrite/auth'

function Home() {
const[posts,setPosts]=useState([])
const[user,setUser]=useState(null);
useEffect(()=>{
    authService.getCurrentUser().then((user)=>{
    if(user){
        setUser(user);
    }
})
},[])

useEffect(()=>{
    appWriteService.getPosts().then((posts)=>{
        if (posts) {
            setPosts(posts.documents)
        }
    })
},[])

    if(user===null){
        return(
            <div className="w-full py-8 mt-4 text-center">
            <Container>
                <div className="flex flex-wrap">
                    <div className="p-2 w-full">
                        <h1 className="text-2xl font-bold hover:text-gray-500">
                          Sign in to Show & Add Post  
                        
                        </h1>
                    </div>
                </div>
            </Container>
        </div>
        )
    
    }
        if(posts.length === 0) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-2xl font-bold hover:text-gray-500">
                                Add new Post
                            
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }
    
  
  return (
    
    <div className='w-full py-8'>
        <Container>
        
            <div className='flex flex-wrap'>
                {posts.map((post) => (
                    <div key={post.$id} className='p-2 w-1/4'>
                        <PostCard 
                             $id={post.$id}
                             featuredimage={post.featuredimage}
                             title={post.title}
                             content={post.content}
                             showContent={false}
                         />
                    </div>
                ))}
            </div>
        </Container>
    </div>
)
}

export default Home