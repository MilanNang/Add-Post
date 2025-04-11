import conf from "../conf/conf";
import {ID,Client,Databases,Storage,Query } from "appwrite";



export class Service{
    
    client=new Client();
    databases;
    bucket;
   
    constructor(){
       
        this.client
                    .setEndpoint(conf.appwriteUrl)
                    .setProject(conf.appwriteProjectId);

        this.databases=new Databases(this.client);
        this.bucket=new Storage(this.client);
    }

    async createPost({title, slug, content, featuredimage, status, userId}){
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredimage,
                    status,
                    userId,
                }
            )
        } catch (error) {
            console.log("Appwrite serive :: createPost :: error", error);
        }
    }

 

    
    

    async updatePost(slug,{title,content,featuredimage,status}){
            try {
                return await this.databases.updateDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionId,
                    slug,
                    {
                        title,
                        content,
                        featuredimage,
                        status,
                    }

                )
            } catch (error) {
                console.log("Appwrite servies :: updatePost :: error",error);
            }

    }
    async deletePost(slug){
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
            )
            return true;
        } catch (error) {
            console.log("Appwrite servies :: deletePost :: error",error);
            return false;
        }
    }
    async getPost(slug){
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            )
        } catch (error) {
            console.log("Appwrite servies :: getpost :: error",error);
        }
    }
    async getPosts(queries=[Query.equal("status","active")]){
         try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries,
            )
         } catch (error) {
            console.log("Appwrite servies :: getPosts :: error",error);
            return false;
         }
    }

    //file aplode services
    
        
    
    async uploadFile(file){
        try {   
             
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file,
                
                

            )
             
        }
        
        catch (error) {
            console.log("Appwrite servies :: uploadFile :: error",error);
            return false;
        }
    }
    
    

    async deleteFile(fileId){
        try {
            
            console.log(fileId);
             await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
               
             )
             console.log(fileId);
             return true
        } catch (error) {
            console.log("Appwrite servies :: deleteFile :: error",error);
            return false;
        }
    }
    
    getFileView(fileId){
        
        return this.bucket.getFileView(
            conf.appwriteBucketId,
            fileId
        )
        
        
    }
    async likefile(fileId){
        try{
            this.bucket.getFileView(fileId,true);
        }
        catch(error){
            console.log(error);
            return false;
            
        }
    }

    async updateLikes(postId, likedBy) {
        try {
            const likes = likedBy.length;
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                postId,
                { likes, likedBy }
            );
        } catch (error) {
            console.log("Appwrite services :: updateLikes :: error", error);
        }
    }
    
    


}

const service=new Service();
export default service 




