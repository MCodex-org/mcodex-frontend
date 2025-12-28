import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ProfileCard } from "../components/ProfileComponents";
import { Pagination, PostGrid } from "../components/PostComponents";
import { useFetchPosts } from "../hooks/usePosts";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const ProfilePage = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/profiles/u/${username}`);
        setProfile(res.data.data);
        setFilterData((prev) => ({ ...prev, designer: res.data.data.id }));
      } catch (err) {
        console.log(err);
        setError("Profile not found", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  const [filterData, setFilterData] = useState({
    tags: {
      with: [],
      without: []
    },
    page: 1
  });

  const { data: posts, isPending } = useFetchPosts(filterData);

  if (loading || isPending) return <span className="loading loading-spinner" />;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <ProfileCard profile={profile} postCount={posts?.[0]?.count || 0} />
      <PostGrid posts={posts} isPending={isPending} />
      { posts?.[0]?.count !== undefined && <Pagination filterData={filterData} setFilterData={setFilterData} totalPageCount={Math.ceil(posts?.[0].count / 50)} /> }
    </div>
  );
};

export default ProfilePage;