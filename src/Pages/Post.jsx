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
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showDeletingPopup, setShowDeletingPopup] = useState(false);
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
    const isAuthor = post && userData ? post.userId === userData.$id : false;

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

    const deletePost = () => {
        setShowDeletePopup(false);
        setShowDeletingPopup(true);

        appwriteService.deletePost(post.$id).then((status) => {
            if (status) {
                appwriteService.deleteFile(post.featuredimage);
                navigate("/");
            }
        });
    };

    return post ? (
        <div className="py-8 px-4 sm:px-0">
            <Container>
                {/* Image */}
                <div className="w-full flex flex-col items-center mb-4 border rounded-xl p-2">
                    <img
                        src={appwriteService.getFilePreview(post.featuredimage)}
                        alt={post.title}
                        className="rounded-xl w-full max-w-[400px]"
                    />
                </div>

                {/* Like and Edit/Delete Buttons BELOW the image */}
                <div className="w-full flex justify-between items-center mb-6">
                    {/* Like Button on Left */}
                    {userData && (
                        <button
                            onClick={handleLike}
                            className={`py-2 px-4 rounded-xl ${isLiked ? 'bg-red-400' : 'bg-blue-400'} text-white`}
                        >
                            👍 Like {likeCount}
                        </button>
                    )}

                    {/* Edit & Delete Buttons on Right */}
                    {isAuthor && (
                        <div className="flex space-x-3">
                            <Link to={`/edit-post/${post.$id}`}>
                                <button className="h-[40px] w-[80px] bg-sky-400 rounded-lg hover:bg-sky-600">
                                    Edit
                                </button>
                            </Link>
                            <button className='bg-red-500 h-[40px] w-[80px] rounded-lg hover:bg-red-600' onClick={() => setShowDeletePopup(true)}>
                                Delete
                            </button>
                        </div>
                    )}
                </div>

                {/* Title */}
                <div className="w-full mb-6">
                    <h1 className="text-lg sm:text-2xl font-bold text-center">{post.title}</h1>
                </div>
                
                {/* Content */}
                <div className="browser-css text-sm sm:text-base text-center sm:text-left">
                    {parse(post.content)}
                </div>
            </Container>

            {showDeletePopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <p className="mb-4">Are you sure you want to delete this post?</p>
                        <div className="flex justify-end">
                            <Button className="mr-3 bg-gray-300 rounded-xl hover:bg-gray-400" onClick={() => setShowDeletePopup(false)}>Cancel</Button>
                            <Button className="bg-red-600 rounded-xl hover:bg-red-800" onClick={deletePost}>Delete</Button>
                        </div>
                    </div>
                </div>
            )}

            {showDeletingPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <p className="mb-4">Deleting post...</p>
                    </div>
                </div>
            )}
        </div>
    ) : null;
}
