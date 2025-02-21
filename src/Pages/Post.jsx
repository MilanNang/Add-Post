import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Container } from '../componet/Index';
import parse from 'html-react-parser';
import appwriteService from '../appwrite/config';

export default function Post() {
    const [post, setPost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();
    const [likeCount, setLikeCount] = useState(0);
    const [likedBy, setLikedBy] = useState([]);
    const userData = useSelector((state) => state.auth.userData);

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) {
                    setPost(post);
                    setLikeCount(post.likes || 0);
                    setLikedBy(post.likedBy || []);
                } else {
                    navigate("/");
                }
            });
        } else {
            navigate("/");
        }
    }, [slug, navigate]);

    const isLiked = userData ? likedBy.includes(userData.$id) : false;

    const handleLike = () => {
        if (!userData) return alert("Please log in to like the post");

        const newLikedBy = isLiked
            ? likedBy.filter(id => id !== userData.$id)
            : [...likedBy, userData.$id];

        const newLikeCount = newLikedBy.length;
        setLikedBy(newLikedBy);
        setLikeCount(newLikeCount);

        appwriteService.updateLikes(post.$id, userData.$id, newLikedBy, !isLiked);
    };

    return post ? (
        <div className="py-8 px-4 sm:px-0">
            <Container>
                <div className="w-full flex flex-col items-center mb-4 relative border rounded-xl p-2">
                    <img
                        src={appwriteService.getFilePreview(post.featuredimage)}
                        alt={post.title}
                        className="rounded-xl w-full max-w-[400px]"
                    />
                </div>
                <div className="w-full mb-6 flex flex-col sm:flex-row justify-center items-center sm:justify-between">
                    <h1 className="text-lg sm:text-2xl font-bold text-center">{post.title}</h1>
                    {userData && (
                        <button
                            onClick={handleLike}
                            className={`mt-4 sm:mt-0 w-full sm:w-auto py-2 px-4 rounded-xl ${isLiked ? 'bg-red-400' : 'bg-blue-400'} text-white`}
                        >
                            👍 Like {likeCount}
                        </button>
                    )}
                </div>
                <div className="browser-css text-sm sm:text-base text-center sm:text-left">
                    {parse(post.content)}
                </div>
            </Container>
        </div>
    ) : null;
}
