import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const fetchPosts = async (filterData) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/posts`, {
      params: {
        search: filterData.search,
        by: filterData.by,
        designer: filterData.designer,
        recommended: filterData.recommended || false,
        schems: filterData.schems || false,
        wdl: filterData.wdl || false,
        category: filterData.category,
        subcategory: filterData.subcategory,
        with_tags: filterData.tags.with.join(","),
        without_tags: filterData.tags.without.join(","),
        version: filterData.version,
        sort: filterData.sort,
        page: filterData.page
      }
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch posts");
    }
    
    console.log(response.data.data);
    return response.data.data;
  } catch (err) {
    const errMsg = err.response?.data?.message || err.message || "An error occured";
    const errorData = err.response?.data;
    console.log(err);
    throw new Error(errMsg);
  }
};

const fetchPost = async (postId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/posts/${postId}`);

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch post");
    }
    
    console.log(response.data.data);
    return response.data.data;
  } catch (err) {
    const errMsg = err.response?.data?.message || err.message || "An error occured";
    const errorData = err.response?.data;
    console.log(errorData?.message);
    throw new Error(errMsg);
  }
};

const fetchDownloads = async (postId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/posts/downloads/${postId}`);

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch post");
    }
    
    console.log(response.data.data);
    return response.data.data;
  } catch (err) {
    const errMsg = err.response?.data?.message || err.message || "An error occured";
    const errorData = err.response?.data;
    console.log(errorData?.message);
    throw new Error(errMsg);
  }
};

const fetchDashboard = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/posts/dashboard`);

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch posts");
    }

    console.log(response.data.data);
    return response.data.data;
  } catch (err) {
    const errMsg = err.response?.data?.message || err.message || "An error occured";
    const errorData = err.response?.data;
    console.log(err);
    throw new Error(errMsg);
  }
};

const createPost = async (postData) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/posts`, postData);

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to create post");
    }
    
    return response.data.data;
    
  } catch (err) {
    const errMsg = err.response?.data?.message || err.message || "An error occured";
    const errorData = err.response?.data;
    console.log(errorData?.message);
    throw new Error(errMsg);
  }
};

const createPostTranslation = async ({ postId, translationData }) => {
  try {
    console.log(translationData);
    const response = await axios.post(`${BASE_URL}/api/posts/${postId}`, translationData);

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to create post translation");
    }
    
    return response.data.data;

  } catch (err) {
    const errMsg = err.response?.data?.message || err.message || "An error occured";
    const errorData = err.response?.data;
    console.log(errorData?.message);
    throw new Error(errMsg);
  }
};

const updatePost = async (postData) => {
  try {
    const response = await axios.put(`${BASE_URL}/api/posts/${postData.get("post_id")}`, postData);

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to update post");
    }
    
    return response.data.data;

  } catch (err) {
    const errMsg = err.response?.data?.message || err.message || "An error occured";
    const errorData = err.response?.data;
    console.log(errorData?.message);
    throw new Error(errMsg);
  }
};

const updatePostTranslation = async ({ postId, lang, translationData }) => {
  try {
    const response = await axios.put(`${BASE_URL}/api/posts/${postId}/translations/${lang}`, translationData);

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to update post translation");
    }
    
    return response.data.data;

  } catch (err) {
    const errMsg = err.response?.data?.message || err.message || "An error occured";
    const errorData = err.response?.data;
    console.log(errorData?.message);
    throw new Error(errMsg);
  }
};



export const useFetchPosts = (filterData) => {
  return useQuery({
    queryKey: ["posts", filterData],
    queryFn: () => fetchPosts(filterData),
    keepPreviousData: true
  });
};

export const useFetchPost = (postId) => {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: () => fetchPost(postId),
    enabled: !!postId
  });
};

export const useFetchDownloads = (postId) => {
  return useQuery({
    queryKey: ["downloads", postId],
    queryFn: () => fetchDownloads(postId),
    enabled: false
  });
};

export const useFetchDashboard = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: () => fetchDashboard()
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createPost,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      console.error("Post creation failed:", error.message);
    }
  });
};

export const useCreatePostTranslation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPostTranslation,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      console.error("Post completion failed:", error.message);
    }
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePost,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post'] });
    },
    onError: (error) => {
      console.error("Post update failed:", error.message);
    }
  });
};

export const useUpdatePostTranslation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePostTranslation,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post'] });
    },
    onError: (error) => {
      console.error("Post translation update failed:", error.message);
    }
  });
};

export const useVote = (postId) => {
  const queryClient = useQueryClient();
  console.log("Exectuted0");

  return useMutation({
    mutationFn: (vote) => axios.post(`${BASE_URL}/api/vote/${postId}/vote`, { vote }).then(r => r.data),
    onMutate: async (newVote) => {
      await queryClient.cancelQueries(["post", postId]);
      await queryClient.cancelQueries(["posts"]);

      const previousPost = queryClient.getQueryData(["post", postId]);
      const previousPosts = queryClient.getQueryData(["posts"]);

      const prevUserVote = previousPost?.vote ?? 0;
      const prevCached = previousPost?.cached_vote_count ?? 0;

      let delta = 0;
      if (prevUserVote === newVote) {
        delta = -newVote;
      } else if (prevUserVote === 0) {
        delta = newVote;
      } else {
        delta = newVote - prevUserVote;
      }

      if (previousPost) {
        queryClient.setQueryData(["post", postId], old => ({
          ...old,
          vote: prevUserVote === newVote ? 0 : newVote,
          cached_vote_count: old.cached_vote_count + delta
        }));
      }

      if (previousPosts) {
        queryClient.setQueryData(["posts"], old => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map(p =>
              p.id === postId ? { ...p, cached_vote_count: p.cached_vote_count + delta} : p
            )
          };
        });
      }

      return { previousPost, previousPosts };
    },

    onError: (err, newVote, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(["post", postId], context.previousPost);
      }
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries(["post", postId]);
      queryClient.invalidateQueries(["posts"]);
    }
  });
};