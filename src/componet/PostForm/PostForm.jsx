import React, { useCallback ,useEffect} from 'react'
import {useForm} from 'react-hook-form'
import {Button,RTE,Input,Select} from '../Index'
import appwriteService from '../../appwrite/config'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function PostForm({post}) {

    const {register,handleSubmit,watch,setValue,getValues,control}=useForm({
        defaultValues:{
            title:post?.title||"",
            slug:post?.slug||"",
            content:post?.content||"",
            status:post?.status||"active",

        }
    });
    const navigate=useNavigate()
    const userData=useSelector((state)=>state.auth.userData)

    const submit= async(data)=>{
        let file=null
        if(data.image?.[0]){
          file=await appwriteService.uploadFile(data.image[0]);
          if(file && post?.featuredimage){
            await appwriteService.deleteFile(post.featuredimage);
          }
        }
        if(post){

          const file=data.image[0]? appwriteService.uploadFile(data.image[0]):null
            if(file){
                appwriteService.deleteFile(post.featuredimage)
            }
            const dbPost=await appwriteService.updatePost(post.$id,{
                ...data,
                featuredimage:file?file.$id : undefined
            })
            if(dbPost){
              navigate(`/post/${dbPost.$id}`)
            }
        
        }else{
         

            if(file){
              
                const fileId = file.$id;
                data.featuredimage = fileId;

               const dbPost= await appwriteService.createPost({
                    ...data,
                    userId:userData.$id,

                })
                if(dbPost){
                   // navigate(`/post/${dbPost.$id}`)
                   navigate(`/post/${dbPost.$id}`);
                }
            }
        }
    }

    const slugTransform=useCallback((value)=>{

        if(value && typeof value==="string"){
            return value
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '-')    // Replace spaces with dashes
            .replace(/[^\w-]+/g, '');
        

        }
        return ''

    },[])
   
    React.useEffect(()=>{

        const subscription=watch((value,{name})=>{

            if(name==='title'){
                setValue('slug',slugTransform(value.title,{shouldValidate:true}))
            }
        })
        return()=>{
            subscription.unsubscribe()
        }

    },[watch,slugTransform,setValue])

return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
    <div className="w-2/3 px-2">
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
        <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
    </div>
    <div className="w-1/3 px-2">
        <Input
            label="Featured Image :"
            type="file"
            className="mb-4"
            accept="image/png, image/jpg, image/jpeg, image/gif"
            {...register("image", { required: !post })}
        />
        {post && (
            <div className="w-full mb-4">
                <img
                    src={appwriteService.getFilePreview(post.featuredimage)}
                    alt={post.title}
                    className="rounded-lg"
                />
            </div>
        )}
        <Select
            options={["active", "inactive"]}
            label="Status"
            className="mb-4"
            {...register("status", { required: true })}
        />
        <Button  type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-[80px] bg-[#99582a] text-black hover:bg-[#bc6c25]">
            {post ? "Update" : "Submit"}
        </Button>
    </div>
</form>
  )
}

export default PostForm 