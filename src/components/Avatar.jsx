import { useState } from "react";

const Avatar = ({ avatarUrl, external = false }) => {
  const [imgLoading, setImgLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const placeholder = "Portrait_Placeholder.png";
  const CDN_URL = import.meta.env.VITE_CDN_URL;
  var link;

  if (!external) {
    link = CDN_URL + "/" + avatarUrl;
  } else {
    link = avatarUrl;
  }

  if (!avatarUrl || imgError) {
    link = CDN_URL + "/" + placeholder;
  }

  return (
    <div className="avatar">
      <div className="w-10 rounded">
        {imgLoading && <div className="skeleton h-10 w-10" />}

        <img
          src={link}
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