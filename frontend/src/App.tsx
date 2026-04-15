import { useWallet } from './hooks/useWallet';
import { usePosts } from './hooks/usePosts';
import { ConnectWallet } from './components/ConnectWallet';
import { CreatePost } from './components/CreatePost';
import { PostFeed } from './components/PostFeed';
import { Earnings } from './components/Earnings';
import './index.css';

function App() {
  const { account } = useWallet();
  const { posts, totalEarned, loading, error, createPost, likePost, checkLiked } = usePosts();

  return (
    <div className="app-container">
      <ConnectWallet />
      
      {account ? (
        <div className="app-grid">
          {error && (
            <div className="alert-error">
              <strong>⚠️ Error:</strong> {error}
            </div>
          )}
          
          <div className="main-content-grid">
            <div className="column-flex">
              <Earnings totalEarned={totalEarned} />
              <CreatePost 
                createPost={createPost} 
                isGlobalLoading={loading} 
                globalError={error} 
              />
            </div>
            
            <div className="column-flex">
              <h2 className="text-gradient" style={{ borderBottom: '1px solid var(--surface-border)', paddingBottom: '1rem' }}>
                Recent Feed
              </h2>
              <PostFeed 
                posts={posts} 
                currentUser={account} 
                loading={loading} 
                likePost={likePost}
                checkLiked={checkLiked}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="card glass-panel" style={{ textAlign: 'center', padding: '5rem 2rem', marginTop: '3rem', maxWidth: '800px', margin: '3rem auto' }}>
          <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>
            Welcome to TipPost
          </h1>
          <p className="text-secondary" style={{ fontSize: '1.25rem', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
            A decentralized social platform tailored for creators. Connect your web3 wallet to start sharing art, expressing ideas, and earning crypto directly from your community.
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
