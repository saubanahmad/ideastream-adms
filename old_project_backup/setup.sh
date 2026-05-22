#!/bin/bash

# SocialConnect Web - Quick Setup Script

echo "========================================="
echo "   SocialConnect Web Setup"
echo "========================================="
echo ""

# Step 1: Download cpp-httplib
echo "Step 1: Download cpp-httplib header"
echo "---------------------------------------"
echo "Please download httplib.h from:"
echo "https://github.com/yhirose/cpp-httplib/releases"
echo ""
echo "Or use this direct link:"
echo "https://raw.githubusercontent.com/yhirose/cpp-httplib/master/httplib.h"
echo ""
echo "Place httplib.h in this directory:"
echo "$(pwd)"
echo ""
read -p "Press Enter when you've downloaded httplib.h..."

# Step 2: Check if file exists
if [ ! -f "httplib.h" ]; then
    echo "ERROR: httplib.h not found in current directory!"
    echo "Please download it and try again."
    exit 1
fi

echo "✓ httplib.h found!"
echo ""

# Step 3: Compile
echo "Step 2: Compiling SocialConnectWeb.cpp"
echo "---------------------------------------"

if command -v g++ &> /dev/null; then
    echo "Using g++ compiler..."
    g++ -o SocialConnectWeb SocialConnectWeb.cpp -std=c++11 -pthread -lws2_32 2>&1
    
    if [ $? -eq 0 ]; then
        echo "✓ Compilation successful!"
    else
        echo "✗ Compilation failed. Check errors above."
        exit 1
    fi
else
    echo "ERROR: g++ compiler not found!"
    echo "Please install MinGW or GCC and try again."
    exit 1
fi

echo ""

# Step 4: Run server
echo "Step 3: Starting server"
echo "---------------------------------------"
echo "Server will start on http://localhost:8080"
echo ""
echo "Open your browser and go to:"
echo "  → http://localhost:8080/login_new.html"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""
echo "========================================="
echo ""

./SocialConnectWeb
