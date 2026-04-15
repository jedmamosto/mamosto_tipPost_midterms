import React, { useState } from 'react';

interface CreatePostProps {
  createPost: (imageUrl: string, caption: string) => Promise<void>;
  isGlobalLoading: boolean;
  globalError: string | null;
}

export function CreatePost({ createPost, isGlobalLoading, globalError }: CreatePostProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim() || !caption.trim()) return;

    try {
      await createPost(imageUrl, caption);
      setImageUrl('');
      setCaption('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="card glass-panel">
      <h3 className="text-gradient" style={{ margin: '0 0 1.25rem 0', fontSize: '1.5rem' }}>Share your art</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <input 
          type="text" 
          placeholder="Image URL (e.g. https://...)" 
          className="form-input" 
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          disabled={isGlobalLoading}
        />
        <textarea 
          placeholder="What's the story behind this piece?" 
          className="form-input" 
          style={{ minHeight: '100px', resize: 'vertical' }}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          disabled={isGlobalLoading}
        />
        
        {globalError && (
          <div className="alert-error" style={{ marginBottom: '1rem' }}>
            {globalError}
          </div>
        )}
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <button type="submit" className="btn-primary" disabled={isGlobalLoading || !imageUrl || !caption}>
            {isGlobalLoading ? 'Posting...' : 'Post Artwork'}
          </button>
        </div>
      </form>
    </div>
  );
}
