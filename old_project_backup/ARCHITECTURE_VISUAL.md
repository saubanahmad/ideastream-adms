# SocialConnect Architecture - Visual Guide

## 🎨 System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                          │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │   Login     │  │   Signup    │  │    Feed     │           │
│  │   Page      │  │    Page     │  │    Page     │           │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘           │
│         │                 │                 │                   │
│         └─────────────────┴─────────────────┘                   │
│                           │                                     │
│                  JavaScript Fetch API                           │
│                   (HTTP Requests)                               │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ JSON over HTTP
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                    C++ WEB SERVER                                │
│                  (SocialConnectWeb.cpp)                          │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              HTTP Router (cpp-httplib)                    │  │
│  │                                                            │  │
│  │  /api/login          → loginHandler()                    │  │
│  │  /api/signup         → signupHandler()                   │  │
│  │  /api/feed/fifo      → getFIFOFeed()                     │  │
│  │  /api/feed/trending  → getTrendingFeed()                 │  │
│  │  /api/post/create    → createPost()                      │  │
│  │  /api/post/:id/upvote → votePost(id, 1)                 │  │
│  │  ... (20 total endpoints)                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │            Session Management Layer                       │  │
│  │                                                            │  │
│  │  Cookie → Token → User*                                   │  │
│  │  map<string, User*> sessions;                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Business Logic Layer                         │  │
│  │         (Original Console Functions)                      │  │
│  │                                                            │  │
│  │  • addUser()         • findUser()                         │  │
│  │  • createPost()      • findPost()                         │  │
│  │  • votePost()        • addComment()                       │  │
│  │  • addFriend()       • searchPosts()                      │  │
│  │  • undoLastAction()  • editProfile()                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           Data Structure Layer                            │  │
│  │                                                            │  │
│  │  User*     ← → User*     ← → User*    (Doubly Linked)   │  │
│  │    ↓                                                       │  │
│  │  FriendNode* → FriendNode* → NULL    (Singly Linked)    │  │
│  │                                                            │  │
│  │  Post*     ← → Post*     ← → Post*    (Doubly Linked)   │  │
│  │    ↓            ↓                                         │  │
│  │  Comment*     VoterNode*              (Singly Linked)    │  │
│  │    ↓            ↓                                         │  │
│  │  Comment*     VoterNode*                                 │  │
│  │                                                            │  │
│  │  HistoryStack                         (Stack - LIFO)     │  │
│  │  [Top] → HistoryNode → HistoryNode → NULL               │  │
│  │                                                            │  │
│  │  PostQueue                            (Queue - FIFO)     │  │
│  │  [Front] → QueueNode → QueueNode → [Rear]               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              File Persistence Layer                       │  │
│  │                                                            │  │
│  │  users.txt    ← → saveDatabase() / loadDatabase()        │  │
│  │  posts.txt    ← → saveDatabase() / loadDatabase()        │  │
│  │  friends.txt  ← → saveDatabase() / loadDatabase()        │  │
│  │  votes.txt    ← → saveDatabase() / loadDatabase()        │  │
│  │  comments.txt ← → saveDatabase() / loadDatabase()        │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Request Flow: Creating a Post

```
1. USER ACTION
   User types "My awesome idea!" in create_post.html
   ↓

2. FORM SUBMIT
   JavaScript intercepts form submission
   const data = new URLSearchParams(new FormData(form))
   ↓

3. HTTP REQUEST
   fetch('/api/post/create', {
     method: 'POST',
     body: data,
     credentials: 'include'  // ← Sends cookie
   })
   ↓

4. SERVER RECEIVES
   C++ server receives POST request at /api/post/create
   ↓

5. AUTHENTICATION
   Extract token from cookie
   sessions["abc123"] → finds User* john
   ↓

6. BUSINESS LOGIC
   createPost("john", "My awesome idea!")
   ↓

7. DATA STRUCTURE OPERATION
   Create new Post node
   Post* newPost = new Post(nextPostID++, "john", "My awesome idea!")
   Append to doubly linked list
   postHead → ... → newPost
   ↓

8. PERSISTENCE
   saveDatabase()
   Writes to posts.txt:
   "5|john|0|0|My awesome idea!"
   ↓

9. RESPONSE
   Return JSON: {"status": "success", "message": "Post created"}
   ↓

10. CLIENT UPDATE
    JavaScript receives response
    Redirects to feed.html
    Feed loads and displays new post
```

---

## 🗳️ Request Flow: Upvoting a Post

```
1. USER CLICKS
   User clicks upvote button (▲) on post #5
   ↓

2. JAVASCRIPT HANDLER
   onclick="vote(5, 1)"
   ↓

3. HTTP REQUEST
   fetch('/api/post/5/upvote', {
     method: 'POST',
     credentials: 'include'
   })
   ↓

4. SERVER ROUTING
   Router matches: POST /api/post/:id/upvote
   Extracts: postId = 5
   ↓

5. AUTHENTICATION
   Extract token from cookie
   Find User* from sessions map
   ↓

6. FIND POST
   Post* p = findPost(5)
   Traverses doubly linked list until p->id == 5
   ↓

7. CHECK EXISTING VOTE
   Traverse p->votersHead linked list
   Look for VoterNode with username == currentUser
   ↓

8A. IF USER ALREADY UPVOTED
    Remove VoterNode
    Decrement p->upvotes
    (Toggle off)
    ↓

8B. IF USER ALREADY DOWNVOTED
    Remove old VoterNode
    Decrement p->downvotes
    Add new VoterNode(username, 1)
    Increment p->upvotes
    ↓

8C. IF USER NEVER VOTED
    Add new VoterNode(username, 1)
    Increment p->upvotes
    ↓

9. HISTORY TRACKING
   userHistories["john"]->push(ACT_VOTE, 5, ...)
   ↓

10. PERSISTENCE
    saveDatabase()
    Updates posts.txt: "5|john|3|1|My awesome idea!"
    Updates votes.txt: "5|john|1"
    ↓

11. RESPONSE
    Return JSON: {
      "status": "success",
      "upvotes": 3,
      "downvotes": 1,
      "score": 2
    }
    ↓

12. UI UPDATE
    JavaScript updates button colors
    Updates score display
    No page reload!
```

---

## 📊 Data Structure Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                        User System                          │
└─────────────────────────────────────────────────────────────┘

userHead
   ↓
 User: "john"
   ├─ username: "john"
   ├─ password: "pass123"
   ├─ fullName: "John Doe"
   ├─ friendsHead → FriendNode("jane") → FriendNode("bob") → NULL
   ├─ next → User: "jane"
   └─ prev → NULL

   User: "jane"
   ├─ username: "jane"
   ├─ password: "jane123"
   ├─ fullName: "Jane Smith"
   ├─ friendsHead → FriendNode("john") → NULL
   ├─ next → NULL
   └─ prev → User: "john"


┌─────────────────────────────────────────────────────────────┐
│                        Post System                          │
└─────────────────────────────────────────────────────────────┘

postHead
   ↓
 Post: #1
   ├─ id: 1
   ├─ authorUsername: "john"
   ├─ content: "First post!"
   ├─ upvotes: 5
   ├─ downvotes: 1
   ├─ votersHead → VoterNode("jane",1) → VoterNode("bob",1) → NULL
   ├─ commentsHead → Comment("jane","Nice!") → NULL
   ├─ next → Post: #2
   └─ prev → NULL

 Post: #2
   ├─ id: 2
   ├─ authorUsername: "jane"
   ├─ content: "Second post!"
   ├─ upvotes: 3
   ├─ downvotes: 2
   ├─ votersHead → VoterNode("john",-1) → NULL
   ├─ commentsHead → NULL
   ├─ next → NULL
   └─ prev → Post: #1


┌─────────────────────────────────────────────────────────────┐
│                     Session System                          │
└─────────────────────────────────────────────────────────────┘

sessions (map)
   ├─ "abc123..." → User*: "john"
   ├─ "def456..." → User*: "jane"
   └─ "ghi789..." → User*: "bob"

userHistories (map)
   ├─ "john" → HistoryStack
   │            └─ [Top] → HistoryNode(ACT_VOTE, 5) → NULL
   │
   ├─ "jane" → HistoryStack
   │            └─ [Top] → HistoryNode(ACT_DELETE, 3, "Old post") → NULL
   │
   └─ "bob" → HistoryStack
                └─ [Top] → NULL (empty)


┌─────────────────────────────────────────────────────────────┐
│                      Feed Generation                        │
└─────────────────────────────────────────────────────────────┘

FIFO Feed (Queue):
   PostQueue
   [Front] → Post #1 → Post #2 → Post #3 → [Rear]
   Dequeue order: #1, #2, #3 (oldest first)

Trending Feed (Array + Bubble Sort):
   1. Convert linked list to array: [Post #1, Post #2, Post #3]
   2. Calculate scores: [4, 1, -2]
   3. Bubble sort by score: [Post #1 (score:4), Post #2 (score:1), Post #3 (score:-2)]
   4. Return sorted array
```

---

## 🎯 Console vs Web Comparison

```
┌─────────────────────────────────────────────────────────────┐
│                    CONSOLE VERSION                          │
└─────────────────────────────────────────────────────────────┘

main()
  └─ loadDatabase()  // Read .txt files
  └─ mainMenu()      // Login/Register loop
       └─ userMenu() // Feature menu loop
            ├─ Option 1: showFIFOFeed()
            ├─ Option 2: showTrendingFeed()
            ├─ Option 3: createPost()
            ├─ Option 9: likePost()
            └─ Option 0: saveDatabase() & exit

Input:  cin >> choice
Output: cout << "Post created!"
State:  User* currentUser (single global)


┌─────────────────────────────────────────────────────────────┐
│                      WEB VERSION                            │
└─────────────────────────────────────────────────────────────┘

main()
  └─ loadDatabase()  // Read .txt files
  └─ httplib::Server svr
       └─ svr.listen(8080)  // Wait for requests

       Request received:
       ├─ POST /api/login        → loginHandler()
       ├─ GET  /api/feed/fifo    → getFIFOFeedJSON()
       ├─ GET  /api/feed/trending → getTrendingFeedJSON()
       ├─ POST /api/post/create  → createPost()
       └─ POST /api/post/:id/upvote → votePost()

Input:  req.get_param_value("content")
Output: res.set_content("{\"status\":\"success\"}")
State:  map<string, User*> sessions (multiple concurrent)
```

---

## 🔐 Authentication Flow

```
┌──────────────┐
│   Browser    │
└──────┬───────┘
       │
       │ 1. POST /api/login
       │    username=john
       │    password=pass123
       ↓
┌──────────────────────────────────┐
│    C++ Server                    │
│                                  │
│  2. findUser("john")             │
│     ↓ (O(n) search)              │
│  3. Check password               │
│     ↓ (if match)                 │
│  4. generateToken()              │
│     → "abc123..."                │
│     ↓                            │
│  5. sessions["abc123"] = User*   │
│     ↓                            │
│  6. Set-Cookie: token=abc123     │
└──────┬───────────────────────────┘
       │
       │ Response: {"status":"success"}
       │ Cookie: token=abc123
       ↓
┌──────────────┐
│   Browser    │
│ (stores cookie) │
└──────┬───────┘
       │
       │ Future requests include:
       │ Cookie: token=abc123
       ↓
┌──────────────────────────────────┐
│    C++ Server                    │
│                                  │
│  1. Extract token from cookie    │
│  2. Look up: sessions["abc123"]  │
│     → User*: john                │
│  3. Process request as john      │
└──────────────────────────────────┘
```

---

## 📁 File Structure Visual

```
finaltryforUI/
│
├── 📄 SocialConnect.cpp           [Original console app]
├── 📄 SocialConnectWeb.cpp        [New web backend]
├── 📄 httplib.h                   [HTTP library - download]
│
├── 📖 README.md                   [Complete documentation]
├── 📖 QUICKSTART.md               [Quick setup guide]
├── 📖 PROJECT_SUMMARY.md          [Project overview]
├── 📖 DOWNLOAD_HTTPLIB.md         [Download instructions]
│
├── ⚙️ setup.bat                   [Windows setup script]
├── ⚙️ setup.sh                    [Linux/Mac setup script]
│
├── 📂 html/
│   ├── 🌐 login_new.html         [Login page - NEW]
│   ├── 🌐 signup_new.html        [Signup page - NEW]
│   ├── 🌐 feed.html              [Main feed - NEW]
│   ├── 🌐 create_post.html       [Create post - NEW]
│   ├── 🌐 friends.html           [Friends list - NEW]
│   │
│   ├── 🌐 login.html             [Original login]
│   ├── 🌐 signup.html            [Original signup]
│   ├── 🌐 isfeed.html            [Original feed]
│   └── 🌐 createidea.html        [Original create]
│
├── 📂 assets/
│   ├── 🖼️ logo.png
│   ├── 🖼️ ISlogo.png
│   ├── 🖼️ IdeaStream.png
│   └── 🖼️ (navigation icons)
│
└── 💾 (Generated on first run)
    ├── users.txt
    ├── posts.txt
    ├── friends.txt
    ├── votes.txt
    └── comments.txt
```

---

## 🎮 User Journey Map

```
NEW USER
   ↓
[Open localhost:8080/login_new.html]
   ↓
Click "Sign Up"
   ↓
[signup_new.html]
   ↓
Enter: Name, Username, Password
   ↓
Click "Sign Up"
   ↓
POST /api/signup → addUser() → saveDatabase()
   ↓
Redirect to login
   ↓
[login_new.html]
   ↓
Enter: Username, Password
   ↓
Click "Login"
   ↓
POST /api/login → findUser() → createSession()
   ↓
Redirect to feed
   ↓
[feed.html]
   ↓
See "Create New Post" button
   ↓
Click button
   ↓
[create_post.html]
   ↓
Type content
   ↓
Click "Post"
   ↓
POST /api/post/create → createPost() → saveDatabase()
   ↓
Redirect to feed
   ↓
[feed.html]
   ↓
See own post + other posts
   ↓
Click upvote (▲)
   ↓
POST /api/post/:id/upvote → votePost() → saveDatabase()
   ↓
See score increase (no reload!)
   ↓
Click "Comment"
   ↓
Type comment
   ↓
Click "Add Comment"
   ↓
POST /api/post/:id/comment → addComment() → saveDatabase()
   ↓
See comment appear (no reload!)
   ↓
Click "Trending" button
   ↓
GET /api/feed/trending → getTrendingFeedJSON() → bubbleSort()
   ↓
See posts sorted by score
   ↓
Search for keyword
   ↓
GET /api/search → searchPosts() → linearSearch()
   ↓
See filtered results
   ↓
Add friend from sidebar
   ↓
POST /api/friend/add → addFriend() → saveDatabase()
   ↓
Click friends icon (👥)
   ↓
[friends.html]
   ↓
See friend list
   ↓
Click "Back to Feed"
   ↓
[feed.html]
   ↓
Click logout (⎋)
   ↓
GET /api/logout → sessions.erase() → clearCookie()
   ↓
Redirect to login
   ↓
[login_new.html]
```

---

This visual guide helps understand:
✅ How requests flow through the system
✅ How data structures are organized
✅ How authentication works
✅ How the console version maps to web
✅ Complete user journey

Refer to this alongside the code! 🎯
