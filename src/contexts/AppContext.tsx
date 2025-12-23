import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Types
export type UserRole = "leader" | "member";
export type UserStatus = "active" | "soft-disabled" | "disabled";
export type ApprovalState = "pending" | "approved" | "rejected";

export interface CreditTransaction {
  ts: string;
  amount: number;
  reason: string;
  by: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  credits: number;
  status: UserStatus;
  joinDate: string;
  avatarUrl: string;
  position: string;
  minThreshold?: number;
  softDisabled: boolean;
  suspensionReason: string;
  approvalState: ApprovalState;
  history: CreditTransaction[];
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  imageUrl?: string;
  likes: string[]; // user IDs
  tribeId?: string;
  createdAt: string;
}

export interface Tribe {
  id: string;
  name: string;
  description: string;
  icon: string;
  memberCount: number;
  color: string;
}

interface AppContextType {
  // User state
  currentUser: User | null;
  users: User[];
  isAuthenticated: boolean;
  isLeader: boolean;
  
  // Auth actions
  login: (email: string, password: string, role: UserRole) => boolean;
  signup: (name: string, email: string, password: string, position: string) => boolean;
  logout: () => void;
  
  // Credit actions
  updateCredits: (userId: string, amount: number, reason: string) => void;
  
  // Posts
  posts: Post[];
  addPost: (content: string, imageUrl?: string, tribeId?: string) => void;
  likePost: (postId: string) => void;
  
  // Tribes
  tribes: Tribe[];
  
  // Config
  globalThreshold: number;
  warnBuffer: number;
  setGlobalThreshold: (v: number) => void;
}

const AppContext = createContext<AppContextType | null>(null);

// Initial data
const INITIAL_USERS: User[] = [
  {
    id: "u1",
    name: "Priya Kapoor",
    email: "priya@mgit.ac.in",
    role: "leader",
    credits: 85,
    status: "active",
    joinDate: "2023-06-01",
    avatarUrl: "",
    position: "Club President",
    softDisabled: false,
    suspensionReason: "",
    approvalState: "approved",
    history: [
      { ts: "2024-06-15T10:01:00Z", amount: 50, reason: "Initial grant", by: "SYSTEM" },
      { ts: "2024-06-20T09:12:00Z", amount: 20, reason: "Organized AI Workshop", by: "SYSTEM" },
      { ts: "2024-06-25T14:30:00Z", amount: 15, reason: "Hackathon Winner", by: "SYSTEM" },
    ],
  },
  {
    id: "u2",
    name: "Aman Verma",
    email: "aman@mgit.ac.in",
    role: "member",
    credits: 42,
    status: "active",
    joinDate: "2023-11-15",
    avatarUrl: "",
    position: "Tech Lead",
    softDisabled: false,
    suspensionReason: "",
    approvalState: "approved",
    history: [
      { ts: "2024-06-10T12:00:00Z", amount: 20, reason: "Welcome bonus", by: "SYSTEM" },
      { ts: "2024-06-18T16:45:00Z", amount: 12, reason: "Event Attendance", by: "Priya Kapoor" },
      { ts: "2024-06-22T10:00:00Z", amount: 10, reason: "Blog Post Published", by: "SYSTEM" },
    ],
  },
  {
    id: "u3",
    name: "Saina Reddy",
    email: "saina@mgit.ac.in",
    role: "member",
    credits: 8,
    status: "soft-disabled",
    joinDate: "2022-12-22",
    avatarUrl: "",
    position: "Senior Member",
    softDisabled: true,
    suspensionReason: "",
    approvalState: "approved",
    history: [
      { ts: "2024-06-01T15:35:00Z", amount: 30, reason: "Annual grant", by: "Priya Kapoor" },
      { ts: "2024-06-14T09:14:00Z", amount: -15, reason: "Absence penalty", by: "Priya Kapoor" },
      { ts: "2024-06-20T12:00:00Z", amount: -7, reason: "Missed deadline", by: "Priya Kapoor" },
    ],
  },
  {
    id: "u4",
    name: "Raj Patel",
    email: "raj@mgit.ac.in",
    role: "member",
    credits: -2,
    status: "disabled",
    joinDate: "2023-03-10",
    avatarUrl: "",
    position: "Developer",
    softDisabled: false,
    suspensionReason: "Multiple missed meetings",
    approvalState: "approved",
    history: [
      { ts: "2024-06-05T10:00:00Z", amount: 15, reason: "Project contribution", by: "Priya Kapoor" },
      { ts: "2024-06-15T14:00:00Z", amount: -10, reason: "No-show penalty", by: "Priya Kapoor" },
      { ts: "2024-06-25T09:00:00Z", amount: -7, reason: "Incomplete task", by: "Priya Kapoor" },
    ],
  },
  {
    id: "u5",
    name: "Meera Singh",
    email: "meera@mgit.ac.in",
    role: "member",
    credits: 67,
    status: "active",
    joinDate: "2024-01-15",
    avatarUrl: "",
    position: "Designer",
    softDisabled: false,
    suspensionReason: "",
    approvalState: "approved",
    history: [
      { ts: "2024-06-08T11:00:00Z", amount: 25, reason: "UI Design Contest Winner", by: "SYSTEM" },
      { ts: "2024-06-20T15:30:00Z", amount: 20, reason: "Workshop Facilitation", by: "Priya Kapoor" },
      { ts: "2024-06-28T10:00:00Z", amount: 22, reason: "Mentoring bonus", by: "Priya Kapoor" },
    ],
  },
];

const INITIAL_TRIBES: Tribe[] = [
  { id: "t1", name: "AI Wing", description: "Machine Learning & AI enthusiasts", icon: "🤖", memberCount: 24, color: "from-purple-500 to-pink-500" },
  { id: "t2", name: "Web Dev Squad", description: "Full-stack web developers", icon: "🌐", memberCount: 32, color: "from-blue-500 to-cyan-500" },
  { id: "t3", name: "Mobile Devs", description: "iOS & Android developers", icon: "📱", memberCount: 18, color: "from-green-500 to-emerald-500" },
  { id: "t4", name: "Data Science", description: "Analytics and data wizards", icon: "📊", memberCount: 15, color: "from-orange-500 to-yellow-500" },
  { id: "t5", name: "Cybersecurity", description: "Security researchers and hackers", icon: "🔒", memberCount: 12, color: "from-red-500 to-rose-500" },
];

const INITIAL_POSTS: Post[] = [
  {
    id: "p1",
    authorId: "u1",
    authorName: "Priya Kapoor",
    authorAvatar: "",
    content: "🚀 Just wrapped up an amazing AI workshop! Huge thanks to everyone who participated. Can't wait for the next one!",
    likes: ["u2", "u3", "u5"],
    tribeId: "t1",
    createdAt: "2024-06-28T14:30:00Z",
  },
  {
    id: "p2",
    authorId: "u2",
    authorName: "Aman Verma",
    authorAvatar: "",
    content: "Working on a new React component library for our projects. Open to contributors! 💻",
    likes: ["u1", "u5"],
    tribeId: "t2",
    createdAt: "2024-06-27T10:15:00Z",
  },
  {
    id: "p3",
    authorId: "u5",
    authorName: "Meera Singh",
    authorAvatar: "",
    content: "New design system is live! Check out the updated components in Figma. Feedback welcome 🎨",
    likes: ["u1", "u2", "u3", "u4"],
    createdAt: "2024-06-26T16:45:00Z",
  },
];

// Password store (demo only)
const PASSWORDS: Record<string, { password: string; role: UserRole }> = {
  "priya@mgit.ac.in": { password: "leader123", role: "leader" },
  "aman@mgit.ac.in": { password: "member123", role: "member" },
  "saina@mgit.ac.in": { password: "member123", role: "member" },
  "raj@mgit.ac.in": { password: "member123", role: "member" },
  "meera@mgit.ac.in": { password: "member123", role: "member" },
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [passwords, setPasswords] = useState(PASSWORDS);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [tribes] = useState<Tribe[]>(INITIAL_TRIBES);
  const [globalThreshold, setGlobalThreshold] = useState(10);
  const [warnBuffer] = useState(5);

  // Sync currentUser with users array
  useEffect(() => {
    if (currentUser) {
      const updated = users.find(u => u.id === currentUser.id);
      if (updated && JSON.stringify(updated) !== JSON.stringify(currentUser)) {
        setCurrentUser(updated);
      }
    }
  }, [users, currentUser]);

  // Auto-update status based on credits
  useEffect(() => {
    setUsers(prev => prev.map(u => {
      let status: UserStatus = "active";
      let softDisabled = false;

      if (u.credits < 0) {
        status = "disabled";
      } else if (u.credits < globalThreshold) {
        status = "soft-disabled";
        softDisabled = true;
      }

      if (u.status !== status || u.softDisabled !== softDisabled) {
        return { ...u, status, softDisabled };
      }
      return u;
    }));
  }, [globalThreshold]);

  const login = (email: string, password: string, role: UserRole): boolean => {
    const emailLower = email.toLowerCase();
    const stored = passwords[emailLower];
    
    if (!stored || stored.password !== password) {
      return false;
    }
    
    if (role === "leader" && stored.role !== "leader") {
      return false;
    }

    const user = users.find(u => u.email.toLowerCase() === emailLower);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const signup = (name: string, email: string, password: string, position: string): boolean => {
    const emailLower = email.toLowerCase();
    if (passwords[emailLower]) {
      return false; // Already exists
    }

    const newUser: User = {
      id: `u${Date.now()}`,
      name,
      email: emailLower,
      role: "member",
      credits: 20,
      status: "active",
      joinDate: new Date().toISOString().slice(0, 10),
      avatarUrl: "",
      position,
      softDisabled: false,
      suspensionReason: "",
      approvalState: "pending",
      history: [{ ts: new Date().toISOString(), amount: 20, reason: "Welcome bonus", by: "SYSTEM" }],
    };

    setUsers(prev => [...prev, newUser]);
    setPasswords(prev => ({ ...prev, [emailLower]: { password, role: "member" } }));
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateCredits = (userId: string, amount: number, reason: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== userId) return u;

      const newCredits = u.credits + amount;
      let status: UserStatus = "active";
      let softDisabled = false;

      if (newCredits < 0) {
        status = "disabled";
      } else if (newCredits < globalThreshold) {
        status = "soft-disabled";
        softDisabled = true;
      }

      return {
        ...u,
        credits: newCredits,
        status,
        softDisabled,
        history: [
          { ts: new Date().toISOString(), amount, reason, by: currentUser?.name || "SYSTEM" },
          ...u.history,
        ],
      };
    }));
  };

  const addPost = (content: string, imageUrl?: string, tribeId?: string) => {
    if (!currentUser) return;

    const newPost: Post = {
      id: `p${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatarUrl,
      content,
      imageUrl,
      likes: [],
      tribeId,
      createdAt: new Date().toISOString(),
    };

    setPosts(prev => [newPost, ...prev]);
  };

  const likePost = (postId: string) => {
    if (!currentUser) return;

    setPosts(prev => prev.map(post => {
      if (post.id !== postId) return post;

      const hasLiked = post.likes.includes(currentUser.id);
      const newLikes = hasLiked
        ? post.likes.filter(id => id !== currentUser.id)
        : [...post.likes, currentUser.id];

      // Award credit if post reaches 5 likes
      if (!hasLiked && newLikes.length === 5) {
        updateCredits(post.authorId, 1, "Post reached 5 likes");
      }

      return { ...post, likes: newLikes };
    }));
  };

  const value: AppContextType = {
    currentUser,
    users,
    isAuthenticated: !!currentUser,
    isLeader: currentUser?.role === "leader",
    login,
    signup,
    logout,
    updateCredits,
    posts,
    addPost,
    likePost,
    tribes,
    globalThreshold,
    warnBuffer,
    setGlobalThreshold,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
