#include <iostream>
#include <string>
#include <fstream>
#include <sstream>
#include <ctime>
#include <cstdlib>

using namespace std;

struct User;
struct Post;
struct Comment;

struct LikerNode 
{
    string username;
    LikerNode* next;
    LikerNode(string u) : username(u), next(NULL) {}
};

struct Comment {
    string author;
    string content;
    Comment* next;

    Comment(string a, string c) : author(a), content(c), next(NULL) {}
};

struct Post {
    int id;
    string authorUsername;
    string content;
    int likes;
    Comment* commentsHead; 
    LikerNode* likersHead;
    
    Post* next;
    Post* prev;

    Post(int pid, string author, string txt, int l = 0) 
        : id(pid), authorUsername(author), content(txt), likes(l), commentsHead(nullptr), likersHead(nullptr), next(nullptr), prev(nullptr) {}
};

struct FriendNode {
    string username;
    
    FriendNode* next;

    FriendNode(string u) : username(u), next(nullptr) {}
};

struct User {
    string username;
    string password;
    string fullName;
    FriendNode* friendsHead;
    
    User* next;
    User* prev;

    User(string u, string p, string f) 
        : username(u), password(p), fullName(f), friendsHead(nullptr), next(nullptr), prev(nullptr) {}
};

enum ActionType {
    ACT_LIKE,
    ACT_DELETE_POST,
    ACT_VIEW_FEED,
    ACT_EDIT_POST 
};

struct HistoryNode {
    ActionType type;
    int postID;      
    string extraData; 
    string authorUsername; 
    int likes; 
    HistoryNode* next;

    HistoryNode(ActionType t, int pid, string data = "", string author = "", int likeCount = 0) 
        : type(t), postID(pid), extraData(data), authorUsername(author), likes(likeCount), next(nullptr) {}
};


User* userHead = nullptr;
Post* postHead = nullptr;
User* currentUser = nullptr;

int nextPostID = 1;


void clearScreen() {
    system("cls");
}

void pauseScreen() {
    cout << "\nPress Enter to continue...";
    cin.ignore();
    cin.get();
}


class HistoryStack {
private:
    HistoryNode* top;
public:
    HistoryStack() : top(nullptr) {}

    void push(ActionType type, int postID, string extraData = "", string author = "", int likeCount = 0) {
        HistoryNode* newNode = new HistoryNode(type, postID, extraData, author, likeCount);
        newNode->next = top;
        top = newNode;
    }

    bool pop(ActionType &type, int &postID, string &extraData, string &author, int &likeCount) {
        if (!top) return false;
        HistoryNode* temp = top;
        type = temp->type;
        postID = temp->postID;
        extraData = temp->extraData;
        author = temp->authorUsername;
        likeCount = temp->likes;
        top = top->next;
        delete temp;
        return true;
    }

    bool isEmpty() { return top == nullptr; }
};

HistoryStack globalHistory;

struct QueueNode {
    Post* data;
    QueueNode* next;
    QueueNode(Post* p) : data(p), next(NULL) {}
};

class PostQueue {
private:
    QueueNode* front;
    QueueNode* rear;
public:
    PostQueue() : front(NULL), rear(NULL) {}

    void enqueue(Post* p) {
        QueueNode* temp = new QueueNode(p);
        if (rear == NULL) {
            front = rear = temp;
            return;
        }
        rear->next = temp;
        rear = temp;
    }

    Post* dequeue() {
        if (front == NULL) return NULL;
        QueueNode* temp = front;
        Post* p = front->data;
        front = front->next;
        if (front == NULL) rear = NULL;
        delete temp;
        return p;
    }

    bool isEmpty() { return front == NULL; }
};


void addUser(string u, string p, string f) {
    User* newUser = new User(u, p, f);
    if (!userHead) {
        userHead = newUser;
    } else {
        User* temp = userHead;
        while (temp->next) temp = temp->next;
        temp->next = newUser;
        newUser->prev = temp;
    }
}

User* findUser(string username) {
    User* temp = userHead;
    while (temp) {
        if (temp->username == username) return temp;
        temp = temp->next;
    }
    return NULL;
}

void addFriend(User* u, string friendName) {
    if (u->username == friendName) return; 

    FriendNode* curr = u->friendsHead;
    while(curr) {
        if(curr->username == friendName) return; 
        curr = curr->next;
    }

    FriendNode* newNode = new FriendNode(friendName);
    newNode->next = u->friendsHead;
    u->friendsHead = newNode;
}

void displayFriends(User* u) {
    cout << "\n--- " << u->username << "'s Friends ---\n";
    FriendNode* temp = u->friendsHead;
    if(!temp) {
        cout << "(No friends yet)\n";
        return;
    }
    
    int count = 0;
    while(temp) {
        count++;
        temp = temp->next;
    }
    
    string* friendArray = new string[count];
    temp = u->friendsHead;
    int i = 0;
    while(temp) {
        friendArray[i++] = temp->username;
        temp = temp->next;
    }
    
    cout << "\nSort Options:\n";
    cout << "1. Unsorted (as added)\n";
    cout << "2. A - Z (Alphabetical)\n";
    cout << "3. Z - A (Reverse Alphabetical)\n";
    cout << "Choice (or press Enter for unsorted): ";
    
    string sortChoice;
    getline(cin, sortChoice);
    
    if(sortChoice == "2") {

        for(int j = 0; j < count - 1; j++) {
            for(int k = 0; k < count - j - 1; k++) {
                if(friendArray[k] > friendArray[k + 1]) {
                    string swapTemp = friendArray[k];
                    friendArray[k] = friendArray[k + 1];
                    friendArray[k + 1] = swapTemp;
                }
            }
        }
        cout << "\n[Sorted A → Z]\n";
    }
    else if(sortChoice == "3") {

        for(int j = 0; j < count - 1; j++) {
            for(int k = 0; k < count - j - 1; k++) {
                if(friendArray[k] < friendArray[k + 1]) {
                    string swapTemp = friendArray[k];
                    friendArray[k] = friendArray[k + 1];
                    friendArray[k + 1] = swapTemp;
                }
            }
        }
        cout << "\n[Sorted Z → A]\n";
    }
    else {
        cout << "\n[Unsorted - Order Added]\n";
    }
    
    for(int j = 0; j < count; j++) {
        User* friendUser = findUser(friendArray[j]);
        if(friendUser) {
            cout << j + 1 << ". @" << friendArray[j] << " (" << friendUser->fullName << ")\n";
        } else {
            cout << j + 1 << ". @" << friendArray[j] << "\n";
        }
    }
    
    cout << "\nTotal Friends: " << count << "\n";
    
    delete[] friendArray;
}

void displayAllUsersForFriendship() {
    cout << "\n--- Available Users ---\n";
    User* temp = userHead;
    bool foundAny = false;
    while(temp) {
        if (temp->username != currentUser->username) {
            bool isFriend = false;
            FriendNode* f = currentUser->friendsHead;
            while(f) {
                if(f->username == temp->username) {
                    isFriend = true;
                    break;
                }
                f = f->next;
            }
            
            if(!isFriend) {
                cout << "-> " << temp->username << " (" << temp->fullName << ")\n";
                foundAny = true;
            }
        }
        temp = temp->next;
    }
    if (!foundAny) cout << "No new users available to add.\n";
}

void editProfile() {
    cout << "\n=== EDIT PROFILE ===\n";
    cout << "Current Full Name: " << currentUser->fullName << endl;
    cout << "Current Password: " << currentUser->password << endl;
    cout << "--------------------\n";
    
    cout << "Enter new Full Name (or type '.' to keep same): ";
    string newName;
    getline(cin, newName);
    if (newName != ".") currentUser->fullName = newName;

    cout << "Enter new Password (or type '.' to keep same): ";
    string newPass;
    cin >> newPass;
    if (newPass != ".") currentUser->password = newPass;

    cout << "Profile updated successfully.\n";
}


void createPost(string content) {
    Post* newPost = new Post(nextPostID++, currentUser->username, content);
    
    if (!postHead) {
        postHead = newPost;
    } else {
        Post* temp = postHead;
        while (temp->next) temp = temp->next;
        temp->next = newPost;
        newPost->prev = temp;
    }
    cout << "Post created successfully!\n";
}

Post* findPost(int id) {
    Post* temp = postHead;
    while (temp) {
        if (temp->id == id) return temp;
        temp = temp->next;
    }
    return NULL;
}

void editPost() {
    cout << "\n--- Your Posts ---\n";
    Post* temp = postHead;
    bool found = false;
    while(temp) {
        if(temp->authorUsername == currentUser->username) {
            cout << "[" << temp->id << "] " << temp->content << endl;
            found = true;
        }
        temp = temp->next;
    }

    if(!found) {
        cout << "You have no posts to edit.\n";
        return;
    }

    cout << "\nEnter Post ID to edit: ";
    int pid; cin >> pid;
    cin.ignore(); 

    Post* p = findPost(pid);
    if (p && p->authorUsername == currentUser->username) {
        cout << "Old Content: " << p->content << endl;
        cout << "New Content: ";
        string newC;
        getline(cin, newC);
        p->content = newC;
        cout << "Post updated.\n";
    } else {
        cout << "Invalid ID or permission denied.\n";
    }
}

void deletePost(int id) {
    Post* p = findPost(id);
    if (!p) return;

    globalHistory.push(ACT_DELETE_POST, p->id, p->content, p->authorUsername, p->likes); 

    if (p == postHead) {
        postHead = p->next;
        if (postHead) postHead->prev = NULL;
    } else {
        if (p->prev) p->prev->next = p->next;
        if (p->next) p->next->prev = p->prev;
    }
    
    delete p; 
    cout << "Post deleted.\n";
}

bool hasLiked(Post* p, string username) {
    LikerNode* temp = p->likersHead;
    while(temp) {
        if(temp->username == username) return true;
        temp = temp->next;
    }
    return false;
}

void likePost(int id) {
    Post* p = findPost(id);
    if (p) {
        if (hasLiked(p, currentUser->username)) {
            cout << "You have already liked this post.\n";
            return;
        }

        LikerNode* newLiker = new LikerNode(currentUser->username);
        newLiker->next = p->likersHead;
        p->likersHead = newLiker;

        p->likes++;
        
        globalHistory.push(ACT_LIKE, id);
        cout << "You liked post #" << id << endl;
    } else {
        cout << "Post not found.\n";
    }
}

void addComment(int id, string txt) {
    Post* p = findPost(id);
    if (p) {
        Comment* c = new Comment(currentUser->username, txt);
        c->next = p->commentsHead;
        p->commentsHead = c;
        cout << "Comment added.\n";
    }
}


void showFIFOFeed() {
    PostQueue feedQueue;
    Post* temp = postHead;
    while (temp) {
        feedQueue.enqueue(temp);
        temp = temp->next;
    }

    cout << "\n=== FEED (FIFO - Oldest First) ===\n";
    if (feedQueue.isEmpty()) cout << "No posts available.\n";

    while (!feedQueue.isEmpty()) {
        Post* p = feedQueue.dequeue();
        cout << "----------------------------\n";
        cout << "ID: " << p->id << " | User: @" << p->authorUsername << endl;
        cout << "Content: " << p->content << endl;
        cout << "Likes: " << p->likes << endl;
        
        Comment* c = p->commentsHead;
        if (c) cout << "  Comments:\n";
        while (c) {
            cout << "  - @" << c->author << ": " << c->content << endl;
            c = c->next;
        }
    }
}

void showTrendingFeed() {
    int count = 0;
    Post* temp = postHead;
    while(temp) { count++; temp = temp->next; }

    if(count == 0) { cout << "No posts available.\n"; return; }

    Post** postArray = new Post*[count];
    temp = postHead;
    int i = 0;
    while(temp) {
        postArray[i++] = temp;
        temp = temp->next;
    }

    for(int k=0; k<count-1; k++) {
        for(int j=0; j<count-k-1; j++) {
            if(postArray[j]->likes < postArray[j+1]->likes) {
                Post* swapTemp = postArray[j];
                postArray[j] = postArray[j+1];
                postArray[j+1] = swapTemp;
            }
        }
    }

    cout << "\n=== TRENDING FEED (Sorted by Likes) ===\n";
    for(int k=0; k<count; k++) {
        cout << "[#" << postArray[k]->id << "] " << postArray[k]->authorUsername 
             << ": " << postArray[k]->content << " (Likes: " << postArray[k]->likes << ")\n";
    }
    
    delete[] postArray;
}

void searchPosts(string keyword) {
    cout << "\n=== SEARCH RESULTS FOR '" << keyword << "' ===\n";
    Post* temp = postHead;
    bool found = false;
    while (temp) {
        if (temp->content.find(keyword) != string::npos || temp->authorUsername.find(keyword) != string::npos) {
            cout << "[#" << temp->id << "] @" << temp->authorUsername << ": " << temp->content << endl;
            found = true;
        }
        temp = temp->next;
    }
    if(!found) cout << "No results found.\n";
}


void undoLastAction() {
    if (globalHistory.isEmpty()) {
        cout << "Nothing to undo.\n";
        return;
    }

    ActionType type;
    int pid;
    string extra, author;
    int likeCount;

    globalHistory.pop(type, pid, extra, author, likeCount);

    if (type == ACT_LIKE) {
        Post* p = findPost(pid);
        if (p) {
            LikerNode* curr = p->likersHead;
            LikerNode* prev = NULL;
            while (curr) {
                if (curr->username == currentUser->username) {
                    if (prev) prev->next = curr->next;
                    else p->likersHead = curr->next;
                    delete curr;
                    p->likes--;
                    cout << "Undo: Unliked post #" << pid << endl;
                    break;
                }
                prev = curr;
                curr = curr->next;
            }
        }
    } 
    else if (type == ACT_DELETE_POST) {
        Post* restored = new Post(pid, author, extra, likeCount); 
        if (!postHead) {
            postHead = restored;
        } else {
            Post* temp = postHead;
            while (temp->next) temp = temp->next;
            temp->next = restored;
            restored->prev = temp;
        }
        cout << "Undo: Restored deleted post #" << pid << " by @" << author << endl;
    }
    else if (type == ACT_VIEW_FEED) {
        cout << "Undo: Returned to previous view state.\n";
    }
}


void saveDatabase() {
    ofstream userFile("users.txt");
    User* u = userHead;
    while (u) {
        userFile << u->username << "|" << u->password << "|" << u->fullName << endl;
        u = u->next;
    }
    userFile.close();

    ofstream friendsFile("friends.txt");
    u = userHead;
    while (u) {
        FriendNode* f = u->friendsHead;
        while (f) {
            friendsFile << u->username << "|" << f->username << endl;
            f = f->next;
        }
        u = u->next;
    }
    friendsFile.close();
    ofstream postFile("posts.txt");
    Post* p = postHead;
    while (p) {
        postFile << p->id << "|" << p->authorUsername << "|" << p->likes << "|" << p->content << endl;
        p = p->next;
    }
    postFile.close();

    ofstream likesFile("likes.txt");
    p = postHead;
    while(p) {
        LikerNode* ln = p->likersHead;
        while(ln) {
            likesFile << p->id << "|" << ln->username << endl;
            ln = ln->next;
        }
        p = p->next;
    }
    likesFile.close();

    cout << "Database saved successfully.\n";
}

void loadDatabase() {
    string line;
    
    ifstream userFile("users.txt");
    if (userFile.is_open()) {
        while (getline(userFile, line)) {
            stringstream ss(line);
            string u, p, f;
            getline(ss, u, '|');
            getline(ss, p, '|');
            getline(ss, f, '|');
            if (!u.empty()) {
                addUser(u, p, f);
            }
        }
        userFile.close();
    }

    ifstream friendsFile("friends.txt");
    if (friendsFile.is_open()) {
        while (getline(friendsFile, line)) {
            stringstream ss(line);
            string uName, fName;
            getline(ss, uName, '|');
            getline(ss, fName, '|');
            
            if(!uName.empty() && !fName.empty()) {
                User* u = findUser(uName);
                if(u) addFriend(u, fName);
            }
        }
        friendsFile.close();
    }

    ifstream postFile("posts.txt");
    if (postFile.is_open()) {
        while (getline(postFile, line)) {
            stringstream ss(line);
            string sid, sauthor, slikes, scontent;
            
            getline(ss, sid, '|');
            getline(ss, sauthor, '|');
            getline(ss, slikes, '|');
            getline(ss, scontent, '|'); 

            if (!sid.empty()) {
                int id = atoi(sid.c_str());
                int likes = atoi(slikes.c_str());
                if(id >= nextPostID) nextPostID = id + 1;

                Post* newPost = new Post(id, sauthor, scontent, likes);
                if (!postHead) {
                    postHead = newPost;
                } else {
                    Post* temp = postHead;
                    while (temp->next) temp = temp->next;
                    temp->next = newPost;
                    newPost->prev = temp;
                }
            }
        }
        postFile.close();
    }

    ifstream likesFile("likes.txt");
    if (likesFile.is_open()) {
        while(getline(likesFile, line)) {
             stringstream ss(line);
             string sid, uname;
             getline(ss, sid, '|');
             getline(ss, uname, '|');

             if(!sid.empty() && !uname.empty()) {
                 int id = atoi(sid.c_str());
                 Post* p = findPost(id);
                 if(p) {
                     LikerNode* ln = new LikerNode(uname);
                     ln->next = p->likersHead;
                     p->likersHead = ln;
                 }
             }
        }
        likesFile.close();
    }
}

void userMenu() {
    int choice;
    do {
        clearScreen();
        cout << "\n==============================\n";
        cout << "   SOCIAL CONNECT: " << currentUser->fullName << "\n";
        cout << "==============================\n";
        cout << "1. View Feed (FIFO)\n";
        cout << "2. View Trending (Sorted)\n";
        cout << "3. Create Post\n";
        cout << "4. Search Posts\n";
        cout << "5. My Friends\n";
        cout << "6. Add Friend\n";
        cout << "7. Undo Last Action\n";
        cout << "8. Delete Post\n";
        cout << "9. Like Post\n";
        cout << "10. Edit Post\n";
        cout << "11. Edit Profile\n";
        cout << "12. Add Comment\n";
        cout << "0. Logout & Save\n";
        cout << "Choice: ";
        cin >> choice;
        cin.ignore();

        switch(choice) {
            case 1: 
                showFIFOFeed(); 
                globalHistory.push(ACT_VIEW_FEED, 0); 
                pauseScreen();
                break;
            case 2: 
                showTrendingFeed(); 
                pauseScreen();
                break;
            case 3: {
                cout << "Enter Post Content: ";
                string content;
                getline(cin, content);
                createPost(content);
                pauseScreen();
                break;
            }
            case 4: {
                cout << "Enter keyword: ";
                string k;
                getline(cin, k);
                searchPosts(k);
                pauseScreen();
                break;
            }
            case 5: 
                displayFriends(currentUser); 
                pauseScreen();
                break;
            case 6: {
                displayAllUsersForFriendship();
                
                cout << "\nEnter username to add (or type 0 to cancel): ";
                string fName;
                cin >> fName;
                if (fName != "0") {
                    if(findUser(fName)) {
                        addFriend(currentUser, fName);
                        cout << "Friend added.\n";
                    } else {
                        cout << "User not found.\n";
                    }
                }
                pauseScreen();
                break;
            }
            case 7: 
                undoLastAction(); 
                pauseScreen();
                break;
            case 8: {
                cout << "--- Your Posts ---\n";
                Post* t = postHead;
                bool hasPosts = false;
                while(t) {
                    if(t->authorUsername == currentUser->username) {
                        cout << "[" << t->id << "] " << t->content << endl;
                        hasPosts = true;
                    }
                    t = t->next;
                }

                if(hasPosts) {
                    cout << "Enter Post ID to delete: ";
                    int pid; cin >> pid;
                    Post* p = findPost(pid);
                    if(p && p->authorUsername == currentUser->username) {
                        deletePost(pid);
                    } else {
                        cout << "Post not found or you are not the author.\n";
                    }
                } else {
                    cout << "You have no posts to delete.\n";
                }
                pauseScreen();
                break;
            }
            case 9: {
                showFIFOFeed();
                cout << "\nEnter Post ID to like: ";
                int pid; cin >> pid;
                likePost(pid);
                pauseScreen();
                break;
            }
            case 10:
                editPost();
                pauseScreen();
                break;
            case 11:
                editProfile();
                pauseScreen();
                break;
            case 12: {
                showFIFOFeed();
                cout << "\nEnter Post ID to comment on: ";
                int pid; cin >> pid;
                cin.ignore();
                Post* p = findPost(pid);
                if(p) {
                    cout << "Enter your comment: ";
                    string commentText;
                    getline(cin, commentText);
                    addComment(pid, commentText);
                } else {
                    cout << "Post not found.\n";
                }
                pauseScreen();
                break;
            }
            case 0: 
                saveDatabase(); 
                currentUser = NULL; 
                break;
            default: 
                cout << "Invalid choice.\n";
                pauseScreen();
        }
    } while (choice != 0);
}

void mainMenu() {
    int choice;
    do {
        clearScreen();
        cout << "\n==============================\n";
        cout << "   SOCIAL CONNECT LOGIN\n";
        cout << "==============================\n";
        cout << "1. Login\n";
        cout << "2. Register\n";
        cout << "0. Exit\n";
        cout << "Choice: ";
        cin >> choice;

        if (choice == 1) {
            string u, p;
            cout << "Username: "; cin >> u;
            cout << "Password: "; cin >> p;
            User* user = findUser(u);
            if (user && user->password == p) {
                currentUser = user;
                cout << "Login Successful!\n";
                pauseScreen();
                userMenu();
            } else {
                cout << "Invalid Credentials.\n";
                pauseScreen();
            }
        }
        else if (choice == 2) {
            string u, p, f;
            cout << "Enter Username: "; cin >> u;
            if (findUser(u)) {
                cout << "Username taken.\n";
                pauseScreen();
                continue;
            }
            cout << "Enter Password: "; cin >> p;
            cin.ignore();
            cout << "Enter Full Name: "; getline(cin, f);
            addUser(u, p, f);
            cout << "Registered Successfully! Please Login.\n";
            saveDatabase();
            pauseScreen();
        }
    } while (choice != 0);
}

int main() {
    loadDatabase();

    mainMenu();

    return 0;
}