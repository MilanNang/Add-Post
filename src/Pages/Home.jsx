import React,{useState,useEffect} from 'react'
import {Container,PostCard } from '../componet/Index'
import appWriteService from '../appwrite/config'

function Home() {
const[posts,setPosts]=useState([])
useEffect(()=>{
    appWriteService.getPosts().then((posts)=>{
        if (posts) {
            setPosts(posts.documents)
        }
    })
},[])


  if (posts.length === 0) {
    return (
        <div className="w-full py-8 mt-4 text-center">
            <Container>
                <div className="flex flex-wrap">
                    <div className="p-2 w-full">
                        <h1 className="text-2xl font-bold hover:text-gray-500">
                            Login to read posts
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