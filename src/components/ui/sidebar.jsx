import React, { useState, useEffect } from "react";
import {
  BookOpen,
  ListMusic,
  Plus,
  PlayCircle,
  Clock,
  PlusCircle,
  Check,
  ChevronLeft,
  Menu,
  Trash2,
} from "lucide-react";
import { storyAPI, playlistAPI, paymentsAPI, authAPI } from "../../services/api.js";

const Sidebar = ({ onPlayStory, onPlayPlaylist }) => {
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 768); // Closed by default on mobile screens
  const [activeTab, setActiveTab] = useState("history");
  const [stories, setStories] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscriptionTier, setSubscriptionTier] = useState("BASIC");

  // State for Playlist Creation
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // State for Adding Story to Playlist
  const [addingToPlaylistId, setAddingToPlaylistId] = useState(null);
  const [isAddingToPlaylist, setIsAddingToPlaylist] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (!authAPI.isAuthenticated()) return;

      try {
        // Fetch stories and playlists in parallel
        const [fetchedStories, fetchedPlaylists, subData] = await Promise.allSettled([
          storyAPI.getMyStories(),
          playlistAPI.getMyPlaylists(),
          paymentsAPI.getStatus().catch(() => ({ tier: "BASIC" }))
        ]);

        if (fetchedStories.status === "fulfilled") {
          setStories(fetchedStories.value);
        }

        if (fetchedPlaylists.status === "fulfilled") {
          setPlaylists(fetchedPlaylists.value);
        }

        if (subData.status === "fulfilled" && subData.value.tier) {
          setSubscriptionTier(subData.value.tier);
        }

      } catch (error) {
        console.error("Failed to fetch sidebar data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    setIsSaving(true);

    try {
      const createdPlaylist = await playlistAPI.createPlaylist(newPlaylistName);
      setPlaylists([
        {
          id: createdPlaylist.id || createdPlaylist._id,
          name: createdPlaylist.name,
          stories: [],
        },
        ...playlists,
      ]);
      setNewPlaylistName("");
      setIsCreatingPlaylist(false);
    } catch (error) {
      console.error("Error creating playlist:", error);
      alert("Failed to create playlist: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddToPlaylist = async (e, playlistId, story) => {
    e.stopPropagation();
    setIsAddingToPlaylist(true);

    try {
      await playlistAPI.addStoryToPlaylist(playlistId, story.id);
      setPlaylists(
        playlists.map((p) => {
          if (p.id === playlistId) {
            return { ...p, stories: [...p.stories, story] };
          }
          return p;
        }),
      );
      setAddingToPlaylistId(null);
    } catch (error) {
      console.error("Error adding to playlist:", error);
      alert("Failed to add to playlist: " + error.message);
    } finally {
      setIsAddingToPlaylist(false);
    }
  };

  const handleDeleteStory = async (e, storyId) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this story?")) return;

    try {
      await storyAPI.deleteStory(storyId);
      setStories(stories.filter(s => s.id !== storyId));
      setPlaylists(playlists.map(p => ({
        ...p,
        stories: p.stories ? p.stories.filter(s => s.id !== storyId) : []
      })));
    } catch (error) {
      console.error("Failed to delete story:", error);
      alert("Failed to delete story: " + error.message);
    }
  };

  return (
    <div
      className={`story-sidebar-shell relative h-full transition-all duration-300 ease-in-out z-50 flex-shrink-0 ${isOpen ? "w-80" : "w-0"}`}
    >
      {/* Sidebar Content Wrapper */}
      <aside
        className={`story-sidebar-panel absolute top-0 left-0 h-full w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header & Tabs */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
              Library
            </h2>
            {subscriptionTier !== "BASIC" && (
              <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md shadow-sm ${
                subscriptionTier === "LEGEND" 
                ? "bg-gradient-to-r from-yellow-400 to-amber-600 text-white" 
                : "bg-violet-600 text-white"
              }`}>
                {subscriptionTier}
              </span>
            )}
          </div>
          <div className="flex space-x-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("history")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "history"
                  ? "bg-white dark:bg-slate-700 shadow-sm text-violet-600 dark:text-violet-400"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <Clock size={16} /> My Stories
            </button>
            <button
              onClick={() => setActiveTab("playlists")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "playlists"
                  ? "bg-white dark:bg-slate-700 shadow-sm text-violet-600 dark:text-violet-400"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <ListMusic size={16} /> Playlists
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading ? (
            <div className="text-center text-slate-500 text-sm mt-10">
              Loading...
            </div>
          ) : activeTab === "history" ? (
            // --- History View ---
            stories.length === 0 ? (
              <p className="text-center text-slate-500 text-sm mt-10">
                📚 No stories yet. Create your first magical adventure!
              </p>
            ) : (
              stories.map((story) => (
                <div
                  key={story.id}
                  className="flex flex-col mb-1 border-b border-slate-100 dark:border-slate-800/50 last:border-0 pb-1"
                >
                  {/* Main Story Item */}
                  <div
                    onClick={() => onPlayStory(story)}
                    className="group flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                  >
                    <div className="w-10 h-10 bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen size={20} />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                        {story.title}
                      </h4>
                      <p className="text-xs text-slate-500 truncate">
                        {story.created_at}
                      </p>
                    </div>

                    {/* Action Buttons (Show on hover) */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setAddingToPlaylistId(
                            addingToPlaylistId === story.id ? null : story.id,
                          );
                        }}
                        className="p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/30 rounded-md transition-colors"
                        title="Add to Playlist"
                      >
                        <PlusCircle size={18} />
                      </button>
                      <button
                        onClick={(e) => handleDeleteStory(e, story.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors"
                        title="Delete Story"
                      >
                        <Trash2 size={18} />
                      </button>
                      <PlayCircle size={18} className="text-slate-400" />
                    </div>
                  </div>

                  {/* --- THE "ADD TO PLAYLIST" DROPDOWN --- */}
                  {addingToPlaylistId === story.id && (
                    <div className="pl-14 pr-3 py-2 animate-in slide-in-from-top-2 duration-200">
                      <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">
                        Save to...
                      </p>

                      {playlists.length === 0 ? (
                        <p className="text-xs text-slate-500">
                          No playlists yet. Create one in the Playlists tab!
                        </p>
                      ) : (
                        <div className="flex flex-col gap-1">
                          {playlists.map((p) => {
                            const isAlreadyIn =
                              p.stories &&
                              p.stories.some((s) => s.id === story.id);

                            return (
                              <button
                                key={p.id}
                                onClick={(e) =>
                                  !isAlreadyIn &&
                                  handleAddToPlaylist(e, p.id, story)
                                }
                                disabled={isAddingToPlaylist || isAlreadyIn}
                                className={`text-left text-sm px-3 py-2 rounded-lg flex justify-between items-center transition-colors ${
                                  isAlreadyIn
                                    ? "bg-slate-50 dark:bg-slate-800/50 text-slate-400 cursor-default"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400"
                                }`}
                              >
                                <span className="truncate">{p.name}</span>
                                {isAlreadyIn ? (
                                  <Check
                                    size={14}
                                    className="text-emerald-500"
                                  />
                                ) : (
                                  <Plus size={14} />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )
          ) : (
            // --- Playlists View ---
            <div>
              {!isCreatingPlaylist ? (
                <button
                  onClick={() => setIsCreatingPlaylist(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 mb-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-500 hover:border-violet-500 hover:text-violet-600 dark:hover:text-violet-400 dark:hover:border-violet-500 transition-colors text-sm font-bold"
                >
                  <Plus size={18} /> Create Playlist
                </button>
              ) : (
                <form
                  onSubmit={handleCreatePlaylist}
                  className="mb-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  <input
                    type="text"
                    autoFocus
                    placeholder="Playlist name..."
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    className="w-full px-3 py-2 mb-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 dark:text-white"
                    disabled={isSaving}
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingPlaylist(false);
                        setNewPlaylistName("");
                      }}
                      className="flex-1 py-2 text-xs font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      disabled={isSaving}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors flex justify-center items-center"
                      disabled={isSaving || !newPlaylistName.trim()}
                    >
                      {isSaving ? "Saving..." : "Save"}
                    </button>
                  </div>
                </form>
              )}

              {playlists.length === 0 && !isCreatingPlaylist ? (
                <p className="text-center text-slate-500 text-sm mt-6">
                  🎨 No playlists yet. Create your first collection!
                </p>
              ) : (
                playlists.map((playlist) => (
                  <div
                    key={playlist.id}
                    className="group flex flex-col p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center flex-shrink-0">
                          <ListMusic size={20} />
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                            {playlist.name}
                          </h4>
                          <p className="text-xs text-slate-500">
                            {playlist.stories ? playlist.stories.length : 0}{" "}
                            stories
                          </p>
                        </div>
                      </div>
                      {playlist.stories && playlist.stories.length > 0 && (
                        <button
                          onClick={() => onPlayPlaylist(playlist)}
                          className="p-2 bg-violet-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-violet-700 shadow-md flex-shrink-0 ml-2"
                        >
                          <PlayCircle size={18} fill="currentColor" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`absolute top-6 left-full z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 rounded-r-xl shadow-md text-slate-500 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-300 ${isOpen ? "border-l-0" : "border-l"}`}
        title={isOpen ? "Close Library" : "Open Library"}
      >
        {isOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
      </button>
    </div>
  );
};

export default Sidebar;
