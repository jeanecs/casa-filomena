"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Plus, Calendar, User } from "lucide-react";
import { toast } from "sonner";
import { PostForm } from "./PostForm";
import { Post } from "../../prisma/data/bulletin";

interface BulletinBoardProps {
  isAdmin: boolean;
}

const getPriorityTextColor = (priority: string) => {
  switch (priority) {
    case "LOW":
      return "text-green-600/70";
    case "MEDIUM":
      return "text-yellow-600/70";
    case "HIGH":
      return "text-red-600/70";
    default:
      return "text-gray-600/70";
  }
};

export function BulletinBoard({ isAdmin }: BulletinBoardProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [showNewPostForm, setShowNewPostForm] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts");
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load posts");
      }
    };
    fetchPosts();
  }, []);

  // 🔹 Handle new post submission
  const handleSubmitPost = async (postData: Omit<Post, "id" | "author" | "date">) => {
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (!res.ok) throw new Error("Failed to create post");

      const newPost: Post = await res.json();

      // Optimistically update state
      setPosts((prev) => [newPost, ...prev]);
      setShowNewPostForm(false);
      toast.success("Post published successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to publish post");
    }
  };

  return (
    <section id="bulletin" className="py-20 bg-white">
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        
        .marquee-container {
          overflow: hidden;
          width: 100%;
        }
        
        .marquee-content {
          display: flex;
          animation: marquee 150s linear infinite;
          gap: 1.5rem;
          width: max-content;
        }
        
        .marquee-content:hover {
          animation-play-state: paused;
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-yellow-800 mb-4">Resort Bulletin</h2>
          <p className="text-xl text-gray-600">
            Stay informed with the latest updates and announcements
          </p>
        </div>

        {isAdmin && (
          <div className="mb-8">
            {!showNewPostForm ? (
              <Button
                onClick={() => setShowNewPostForm(true)}
                className="w-full sm:w-auto flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Post</span>
              </Button>
            ) : (
              <PostForm
                onSubmit={handleSubmitPost}
                onCancel={() => setShowNewPostForm(false)}
              />
            )}
          </div>
        )}

        {posts.length > 0 ? (
          <div className="marquee-container">
            <div className="marquee-content">
              {[...posts, ...posts, ...posts, ...posts].map((post, index) => (
                <div
                  key={`${post.id}-${index}`}
                  className="min-w-[350px] flex-shrink-0"
                >
                  <div className="bg-white border border-gray-300 shadow-lg hover:shadow-xl transition-shadow h-full">
                    <div className="p-4">
                      <div className="flex flex-col space-y-2 mb-3">
                        <h3 className="text-lg font-bold text-yellow-800 line-clamp-2">
                          {post.title}
                        </h3>
                        <p className={`text-xs font-semibold ${getPriorityTextColor(post.priority)}`}>
                          {post.priority.charAt(0).toUpperCase() + post.priority.slice(1)}
                        </p>
                      </div>

                      <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                        {post.content}
                      </p>

                      <div className="flex items-center space-x-4 text-xs text-gray-500 border-t border-gray-200 pt-3">
                        <div className="flex items-center space-x-1">
                          <User className="w-3 h-3" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(post.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No posts yet</p>
          </div>
        )}
      </div>
    </section>
  );
}
