// import React, { useState, useEffect } from 'react';
// import { PostCard, Container } from '../componet/Index';
// import appwriteService from '../appwrite/config';

// function AllPosts({ content }) {
//     const [posts, setPosts] = useState([]);

//     useEffect(() => {
//         appwriteService.getPosts([]).then((posts) => {
//             if (posts) {
//                 setPosts(posts.documents.map(post => ({
//                     ...post,
//                     likeCount: post.likes || 0
//                 })));
//             }
//         });
//     }, []);

//     return (
//         <div className='w-full py-8'>
//             <Container>
//                 <div className='flex flex-wrap'>
//                     {posts.map((post) => (
//                         <div key={post.$id} className="w-full sm:w-1/2 lg:w-1/3 p-2">
//                             <div className="border rounded-xl shadow-lg overflow-hidden">
//                                 <PostCard
//                                     $id={post.$id}
//                                     title={post.title}
//                                     featuredimage={post.featuredimage}
//                                     content={post.content}
//                                     showContent={true}
//                                 />
//                                 <div className="flex justify-center py-2">
//                                     <button
//                                         className="bg-gray-300 text-black px-4 py-2 rounded-xl cursor-default"
//                                     >
//                                         👍 {post.likeCount}
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </Container>
//         </div>
//     );
// }

// export default AllPosts;





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
                            <div className="flex justify-start py-2">
                                    <button
                                        className="bg-gray-300 text-black px-4 py-2 rounded-xl cursor-default"
                                     >
                                         👍 {post.likeCount}
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