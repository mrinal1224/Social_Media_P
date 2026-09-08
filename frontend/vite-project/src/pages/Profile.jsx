import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../lib/axios";
import { useAuth } from "../context/AuthContext";
import EditProfileModal from "../components/EditProfileModal";

function Profile() {
  const { username } = useParams();
  const { user: currentUser, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [followLoading, setFollowLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const isOwnProfile = currentUser?.username === profile?.username;
  const isFollowing = currentUser?._id
    ? profile?.followers?.some?.(
        (id) => id.toString() === currentUser._id.toString()
      )
    : false;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axiosInstance.get(
          `/users/profile/${username}`
        );
        setProfile(response.data);
      } catch (err) {
        setProfile(null);
        setError(err.response?.data?.message || "Unable to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  const handleProfileUpdated = (updatedUser) => {
    setProfile((prev) => ({
      ...prev,
      _id: updatedUser._id,
      name: updatedUser.name,
      username: updatedUser.username,
      bio: updatedUser.bio,
      website: updatedUser.website,
      location: updatedUser.location,
      profileImage: updatedUser.profileImage,
      followers: updatedUser.followers || prev.followers || [],
      followersCount: updatedUser.followers?.length ?? prev.followersCount,
      followingCount: updatedUser.followings?.length ?? prev.followingCount,
      postsCount: updatedUser.posts?.length ?? prev.postsCount,
    }));

    setUser(updatedUser);
  };

  const handleFollowToggle = async () => {
    if (!profile || isOwnProfile || followLoading) return;

    try {
      setFollowLoading(true);
      setError("");

      if (isFollowing) {
        await axiosInstance.delete(`/users/${profile._id}/follow`);
        setProfile((prev) => ({
          ...prev,
          followers:
            prev.followers?.filter(
              (id) => id.toString() !== currentUser._id.toString()
            ) || [],
          followersCount: Math.max((prev.followersCount || 0) - 1, 0),
        }));
      } else {
        await axiosInstance.post(`/users/${profile._id}/follow`);
        setProfile((prev) => ({
          ...prev,
          followers: [...(prev.followers || []), currentUser._id],
          followersCount: (prev.followersCount || 0) + 1,
        }));
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to update follow status"
      );
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          Loading profile...
        </div>
      </main>
    );
  }

  if (error && !profile) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="font-semibold text-red-700">{error}</p>
          <Link
            to="/home"
            className="mt-4 inline-block text-sm font-medium text-indigo-600"
          >
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-10">
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-3xl font-bold text-slate-500">
              {profile.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt={profile.username}
                  className="h-full w-full object-cover"
                />
              ) : (
                profile.name?.charAt(0)?.toUpperCase()
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    @{profile.username}
                  </p>
                  <h1 className="mt-1 text-2xl font-bold text-slate-900">
                    {profile.name}
                  </h1>
                </div>

                {isOwnProfile ? (
                  <button
                    type="button"
                    onClick={() => setShowEditModal(true)}
                    className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFollowToggle}
                    disabled={followLoading}
                    className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                      isFollowing
                        ? "bg-slate-700 hover:bg-slate-800"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                  >
                    {followLoading
                      ? "Updating..."
                      : isFollowing
                        ? "Following"
                        : "Follow"}
                  </button>
                )}
              </div>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
                {profile.bio || "No bio yet."}
              </p>

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                {profile.location && <span>📍 {profile.location}</span>}
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-indigo-600 hover:underline"
                  >
                    🔗 Website
                  </a>
                )}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-6 text-sm">
                <div>
                  <span className="font-bold text-slate-900">
                    {profile.postsCount}
                  </span>{" "}
                  <span className="text-slate-500">Posts</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900">
                    {profile.followersCount}
                  </span>{" "}
                  <span className="text-slate-500">Followers</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900">
                    {profile.followingCount}
                  </span>{" "}
                  <span className="text-slate-500">Following</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
          Posts will appear here in the next phase.
        </div>
      </div>

      {showEditModal && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEditModal(false)}
          onUpdated={handleProfileUpdated}
        />
      )}
    </main>
  );
}

export default Profile;
