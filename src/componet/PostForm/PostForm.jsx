import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, RTE, Input, Select } from '../Index';
import appwriteService from '../../appwrite/config';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, getValues, control } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.slug || "",
            content: post?.content || "",
            status: post?.status || "active",
        }
    });
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");

    const submit = async (data) => {
        if (!data.slug.trim()) {
            setMessage("Slug must be entered to update or submit.");
            return;
        }
        setMessage("");
        setPopupMessage(post ? "Updating post..." : "Adding post...");
        setShowPopup(true);

        let file = null;
        if (data.image?.[0]) {
            file = await appwriteService.uploadFile(data.image[0]);
            if (file && post?.featuredimage) {
                await appwriteService.deleteFile(post.featuredimage);
            }
        }
        if (post) {
            const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;
            if (file) {
                await appwriteService.deleteFile(post.featuredimage);
            }
            const dbPost = await appwriteService.updatePost(post.$id, {
                ...data,
                featuredimage: file ? file.$id : undefined
            });
            if (dbPost) {
                navigate(`/post/${dbPost.$id}`);
            }
        } else {
            if (file) {
                const fileId = file.$id;
                data.featuredimage = fileId;
            }
            const dbPost = await appwriteService.createPost({
                ...data,
                userId: userData.$id,
            });
            if (dbPost) {
                navigate(`/post/${dbPost.$id}`);
            }
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string") {
            return value
                .trim()
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^\w-]+/g, '');
        }
        return '';
    }, []);

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === 'title') {
                setValue('slug', slugTransform(value.title, { shouldValidate: true }));
            }
        });
        return () => {
            subscription.unsubscribe();
        };
    }, [watch, slugTransform, setValue]);

    return (
        <>
            <form onSubmit={handleSubmit(submit)} className="flex flex-wrap md:flex-nowrap">
                {message && <p className="text-red-500 mb-2">{message}</p>}
                <div className="w-full md:w-1/3 px-2">
                    <Input
                        label="Featured Image :"
                        type="file"
                        className="mb-4"
                        accept="image/png, image/jpg, image/jpeg, image/gif"
                        {...register("image", { required: !post })}
                    />
                    <Select
                        options={["active", "inactive"]}
                        label="Status"
                        className="mb-4"
                        {...register("status", { required: true })}
                    />
                </div>
                <div className="w-full md:w-2/3 px-2">
                    <Input
                        label="Title :"
                        placeholder="Title"
                        className="mb-4"
                        {...register("title", { required: true })}
                    />
                    <Input
                        label="Slug :"
                        placeholder="Slug"
                        className="mb-4"
                        {...register("slug", { required: true })}
                        onInput={(e) => {
                            setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                        }}
                    />
                    <RTE label="Content : (Description is maximum 25 letters)" name="content" control={control} defaultValue={getValues("content")} />
                    {post && (
                        <div className="w-full mb-4">
                            <img
                                src={appwriteService.getFilePreview(post.featuredimage)}
                                alt={post.title}
                                className="rounded-lg w-full h-auto"
                            />
                        </div>
                    )}
                    <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className=" mt-5 w-full md:w-[80px] bg-[#99582a] text-black hover:bg-[#bc6c25]">
                        {post ? "Update" : "Submit"}
                    </Button>
                </div>
            </form>
            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <p className="mb-4">{popupMessage}</p>
                    </div>
                </div>
            )}
        </>
    );
}

export default PostForm;

