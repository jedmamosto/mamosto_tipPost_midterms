import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './useWallet';
import { useContract } from './useContract';

export interface Post {
  id: number;
  creator: string;
  imageUrl: string;
  caption: string;
  likes: number;
  totalEarned: string; // Formatted ETH
  timestamp: number;
}

export function usePosts() {
  const { account } = useWallet();
  const contract = useContract();

  const [posts, setPosts] = useState<Post[]>([]);
  const [totalEarned, setTotalEarned] = useState<string>('0.0');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!contract) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Fetch all posts
      const rawPosts = await contract.getAllPosts();
      
      const formattedPosts: Post[] = rawPosts.map((post: any) => ({
        id: Number(post.id),
        creator: post.creator,
        imageUrl: post.imageUrl,
        caption: post.caption,
        likes: Number(post.likes),
        totalEarned: ethers.formatEther(post.totalEarned),
        timestamp: Number(post.timestamp),
      }));

      // Sort posts by timestamp descending (newest first)
      setPosts(formattedPosts.sort((a, b) => b.timestamp - a.timestamp));

      // 2. Fetch total earned by user if connected
      if (account) {
        const earnedBigInt = await contract.totalEarnedByUser(account);
        setTotalEarned(ethers.formatEther(earnedBigInt));
      }
    } catch (err: any) {
      console.error('Error fetching data from contract:', err);
      setError('Failed to fetch data from the smart contract.');
    } finally {
      setLoading(false);
    }
  }, [contract, account]);

  const createPost = async (imageUrl: string, caption: string) => {
    if (!contract) {
      setError('Wallet not connected');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const tx = await contract.createPost(imageUrl, caption);
      await tx.wait(1); // Wait for 1 confirmation
      await fetchData();
    } catch (err: any) {
      console.error('Error creating post:', err);
      setError(err.reason || err.message || 'Failed to create post');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const likePost = async (postId: number) => {
    if (!contract) {
      setError('Wallet not connected');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const tx = await contract.likePost(postId, {
        value: ethers.parseEther('0.0001'),
      });
      await tx.wait(1);
      await fetchData();
    } catch (err: any) {
      console.error('Error liking post:', err);
      setError(err.reason || err.message || 'Failed to like post');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const checkLiked = async (postId: number, userAddress: string) => {
    if (!contract) return false;
    try {
      return await contract.checkLiked(postId, userAddress);
    } catch (err) {
      console.error('Error checking if liked:', err);
      return false;
    }
  };

  useEffect(() => {
    if (contract) {
      fetchData();
    }
  }, [contract, fetchData]);

  return {
    posts,
    totalEarned,
    loading,
    error,
    createPost,
    likePost,
    checkLiked,
    refreshPosts: fetchData,
  };
}
