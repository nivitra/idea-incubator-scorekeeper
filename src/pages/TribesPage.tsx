import React, { useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TribesPage() {
  const { tribes, posts } = useApp();
  const [selectedTribe, setSelectedTribe] = useState<string | null>(null);

  const tribePosts = selectedTribe 
    ? posts.filter(p => p.tribeId === selectedTribe)
    : [];

  const selectedTribeData = tribes.find(t => t.id === selectedTribe);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Tribes</h1>
        <p className="text-muted-foreground">Join communities and connect with peers</p>
      </div>

      {/* Tribes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tribes.map((tribe, index) => (
          <motion.div
            key={tribe.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={cn(
                "tribe-card",
                selectedTribe === tribe.id && "neon-border"
              )}
              onClick={() => setSelectedTribe(tribe.id === selectedTribe ? null : tribe.id)}
            >
              <CardContent className="p-6">
                <div className={cn(
                  "h-16 w-16 rounded-2xl flex items-center justify-center text-3xl mb-4 bg-gradient-to-br",
                  tribe.color
                )}>
                  {tribe.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{tribe.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{tribe.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {tribe.memberCount} members
                  </div>
                  <Button variant="ghost" size="sm">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Selected Tribe Posts */}
      {selectedTribe && selectedTribeData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <span className="text-2xl">{selectedTribeData.icon}</span>
                {selectedTribeData.name} Feed
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tribePosts.length > 0 ? (
                <div className="space-y-4">
                  {tribePosts.map(post => (
                    <div 
                      key={post.id}
                      className="p-4 rounded-lg bg-muted/30 border border-border"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={post.authorAvatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${post.authorId}`}
                          alt={post.authorName}
                          className="h-8 w-8 rounded-full"
                        />
                        <div>
                          <p className="font-medium text-sm">{post.authorName}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm">{post.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No posts in this tribe yet.</p>
                  <p className="text-sm">Be the first to share something!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
