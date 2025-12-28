import { useState } from "react";

const Avatar = ({ avatarUrl }) => {
  const [imgLoading, setImgLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const placeholder = "Portrait_Placeholder.png";
  const CDN_URL = import.meta.env.VITE_CDN_URL;

  if (!avatarUrl || imgError) {
    avatarUrl = placeholder;
  }

  return (
    <div className="avatar">
      <div className="w-10 rounded">
        {imgLoading && <div className="skeleton h-10 w-10" />}

        <img
          src={`${CDN_URL}/${avatarUrl}`}
          alt="profile"
          style={imgLoading ? { visibility: "hidden" } : { visibility: "visible" }}
          onLoad={() => setImgLoading(false)}
          onError={() => setImgError(true)}
        />

      </div>
    </div>
  );
};

export default Avatar;