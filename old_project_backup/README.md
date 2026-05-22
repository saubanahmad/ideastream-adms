# SocialConnect Web Application - Complete Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Setup Instructions](#setup-instructions)
4. [API Endpoints](#api-endpoints)
5. [Console-to-Web Feature Mapping](#feature-mapping)
6. [Data Structures & Algorithms](#data-structures)
7. [Frontend-Backend Communication](#communication)
8. [Key Changes from Console Version](#key-changes)

---

## 🎯 Overview

This is a complete web-based conversion of your SocialConnect.cpp console application. The project maintains **all original data structures, algorithms, and logic** while adding a modern web interface.

### Technology Stack
- **Backend**: C++ with cpp-httplib (lightweight HTTP server)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Data Format**: JSON for API responses
- **Authentication**: Cookie-based session tokens
- **Storage**: Text file persistence (same as original)

---

## 🏗️ Architecture

### System Architecture Diagram
```
┌─────────────────────────────────────────────────────┐
│                  FRONTEND (Browser)                  │
│                                                      │
│  HTML Pages:                                         │
│  • login_new.html     → User authentication         │
│  • signup_new.html    → User registration           │
│  • feed.html          → Main feed (FIFO/Trending)   │
│  • create_post.html   → Create new posts            │
│  • friends.html       → View friends list           │
│                                                      │
│  JavaScript: Fetch API for HTTP requests            │
└──────────────────┬───────────────────────────────────┘
                   │ HTTP/JSON (REST API)
┌──────────────────▼───────────────────────────────────┐
│              BACKEND (C++ Server)                     │
│                                                      │
│  ┌────────────────────────────────────────────┐    │
│  │  HTTP Server (cpp-httplib)                 │    │
│  │  Port: 8080                                 │    │
│  │  Routes: /api/*                            │    │
│  └────────────────────────────────────────────┘    │
│                                                      │
│  ┌────────────────────────────────────────────┐    │
│  │  Session Management                         │    │
│  │  • Token → User* mapping                   │    │
│  │  • Cookie-based authentication             │    │
│  └────────────────────────────────────────────┘    │
│                                                      │
│  ┌────────────────────────────────────────────┐    │
│  │  Original Console Logic (PRESERVED!)       │    │
│  │  • User* (Doubly Linked List)              │    │
│  │  • Post* (Doubly Linked List)              │    │
│  │  • FriendNode* (Singly Linked List)        │    │
│  │  • Comment* (Singly Linked List)           │    │
│  │  • VoterNode* (Singly Linked List)         │    │
│  │  • HistoryStack (Stack per user)           │    │
│  │  • PostQueue (Queue for FIFO feed)         │    │
│  │  • Bubble Sort (Trending feed)             │    │
│  └────────────────────────────────────────────┘    │
│                                                      │
│  ┌────────────────────────────────────────────┐    │
│  │  File Persistence                           │    │
│  │  • users.txt                                │    │
│  │  • posts.txt                                │    │
│  │  • friends.txt                              │    │
│  │  • votes.txt                                │    │
│  │  • comments.txt                             │    │
│  └────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────┘
```

---

## 🚀 Setup Instructions

### Prerequisites
1. **C++ Compiler** (g++, MSVC, or clang)
2. **cpp-httplib library** (single header file)

### Step 1: Download cpp-httplib
```bash
# Download the header file from GitHub
# Place it in your project directory
# URL: https://github.com/yhirose/cpp-httplib
```

**Or manually:**
- Go to: https://github.com/yhirose/cpp-httplib/releases
- Download `httplib.h`
- Place it in: `d:\University\3rd_Sem\DSA\project_01\finaltryforUI\`

### Step 2: Compile the Backend
```bash
# Windows (MinGW)
g++ -o SocialConnectWeb.exe SocialConnectWeb.cpp -std=c++11 -lws2_32

# Windows (MSVC)
cl /EHsc /std:c++14 SocialConnectWeb.cpp /Fe:SocialConnectWeb.exe

# Linux/Mac
g++ -o SocialConnectWeb SocialConnectWeb.cpp -std=c++11 -pthread
```

### Step 3: Run the Server
```bash
# Windows
.\SocialConnectWeb.exe

# Linux/Mac
./SocialConnectWeb
```

### Step 4: Access the Application
Open your browser and navigate to:
```
http://localhost:8080/login_new.html
```

### File Structure Required
```
finaltryforUI/
├── SocialConnectWeb.cpp       # Backend server
├── SocialConnectWeb.exe       # Compiled executable
├── httplib.h                  # HTTP library (download separately)
├── html/
│   ├── login_new.html         # Login page
│   ├── signup_new.html        # Registration page
│   ├── feed.html              # Main feed
│   ├── create_post.html       # Create post page
│   └── friends.html           # Friends list
├── assets/
│   ├── logo.png
│   ├── ISlogo.png
│   ├── IdeaStream.png
│   └── (navigation icons)
├── users.txt                  # Generated on first save
├── posts.txt                  # Generated on first save
├── friends.txt                # Generated on first save
├── votes.txt                  # Generated on first save
└── comments.txt               # Generated on first save
```

---

## 🔌 API Endpoints

### Authentication Endpoints

#### POST `/api/login`
**Purpose**: Authenticate user and create session

**Request Body** (form-data):
```
username: string
password: string
```

**Response**:
```json
{
  "status": "success",
  "token": "abc123...",
  "username": "john"
}
```

**Console Equivalent**: Login option in `mainMenu()`

---

#### POST `/api/signup`
**Purpose**: Register new user

**Request Body** (form-data):
```
username: string
password: string
name: string (full name)
```

**Response**:
```json
{
  "status": "success",
  "message": "Registration successful"
}
```

**Console Equivalent**: Register option in `mainMenu()`

---

#### GET `/api/logout`
**Purpose**: Clear session and logout

**Response**:
```json
{
  "status": "success"
}
```

**Console Equivalent**: Option 0 in `userMenu()`

---

### Feed Endpoints

#### GET `/api/feed/fifo`
**Purpose**: Get posts in FIFO order (oldest first)

**Response**:
```json
[
  {
    "id": 1,
    "author": "john",
    "content": "My first post",
    "upvotes": 5,
    "downvotes": 1,
    "score": 4,
    "userVote": 1,
    "comments": [
      {
        "author": "jane",
        "content": "Great post!"
      }
    ]
  }
]
```

**Console Equivalent**: `showFIFOFeed()` (Option 1)
**Algorithm Used**: PostQueue (FIFO Queue)

---

#### GET `/api/feed/trending`
**Purpose**: Get posts sorted by score (upvotes - downvotes)

**Response**: Same format as FIFO, but sorted

**Console Equivalent**: `showTrendingFeed()` (Option 2)
**Algorithm Used**: Bubble Sort on score

---

### Post Endpoints

#### POST `/api/post/create`
**Purpose**: Create new post

**Request Body** (form-data):
```
description: string
```

**Response**:
```json
{
  "status": "success",
  "message": "Post created"
}
```

**Console Equivalent**: `createPost()` (Option 3)

---

#### POST `/api/post/:id/upvote`
**Purpose**: Upvote a post (toggle on/off)

**URL Parameter**: Post ID

**Response**:
```json
{
  "status": "success",
  "upvotes": 6,
  "downvotes": 1,
  "score": 5
}
```

**Console Equivalent**: Modified from `likePost()` (Option 9)
**New Feature**: Toggle behavior - clicking again removes vote

---

#### POST `/api/post/:id/downvote`
**Purpose**: Downvote a post (toggle on/off)

**URL Parameter**: Post ID

**Response**: Same as upvote

**Console Equivalent**: NEW - replaces simple like system

---

#### DELETE `/api/post/:id`
**Purpose**: Delete user's own post

**URL Parameter**: Post ID

**Response**:
```json
{
  "status": "success",
  "message": "Post deleted"
}
```

**Console Equivalent**: `deletePost()` (Option 8)
**History**: Saved to HistoryStack for undo

---

#### PUT `/api/post/:id`
**Purpose**: Edit post content

**Request Body** (form-data):
```
content: string
```

**Response**:
```json
{
  "status": "success",
  "message": "Post updated"
}
```

**Console Equivalent**: `editPost()` (Option 10)

---

#### POST `/api/post/:id/comment`
**Purpose**: Add comment to post

**Request Body** (form-data):
```
comment: string
```

**Response**:
```json
{
  "status": "success",
  "message": "Comment added"
}
```

**Console Equivalent**: `addComment()` (Option 12)

---

### Search Endpoints

#### GET `/api/search?q=keyword`
**Purpose**: Search posts by content or author

**Query Parameter**: 
- `q`: Search keyword

**Response**: Array of matching posts (same format as feed)

**Console Equivalent**: `searchPosts()` (Option 4)
**Algorithm**: Linear search through linked list

---

### Friend Endpoints

#### GET `/api/friends`
**Purpose**: Get current user's friend list

**Response**:
```json
[
  {
    "username": "jane",
    "fullName": "Jane Doe"
  }
]
```

**Console Equivalent**: `displayFriends()` (Option 5)

---

#### GET `/api/users`
**Purpose**: Get non-friend users (suggestions)

**Response**: Same format as friends list

**Console Equivalent**: `displayAllUsersForFriendship()` (Option 6)

---

#### POST `/api/friend/add`
**Purpose**: Add friend

**Request Body** (form-data):
```
username: string
```

**Response**:
```json
{
  "status": "success",
  "message": "Friend added"
}
```

**Console Equivalent**: `addFriend()` (Option 6)

---

### User Profile Endpoints

#### GET `/api/user/current`
**Purpose**: Get current logged-in user info

**Response**:
```json
{
  "username": "john",
  "fullName": "John Doe"
}
```

**Console Equivalent**: `currentUser` global variable

---

#### PUT `/api/user/profile`
**Purpose**: Update profile

**Request Body** (form-data):
```
fullName: string (optional)
password: string (optional)
```

**Response**:
```json
{
  "status": "success",
  "message": "Profile updated"
}
```

**Console Equivalent**: `editProfile()` (Option 11)

---

### Undo Endpoint

#### POST `/api/undo`
**Purpose**: Undo last action (vote or delete)

**Response**:
```json
{
  "status": "success",
  "message": "Vote undone"
}
```

**Console Equivalent**: `undoLastAction()` (Option 7)
**Data Structure**: HistoryStack per user

---

## 🔄 Console-to-Web Feature Mapping

| Console Feature | Console Function | Web Page | API Endpoint | Key Changes |
|----------------|------------------|----------|--------------|-------------|
| **Login** | `mainMenu()` option 1 | login_new.html | POST /api/login | Returns auth token instead of setting global var |
| **Register** | `mainMenu()` option 2 | signup_new.html | POST /api/signup | Instant validation feedback |
| **View Feed (FIFO)** | `showFIFOFeed()` | feed.html | GET /api/feed/fifo | Returns JSON, rendered in browser |
| **View Trending** | `showTrendingFeed()` | feed.html | GET /api/feed/trending | Same bubble sort algorithm |
| **Create Post** | `createPost()` | create_post.html | POST /api/post/create | Form-based instead of console input |
| **Like Post** → **Vote System** | `likePost()` | feed.html buttons | POST /api/post/:id/upvote, /downvote | **CHANGED**: Upvote/Downvote instead of simple like |
| **Search Posts** | `searchPosts()` | feed.html search box | GET /api/search | Real-time search as you type |
| **My Friends** | `displayFriends()` | friends.html | GET /api/friends | Visual cards instead of text list |
| **Add Friend** | `addFriend()` | feed.html sidebar | POST /api/friend/add | One-click add from suggestions |
| **Delete Post** | `deletePost()` | feed.html buttons | DELETE /api/post/:id | Confirmation dialog |
| **Edit Post** | `editPost()` | feed.html buttons | PUT /api/post/:id | Inline editing |
| **Add Comment** | `addComment()` | feed.html | POST /api/post/:id/comment | Expandable comment section |
| **Edit Profile** | `editProfile()` | (Future) | PUT /api/user/profile | Separate profile page |
| **Undo** | `undoLastAction()` | feed.html button | POST /api/undo | Global undo button in UI |
| **Logout & Save** | `userMenu()` option 0 | feed.html button | GET /api/logout | Auto-save on every action |

---

## 💾 Data Structures & Algorithms (PRESERVED)

All original data structures and algorithms remain **exactly the same**:

### 1. User Management
**Data Structure**: Doubly Linked List
```cpp
User* userHead;  // Global pointer
struct User {
    string username, password, fullName;
    FriendNode* friendsHead;
    User* next;
    User* prev;
};
```
**Operations**: 
- `addUser()` - O(n) append
- `findUser()` - O(n) linear search

---

### 2. Post Management
**Data Structure**: Doubly Linked List
```cpp
Post* postHead;  // Global pointer
struct Post {
    int id;
    string authorUsername, content;
    int upvotes, downvotes;  // CHANGED from single 'likes'
    VoterNode* votersHead;   // CHANGED from LikerNode
    Comment* commentsHead;
    Post* next;
    Post* prev;
};
```

---

### 3. FIFO Feed
**Algorithm**: Queue (FIFO)
```cpp
class PostQueue {
    QueueNode* front;
    QueueNode* rear;
    
    void enqueue(Post* p);  // O(1)
    Post* dequeue();        // O(1)
};
```
**Usage**: `getFIFOFeedJSON()` enqueues all posts, dequeues to display

---

### 4. Trending Feed
**Algorithm**: Bubble Sort
```cpp
// Sort by score (upvotes - downvotes)
for(int k=0; k<count-1; k++) {
    for(int j=0; j<count-k-1; j++) {
        int score1 = postArray[j]->upvotes - postArray[j]->downvotes;
        int score2 = postArray[j+1]->upvotes - postArray[j+1]->downvotes;
        if(score1 < score2) {
            swap(postArray[j], postArray[j+1]);
        }
    }
}
```
**Complexity**: O(n²)
**Usage**: `getTrendingFeedJSON()`

---

### 5. History/Undo System
**Data Structure**: Stack (per user)
```cpp
class HistoryStack {
    HistoryNode* top;
    
    void push(ActionType, postID, ...);  // O(1)
    bool pop(...);                       // O(1)
};

map<string, HistoryStack*> userHistories;
```
**Supports**:
- Undo vote
- Undo delete post

---

### 6. Voting System (NEW)
**Data Structure**: Singly Linked List per post
```cpp
struct VoterNode {
    string username;
    int voteType;  // 1 = upvote, -1 = downvote
    VoterNode* next;
};
```
**Features**:
- One vote per user per post
- Can switch between upvote/downvote
- Can remove vote by clicking same button

---

### 7. Comments
**Data Structure**: Singly Linked List per post
```cpp
struct Comment {
    string author, content;
    Comment* next;
};
```
**Operations**: O(1) prepend (newest first)

---

### 8. Friends List
**Data Structure**: Singly Linked List per user
```cpp
struct FriendNode {
    string username;
    FriendNode* next;
};
```
**Operations**: O(n) search, O(1) prepend

---

## 📡 Frontend-Backend Communication

### Authentication Flow
```
1. User enters credentials in login_new.html
   ↓
2. JavaScript sends POST /api/login with form data
   ↓
3. Backend validates with findUser() and password check
   ↓
4. Backend generates token, stores in sessions map
   ↓
5. Backend sets HTTP-only cookie with token
   ↓
6. Frontend redirects to feed.html
   ↓
7. All subsequent requests include cookie automatically
   ↓
8. Backend extracts token from cookie, looks up user in sessions
```

### Post Creation Flow
```
1. User fills form in create_post.html
   ↓
2. JavaScript sends POST /api/post/create with description
   ↓
3. Backend extracts token from cookie
   ↓
4. Backend looks up User* from sessions[token]
   ↓
5. Backend calls createPost(username, content)
   ↓
6. New Post* added to doubly linked list
   ↓
7. Backend calls saveDatabase() (persists to posts.txt)
   ↓
8. Backend returns success JSON
   ↓
9. Frontend redirects to feed.html
```

### Feed Loading Flow
```
1. feed.html loads in browser
   ↓
2. JavaScript calls loadFeed('fifo')
   ↓
3. Sends GET /api/feed/fifo with cookie
   ↓
4. Backend validates session
   ↓
5. Backend calls getFIFOFeedJSON()
   ↓
6. Iterates through Post* linked list using PostQueue
   ↓
7. Converts each Post to JSON with postToJSON()
   ↓
8. Returns JSON array
   ↓
9. JavaScript receives array
   ↓
10. Dynamically creates HTML for each post
   ↓
11. Renders in feed container
```

### Voting Flow
```
1. User clicks upvote button on post #42
   ↓
2. JavaScript calls vote(42, 1)
   ↓
3. Sends POST /api/post/42/upvote with cookie
   ↓
4. Backend extracts username from session
   ↓
5. Backend calls votePost(42, username, 1)
   ↓
6. Checks if user already voted with getUserVote()
   ↓
7. Removes old VoterNode if exists
   ↓
8. Adds new VoterNode with voteType=1
   ↓
9. Increments post->upvotes
   ↓
10. Adds to HistoryStack for undo
   ↓
11. Calls saveDatabase()
   ↓
12. Returns updated vote counts
   ↓
13. JavaScript updates UI without full reload
```

---

## 🔑 Key Changes from Console Version

### 1. **Like → Upvote/Downvote System**

**Original Console Code**:
```cpp
struct LikerNode {
    string username;
    LikerNode* next;
};

struct Post {
    int likes;
    LikerNode* likersHead;
};

void likePost(int id) {
    Post* p = findPost(id);
    if (hasLiked(p, currentUser->username)) {
        cout << "Already liked";
        return;
    }
    p->likes++;
    // Add to likersHead...
}
```

**New Web Version**:
```cpp
struct VoterNode {
    string username;
    int voteType;  // 1 or -1
    VoterNode* next;
};

struct Post {
    int upvotes;
    int downvotes;
    VoterNode* votersHead;
};

void votePost(int id, string username, int voteType) {
    Post* p = findPost(id);
    // Remove old vote if exists
    // Add new vote with type
    // Update upvotes/downvotes
}
```

**Why Changed**: HTML buttons showed upvote/downvote, matching Reddit-style voting

---

### 2. **Session Management**

**Original**: Single global `currentUser*`
```cpp
User* currentUser = nullptr;
```

**New**: Token-based session map
```cpp
map<string, User*> sessions;  // token → User*
map<string, HistoryStack*> userHistories;  // username → HistoryStack*
```

**Why Changed**: Multiple users can be logged in simultaneously in web version

---

### 3. **Output Format**

**Original**: Console text output
```cpp
cout << "[#" << p->id << "] " << p->authorUsername 
     << ": " << p->content << " (Likes: " << p->likes << ")\n";
```

**New**: JSON output
```cpp
string postToJSON(Post* p) {
    stringstream ss;
    ss << "{\"id\":" << p->id 
       << ",\"author\":\"" << p->authorUsername << "\""
       << ",\"content\":\"" << p->content << "\""
       << ",\"upvotes\":" << p->upvotes
       << ",\"downvotes\":" << p->downvotes << "}";
    return ss.str();
}
```

---

### 4. **Input Method**

**Original**: `cin >>` and `getline(cin, ...)`
```cpp
cout << "Enter Post Content: ";
string content;
getline(cin, content);
createPost(content);
```

**New**: HTTP POST parameters
```cpp
svr.Post("/api/post/create", [](const Request& req, Response& res) {
    string content = req.get_param_value("description");
    User* user = sessions[token];
    createPost(user->username, content);
});
```

---

### 5. **Auto-Save**

**Original**: Save only on logout
```cpp
case 0: 
    saveDatabase(); 
    currentUser = NULL; 
    break;
```

**New**: Save after every modification
```cpp
createPost(username, content);
saveDatabase();  // Immediate save

votePost(id, username, voteType);
saveDatabase();  // Immediate save
```

**Why Changed**: Web users expect changes to persist immediately, not just on logout

---

### 6. **Error Handling**

**Original**: Console messages
```cpp
if (!user) {
    cout << "Invalid Credentials.\n";
    pauseScreen();
}
```

**New**: JSON error responses
```cpp
if (!user || user->password != password) {
    res.set_content(
        "{\"status\":\"error\",\"message\":\"Invalid credentials\"}", 
        "application/json"
    );
}
```

---

## 🧪 Testing Checklist

### Authentication
- [ ] Register new user
- [ ] Login with correct credentials
- [ ] Login with wrong credentials (should fail)
- [ ] Logout and try accessing feed (should redirect)

### Posts
- [ ] Create post
- [ ] View post in FIFO feed
- [ ] View post in Trending feed
- [ ] Upvote post (score increases)
- [ ] Downvote post (score decreases)
- [ ] Click upvote twice (should toggle off)
- [ ] Edit own post
- [ ] Delete own post
- [ ] Try to edit someone else's post (should not show button)

### Comments
- [ ] Add comment to post
- [ ] View comments on post

### Friends
- [ ] Add friend from suggestions
- [ ] View friends list
- [ ] Check friend removed from suggestions after adding

### Search
- [ ] Search for keyword in post content
- [ ] Search for username
- [ ] Search for non-existent term

### Undo
- [ ] Upvote post, then undo (vote should be removed)
- [ ] Delete post, then undo (post should be restored)

### Persistence
- [ ] Create data, stop server, restart, verify data still exists

---

## 🎓 Learning Points

### Data Structures Demonstrated
1. **Doubly Linked List**: Users and Posts (bidirectional traversal)
2. **Singly Linked List**: Friends, Comments, Voters (one-way traversal)
3. **Stack**: History/Undo system (LIFO)
4. **Queue**: FIFO feed (FIFO)
5. **Hash Map**: Session management (token lookup)

### Algorithms Demonstrated
1. **Linear Search**: Finding users/posts by ID
2. **Bubble Sort**: Sorting posts by score
3. **Queue Operations**: Enqueue/Dequeue for feed
4. **Stack Operations**: Push/Pop for undo

### Software Engineering Concepts
1. **RESTful API Design**: HTTP methods (GET, POST, PUT, DELETE)
2. **Session Management**: Token-based authentication
3. **Data Persistence**: File I/O
4. **MVC Pattern**: Separation of data (C++) and view (HTML)
5. **JSON Serialization**: Converting C++ objects to JSON

---

## 📝 Future Enhancements

### Suggested Improvements
1. **Profile Page**: Dedicated page for editing profile (currently just endpoint)
2. **Real-time Updates**: WebSocket for live feed updates
3. **Image Upload**: Add image support for posts
4. **Pagination**: Load posts in chunks for better performance
5. **Advanced Search**: Filter by date, author, etc.
6. **Friend Requests**: Approval system instead of instant friend add
7. **Database**: Migrate from text files to SQLite
8. **Password Hashing**: Use bcrypt instead of plain text
9. **Post Tags**: Category system matching theme selection in createidea.html
10. **Notifications**: Alert users of comments on their posts

---

## 🐛 Known Limitations

1. **Concurrency**: Single-threaded, not production-ready for high traffic
2. **Security**: 
   - Passwords stored in plain text (use hashing in production)
   - Basic XSS vulnerability (sanitize user input)
   - No rate limiting
3. **Scalability**: Linked lists are O(n) for search (use hash maps in production)
4. **Memory**: No cleanup on server shutdown (memory leaks possible)
5. **File Locking**: No file lock mechanism (race conditions possible)

---

## 📞 Support

For questions or issues:
1. Check console/browser developer tools for errors
2. Verify cpp-httplib is correctly installed
3. Ensure port 8080 is not in use
4. Check file permissions for .txt files

---

## 🎉 Success!

You now have a **fully functional web-based social network** that:
✅ Maintains all original C++ data structures
✅ Uses all original algorithms (FIFO, sorting, stack, queue)
✅ Has a modern, responsive UI
✅ Supports real-time interactions
✅ Persists data to files
✅ Implements upvote/downvote system
✅ Has comprehensive REST API

**Well done!** 🚀
