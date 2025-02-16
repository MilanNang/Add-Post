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
      <div className="w-full bg-gray-100 rounded-lg p-3 sm:p-4">
        <div className="w-full mb-3">
          <img
            src={appwriteService.getFilePreview(featuredimage)}
            className="rounded-lg w-full h-32 sm:h-40 object-cover"
            alt={title}
          />
        </div>
        <h2 className="text-sm sm:text-lg font-semibold sm:font-bold truncate">
          {title}
        </h2>
        {showContent && (
          <p className="text-xs sm:text-sm text-gray-700">{stripHTML(content)}</p>
        )}
      </div>
    </Link>
  );
}

export default PostCard;
