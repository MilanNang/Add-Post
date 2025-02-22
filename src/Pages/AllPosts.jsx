import React, { useState, useEffect } from 'react';
import { PostCard, Container } from '../componet/Index';
import appwriteService from '../appwrite/config';

function AllPosts({ content }) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        appwriteService.getPosts([]).then((posts) => {
            if (posts) {
                setPosts(posts.documents.map(post => ({
                    ...post,
                    likeCount: post.likes || 0
                })));
            }
        });
    }, []);

    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {posts.map((post) => (
                        <div key={post.$id} className="w-full sm:w-1/2 lg:w-1/3 p-2">
                            <div className="border rounded-xl shadow-lg overflow-hidden">
                                <PostCard
                                    $id={post.$id}
                                    title={post.title}
                                    featuredimage={post.featuredimage}
                                    content={post.content}
                                    showContent={true}
                                />
                                <div className="flex justify-center py-2">
                                    <button
                                        className="bg-gray-300 text-black px-4 py-2 rounded-xl cursor-default"
                                    >
                                        👍 {post.likeCount}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
}

export default AllPosts;





