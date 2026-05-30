import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FeedSidebar from '../components/FeedSidebar';
import PostCard from '../components/PostCard';
import api from '../api/axios';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        // Assuming backend has GET /api/posts/:id
        const { data } = await api.get(`/posts/${id}`);
        setPost(data.data);
      } catch (err) {
        console.error('Failed to fetch post', err);
        setError('Post not found or an error occurred.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  return (
    <div className="min-h-screen bg-brand-background">
      <FeedSidebar />
      <Navbar />
      <main className="ml-20 pt-14 flex min-h-screen justify-center">
        <section className="flex-1 max-w-2xl px-6 py-6">
          <div className="mb-6">
            <button 
              onClick={() => navigate(-1)} 
              className="text-brand-primary hover:underline text-sm font-semibold"
            >
              &larr; Back
            </button>
          </div>
          
          {loading ? (
            <div className="flex justify-center p-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-primary"></div>
            </div>
          ) : error ? (
            <div className="bg-brand-surface border border-brand-border rounded-xl p-8 text-center">
              <p className="text-brand-muted">{error}</p>
              <button 
                onClick={() => navigate('/home')}
                className="mt-4 px-4 py-2 bg-brand-primary text-brand-text rounded-full hover:bg-brand-primaryHover transition-colors"
              >
                Go Home
              </button>
            </div>
          ) : post ? (
            <PostCard post={post} />
          ) : null}
        </section>
      </main>
    </div>
  );
};

export default PostDetail;
