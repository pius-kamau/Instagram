// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        document.getElementById('login-screen').classList.add('hidden');
        initializeApp();
    }

    // Login form submission
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        if (username && password) {
            // Create user if doesn't exist
            let users = JSON.parse(localStorage.getItem('users')) || [];
            let user = users.find(u => u.username === username);
            
            if (!user) {
                user = {
                    id: Date.now().toString(),
                    username: username,
                    fullName: username,
                    bio: 'Hello, I am new to Photogram!',
                    followers: [],
                    following: [],
                    posts: []
                };
                users.push(user);
                localStorage.setItem('users', JSON.stringify(users));
            }
            
            localStorage.setItem('currentUser', JSON.stringify(user));
            document.getElementById('login-screen').classList.add('hidden');
            initializeApp();
        }
    });

    // Signup form submission
    document.getElementById('signup-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const fullName = document.getElementById('signup-name').value;
        const username = document.getElementById('signup-username').value;
        const password = document.getElementById('signup-password').value;
        
        if (fullName && username && password) {
            // Create new user
            let users = JSON.parse(localStorage.getItem('users')) || [];
            const user = {
                id: Date.now().toString(),
                username: username,
                fullName: fullName,
                bio: 'Hello, I am new to Photogram!',
                followers: [],
                following: [],
                posts: []
            };
            
            users.push(user);
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            document.getElementById('signup-screen').classList.add('hidden');
            initializeApp();
        }
    });

    // Show signup screen
    document.getElementById('show-signup').addEventListener('click', function() {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('signup-screen').classList.remove('hidden');
    });

    // Show login screen
    document.getElementById('show-login').addEventListener('click', function() {
        document.getElementById('signup-screen').classList.add('hidden');
        document.getElementById('login-screen').classList.remove('hidden');
    });
});

function initializeApp() {
    // Initialize data if not exists
    if (!localStorage.getItem('posts')) {
        initializeData();
    }
    
    // Load posts
    loadPosts();
    
    // Load stories
    loadStories();
    
    // Setup event listeners
    setupEventListeners();
    
    // Update profile data
    updateProfileData();
    
    // Load explore posts
    loadExplorePosts();
    
    // Load activity
    loadActivity();
}

function initializeData() {
    // Sample users
    const users = [
        {
            id: '1',
            username: 'travel_adventures',
            fullName: 'Travel Adventures',
            bio: 'Exploring the world one destination at a time ✈️',
            followers: [],
            following: [],
            posts: ['1', '4']
        },
        {
            id: '2',
            username: 'food_lover',
            fullName: 'Food Lover',
            bio: 'Food enthusiast and home chef 🍳',
            followers: [],
            following: [],
            posts: ['2']
        },
        {
            id: '3',
            username: 'tech_enthusiast',
            fullName: 'Tech Enthusiast',
            bio: 'Always on the lookout for the latest gadgets 📱',
            followers: [],
            following: [],
            posts: ['3']
        }
    ];
    
    // Sample posts
    const posts = [
        {
            id: '1',
            userId: '1',
            imageUrl: '',
            caption: 'Paradise found in Bali! The perfect sunset at Uluwatu Temple 🌅 #bali #travel #sunset',
            location: 'Bali, Indonesia',
            likes: [],
            comments: [
                {
                    userId: 'adventure_seeker',
                    text: 'Wow! This looks amazing! 😍',
                    timestamp: Date.now() - 3600000
                }
            ],
            timestamp: Date.now() - 7200000
        },
        {
            id: '2',
            userId: '2',
            imageUrl: '',
            caption: 'Brunch goals! Avocado toast with poached eggs and a side of fresh fruit 🥑🍳 #foodie #brunch',
            location: 'Downtown Cafe',
            likes: [],
            comments: [
                {
                    userId: 'healthy_eats',
                    text: 'This looks delicious! Recipe please?',
                    timestamp: Date.now() - 10800000
                }
            ],
            timestamp: Date.now() - 18000000
        },
        {
            id: '3',
            userId: '3',
            imageUrl: '',
            caption: 'Just got my hands on the latest gadget at the tech conference! This is going to change everything 🚀 #innovation #tech #future',
            location: 'Tech Conference',
            likes: [],
            comments: [
                {
                    userId: 'gadget_lover',
                    text: 'No way! How did you get early access?',
                    timestamp: Date.now() - 1800000
                }
            ],
            timestamp: Date.now() - 3600000
        },
        {
            id: '4',
            userId: '1',
            imageUrl: '',
            caption: 'Mountain views that take your breath away ⛰️ #hiking #nature #adventure',
            location: 'Mountain Range',
            likes: [],
            comments: [],
            timestamp: Date.now() - 86400000
        }
    ];
    
    // Save to localStorage
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('posts', JSON.stringify(posts));
}

function loadPosts() {
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = '';
    
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Sort posts by timestamp (newest first)
    posts.sort((a, b) => b.timestamp - a.timestamp);
    
    posts.forEach(post => {
        const user = users.find(u => u.id === post.userId);
        if (!user) return;
        
        const postElement = createPostElement(post, user, currentUser);
        postsContainer.appendChild(postElement);
    });
}

function createPostElement(post, user, currentUser) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post bg-white rounded-xl mb-6 overflow-hidden fade-in';
    postDiv.dataset.postId = post.id;
    
    const isLiked = post.likes.includes(currentUser.id);
    const likeIconClass = isLiked ? 'fas fa-heart text-red-500' : 'far fa-heart';
    
    const timeAgo = getTimeAgo(post.timestamp);
    
    postDiv.innerHTML = `
        <!-- Post Header -->
        <div class="post-header flex items-center justify-between p-4">
            <div class="flex items-center">
                <div class="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 mr-3 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                    </svg>
                </div>
                <div>
                    <div class="flex items-center">
                        <span class="font-semibold text-sm">${user.username}</span>
                        <span class="ml-1 text-blue-500">
                            <i class="fas fa-check-circle text-xs"></i>
                        </span>
                    </div>
                    <span class="text-xs text-gray-500 block">${post.location || ''}</span>
                </div>
            </div>
            <button class="focus:outline-none post-menu" data-post-id="${post.id}">
                <i class="fas fa-ellipsis-h"></i>
            </button>
        </div>
        
        <!-- Post Image -->
        <div class="post-image relative">
            <div class="aspect-w-4 aspect-h-5 bg-gradient-to-br from-purple-100 to-blue-100">
                ${post.imageUrl ? `<img src="${post.imageUrl}" class="w-full h-full object-cover" alt="Post image">` : `
                <svg class="w-full h-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0H5C2.239 0 0 2.239 0 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5V5c0-2.761-2.238-5-5-5zM6.5 8a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm11 8.5c0 .828-.672 1.5-1.5 1.5h-8C7.172 18 6.5 17.328 6.5 16.5v-4c0-.653.423-1.202 1-1.408V9.5C7.5 7.57 9.07 6 11 6s3.5 1.57 3.5 3.5v1.592c.577.206 1 .755 1 1.408v4z"/>
                </svg>
                `}
            </div>
            <div class="heart-overlay absolute inset-0 flex items-center justify-center pointer-events-none">
                <i class="fas fa-heart text-white text-7xl drop-shadow-lg"></i>
            </div>
        </div>
        
        <!-- Post Actions -->
        <div class="post-actions p-4">
            <div class="flex justify-between">
                <div class="flex space-x-5">
                    <button class="like-button focus:outline-none like-animation" data-post-id="${post.id}">
                        <i class="${likeIconClass} text-2xl"></i>
                    </button>
                    <button class="focus:outline-none comment-button" data-post-id="${post.id}">
                        <i class="far fa-comment text-2xl"></i>
                    </button>
                    <button class="focus:outline-none">
                        <i class="far fa-paper-plane text-2xl"></i>
                    </button>
                </div>
                <button class="focus:outline-none bookmark-button" data-post-id="${post.id}">
                    <i class="far fa-bookmark text-2xl"></i>
                </button>
            </div>
            
            <!-- Likes -->
            <div class="likes mt-3">
                <span class="font-semibold text-sm">${post.likes.length} likes</span>
            </div>
            
            <!-- Caption -->
            <div class="caption mt-2">
                <span class="text-sm">
                    <span class="font-semibold">${user.username}</span>
                    ${post.caption}
                </span>
            </div>
            
            <!-- Comments -->
            <div class="comments mt-2">
                ${post.comments.length > 0 ? `
                    <button class="text-gray-500 text-sm focus:outline-none view-comments-btn" data-post-id="${post.id}">
                        View all ${post.comments.length} comments
                    </button>
                    ${post.comments.slice(0, 1).map(comment => `
                        <div class="comment flex justify-between mt-2">
                            <span class="text-sm">
                                <span class="font-semibold">${comment.userId}</span>
                                ${comment.text}
                            </span>
                            <button class="like-button focus:outline-none">
                                <i class="far fa-heart text-xs"></i>
                            </button>
                        </div>
                    `).join('')}
                ` : ''}
            </div>
            
            <!-- Timestamp -->
            <div class="timestamp mt-2">
                <span class="text-xs text-gray-500">${timeAgo}</span>
            </div>
        </div>
        
        <!-- Add Comment -->
        <div class="add-comment border-t border-gray-100 p-4 flex justify-between items-center">
            <div class="flex items-center flex-1">
                <button class="focus:outline-none mr-3">
                    <i class="far fa-smile text-xl"></i>
                </button>
                <input type="text" placeholder="Add a comment..." class="comment-input text-sm flex-1 bg-transparent" data-post-id="${post.id}">
            </div>
            <button class="text-blue-500 font-semibold text-sm focus:outline-none post-comment-btn" data-post-id="${post.id}">Post</button>
        </div>
    `;
    
    return postDiv;
}

function getTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return interval + ' YEARS AGO';
    if (interval === 1) return '1 YEAR AGO';
    
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return interval + ' MONTHS AGO';
    if (interval === 1) return '1 MONTH AGO';
    
    interval = Math.floor(seconds / 86400);
    if (interval > 1) return interval + ' DAYS AGO';
    if (interval === 1) return '1 DAY AGO';
    
    interval = Math.floor(seconds / 3600);
    if (interval > 1) return interval + ' HOURS AGO';
    if (interval === 1) return '1 HOUR AGO';
    
    interval = Math.floor(seconds / 60);
    if (interval > 1) return interval + ' MINUTES AGO';
    if (interval === 1) return '1 MINUTE AGO';
    
    return 'JUST NOW';
}

function loadStories() {
    const storiesContainer = document.getElementById('stories-container');
    const yourStory = storiesContainer.querySelector('.story-item');
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Add sample stories (first 5 users)
    users.slice(0, 5).forEach(user => {
        const storyItem = document.createElement('div');
        storyItem.className = 'flex flex-col items-center story-item';
        
        // Generate a random color for each user's story ring
        const colors = ['purple', 'pink', 'blue', 'green', 'yellow', 'red', 'indigo', 'orange'];
        const color1 = colors[Math.floor(Math.random() * colors.length)];
        const color2 = colors[Math.floor(Math.random() * colors.length)];
        
        storyItem.innerHTML = `
            <div class="story-ring rounded-full p-0.5 mb-1">
                <div class="bg-white p-0.5 rounded-full">
                    <div class="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-${color1}-400 to-${color2}-500">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full text-white opacity-80" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                        </svg>
                    </div>
                </div>
            </div>
            <span class="text-xs font-medium mt-1">${user.username}</span>
        `;
        
        storiesContainer.appendChild(storyItem);
    });
}

function setupEventListeners() {
    // Create post button
    document.getElementById('create-post-btn').addEventListener('click', showCreatePostModal);
    document.getElementById('create-post-btn-nav').addEventListener('click', showCreatePostModal);
    
    // Close create post modal
    document.getElementById('close-create-post').addEventListener('click', hideCreatePostModal);
    
    // Share post button
    document.getElementById('share-post-btn').addEventListener('click', createNewPost);
    
    // Profile button
    document.getElementById('profile-btn').addEventListener('click', showProfileScreen);
    
    // Back from profile
    document.getElementById('back-from-profile').addEventListener('click', hideProfileScreen);
    
    // Profile tabs
    document.querySelectorAll('.profile-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            
            // Remove active class from all tabs
            document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            document.getElementById(`profile-${tabName}-tab`).classList.add('active');
        });
    });
    
    // Search button
    document.getElementById('search-btn').addEventListener('click', showSearchScreen);
    
    // Back from search
    document.getElementById('back-from-search').addEventListener('click', hideSearchScreen);
    
    // Activity button
    document.getElementById('activity-btn').addEventListener('click', showActivityScreen);
    
    // Back from activity
    document.getElementById('back-from-activity').addEventListener('click', hideActivityScreen);
    
    // Home button
    document.getElementById('home-btn').addEventListener('click', function() {
        hideProfileScreen();
        hideSearchScreen();
        hideActivityScreen();
    });
    
    // Like button event delegation
    document.addEventListener('click', function(e) {
        if (e.target.closest('.like-button')) {
            const button = e.target.closest('.like-button');
            const postId = button.dataset.postId;
            if (postId) toggleLike(button, postId);
        }
        
        if (e.target.closest('.post-image')) {
            const postImage = e.target.closest('.post-image');
            handleDoubleTap(postImage);
        }
        
        if (e.target.closest('.post-comment-btn')) {
            const button = e.target.closest('.post-comment-btn');
            const postId = button.dataset.postId;
            addComment(postId);
        }
    });
    
    // Comment input keypress
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.target.classList.contains('comment-input')) {
            const postId = e.target.dataset.postId;
            addComment(postId);
        }
    });
}

function showCreatePostModal() {
    const modal = document.getElementById('create-post-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

function hideCreatePostModal() {
    const modal = document.getElementById('create-post-modal');
    modal.classList.remove('active');
    
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        
        // Clear form
        document.getElementById('post-image-url').value = '';
        document.getElementById('post-caption').value = '';
        document.getElementById('post-location').value = '';
    }, 300);
}

function createNewPost() {
    const imageUrl = document.getElementById('post-image-url').value;
    const caption = document.getElementById('post-caption').value;
    const location = document.getElementById('post-location').value;
    
    if (!caption) {
        alert('Please add a caption');
        return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Create new post
    const newPost = {
        id: Date.now().toString(),
        userId: currentUser.id,
        imageUrl: imageUrl,
        caption: caption,
        location: location,
        likes: [],
        comments: [],
        timestamp: Date.now()
    };
    
    // Add post to posts array
    posts.push(newPost);
    localStorage.setItem('posts', JSON.stringify(posts));
    
    // Add post to user's posts
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex].posts.push(newPost.id);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Update current user
        localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
    }
    
    // Hide modal
    hideCreatePostModal();
    
    // Reload posts
    loadPosts();
    
    // Update profile data
    updateProfileData();
    
    // Add to activity
    addActivity(`You created a new post`);
}

function toggleLike(button, postId) {
    const icon = button.querySelector('i');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) return;
    
    const post = posts[postIndex];
    const likeIndex = post.likes.indexOf(currentUser.id);
    
    if (likeIndex === -1) {
        // Add like
        post.likes.push(currentUser.id);
        icon.classList.remove('far');
        icon.classList.add('fas', 'text-red-500');
        
        // Add animation
        button.classList.add('animate-pulse');
        setTimeout(() => {
            button.classList.remove('animate-pulse');
        }, 300);
        
        // Add to activity if not current user's post
        if (post.userId !== currentUser.id) {
            addActivity(`You liked a post by ${getUsernameById(post.userId)}`);
        }
    } else {
        // Remove like
        post.likes.splice(likeIndex, 1);
        icon.classList.remove('fas', 'text-red-500');
        icon.classList.add('far');
    }
    
    // Update likes count
    const likesElement = button.closest('.post-actions').querySelector('.likes span');
    likesElement.textContent = `${post.likes.length} likes`;
    
    // Save to localStorage
    localStorage.setItem('posts', JSON.stringify(posts));
}

function handleDoubleTap(postImage) {
    let tapCount = 0;
    let tapTimer;
    
    tapCount++;
    
    if (tapCount === 1) {
        tapTimer = setTimeout(function() {
            tapCount = 0;
        }, 300);
    } else if (tapCount === 2) {
        clearTimeout(tapTimer);
        tapCount = 0;
        
        // Show heart animation
        const heartOverlay = postImage.querySelector('.heart-overlay');
        heartOverlay.style.opacity = '1';
        heartOverlay.style.transform = 'scale(1)';
        
        // Hide after animation
        setTimeout(() => {
            heartOverlay.style.opacity = '0';
            heartOverlay.style.transform = 'scale(0)';
        }, 1000);
        
        // Like the post
        const post = postImage.closest('.post');
        const postId = post.dataset.postId;
        const likeButton = post.querySelector('.like-button');
        const icon = likeButton.querySelector('i');
        
        if (icon.classList.contains('far')) {
            toggleLike(likeButton, postId);
        }
    }
}

function addComment(postId) {
    const commentInput = document.querySelector(`.comment-input[data-post-id="${postId}"]`);
    const commentText = commentInput.value.trim();
    
    if (!commentText) return;
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) return;
    
    // Add comment
    posts[postIndex].comments.push({
        userId: currentUser.username,
        text: commentText,
        timestamp: Date.now()
    });
    
    // Save to localStorage
    localStorage.setItem('posts', JSON.stringify(posts));
    
    // Clear input
    commentInput.value = '';
    
    // Reload posts
    loadPosts();
    
    // Add to activity if not current user's post
    if (posts[postIndex].userId !== currentUser.id) {
        addActivity(`You commented on a post by ${getUsernameById(posts[postIndex].userId)}`);
    }
}

function showProfileScreen() {
    document.getElementById('profile-screen').classList.remove('hidden');
    updateProfileData();
}

function hideProfileScreen() {
    document.getElementById('profile-screen').classList.add('hidden');
}

function updateProfileData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    
    // Find updated user data
    const user = users.find(u => u.id === currentUser.id) || currentUser;
    
    // Update profile header
    document.getElementById('profile-username').textContent = user.username;
    document.getElementById('profile-fullname').textContent = user.fullName;
    document.getElementById('profile-bio').textContent = user.bio;
    
    // Update counts
    document.getElementById('profile-posts-count').textContent = user.posts.length;
    document.getElementById('profile-followers-count').textContent = user.followers.length;
    document.getElementById('profile-following-count').textContent = user.following.length;
    
    // Load profile posts
    const profilePostsGrid = document.getElementById('profile-posts-grid');
    profilePostsGrid.innerHTML = '';
    
    // Get user's posts
    const userPosts = posts.filter(post => post.userId === user.id);
    
    if (userPosts.length === 0) {
        profilePostsGrid.innerHTML = `
            <div class="col-span-3 flex flex-col items-center justify-center py-10">
                <div class="w-16 h-16 rounded-full border-2 border-black flex items-center justify-center mb-4">
                    <i class="fas fa-camera text-2xl"></i>
                </div>
                <h3 class="font-semibold text-lg mb-1">No Posts Yet</h3>
                <p class="text-sm text-gray-500 text-center">When you share photos, they'll appear here.</p>
            </div>
        `;
        return;
    }
    
    // Sort posts by timestamp (newest first)
    userPosts.sort((a, b) => b.timestamp - a.timestamp);
    
    userPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'aspect-square bg-gray-100 relative';
        
        postElement.innerHTML = `
            ${post.imageUrl ? `<img src="${post.imageUrl}" class="w-full h-full object-cover" alt="Post image">` : `
            <svg class="w-full h-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0H5C2.239 0 0 2.239 0 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5V5c0-2.761-2.238-5-5-5zM6.5 8a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm11 8.5c0 .828-.672 1.5-1.5 1.5h-8C7.172 18 6.5 17.328 6.5 16.5v-4c0-.653.423-1.202 1-1.408V9.5C7.5 7.57 9.07 6 11 6s3.5 1.57 3.5 3.5v1.592c.577.206 1 .755 1 1.408v4z"/>
            </svg>
            `}
            <div class="absolute bottom-2 right-2 text-white">
                <i class="fas fa-heart mr-1"></i>${post.likes.length}
                <i class="fas fa-comment ml-2 mr-1"></i>${post.comments.length}
            </div>
        `;
        
        profilePostsGrid.appendChild(postElement);
    });
}

function showSearchScreen() {
    document.getElementById('search-screen').classList.remove('hidden');
}

function hideSearchScreen() {
    document.getElementById('search-screen').classList.add('hidden');
}

function loadExplorePosts() {
    const exploreGrid = document.getElementById('explore-grid');
    exploreGrid.innerHTML = '';
    
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    
    // Sort posts randomly
    const shuffledPosts = [...posts].sort(() => 0.5 - Math.random());
    
    shuffledPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'aspect-square bg-gray-100 relative';
        
        postElement.innerHTML = `
            ${post.imageUrl ? `<img src="${post.imageUrl}" class="w-full h-full object-cover" alt="Post image">` : `
            <svg class="w-full h-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0H5C2.239 0 0 2.239 0 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5V5c0-2.761-2.238-5-5-5zM6.5 8a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm11 8.5c0 .828-.672 1.5-1.5 1.5h-8C7.172 18 6.5 17.328 6.5 16.5v-4c0-.653.423-1.202 1-1.408V9.5C7.5 7.57 9.07 6 11 6s3.5 1.57 3.5 3.5v1.592c.577.206 1 .755 1 1.408v4z"/>
            </svg>
            `}
            <div class="absolute bottom-2 right-2 text-white">
                <i class="fas fa-heart mr-1"></i>${post.likes.length}
                <i class="fas fa-comment ml-2 mr-1"></i>${post.comments.length}
            </div>
        `;
        
        exploreGrid.appendChild(postElement);
    });
}

function showActivityScreen() {
    document.getElementById('activity-screen').classList.remove('hidden');
}

function hideActivityScreen() {
    document.getElementById('activity-screen').classList.add('hidden');
}

function loadActivity() {
    const activityList = document.getElementById('activity-list');
    activityList.innerHTML = '';
    
    const activities = JSON.parse(localStorage.getItem('activities')) || [];
    
    if (activities.length === 0) {
        activityList.innerHTML = `
            <div class="flex flex-col items-center justify-center py-10">
                <div class="w-16 h-16 rounded-full border-2 border-black flex items-center justify-center mb-4">
                    <i class="fas fa-heart text-2xl"></i>
                </div>
                <h3 class="font-semibold text-lg mb-1">Activity Feed</h3>
                <p class="text-sm text-gray-500 text-center">When you interact with posts, it will show up here.</p>
            </div>
        `;
        return;
    }
    
    // Sort activities by timestamp (newest first)
    activities.sort((a, b) => b.timestamp - a.timestamp);
    
    activities.forEach(activity => {
        const activityElement = document.createElement('div');
        activityElement.className = 'flex items-center fade-in';
        
        activityElement.innerHTML = `
            <div class="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 mr-3 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                </svg>
            </div>
            <div class="flex-1">
                <p class="text-sm">${activity.text}</p>
                <p class="text-xs text-gray-500">${getTimeAgo(activity.timestamp)}</p>
            </div>
        `;
        
        activityList.appendChild(activityElement);
    });
}

function addActivity(text) {
    const activities = JSON.parse(localStorage.getItem('activities')) || [];
    
    activities.push({
        text: text,
        timestamp: Date.now()
    });
    
    // Limit to 20 activities
    if (activities.length > 20) {
        activities.shift();
    }
    
    localStorage.setItem('activities', JSON.stringify(activities));
}

function getUsernameById(userId) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.id === userId);
    return user ? user.username : 'unknown';
}