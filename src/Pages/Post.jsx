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

    const userData = useSelector((state) => state.auth.userData);

    const isAuthor = post && userData ? post.userId === userData.$id : false;

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) setPost(post);
                else navigate("/");
            });
        } else navigate("/");
    }, [slug, navigate]);

    const deletePost = () => {
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
                <div className="w-full flex flex-col sm:flex-row justify-center mb-4 relative border rounded-xl p-2">
                    <img
                        src={appwriteService.getFilePreview(post.featuredimage)}
                        alt={post.title}
                        className="rounded-xl w-full sm:w-auto"
                    />
                </div>
                <div className="w-full mb-6 flex flex-col sm:flex-row justify-center items-center sm:justify-between">
                    <h1 className="text-xl sm:text-2xl font-bold text-center sm:text-left">{post.title}</h1>
                    {isAuthor && (
                        <div className="flex space-x-3 mt-4 sm:mt-0">
                            <Link to={`/edit-post/${post.$id}`}>
                                <button className="bg-sky-400  h-[40px] w-[90px] rounded-xl hover:bg-sky-600">Edit</button>
                            </Link>
                            <button className='bg-red-400 h-[40px] w-[90px] rounded-xl hover:bg-red-600' onClick={deletePost}>Delete</button>
                        </div>
                    )}
                </div>
                <div className="browser-css text-sm sm:text-base">
                    {parse(post.content)}
                </div>
            </Container>
        </div>
    ) : null;
}