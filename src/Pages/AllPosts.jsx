import React,{useState,useEffect} from 'react'
import { PostCard,Container } from '../componet/Index'
import appwriteService  from '../appwrite/config'

function AllPosts({content}) {
    const [posts,setPosts]=useState([])
    useEffect(()=>{},[])
    appwriteService.getPosts([]).then((posts)=>{
        if(posts){
            setPosts(posts.documents)
        }
    }
    )
    const stripHTML = (html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
      };

  return (
    <div className='w-full py-8'>
        <Container>
            <div className='flex flex-wrap'>
                {posts.map((post=>(
                    <div key={post.$id}>
                            <PostCard   $id={post.$id}
                                        title={post.title}
                                        featuredimage={post.featuredimage}
                                        content={post.content}
                                        showContent={true}
                                        />
                    </div>

                )))

                }
            </div>
        </Container>
    </div>
  )
}

export default AllPosts