"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { Post } from "../../prisma/data/bulletin";

interface PostFormProps {
  onSubmit: (post: Omit<Post, 'id' | 'author' | 'date'>) => void;
  onCancel: () => void;
}
export function PostForm({ onCancel, onSubmit }: PostFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "LOW" as Post["priority"],
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("⚠️ Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to publish post");
      }

      toast.success("✅ Post published!");
      setFormData({ title: "", content: "", priority: "LOW" });

      onSubmit(formData);
    } catch (err) {
      console.error(err);
      toast.error("❌ Something went wrong while publishing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Post</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Post title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              disabled={loading}
            />
          </div>
          <div>
            <Textarea
              placeholder="Post content"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              rows={4}
              disabled={loading}
            />
          </div>
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium">Priority:</label>
            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  priority: e.target.value as Post["priority"],
                })
              }
              className="px-3 py-1 border border-gray-300 rounded-md"
              disabled={loading}
            >
              <option value="LOW">Normal</option>
              <option value="MEDIUM">Important</option>
              <option value="HIGH">Urgent</option>
            </select>
          </div>
          <div className="flex space-x-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Publishing..." : "Publish Post"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
