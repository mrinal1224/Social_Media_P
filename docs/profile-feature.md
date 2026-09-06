# Profile Feature

This feature adds a public user profile page to SST Social. The profile is intentionally implemented inside the existing user module because a profile is a public representation of a `User`, not a separate domain entity.

## What was built

### Backend

**Route:** `GET /users/profile/:username`

Files:
- `backend/models/user.model.js`
- `backend/controllers/user.controllers.js`
- `backend/routes/user.routes.js`

The controller finds a user by `username`, removes sensitive fields from the response, and returns only public profile information plus derived counts:

- name
- username
- bio
- profileImage
- followersCount
- followingCount
- postsCount

The route is public because viewing somebody's profile does not require authentication at this stage. Later, actions such as following and editing a profile will use authorization middleware.

### Frontend

**Route:** `/profile/:username`

File:
- `frontend/vite-project/src/pages/Profile.jsx`

The page uses React Router's `useParams()` to read the username from the URL, calls the backend through the existing Axios instance, and handles loading, error, and success states.

## Why this design?

### 1. Keep profile APIs under `/users`

A profile belongs to a user. Keeping profile operations in `user.routes.js` and `user.controllers.js` avoids creating an unnecessary `profile` entity and keeps the API model easy to understand for students.

### 2. Use username in the URL

`/profile/:username` produces human-readable URLs and demonstrates dynamic routes naturally. The backend can translate the username into the corresponding MongoDB document.

### 3. Keep the public response small

The database document contains private information such as the password. The API explicitly selects public fields instead of returning the complete user document.

### 4. Counts are computed in the API response

The frontend should not need to understand how followers/followings/posts are stored. The backend exposes simple `followersCount`, `followingCount`, and `postsCount` values that can later remain stable even if the database representation changes.

### 5. Context is still enough

The logged-in user continues to come from `AuthContext`. The profile currently being viewed is page-specific state, so Redux is intentionally not introduced here.

## Request flow

```text
Browser: /profile/mrinal
        ↓
React Router → useParams()
        ↓
GET /users/profile/mrinal
        ↓
Express userRoutes
        ↓
getUserProfile controller
        ↓
User.findOne({ username })
        ↓
Public profile response
        ↓
Profile.jsx renders UI
```

## Classroom teaching sequence

1. Explain why profile belongs to the User domain.
2. Design the public API response before writing code.
3. Implement the controller.
4. Register the route.
5. Build the frontend profile page with static UI.
6. Add `useParams()` and connect the API.
7. Demonstrate loading and 404 states.
8. Discuss why password and other private fields must never be exposed.
9. Explain why Redux is unnecessary for page-specific server data at this point.

## Natural next feature

The next feature should be **Follow / Unfollow**. It builds directly on this profile page and introduces user-to-user relationships, authorization, `$addToSet`, `$pull`, and UI state changes.
