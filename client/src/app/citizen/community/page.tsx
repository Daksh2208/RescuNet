"use client";

import { useEffect, useState } from "react";
import {
  HeartHandshake,
  PackageOpen,
  Wrench,
  Droplets,
  MapPin,
  Search,
  Filter,
  Plus,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";

import {
  getCommunityPosts,
  CommunityPost,
} from "@/lib/community";

export default function CommunityAidPage() {
  const [activeTab, setActiveTab] = useState<"offers" | "requests">("offers");

  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadPosts = async () => {
    try {
      setLoading(true);

      const type =
        activeTab === "offers"
          ? "OFFER"
          : "REQUEST";

      const data = await getCommunityPosts(
        type,
        search
      );

      setPosts(data);
    } catch (error) {
      console.error("Failed to load community posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [activeTab]);

  const handleSearch = async () => {
    await loadPosts();
  };

  const getPostIcon = (category: string) => {
    const value = category.toLowerCase();

    if (
      value.includes("water") ||
      value.includes("supply")
    ) {
      return Droplets;
    }

    if (
      value.includes("tool") ||
      value.includes("equipment")
    ) {
      return Wrench;
    }

    if (
      value.includes("medical") ||
      value.includes("medicine")
    ) {
      return PackageOpen;
    }

    return PackageOpen;
  };

  const getPostColors = (
    type: "OFFER" | "REQUEST"
  ) => {
    if (type === "OFFER") {
      return {
        color: "text-orange-600",
        bg: "bg-orange-50",
        border: "border-orange-200",
      };
    }

    return {
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
    };
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <HeartHandshake className="h-6 w-6 text-orange-500" />
            Community Aid
          </h1>

          <p className="text-slate-500 text-sm mt-1">
            Neighbors helping neighbors before rescue arrives
          </p>
        </div>

        <div className="flex gap-3">

          <Link
            href="/citizen"
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center"
          >
            Back
          </Link>

          <Link
            href="/citizen/community/post"
            className="px-4 py-2 text-sm font-bold text-white bg-orange-600 rounded-xl hover:bg-orange-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            New Post
          </Link>

        </div>
      </div>

      {/* Warning */}
      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-xl shadow-sm text-orange-900 text-sm">
        <strong>Safety Warning:</strong>{" "}
        Do not enter active danger zones to share supplies.
        Only coordinate handoffs in designated safe areas or
        daylight conditions.
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        {/* Tabs */}
        <div className="flex border-b border-slate-200">

          <button
            onClick={() => setActiveTab("offers")}
            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
              activeTab === "offers"
                ? "bg-orange-50 text-orange-700 border-b-2 border-orange-500"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            }`}
          >
            Available Resources (Offers)
          </button>

          <button
            onClick={() => setActiveTab("requests")}
            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
              activeTab === "requests"
                ? "bg-red-50 text-red-700 border-b-2 border-red-500"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            }`}
          >
            Help Needed (Requests)
          </button>

        </div>

        {/* Search */}
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex flex-col md:flex-row gap-4">

          <div className="relative flex-1">

            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              placeholder={`Search ${activeTab}...`}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white shadow-sm text-sm"
            />

          </div>

          <button
            onClick={handleSearch}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 flex items-center gap-2 shadow-sm shrink-0"
          >
            <Filter className="h-4 w-4" />
            Search
          </button>

        </div>

        {/* Feed */}
        <div className="p-6">

          {loading ? (

            <div className="text-center py-12 text-slate-500">
              Loading community posts...
            </div>

          ) : posts.length === 0 ? (

            <div className="text-center py-12">

              <HeartHandshake className="h-10 w-10 text-slate-300 mx-auto mb-3" />

              <p className="font-medium text-slate-700">
                No posts found
              </p>

              <p className="text-sm text-slate-500 mt-1">
                Be the first to create a community post.
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {posts.map((post) => {

                const Icon = getPostIcon(post.category);

                const colors = getPostColors(
                  post.type
                );

                return (

                  <div
                    key={post.id}
                    className={`p-5 rounded-xl border ${colors.border} ${colors.bg} flex flex-col gap-4 relative overflow-hidden transition-all hover:shadow-md`}
                  >

                    <div className="flex gap-4">

                      <div
                        className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 border border-white shadow-sm bg-white ${colors.color}`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>

                      <div>

                        <h3 className="font-bold text-slate-900 text-lg leading-tight">
                          {post.title}
                        </h3>

                        <p className="text-xs font-semibold text-slate-500 mt-1">
                          Posted by{" "}
                          {post.user.fullName}
                          {" • "}
                          {new Date(
                            post.createdAt
                          ).toLocaleString()}
                        </p>

                      </div>

                    </div>

                    <p className="text-sm text-slate-700 leading-relaxed bg-white/50 p-3 rounded-lg">
                      {post.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-2">

                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-white px-2 py-1 rounded-md shadow-sm border border-slate-100">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        {post.location}
                      </div>

                      <button
                        onClick={() =>
                          alert(
                            "Messaging will be added soon."
                          )
                        }
                        className="bg-white border border-slate-200 text-slate-700 font-bold px-4 py-2 rounded-lg text-sm hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm"
                      >
                        <MessageSquare className="h-4 w-4" />
                        Message
                      </button>

                    </div>

                  </div>

                );

              })}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

