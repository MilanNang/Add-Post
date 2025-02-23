import React, { useState, useEffect } from 'react';
import { PostCard, Container } from '../componet/Index';
import appwriteService from '../appwrite/config';


function AllPosts({ content }) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const fetchedPosts = await appwriteService.getPosts();
            if (fetchedPosts) {
                setPosts(fetchedPosts.documents);
            }
        };
    
        fetchPosts();
    }, []);

    
    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-col space-y-6 p-4'>
                    {posts.map((post) => (
                        <div key={post.$id} className="border p-4 rounded-xl shadow-lg">
                            <PostCard
                                $id={post.$id}
                                title={post.title}
                                featuredimage={post.featuredimage}
                                content={post.content}
                                showContent={true}
                            />
                            <div className="flex justify-start py-2">
                                    <button
                                        className="bg-gray-300 text-black px-4 py-2 rounded-xl cursor-default"
                                    >
                                        👍 {post.likes || 0}
                                    </button>
                                </div>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
}

export default AllPosts;