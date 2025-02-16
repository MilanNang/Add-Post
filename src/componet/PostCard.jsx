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
      <div className="w-full bg-gray-100 rounded-xl p-4 sm:p-6">
        <div className="w-full justify-center mb-4">
          <img src={appwriteService.getFilePreview(featuredimage)} className="rounded-xl" alt={title} />
        </div>
        <h2 className="text-xl font-bold sm:text-2xl">{title}</h2>
        {showContent && (
          <p className="text-sm sm:text-base text-gray-700">{stripHTML(content)}</p>
        )}
      </div>
    </Link>
  );
}

export default PostCard;