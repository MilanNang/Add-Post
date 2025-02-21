import React, { useState, useEffect } from 'react';
import { PostCard, Container } from '../componet/Index';
import appwriteService from '../appwrite/config';
import { useSelector } from 'react-redux';

function AllPosts({ content }) {
    const [posts, setPosts] = useState([]);
    const userData = useSelector((state) => state.auth.userData);

    useEffect(() => {
        appwriteService.getPosts([]).then((posts) => {
            if (posts) {
                setPosts(posts.documents.map(post => ({
                    ...post,
                    likeCount: post.likes || 0,
                    likedBy: post.likedBy || []
                })));
            }
        });
    }, []);

    const handleLike = (postId, likedBy) => {
        if (!userData) return alert("Please log in to like the post");

        const isLiked = likedBy.includes(userData.$id);
        const newLikedBy = isLiked
            ? likedBy.filter(id => id !== userData.$id)
            : [...likedBy, userData.$id];

        setPosts(posts.map(post =>
            post.$id === postId
                ? { ...post, likedBy: newLikedBy, likeCount: newLikedBy.length }
                : post
        ));

        appwriteService.updateLikes(postId, userData.$id, newLikedBy, !isLiked);
    };

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
                            <button
                                onClick={() => handleLike(post.$id, post.likedBy)}
                                className={`mt-4 w-full py-2 rounded-xl ${post.likedBy.includes(userData?.$id) ? 'bg-red-400' : 'bg-blue-400'} text-white`}
                            >
                                👍 Like {post.likeCount}
                            </button>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
}

export default AllPosts;
