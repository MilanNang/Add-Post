// Post.js
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button, Container } from '../componet/Index';
import { FiMoreVertical } from 'react-icons/fi';
import { FaEdit, FaTrash } from 'react-icons/fa';
import parse from 'html-react-parser';
import appwriteService from '../appwrite/config';

export default function Post() {
    const [post, setPost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const [menuOpen, setMenuOpen] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showDeletingPopup, setShowDeletingPopup] = useState(false);
    
    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) {
                    setPost(post);
                } else {
                    navigate("/");
                }
            });
        } else {
            navigate("/");
        }
    }, [slug, navigate]);
    
    const handleLike = async () => {
        if (!userData) return alert("Please log in to like the post");
        const isLiked = post.likedBy.includes(userData.$id);
        
        const updatedLikedBy = isLiked
            ? post.likedBy.filter(id => id !== userData.$id)
            : [...post.likedBy, userData.$id];
        
        const updatedPost = await appwriteService.updateLikes(post.$id, updatedLikedBy);
        if (updatedPost) setPost(updatedPost);
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
    
    const isAuthor = post && userData ? post.userId === userData.$id : false;

    return post ? (
        <div className="py-8 px-4 sm:px-0">
            <Container>
                <div className="flex flex-col items-center">
                    {post.featuredimage && (
                        <img 
                            src={appwriteService.getFilePreview(post.featuredimage)} 
                            alt={post.title} 
                            className="rounded-xl w-full max-w-[400px] mb-4"
                        />
                    )}
                    <h1 className="text-xl font-bold text-center mt-2">{post.title}</h1>
                </div>
                <div className="browser-css text-sm sm:text-base text-center sm:text-center mt-4">
                    {parse(post.content)}
                </div>
                <div className="flex justify-between items-center mt-4">
                    <button 
                        onClick={handleLike} 
                        className={`py-2 px-3 rounded-xl ${post.likedBy.includes(userData.$id) ? 'bg-red-400' : 'bg-blue-400'} text-white`}
                    >
                        👍 Like {post.likes || 0}
                    </button>
                    {isAuthor && (
                        <div className="hidden sm:flex space-x-2">
                            <Link to={`/edit-post/${post.$id}`} className="bg-sky-400 hover:bg-sky-600 px-3 py-2 rounded-xl text-black flex items-center space-x-2">
                                <FaEdit /> <span>Edit</span>
                            </Link>
                            <button onClick={() => setShowDeletePopup(true)} className="bg-red-500 px-3 py-2 rounded-xl hover:bg-red-700 text-black flex items-center space-x-2">
                                <FaTrash /> <span>Delete</span>
                            </button>
                        </div>
                    )}
                    {isAuthor && (
                        <div className="sm:hidden relative">
                            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
                                <FiMoreVertical size={24} />
                            </button>
                            {menuOpen && (
                                <div className="absolute right-0 bg-white shadow-lg rounded-lg p-2 flex flex-col">
                                    <Link to={`/edit-post/${post.$id}`} className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100">
                                        <FaEdit /> <span>Edit</span>
                                    </Link>
                                    <button onClick={() => setShowDeletePopup(true)} className="flex items-center space-x-2 px-4 py-2 rounded-lg text-red-500 hover:bg-white">
                                        <FaTrash /> <span>Delete</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Container>

            {/* Delete Confirmation Popup */}
            {showDeletePopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <p className="mb-4">Are you sure you want to delete this post?</p>
                        <div className="flex justify-end">
                            <Button className="mr-3 bg-sky-400 rounded-xl hover:bg-sky-600" onClick={() => setShowDeletePopup(false)}>Cancel</Button>
                            <Button className="bg-red-600 rounded-xl hover:bg-red-800" onClick={deletePost}>Delete</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Deleting Popup */}
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