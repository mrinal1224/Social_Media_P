import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../lib/axios";

function Profile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axiosInstance.get(`/users/profile/${username}`);
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

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          Loading profile...
        </div>
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="font-semibold text-red-700">{error || "User not found"}</p>
          <Link to="/home" className="mt-4 inline-block text-sm font-medium text-indigo-600">
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-10">
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
              <p className="text-sm font-medium text-slate-500">@{profile.username}</p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900">{profile.name}</h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
                {profile.bio || "No bio yet."}
              </p>

              <div className="mt-5 flex gap-6 text-sm">
                <div>
                  <span className="font-bold text-slate-900">{profile.postsCount}</span>{" "}
                  <span className="text-slate-500">Posts</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900">{profile.followersCount}</span>{" "}
                  <span className="text-slate-500">Followers</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900">{profile.followingCount}</span>{" "}
                  <span className="text-slate-500">Following</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Profile;
