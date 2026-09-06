# Profile + Follow Feature

This module takes SST Social from authentication into the first real social-network interaction: users can view a public profile and follow/unfollow another user.

## Classroom commits

### 1. `feat: add public profile page`

Added `GET /users/profile/:username` and `/profile/:username`.

The profile belongs to the User domain, so the implementation stays inside the existing user model, controller, and routes instead of creating a separate Profile entity.

### 2. `feat: add follow and unfollow controllers`

Added follow/unfollow business logic in the user controller.

The current user comes from the authentication middleware. A follow updates both sides of the relationship:

```text
A follows B

A.followings -> B
B.followers  -> A
```

The controller prevents self-following, rejects a duplicate follow, and verifies that the target user exists.

MongoDB operators:

- `$addToSet` prevents duplicate ids from being inserted.
- `$pull` removes the relationship cleanly.

### 3. `feat: add follow routes`

Added protected endpoints:

```http
POST   /users/:id/follow
DELETE /users/:id/follow
```

Authentication is required because a relationship-changing action is authorization-sensitive.

### 4. `feat: add follow and unfollow to profile`

The Profile page reads the logged-in user from `AuthContext`, determines whether the current user already follows the displayed profile, and lets the user toggle the relationship.

The UI updates the follower count after a successful API call without introducing Redux. The profile being viewed is page-specific server data, while authentication remains global context state.

## API summary

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/users/profile/:username` | Public | View a user's public profile |
| POST | `/users/:id/follow` | Required | Follow a user |
| DELETE | `/users/:id/follow` | Required | Unfollow a user |

## Why this is the next feature

Profile naturally leads to relationships. It gives students a reason to understand ObjectId references, authorization, MongoDB update operators, and UI state synchronization before introducing the Post/Feed system.

## Current architecture

```text
AuthContext
   |
   +-- logged-in user

Profile page
   |
   +-- GET /users/profile/:username
   |
   +-- POST /users/:id/follow
   |
   +-- DELETE /users/:id/follow
```

The next major feature should be Post CRUD, followed by the feed.
