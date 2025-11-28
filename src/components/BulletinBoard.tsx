"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Plus, Calendar, User } from "lucide-react";
import { toast } from "sonner";
import { PostForm } from "./PostForm";
import { Post, getPriorityColor } from "../../prisma/data/bulletin";

interface BulletinBoardProps {
  isAdmin: boolean;
}

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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

        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <CardTitle className="text-xl text-yellow-800">{post.title}</CardTitle>
                  <Badge className={getPriorityColor(post.priority)}>
                    {post.priority.charAt(0).toUpperCase() + post.priority.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{post.content}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
