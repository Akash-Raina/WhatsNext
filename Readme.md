# 🎵 What's Next — A Collaborative Music Queue Platform

**What's Next** is a real-time collaborative music platform where users can join or create virtual music rooms, search for songs, and vote on what should play next. The most upvoted song gets played after the current one ends — giving everyone in the room a voice in the vibe.

## 🌐 Live Demo

Try out the live version here: [https://whats-next-navy.vercel.app](https://whatsnext-app.vercel.app)

📝 **How to Use:**
- Click "Create Room" to generate a unique room code.
- Share the code with friends so they can join.
- Search for a song using YouTube search.
- Add songs to the queue and vote on which to play next.
- The song with the highest votes plays when the current one ends.

## ✨ Features

### ✅ Real-Time Interaction
- Built with WebSockets for real-time communication.
- Instant song queue updates, vote tallies, and room participant tracking.

### 🎶 Music Search & Playback
- Integration with **YouTube IFrame API** 
- Users can search and queue up songs.
- Songs play in order based on upvotes.

### 👥 Room-Based Experience
- Users can **create or join rooms** via room codes.
- Each room has its own queue and user list.
- **Admin/Host control** over skipping, deleting, or pausing songs.

### 👍 Voting System
- Democratic song selection through upvoting
- One vote per user per song
- Real-time vote counting and queue reordering

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS, TypeScript  
- **Backend**: Node.js, Express.js  
- **Real-time Communication**: WebSockets (`ws` library)  
- **Database**: Redis (for queue state)
- **APIs**: YouTube IFrame API+  
- **Deployment**: Vercel (frontend), Render (backend), Upstash(Database)

