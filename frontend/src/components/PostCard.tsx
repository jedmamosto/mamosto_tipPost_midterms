import { useState, useEffect } from 'react';
import { type Post } from '../hooks/usePosts';

interface PostCardProps {
  post: Post;
  currentUser: string | null;
  likePost: (postId: number) => Promise<void>;
  checkLiked: (postId: number, userAddress: string) => Promise<boolean>;
  isGlobalLoading: boolean;
}

export function PostCard({ post, currentUser, likePost, checkLiked, isGlobalLoading }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isTipping, setIsTipping] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    async function fetchLikedStatus() {
      if (currentUser) {
        const liked = await checkLiked(post.id, currentUser);
        setIsLiked(liked);
      }
    }
    fetchLikedStatus();
  }, [post.id, currentUser, checkLiked]);

  const handleLike = async () => {
    if (isLiked || isGlobalLoading || isTipping || !currentUser || isCreator) return;
    setIsTipping(true);
    try {
      await likePost(post.id);
      setIsLiked(true);
    } catch (e) {
      console.error('Failed to like post');
    } finally {
      setIsTipping(false);
    }
  };

  const isCreator = currentUser?.toLowerCase() === post.creator.toLowerCase();
  const truncate = (addr: string) => addr ? `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}` : '';

  return (
    <div className="card glass-panel" style={{ transition: 'transform 0.3s ease, border-color 0.3s ease' }}>
      <div className="card-header">
        <div className="avatar">
          {truncate(post.creator).substring(0, 2)}
        </div>
        <div>
          <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>Creator</div>
          <div className="mono-text" style={{ color: 'var(--secondary)', fontWeight: '600' }}>{truncate(post.creator)}</div>
        </div>
      </div>
      
      <p className="post-caption">{post.caption}</p>
      
      {!imgError ? (
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
          <img 
            src={post.imageUrl} 
            alt="Post content" 
            className="post-image" 
            onError={() => setImgError(true)}
          />
          <div style={{ 
            position: 'absolute', 
            bottom: 0, left: 0, right: 0, 
            height: '40%', 
            background: 'linear-gradient(to top, rgba(11, 15, 25, 0.8), transparent)',
            pointerEvents: 'none'
          }} />
        </div>
      ) : (
        <div className="post-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--surface-base)' }}>
          <span className="text-secondary" style={{ fontStyle: 'italic' }}>Image not available</span>
        </div>
      )}
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <button 
          className={`like-btn ${isLiked ? 'liked' : ''} ${isTipping ? 'loading' : ''}`}
          onClick={handleLike}
          disabled={isCreator || isLiked || isGlobalLoading || isTipping || !currentUser}
        >
          {isTipping ? (
            <>⏳ Processing...</>
          ) : isLiked ? (
            <>❤️ Tipp'd</>
          ) : (
            <>💖 Tip 0.0001 ETH</>
          )}
        </button>
        
        <div style={{ display: 'flex', gap: '1.25rem', padding: '0.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span className="text-secondary" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tips</span>
            <span className="mono-text" style={{ fontWeight: '800', color: 'var(--text-primary)' }}>{post.likes}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span className="text-secondary" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Earned</span>
            <span className="mono-text" style={{ fontWeight: '800', color: 'var(--success)' }}>{post.totalEarned} Ξ</span>
          </div>
        </div>
      </div>
    </div>
  );
}
