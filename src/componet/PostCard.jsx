import React from 'react';
import appwriteService from '../appwrite/config';
import { Link } from 'react-router-dom';

function PostCard({ $id, title, featuredimage, content, showContent }) {
  const stripHTML = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  return (
    <Link to={`/post/${$id}`}>
      <div className="w-full bg-gray-100 rounded-xl p-3 sm:p-6">
        <div className="w-full flex justify-center mb-3 sm:mb-4">
          <img src={appwriteService.getFilePreview(featuredimage)} className="rounded-xl w-full h-32 sm:h-auto object-cover" alt={title} />
        </div>
       <h2 className="text-[7px]  sm:text-2xl font-bold">{title}</h2>
        {showContent && (
          <p className="text-sm sm:text-base text-gray-700">{stripHTML(content)}</p>
        )}
      </div>
    </Link>
  );
}

export default PostCard;
