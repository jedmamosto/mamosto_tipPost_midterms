import { type Post } from '../hooks/usePosts';
import { PostCard } from './PostCard';

interface PostFeedProps {
  posts: Post[];
  currentUser: string | null;
  loading: boolean;
  likePost: (postId: number) => Promise<void>;
  checkLiked: (postId: number, userAddress: string) => Promise<boolean>;
}

export function PostFeed({ posts, currentUser, loading, likePost, checkLiked }: PostFeedProps) {
  if (loading && posts.length === 0) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading posts...</div>;
  }

  if (!loading && posts.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <h3 style={{ margin: 0, opacity: 0.8 }}>No posts yet</h3>
        <p style={{ opacity: 0.6 }}>Be the first to share your art!</p>
      </div>
    );
  }

  return (
    <div className="feed-grid">
      {posts.map((post) => (
        <PostCard 
          key={post.id} 
          post={post} 
          currentUser={currentUser} 
          likePost={likePost} 
          checkLiked={checkLiked} 
          isGlobalLoading={loading}
        />
      ))}
    </div>
  );
}
