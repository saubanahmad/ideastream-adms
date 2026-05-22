// Windows version definitions - MUST be before httplib.h
#ifdef _WIN32
#ifndef _WIN32_WINNT
#define _WIN32_WINNT 0x0A00  // Windows 10
#endif
#ifndef WINVER
#define WINVER 0x0A00
#endif
#endif

#include <iostream>
#include <string>
#include <fstream>
#include <sstream>
#include <ctime>
#include <cstdlib>
#include <map>
#include <random>

#include "httplib.h"

using namespace std;


struct User;
struct Post;
struct Comment;

struct VoterNode {
    string username;
    int voteType; 
    VoterNode* next;
    VoterNode(string u, int v) : username(u), voteType(v), next(NULL) {}
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
    string title;
    string content;
    string themeTag;
    int upvotes;
    int downvotes;
    Comment* commentsHead; 
    VoterNode* votersHead;
    Post* next;
    Post* prev;

    Post(int pid, string author, string txt, string ttl = "", string tag = "Idea Stream", int up = 0, int down = 0) 
        : id(pid), authorUsername(author), content(txt), title(ttl), themeTag(tag), upvotes(up), downvotes(down), 
          commentsHead(nullptr), votersHead(nullptr), next(nullptr), prev(nullptr) {}
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
    ACT_VOTE,
    ACT_DELETE_POST,
    ACT_VIEW_FEED,
    ACT_EDIT_POST 
};

struct HistoryNode {
    ActionType type;
    int postID;      
    string extraData; 
    string authorUsername; 
    int upvotes;
    int downvotes;
    HistoryNode* next;

    HistoryNode(ActionType t, int pid, string data = "", string author = "", int up = 0, int down = 0) 
        : type(t), postID(pid), extraData(data), authorUsername(author), upvotes(up), downvotes(down), next(nullptr) {}
};

User* userHead = nullptr;
Post* postHead = nullptr;
int nextPostID = 1;

map<string, User*> sessions;


class HistoryStack {
private:
    HistoryNode* top;
public:
    HistoryStack() : top(nullptr) {}

    void push(ActionType type, int postID, string extraData = "", string author = "", int up = 0, int down = 0) {
        HistoryNode* newNode = new HistoryNode(type, postID, extraData, author, up, down);
        newNode->next = top;
        top = newNode;
    }

    bool pop(ActionType &type, int &postID, string &extraData, string &author, int &up, int &down) {
        if (!top) return false;
        HistoryNode* temp = top;
        type = temp->type;
        postID = temp->postID;
        extraData = temp->extraData;
        author = temp->authorUsername;
        up = temp->upvotes;
        down = temp->downvotes;
        top = top->next;
        delete temp;
        return true;
    }

    bool isEmpty() { return top == nullptr; }
};

map<string, HistoryStack*> userHistories; 


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


string generateToken() {
    static random_device rd;
    static mt19937 gen(rd());
    static uniform_int_distribution<> dis(0, 15);
    static const char* hex = "0123456789abcdef";
    
    string token;
    for (int i = 0; i < 32; i++) {
        token += hex[dis(gen)];
    }
    return token;
}

string urlDecode(const string& str) {
    string result;
    for (size_t i = 0; i < str.length(); i++) {
        if (str[i] == '+') {
            result += ' ';
        } else if (str[i] == '%' && i + 2 < str.length()) {
            int value;
            sscanf(str.substr(i + 1, 2).c_str(), "%x", &value);
            result += static_cast<char>(value);
            i += 2;
        } else {
            result += str[i];
        }
    }
    return result;
}


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
    
    userHistories[u] = new HistoryStack();
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

void removeFriend(User* u, string friendName) {
    if (!u || !u->friendsHead) return;

    FriendNode* curr = u->friendsHead;
    FriendNode* prev = nullptr;

    while (curr) {
        if (curr->username == friendName) {
            if (prev == nullptr) {
                // Removing the head node
                u->friendsHead = curr->next;
            } else {
                // Removing a middle or tail node
                prev->next = curr->next;
            }
            delete curr;
            return;
        }
        prev = curr;
        curr = curr->next;
    }
}


void createPost(string username, string content, string title = "", string themeTag = "Idea Stream") {
    Post* newPost = new Post(nextPostID++, username, content, title, themeTag);
    
    if (!postHead) {
        postHead = newPost;
    } else {
        Post* temp = postHead;
        while (temp->next) temp = temp->next;
        temp->next = newPost;
        newPost->prev = temp;
    }
}

Post* findPost(int id) {
    Post* temp = postHead;
    while (temp) {
        if (temp->id == id) return temp;
        temp = temp->next;
    }
    return NULL;
}

int getUserVote(Post* p, string username) {
    VoterNode* temp = p->votersHead;
    while(temp) {
        if(temp->username == username) return temp->voteType;
        temp = temp->next;
    }
    return 0; 
}

void votePost(int id, string username, int voteType) {
    Post* p = findPost(id);
    if (!p) return;

    VoterNode* curr = p->votersHead;
    VoterNode* prev = nullptr;
    
    while(curr) {
        if(curr->username == username) {
            if(curr->voteType == 1) p->upvotes--;
            else if(curr->voteType == -1) p->downvotes--;
            
            if(prev) prev->next = curr->next;
            else p->votersHead = curr->next;
            delete curr;
            break;
        }
        prev = curr;
        curr = curr->next;
    }

    if(!curr || curr->voteType != voteType) {
        VoterNode* newVoter = new VoterNode(username, voteType);
        newVoter->next = p->votersHead;
        p->votersHead = newVoter;
        
        if(voteType == 1) p->upvotes++;
        else if(voteType == -1) p->downvotes++;
        
        if(userHistories.find(username) != userHistories.end()) {
            userHistories[username]->push(ACT_VOTE, id, "", "", p->upvotes, p->downvotes);
        }
    }
}

void deletePost(int id, string username) {
    Post* p = findPost(id);
    if (!p || p->authorUsername != username) return;

    // Save to history
    if(userHistories.find(username) != userHistories.end()) {
        userHistories[username]->push(ACT_DELETE_POST, p->id, p->content, p->authorUsername, p->upvotes, p->downvotes);
    }

    if (p == postHead) {
        postHead = p->next;
        if (postHead) postHead->prev = NULL;
    } else {
        if (p->prev) p->prev->next = p->next;
        if (p->next) p->next->prev = p->prev;
    }
    
    delete p;
}

void editPost(int id, string username, string newContent) {
    Post* p = findPost(id);
    if (p && p->authorUsername == username) {
        p->content = newContent;
    }
}

void addComment(int id, string username, string txt) {
    Post* p = findPost(id);
    if (p) {
        Comment* c = new Comment(username, txt);
        c->next = p->commentsHead;
        p->commentsHead = c;
    }
}


string postToJSON(Post* p, string currentUsername = "") {
    stringstream ss;
    ss << "{";
    ss << "\"id\":" << p->id << ",";
    ss << "\"author\":\"" << p->authorUsername << "\",";
    ss << "\"title\":\"" << p->title << "\",";
    ss << "\"content\":\"" << p->content << "\",";
    ss << "\"themeTag\":\"" << p->themeTag << "\",";
    ss << "\"upvotes\":" << p->upvotes << ",";
    ss << "\"downvotes\":" << p->downvotes << ",";
    ss << "\"score\":" << (p->upvotes - p->downvotes) << ",";
    
    // Get user's vote if logged in
    int userVote = 0;
    if (!currentUsername.empty()) {
        userVote = getUserVote(p, currentUsername);
    }
    ss << "\"userVote\":" << userVote << ",";
    
    // Comments
    ss << "\"comments\":[";
    Comment* c = p->commentsHead;
    bool first = true;
    while(c) {
        if(!first) ss << ",";
        ss << "{\"author\":\"" << c->author << "\",\"content\":\"" << c->content << "\"}";
        first = false;
        c = c->next;
    }
    ss << "]";
    ss << "}";
    return ss.str();
}

string getFIFOFeedJSON(string currentUsername = "") {
    PostQueue feedQueue;
    Post* temp = postHead;
    while (temp) {
        feedQueue.enqueue(temp);
        temp = temp->next;
    }

    stringstream ss;
    ss << "[";
    bool first = true;
    while (!feedQueue.isEmpty()) {
        Post* p = feedQueue.dequeue();
        if(!first) ss << ",";
        ss << postToJSON(p, currentUsername);
        first = false;
    }
    ss << "]";
    return ss.str();
}

string getTrendingFeedJSON(string currentUsername = "") {
    int count = 0;
    Post* temp = postHead;
    while(temp) { count++; temp = temp->next; }

    if(count == 0) return "[]";

    Post** postArray = new Post*[count];
    temp = postHead;
    int i = 0;
    while(temp) {
        postArray[i++] = temp;
        temp = temp->next;
    }

    // Sort by score (upvotes - downvotes)
    for(int k=0; k<count-1; k++) {
        for(int j=0; j<count-k-1; j++) {
            int score1 = postArray[j]->upvotes - postArray[j]->downvotes;
            int score2 = postArray[j+1]->upvotes - postArray[j+1]->downvotes;
            if(score1 < score2) {
                Post* swapTemp = postArray[j];
                postArray[j] = postArray[j+1];
                postArray[j+1] = swapTemp;
            }
        }
    }

    stringstream ss;
    ss << "[";
    for(int k=0; k<count; k++) {
        if(k > 0) ss << ",";
        ss << postToJSON(postArray[k], currentUsername);
    }
    ss << "]";
    
    delete[] postArray;
    return ss.str();
}

string searchPostsJSON(string keyword, string currentUsername = "") {
    stringstream ss;
    ss << "[";
    Post* temp = postHead;
    bool first = true;
    while (temp) {
        if (temp->content.find(keyword) != string::npos || temp->authorUsername.find(keyword) != string::npos) {
            if(!first) ss << ",";
            ss << postToJSON(temp, currentUsername);
            first = false;
        }
        temp = temp->next;
    }
    ss << "]";
    return ss.str();
}

string getFilteredFeedJSON(string themeTag, string feedType = "fifo", string currentUsername = "") {
    if (feedType == "trending") {
        // For trending, filter and sort by score
        int count = 0;
        Post* temp = postHead;
        while(temp) {
            if (temp->themeTag == themeTag) count++;
            temp = temp->next;
        }

        if(count == 0) return "[]";

        Post** postArray = new Post*[count];
        temp = postHead;
        int i = 0;
        while(temp) {
            if (temp->themeTag == themeTag) {
                postArray[i++] = temp;
            }
            temp = temp->next;
        }

        // Sort by score
        for(int k=0; k<count-1; k++) {
            for(int j=0; j<count-k-1; j++) {
                int score1 = postArray[j]->upvotes - postArray[j]->downvotes;
                int score2 = postArray[j+1]->upvotes - postArray[j+1]->downvotes;
                if(score1 < score2) {
                    Post* tmp = postArray[j];
                    postArray[j] = postArray[j+1];
                    postArray[j+1] = tmp;
                }
            }
        }

        stringstream ss;
        ss << "[";
        for(int k=0; k<count; k++) {
            if(k > 0) ss << ",";
            ss << postToJSON(postArray[k], currentUsername);
        }
        ss << "]";
        
        delete[] postArray;
        return ss.str();
    } else {
        // FIFO feed
        PostQueue feedQueue;
        Post* temp = postHead;
        while (temp) {
            if (temp->themeTag == themeTag) {
                feedQueue.enqueue(temp);
            }
            temp = temp->next;
        }

        stringstream ss;
        ss << "[";
        bool first = true;
        while (!feedQueue.isEmpty()) {
            Post* p = feedQueue.dequeue();
            if(!first) ss << ",";
            ss << postToJSON(p, currentUsername);
            first = false;
        }
        ss << "]";
        return ss.str();
    }
}

string getFriendsJSON(User* u) {
    stringstream ss;
    ss << "[";
    FriendNode* temp = u->friendsHead;
    bool first = true;
    while(temp) {
        if(!first) ss << ",";
        User* friendUser = findUser(temp->username);
        ss << "{\"username\":\"" << temp->username << "\"";
        if(friendUser) {
            ss << ",\"fullName\":\"" << friendUser->fullName << "\"";
        }
        ss << "}";
        first = false;
        temp = temp->next;
    }
    ss << "]";
    return ss.str();
}

string getAllUsersJSON(string currentUsername) {
    stringstream ss;
    ss << "[";
    User* temp = userHead;
    bool first = true;
    while(temp) {
        if(temp->username != currentUsername) {
            // Check if already friend
            bool isFriend = false;
            User* current = findUser(currentUsername);
            if(current) {
                FriendNode* f = current->friendsHead;
                while(f) {
                    if(f->username == temp->username) {
                        isFriend = true;
                        break;
                    }
                    f = f->next;
                }
            }
            
            if(!isFriend) {
                if(!first) ss << ",";
                ss << "{\"username\":\"" << temp->username << "\",\"fullName\":\"" << temp->fullName << "\"}";
                first = false;
            }
        }
        temp = temp->next;
    }
    ss << "]";
    return ss.str();
}


string undoLastAction(string username) {
    if(userHistories.find(username) == userHistories.end() || userHistories[username]->isEmpty()) {
        return "{\"status\":\"error\",\"message\":\"Nothing to undo\"}";
    }

    ActionType type;
    int pid;
    string extra, author;
    int up, down;

    userHistories[username]->pop(type, pid, extra, author, up, down);

    if (type == ACT_VOTE) {
        Post* p = findPost(pid);
        if (p) {
            VoterNode* curr = p->votersHead;
            VoterNode* prev = nullptr;
            while(curr) {
                if(curr->username == username) {
                    if(curr->voteType == 1) p->upvotes--;
                    else if(curr->voteType == -1) p->downvotes--;
                    
                    if(prev) prev->next = curr->next;
                    else p->votersHead = curr->next;
                    delete curr;
                    break;
                }
                prev = curr;
                curr = curr->next;
            }
            return "{\"status\":\"success\",\"message\":\"Vote undone\"}";
        }
    } 
    else if (type == ACT_DELETE_POST) {
        Post* restored = new Post(pid, author, extra, "", "Idea Stream", up, down);
        if (!postHead) {
            postHead = restored;
        } else {
            Post* temp = postHead;
            while (temp->next) temp = temp->next;
            temp->next = restored;
            restored->prev = temp;
        }
        return "{\"status\":\"success\",\"message\":\"Post restored\"}";
    }

    return "{\"status\":\"success\",\"message\":\"Action undone\"}";
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
        postFile << p->id << "|" << p->authorUsername << "|" << p->title << "|" << p->themeTag << "|" << p->upvotes << "|" << p->downvotes << "|" << p->content << endl;
        p = p->next;
    }
    postFile.close();

    ofstream votesFile("votes.txt");
    p = postHead;
    while(p) {
        VoterNode* vn = p->votersHead;
        while(vn) {
            votesFile << p->id << "|" << vn->username << "|" << vn->voteType << endl;
            vn = vn->next;
        }
        p = p->next;
    }
    votesFile.close();

    ofstream commentsFile("comments.txt");
    p = postHead;
    while(p) {
        Comment* c = p->commentsHead;
        while(c) {
            commentsFile << p->id << "|" << c->author << "|" << c->content << endl;
            c = c->next;
        }
        p = p->next;
    }
    commentsFile.close();
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
            string sid, sauthor, stitle, stheme, sup, sdown, scontent;
            
            getline(ss, sid, '|');
            getline(ss, sauthor, '|');
            getline(ss, stitle, '|');
            getline(ss, stheme, '|');
            getline(ss, sup, '|');
            getline(ss, sdown, '|');
            getline(ss, scontent, '|');

            if (!sid.empty()) {
                int pid = atoi(sid.c_str());
                int upvotes = sup.empty() ? 0 : atoi(sup.c_str());
                int downvotes = sdown.empty() ? 0 : atoi(sdown.c_str());
                
                Post* newPost = new Post(pid, sauthor, scontent, stitle, stheme, upvotes, downvotes);
                
                if (!postHead) {
                    postHead = newPost;
                } else {
                    Post* temp = postHead;
                    while (temp->next) temp = temp->next;
                    temp->next = newPost;
                    newPost->prev = temp;
                }
                
                if (pid >= nextPostID) nextPostID = pid + 1;
            }
        }
        postFile.close();
    }

    ifstream votesFile("votes.txt");
    if (votesFile.is_open()) {
        while(getline(votesFile, line)) {
             stringstream ss(line);
             string sid, uname, svote;
             getline(ss, sid, '|');
             getline(ss, uname, '|');
             getline(ss, svote, '|');

             if(!sid.empty() && !uname.empty()) {
                 int id = atoi(sid.c_str());
                 int voteType = atoi(svote.c_str());
                 Post* p = findPost(id);
                 if(p) {
                     VoterNode* vn = new VoterNode(uname, voteType);
                     vn->next = p->votersHead;
                     p->votersHead = vn;
                 }
             }
        }
        votesFile.close();
    }

    ifstream commentsFile("comments.txt");
    if (commentsFile.is_open()) {
        while(getline(commentsFile, line)) {
            stringstream ss(line);
            string sid, author, content;
            getline(ss, sid, '|');
            getline(ss, author, '|');
            getline(ss, content, '|');
            
            if(!sid.empty()) {
                int id = atoi(sid.c_str());
                Post* p = findPost(id);
                if(p) {
                    Comment* c = new Comment(author, content);
                    c->next = p->commentsHead;
                    p->commentsHead = c;
                }
            }
        }
        commentsFile.close();
    }
}


int main() {
    loadDatabase();

    httplib::Server svr;

    svr.set_mount_point("/", "./html");
    svr.set_mount_point("/assets", "./assets");

    svr.Post("/api/login", [](const httplib::Request& req, httplib::Response& res) {
        auto username = req.get_param_value("username");
        auto password = req.get_param_value("password");

        User* user = findUser(username);
        if (user && user->password == password) {
            string token = generateToken();
            sessions[token] = user;
            
            res.set_header("Set-Cookie", "token=" + token + "; Path=/; HttpOnly");
            res.set_content("{\"status\":\"success\",\"token\":\"" + token + "\",\"username\":\"" + username + "\"}", "application/json");
        } else {
            res.set_content("{\"status\":\"error\",\"message\":\"Invalid credentials\"}", "application/json");
        }
    });

    svr.Post("/api/signup", [](const httplib::Request& req, httplib::Response& res) {
        auto username = req.get_param_value("username");
        auto password = req.get_param_value("password");
        auto fullName = req.get_param_value("name");

        if (findUser(username)) {
            res.set_content("{\"status\":\"error\",\"message\":\"Username already taken\"}", "application/json");
            return;
        }

        addUser(username, password, fullName);
        saveDatabase();
        res.set_content("{\"status\":\"success\",\"message\":\"Registration successful\"}", "application/json");
    });

    svr.Get("/api/logout", [](const httplib::Request& req, httplib::Response& res) {
        string token;
        if (req.has_header("Cookie")) {
            string cookie = req.get_header_value("Cookie");
            size_t pos = cookie.find("token=");
            if (pos != string::npos) {
                token = cookie.substr(pos + 6, 32);
                sessions.erase(token);
            }
        }
        res.set_header("Set-Cookie", "token=; Path=/; HttpOnly; Max-Age=0");
        res.set_content("{\"status\":\"success\"}", "application/json");
    });

    svr.Get("/api/feed/fifo", [](const httplib::Request& req, httplib::Response& res) {
        string token;
        string currentUser;
        if (req.has_header("Cookie")) {
            string cookie = req.get_header_value("Cookie");
            size_t pos = cookie.find("token=");
            if (pos != string::npos) {
                token = cookie.substr(pos + 6, 32);
                if(sessions.find(token) != sessions.end()) {
                    currentUser = sessions[token]->username;
                }
            }
        }
        res.set_content(getFIFOFeedJSON(currentUser), "application/json");
    });

    svr.Get("/api/feed/trending", [](const httplib::Request& req, httplib::Response& res) {
        string token;
        string currentUser;
        if (req.has_header("Cookie")) {
            string cookie = req.get_header_value("Cookie");
            size_t pos = cookie.find("token=");
            if (pos != string::npos) {
                token = cookie.substr(pos + 6, 32);
                if(sessions.find(token) != sessions.end()) {
                    currentUser = sessions[token]->username;
                }
            }
        }
        res.set_content(getTrendingFeedJSON(currentUser), "application/json");
    });

    svr.Get("/api/feed/filtered", [](const httplib::Request& req, httplib::Response& res) {
        string token;
        string currentUser;
        if (req.has_header("Cookie")) {
            string cookie = req.get_header_value("Cookie");
            size_t pos = cookie.find("token=");
            if (pos != string::npos) {
                token = cookie.substr(pos + 6, 32);
                if(sessions.find(token) != sessions.end()) {
                    currentUser = sessions[token]->username;
                }
            }
        }
        
        string themeTag = req.get_param_value("theme");
        string feedType = req.get_param_value("type");
        if (feedType.empty()) feedType = "fifo";
        
        res.set_content(getFilteredFeedJSON(themeTag, feedType, currentUser), "application/json");
    });

    svr.Post("/api/post/create", [](const httplib::Request& req, httplib::Response& res) {
        string token;
        if (req.has_header("Cookie")) {
            string cookie = req.get_header_value("Cookie");
            size_t pos = cookie.find("token=");
            if (pos != string::npos) {
                token = cookie.substr(pos + 6, 32);
            }
        }

        if (sessions.find(token) == sessions.end()) {
            res.set_content("{\"status\":\"error\",\"message\":\"Not authenticated\"}", "application/json");
            return;
        }

        User* user = sessions[token];
        string content = req.get_param_value("description");
        string title = req.get_param_value("title");
        string themeTag = req.get_param_value("themeTag");
        
        createPost(user->username, content, title, themeTag);
        saveDatabase();
        res.set_content("{\"status\":\"success\",\"message\":\"Post created\"}", "application/json");
    });

    svr.Post("/api/post/:id/upvote", [](const httplib::Request& req, httplib::Response& res) {
        string token;
        if (req.has_header("Cookie")) {
            string cookie = req.get_header_value("Cookie");
            size_t pos = cookie.find("token=");
            if (pos != string::npos) {
                token = cookie.substr(pos + 6, 32);
            }
        }

        if (sessions.find(token) == sessions.end()) {
            res.set_content("{\"status\":\"error\",\"message\":\"Not authenticated\"}", "application/json");
            return;
        }

        User* user = sessions[token];
        int postId = stoi(req.path_params.at("id"));
        
        votePost(postId, user->username, 1);
        saveDatabase();
        
        Post* p = findPost(postId);
        if(p) {
            res.set_content("{\"status\":\"success\",\"upvotes\":" + to_string(p->upvotes) + 
                          ",\"downvotes\":" + to_string(p->downvotes) + 
                          ",\"score\":" + to_string(p->upvotes - p->downvotes) + "}", "application/json");
        } else {
            res.set_content("{\"status\":\"error\",\"message\":\"Post not found\"}", "application/json");
        }
    });

    svr.Post("/api/post/:id/downvote", [](const httplib::Request& req, httplib::Response& res) {
        string token;
        if (req.has_header("Cookie")) {
            string cookie = req.get_header_value("Cookie");
            size_t pos = cookie.find("token=");
            if (pos != string::npos) {
                token = cookie.substr(pos + 6, 32);
            }
        }

        if (sessions.find(token) == sessions.end()) {
            res.set_content("{\"status\":\"error\",\"message\":\"Not authenticated\"}", "application/json");
            return;
        }

        User* user = sessions[token];
        int postId = stoi(req.path_params.at("id"));
        
        votePost(postId, user->username, -1);
        saveDatabase();
        
        Post* p = findPost(postId);
        if(p) {
            res.set_content("{\"status\":\"success\",\"upvotes\":" + to_string(p->upvotes) + 
                          ",\"downvotes\":" + to_string(p->downvotes) + 
                          ",\"score\":" + to_string(p->upvotes - p->downvotes) + "}", "application/json");
        } else {
            res.set_content("{\"status\":\"error\",\"message\":\"Post not found\"}", "application/json");
        }
    });

    svr.Delete("/api/post/:id", [](const httplib::Request& req, httplib::Response& res) {
        string token;
        if (req.has_header("Cookie")) {
            string cookie = req.get_header_value("Cookie");
            size_t pos = cookie.find("token=");
            if (pos != string::npos) {
                token = cookie.substr(pos + 6, 32);
            }
        }

        if (sessions.find(token) == sessions.end()) {
            res.set_content("{\"status\":\"error\",\"message\":\"Not authenticated\"}", "application/json");
            return;
        }

        User* user = sessions[token];
        int postId = stoi(req.path_params.at("id"));
        
        deletePost(postId, user->username);
        saveDatabase();
        res.set_content("{\"status\":\"success\",\"message\":\"Post deleted\"}", "application/json");
    });

    svr.Put("/api/post/:id", [](const httplib::Request& req, httplib::Response& res) {
        string token;
        if (req.has_header("Cookie")) {
            string cookie = req.get_header_value("Cookie");
            size_t pos = cookie.find("token=");
            if (pos != string::npos) {
                token = cookie.substr(pos + 6, 32);
            }
        }

        if (sessions.find(token) == sessions.end()) {
            res.set_content("{\"status\":\"error\",\"message\":\"Not authenticated\"}", "application/json");
            return;
        }

        User* user = sessions[token];
        int postId = stoi(req.path_params.at("id"));
        string newContent = req.get_param_value("content");
        
        editPost(postId, user->username, newContent);
        saveDatabase();
        res.set_content("{\"status\":\"success\",\"message\":\"Post updated\"}", "application/json");
    });

    svr.Post("/api/post/:id/comment", [](const httplib::Request& req, httplib::Response& res) {
        string token;
        if (req.has_header("Cookie")) {
            string cookie = req.get_header_value("Cookie");
            size_t pos = cookie.find("token=");
            if (pos != string::npos) {
                token = cookie.substr(pos + 6, 32);
            }
        }

        if (sessions.find(token) == sessions.end()) {
            res.set_content("{\"status\":\"error\",\"message\":\"Not authenticated\"}", "application/json");
            return;
        }

        User* user = sessions[token];
        int postId = stoi(req.path_params.at("id"));
        string comment = req.get_param_value("comment");
        
        addComment(postId, user->username, comment);
        saveDatabase();
        res.set_content("{\"status\":\"success\",\"message\":\"Comment added\"}", "application/json");
    });

    svr.Get("/api/search", [](const httplib::Request& req, httplib::Response& res) {
        string keyword = req.get_param_value("q");
        string token;
        string currentUser;
        if (req.has_header("Cookie")) {
            string cookie = req.get_header_value("Cookie");
            size_t pos = cookie.find("token=");
            if (pos != string::npos) {
                token = cookie.substr(pos + 6, 32);
                if(sessions.find(token) != sessions.end()) {
                    currentUser = sessions[token]->username;
                }
            }
        }
        res.set_content(searchPostsJSON(keyword, currentUser), "application/json");
    });

    svr.Get("/api/friends", [](const httplib::Request& req, httplib::Response& res) {
        string token;
        if (req.has_header("Cookie")) {
            string cookie = req.get_header_value("Cookie");
            size_t pos = cookie.find("token=");
            if (pos != string::npos) {
                token = cookie.substr(pos + 6, 32);
            }
        }

        if (sessions.find(token) == sessions.end()) {
            res.set_content("{\"status\":\"error\",\"message\":\"Not authenticated\"}", "application/json");
            return;
        }

        User* user = sessions[token];
        res.set_content(getFriendsJSON(user), "application/json");
    });

    svr.Get("/api/users", [](const httplib::Request& req, httplib::Response& res) {
        string token;
        if (req.has_header("Cookie")) {
            string cookie = req.get_header_value("Cookie");
            size_t pos = cookie.find("token=");
            if (pos != string::npos) {
                token = cookie.substr(pos + 6, 32);
            }
        }

        if (sessions.find(token) == sessions.end()) {
            res.set_content("{\"status\":\"error\",\"message\":\"Not authenticated\"}", "application/json");
            return;
        }

        User* user = sessions[token];
        res.set_content(getAllUsersJSON(user->username), "application/json");
    });

    svr.Post("/api/friend/add", [](const httplib::Request& req, httplib::Response& res) {
        string token;
        if (req.has_header("Cookie")) {
            string cookie = req.get_header_value("Cookie");
            size_t pos = cookie.find("token=");
            if (pos != string::npos) {
                token = cookie.substr(pos + 6, 32);
            }
        }

        if (sessions.find(token) == sessions.end()) {
            res.set_content("{\"status\":\"error\",\"message\":\"Not authenticated\"}", "application/json");
            return;
        }

        User* user = sessions[token];
        string friendUsername = req.get_param_value("username");
        
        if(findUser(friendUsername)) {
            addFriend(user, friendUsername);
            saveDatabase();
            res.set_content("{\"status\":\"success\",\"message\":\"Friend added\"}", "application/json");
        } else {
            res.set_content("{\"status\":\"error\",\"message\":\"User not found\"}", "application/json");
        }
    });

    svr.Post("/api/friend/remove", [](const httplib::Request& req, httplib::Response& res) {
        string token;
        if (req.has_header("Cookie")) {
            string cookie = req.get_header_value("Cookie");
            size_t pos = cookie.find("token=");
            if (pos != string::npos) {
                token = cookie.substr(pos + 6, 32);
            }
        }

        if (sessions.find(token) == sessions.end()) {
            res.set_content("{\"status\":\"error\",\"message\":\"Not authenticated\"}", "application/json");
            return;
        }

        User* user = sessions[token];
        string friendUsername = req.get_param_value("username");
        
        removeFriend(user, friendUsername);
        saveDatabase();
        res.set_content("{\"status\":\"success\",\"message\":\"Friend removed\"}", "application/json");
    });

    svr.Get("/api/user/current", [](const httplib::Request& req, httplib::Response& res) {
        string token;
        if (req.has_header("Cookie")) {
            string cookie = req.get_header_value("Cookie");
            size_t pos = cookie.find("token=");
            if (pos != string::npos) {
                token = cookie.substr(pos + 6, 32);
            }
        }

        if (sessions.find(token) == sessions.end()) {
            res.set_content("{\"status\":\"error\",\"message\":\"Not authenticated\"}", "application/json");
            return;
        }

        User* user = sessions[token];
        res.set_content("{\"username\":\"" + user->username + "\",\"fullName\":\"" + user->fullName + "\"}", "application/json");
    });

    svr.Put("/api/user/profile", [](const httplib::Request& req, httplib::Response& res) {
        string token;
        if (req.has_header("Cookie")) {
            string cookie = req.get_header_value("Cookie");
            size_t pos = cookie.find("token=");
            if (pos != string::npos) {
                token = cookie.substr(pos + 6, 32);
            }
        }

        if (sessions.find(token) == sessions.end()) {
            res.set_content("{\"status\":\"error\",\"message\":\"Not authenticated\"}", "application/json");
            return;
        }

        User* user = sessions[token];
        string newName = req.get_param_value("fullName");
        string newPass = req.get_param_value("password");
        
        if(!newName.empty() && newName != ".") user->fullName = newName;
        if(!newPass.empty() && newPass != ".") user->password = newPass;
        
        saveDatabase();
        res.set_content("{\"status\":\"success\",\"message\":\"Profile updated\"}", "application/json");
    });

    svr.Post("/api/undo", [](const httplib::Request& req, httplib::Response& res) {
        string token;
        if (req.has_header("Cookie")) {
            string cookie = req.get_header_value("Cookie");
            size_t pos = cookie.find("token=");
            if (pos != string::npos) {
                token = cookie.substr(pos + 6, 32);
            }
        }

        if (sessions.find(token) == sessions.end()) {
            res.set_content("{\"status\":\"error\",\"message\":\"Not authenticated\"}", "application/json");
            return;
        }

        User* user = sessions[token];
        string result = undoLastAction(user->username);
        saveDatabase();
        res.set_content(result, "application/json");
    });

    cout << "Server starting on http://localhost:8080\n";
    cout << "Press Ctrl+C to stop the server\n";
    svr.listen("0.0.0.0", 8080);

    return 0;
}
