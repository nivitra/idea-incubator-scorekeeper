import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/contexts/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Image, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function FeedPage() {
  const { posts, addPost, likePost, currentUser, tribes } = useApp();
  const [newPost, setNewPost] = useState("");
  const [selectedTribe, setSelectedTribe] = useState<string | undefined>();
  const [isPosting, setIsPosting] = useState(false);

  const handlePost = () => {
    if (!newPost.trim()) return;
    
    setIsPosting(true);
    setTimeout(() => {
      addPost(newPost, undefined, selectedTribe);
      setNewPost("");
      setSelectedTribe(undefined);
      setIsPosting(false);
      toast.success("Post published!");
    }, 300);
  };

  const handleLike = (postId: string) => {
    likePost(postId);
    const post = posts.find(p => p.id === postId);
    if (post && !post.likes.includes(currentUser?.id || "") && post.likes.length === 4) {
      toast.success("🎉 Post author earned +1 credit for reaching 5 likes!");
    }
  };

  const getTribeName = (tribeId: string) => {
    return tribes.find(t => t.id === tribeId)?.name || "General";
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Community Feed</h1>
        <p className="text-muted-foreground">Share updates and earn credits through engagement</p>
      </div>

      {/* Create Post */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <img
              src={currentUser?.avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${currentUser?.email}`}
              alt={currentUser?.name}
              className="h-10 w-10 rounded-full border-2 border-primary/30"
            />
            <div className="flex-1 space-y-4">
              <Textarea
                placeholder="What's happening in the community?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="min-h-[100px] resize-none bg-muted/30 border-muted"
              />
              
              {/* Tribe Selector */}
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground">Post to:</span>
                <Badge
                  variant={selectedTribe === undefined ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedTribe(undefined)}
                >
                  Global
                </Badge>
                {tribes.slice(0, 4).map(tribe => (
                  <Badge
                    key={tribe.id}
                    variant={selectedTribe === tribe.id ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedTribe(tribe.id)}
                  >
                    {tribe.icon} {tribe.name}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Image className="h-4 w-4 mr-2" />
                    Image
                  </Button>
                </div>
                <Button 
                  onClick={handlePost} 
                  disabled={!newPost.trim() || isPosting}
                  className="glow-primary"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Post
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gamification Hint */}
      <div className="flex items-center gap-2 p-4 rounded-lg bg-primary/10 border border-primary/20">
        <Sparkles className="h-5 w-5 text-primary" />
        <p className="text-sm">
          <span className="font-medium">Pro tip:</span> Posts that get 5+ likes earn their author +1 credit!
        </p>
      </div>

      {/* Posts */}
      <AnimatePresence mode="popLayout">
        {posts.map((post, index) => {
          const hasLiked = currentUser ? post.likes.includes(currentUser.id) : false;
          const tribe = post.tribeId ? tribes.find(t => t.id === post.tribeId) : null;

          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="post-card">
                <CardContent className="p-5">
                  {/* Post Header */}
                  <div className="flex items-start gap-4">
                    <img
                      src={post.authorAvatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${post.authorId}`}
                      alt={post.authorName}
                      className="h-10 w-10 rounded-full border-2 border-muted"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold">{post.authorName}</span>
                        {tribe && (
                          <Badge variant="secondary" className="text-xs">
                            {tribe.icon} {tribe.name}
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {/* Post Content */}
                      <p className="mt-3 text-foreground leading-relaxed">{post.content}</p>

                      {/* Post Image */}
                      {post.imageUrl && (
                        <img
                          src={post.imageUrl}
                          alt="Post attachment"
                          className="mt-4 rounded-lg w-full object-cover max-h-80"
                        />
                      )}

                      {/* Post Actions */}
                      <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border">
                        <button
                          onClick={() => handleLike(post.id)}
                          className={cn(
                            "flex items-center gap-2 transition-colors",
                            hasLiked ? "text-destructive" : "text-muted-foreground hover:text-destructive"
                          )}
                        >
                          <Heart className={cn("h-5 w-5", hasLiked && "fill-current")} />
                          <span className="text-sm">{post.likes.length}</span>
                        </button>
                        <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                          <MessageCircle className="h-5 w-5" />
                          <span className="text-sm">Reply</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
