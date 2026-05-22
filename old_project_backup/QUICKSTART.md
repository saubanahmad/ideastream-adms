# 🚀 Quick Start Guide - SocialConnect Web

## ⚡ 3-Step Setup

### Step 1: Download cpp-httplib
Download the single header file from:
```
https://raw.githubusercontent.com/yhirose/cpp-httplib/master/httplib.h
```
Save it in the `finaltryforUI` folder (same location as SocialConnectWeb.cpp)

### Step 2: Compile
**Windows (MinGW):**
```bash
g++ -o SocialConnectWeb.exe SocialConnectWeb.cpp -std=c++11 -lws2_32
```

**Linux/Mac:**
```bash
g++ -o SocialConnectWeb SocialConnectWeb.cpp -std=c++11 -pthread
```

### Step 3: Run
```bash
# Windows
.\SocialConnectWeb.exe

# Linux/Mac
./SocialConnectWeb
```

### Step 4: Access
Open browser → **http://localhost:8080/login_new.html**

---

## 📋 First Time Usage

### 1. Register Account
- Click "Sign Up" link
- Enter full name, username, password
- Click "Sign Up" button
- Wait for redirect to login

### 2. Login
- Enter your username and password
- Click "Login"

### 3. Create First Post
- Click "Create New Post" button
- Write your content
- Click "Post"

### 4. Interact
- **Upvote/Downvote**: Click arrow buttons
- **Comment**: Click "Comment" button, type, click "Add Comment"
- **Edit**: Click "Edit" (only on your posts)
- **Delete**: Click "Delete" (only on your posts)

### 5. Add Friends
- See suggestions in right sidebar
- Click "Add" button next to username

---

## 🎯 Key Features to Test

| Feature | Location | Action |
|---------|----------|--------|
| **FIFO Feed** | Feed page | Click "FIFO Feed" button |
| **Trending** | Feed page | Click "Trending" button |
| **Search** | Top search bar | Type keyword, click "Search" |
| **Undo** | Top right (↶ icon) | Click to undo last vote/delete |
| **Friends** | Top right (👥 icon) | Click to view friend list |
| **Logout** | Top right (⎋ icon) | Click to logout |

---

## 🔑 How It Works

### Architecture in Simple Terms:

```
Browser (HTML/JavaScript)
         ↕ HTTP/JSON
C++ Server (SocialConnectWeb.cpp)
         ↕
Data Structures (Linked Lists, Stack, Queue)
         ↕
Text Files (users.txt, posts.txt, etc.)
```

### Key Differences from Console Version:

1. **Like → Upvote/Downvote**
   - Console had simple "like" counter
   - Web has Reddit-style voting with score

2. **Sessions**
   - Console used single `currentUser` variable
   - Web uses token-based sessions (multiple users simultaneously)

3. **Real-time**
   - Console showed menu after each action
   - Web updates dynamically without refresh

4. **Auto-save**
   - Console saved only on logout
   - Web saves after every action

---

## 📊 Data Flow Example: Creating a Post

1. User types in `create_post.html` → "My awesome idea!"
2. JavaScript sends: `POST /api/post/create` with content
3. C++ server receives request
4. Extracts token from cookie → finds User*
5. Calls `createPost(username, "My awesome idea!")`
6. Creates new Post* node
7. Adds to doubly linked list (postHead)
8. Saves to `posts.txt`
9. Returns JSON: `{"status": "success"}`
10. Browser redirects to feed
11. Feed loads and shows new post

---

## 🔍 Troubleshooting

### Server won't start
```
Error: Address already in use
```
**Fix**: Another program is using port 8080. Either:
- Stop that program, or
- Change port in SocialConnectWeb.cpp (line with `svr.listen("0.0.0.0", 8080)`)

### Can't compile
```
Error: httplib.h not found
```
**Fix**: Download httplib.h and place in same folder as .cpp file

### Login doesn't work
**Fix**: 
1. Check browser console (F12) for errors
2. Verify server is running (should say "Server starting on http://localhost:8080")
3. Try registering a new account first

### Posts don't appear
**Fix**:
1. Check if posts.txt file exists and has content
2. Check browser console for JavaScript errors
3. Verify you're logged in (should see username in top right)

---

## 📁 File Structure

```
finaltryforUI/
├── SocialConnectWeb.cpp       ← Backend (compile this)
├── httplib.h                  ← HTTP library (download)
├── README.md                  ← Full documentation
├── QUICKSTART.md              ← This file
├── setup.bat                  ← Windows setup script
├── setup.sh                   ← Linux/Mac setup script
│
├── html/                      ← Frontend files
│   ├── login_new.html
│   ├── signup_new.html
│   ├── feed.html
│   ├── create_post.html
│   └── friends.html
│
├── assets/                    ← Images (your existing assets)
│   ├── logo.png
│   └── ...
│
└── (Generated on first run)
    ├── users.txt
    ├── posts.txt
    ├── friends.txt
    ├── votes.txt
    └── comments.txt
```

---

## 🎓 Understanding the Code

### Data Structures Used:
1. **Doubly Linked List**: Users, Posts (can traverse both directions)
2. **Singly Linked List**: Friends, Comments, Voters (one direction only)
3. **Stack**: Undo history (Last In, First Out)
4. **Queue**: FIFO feed (First In, First Out)
5. **Hash Map**: Session tokens (O(1) lookup)

### Algorithms Used:
1. **Linear Search**: Finding users/posts (O(n))
2. **Bubble Sort**: Sorting posts by score (O(n²))
3. **Queue Operations**: Enqueue/Dequeue (O(1))
4. **Stack Operations**: Push/Pop (O(1))

---

## 🌟 Pro Tips

1. **Use Trending Feed**: See most popular posts first
2. **Upvote Good Ideas**: Help them trend
3. **Downvote Bad Ideas**: Keep feed quality high
4. **Undo Button**: Made a mistake? Click ↶
5. **Search**: Find posts by keyword or username
6. **Comments**: Engage in discussions
7. **Friends**: Add friends to see their activity

---

## 🎯 Test Scenarios

### Basic Flow:
1. Register → Login → Create Post → Upvote → Comment → Logout

### Advanced Flow:
1. Create multiple posts
2. Switch between FIFO and Trending view
3. Edit a post
4. Delete a post, then undo
5. Add friends
6. Search for specific content

---

## 📞 Need Help?

1. **Check README.md** for full documentation
2. **Check browser console** (F12 → Console tab)
3. **Check server output** in terminal
4. **Verify all files are in correct location**

---

## ✅ Success Checklist

Before considering complete, verify:
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Can create post
- [ ] Can see post in feed
- [ ] Can upvote/downvote
- [ ] Can add comment
- [ ] Can switch to trending view
- [ ] Can search posts
- [ ] Can add friend
- [ ] Can undo action
- [ ] Can logout
- [ ] Data persists after server restart

---

## 🎉 You're Ready!

Your SocialConnect application is now a **full-fledged web application** with:
✓ Modern UI
✓ Real-time interactions  
✓ Upvote/Downvote system
✓ All original data structures
✓ All original algorithms
✓ RESTful API
✓ Session management

**Enjoy your web-based social network!** 🚀
