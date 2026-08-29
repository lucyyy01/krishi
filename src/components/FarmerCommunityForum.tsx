import React, { useState } from 'react';
import { FarmerProfile, Language, CommunityPost } from '../types';
import { translations } from '../data/translations';
import { initialCommunityPosts } from '../data/communityData';
import { 
  Users, 
  ThumbsUp, 
  PlusCircle, 
  Search, 
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FarmerCommunityForumProps {
  currentFarmer: FarmerProfile;
  currentLanguage: Language;
}

export const FarmerCommunityForum: React.FC<FarmerCommunityForumProps> = ({
  currentFarmer,
  currentLanguage
}) => {
  const t = translations[currentLanguage] || translations.en;
  const [posts, setPosts] = useState<CommunityPost[]>(initialCommunityPosts);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyInput, setReplyInput] = useState<Record<string, string>>({});
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);

  // New post state
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<'question' | 'buy_sell_equipment' | 'success_story'>('question');
  const [newPrice, setNewPrice] = useState('');

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          upvotes: p.upvotes + 1,
          hasUpvoted: true
        };
      }
      return p;
    }));
  };

  const handleSendReply = (postId: string) => {
    const text = replyInput[postId]?.trim();
    if (!text) return;

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const existingComments = p.comments || [];
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [
            ...existingComments,
            {
              id: `c-${Date.now()}`,
              author: currentFarmer.name,
              role: 'Farmer' as const,
              text: text,
              timestamp: 'Just now'
            }
          ]
        };
      }
      return p;
    }));

    setReplyInput(prev => ({ ...prev, [postId]: '' }));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const created: CommunityPost = {
      id: `post-${Date.now()}`,
      authorName: currentFarmer.name,
      authorAvatar: currentFarmer.avatar,
      authorLocation: `${currentFarmer.village}, ${currentFarmer.district}`,
      authorRole: 'Farmer',
      timestamp: 'Just now',
      cropTag: currentFarmer.crop,
      category: newCategory,
      title: newTitle,
      content: newContent,
      equipmentPrice: newPrice ? `₹${parseInt(newPrice).toLocaleString()}` : undefined,
      upvotes: 1,
      hasUpvoted: true,
      commentsCount: 0,
      comments: []
    };

    setPosts([created, ...posts]);
    setIsNewPostModalOpen(false);
    setNewTitle('');
    setNewContent('');
    setNewPrice('');
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === 'ALL' || post.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.authorLocation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border border-emerald-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] sm:text-xs font-black uppercase tracking-wider mb-1.5">
              <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              {t.communityForum}
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
              {t.communityForum}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200/90 font-medium max-w-2xl mt-1">
              {t.communityDesc}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setIsNewPostModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.newPost}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'ALL', label: t.allDiscussions },
            { id: 'question', label: t.farmerQueries },
            { id: 'buy_sell_equipment', label: t.usedMachinery },
            { id: 'success_story', label: t.successStories }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
                activeCategory === tab.id
                  ? 'bg-emerald-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 font-semibold"
          />
        </div>
      </div>

      {/* Posts Stream */}
      <div className="space-y-3 sm:space-y-4">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-6 space-y-3 shadow-md hover:shadow-lg transition-all"
          >
            {/* Post Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-lg flex-shrink-0">
                  {post.authorAvatar || '👨🏽‍🌾'}
                </div>
                <div>
                  <div className="font-black text-slate-900 text-sm">{post.authorName}</div>
                  <div className="text-[11px] text-slate-500">
                    📍 {post.authorLocation} • {post.timestamp}
                  </div>
                </div>
              </div>

              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase flex-shrink-0">
                {post.category === 'buy_sell_equipment' ? t.usedMachinery : post.category === 'question' ? t.farmerQueries : t.successStories}
              </span>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <h3 className="font-black text-base sm:text-lg text-slate-900">{post.title}</h3>
              <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">{post.content}</p>

              {/* Machinery Sale Card */}
              {post.category === 'buy_sell_equipment' && post.equipmentPrice && (
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-800 block">{t.askingPrice}:</span>
                    <span className="text-base sm:text-lg font-black text-amber-950 font-mono">{post.equipmentPrice}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Replies and Upvotes */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
              <button
                onClick={() => handleLike(post.id)}
                className="flex items-center gap-1.5 text-slate-700 hover:text-emerald-800 font-bold bg-slate-100 hover:bg-emerald-50 px-3 py-1.5 rounded-xl transition-all"
              >
                <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>{post.upvotes} {t.upvotes}</span>
              </button>

              <span className="text-slate-500 font-bold">{post.commentsCount} {t.replies}</span>
            </div>

            {/* Existing Comments List */}
            {post.comments && post.comments.length > 0 && (
              <div className="space-y-2 pt-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                {post.comments.map((comment: any) => (
                  <div key={comment.id} className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-slate-900 flex items-center gap-1">
                        {comment.author}
                        {comment.isExpertReply && (
                          <span className="text-[9px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded-full font-bold">
                            ✓ Verified Expert
                          </span>
                        )}
                      </span>
                      <span className="text-[10px] text-slate-400">{comment.timestamp}</span>
                    </div>
                    <p className="text-slate-700 font-medium">{comment.text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Reply Input Box */}
            <div className="pt-1 flex items-center gap-2">
              <input
                type="text"
                placeholder={t.replyPlaceholder}
                value={replyInput[post.id] || ''}
                onChange={(e) => setReplyInput(prev => ({ ...prev, [post.id]: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendReply(post.id);
                }}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={() => handleSendReply(post.id)}
                className="p-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white shadow"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Modal: New Post */}
      {isNewPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border space-y-4">
            <h3 className="text-lg font-black text-slate-900">{t.newPost}</h3>

            <form onSubmit={handleCreatePost} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Category:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                >
                  <option value="question">❓ Farmer Query (किसान सवाल)</option>
                  <option value="buy_sell_equipment">🚜 Used Equipment Ad (पुराना यंत्र बाजार)</option>
                  <option value="success_story">🏆 Success Story (सफलता की कहानी)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Title:</label>
                <input
                  type="text"
                  placeholder="e.g. Cotton square dropping issue / Old 50HP Rotavator for sale"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold"
                  required
                />
              </div>

              {newCategory === 'buy_sell_equipment' && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">{t.askingPrice} (₹):</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl font-mono"
                    required
                  />
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description / Details:</label>
                <textarea
                  rows={3}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  required
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewPostModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 font-black text-white shadow"
                >
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
