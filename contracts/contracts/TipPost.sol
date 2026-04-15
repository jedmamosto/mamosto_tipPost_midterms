// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TipPost
 * @dev A decentralized social media platform where users can post images and tip creators.
 */
contract TipPost {
    struct Post {
        uint256 id;
        address creator;
        string imageUrl;
        string caption;
        uint256 likes;
        uint256 totalEarned;
        uint256 timestamp;
    }

    uint256 public postCount;
    uint256 public constant likeCost = 0.0001 ether;

    mapping(uint256 => Post) public posts;
    mapping(uint256 => mapping(address => bool)) public hasLiked;
    mapping(address => uint256) public totalEarnedByUser;

    /**
     * @dev Emitted when a new post is created.
     * @param id The unique identifier of the post.
     * @param creator The address of the post creator.
     * @param imageUrl The URL of the image associated with the post.
     * @param caption The description or caption of the post.
     * @param timestamp The time the post was created.
     */
    event PostCreated(
        uint256 indexed id,
        address indexed creator,
        string imageUrl,
        string caption,
        uint256 timestamp
    );

    /**
     * @dev Emitted when a post is liked/tipped.
     * @param postId The ID of the post that was liked.
     * @param liker The address of the user who liked the post.
     * @param creator The address of the creator who received the tip.
     * @param amount The amount of ether tipped.
     */
    event PostLiked(
        uint256 indexed postId,
        address indexed liker,
        address creator,
        uint256 amount
    );

    /**
     * @notice Creates a new post on the platform.
     * @param _imageUrl The URL/IPFS hash of the image.
     * @param _caption The caption for the post.
     */
    function createPost(string memory _imageUrl, string memory _caption) external {
        postCount++;
        posts[postCount] = Post(
            postCount,
            msg.sender,
            _imageUrl,
            _caption,
            0,
            0,
            block.timestamp
        );

        emit PostCreated(
            postCount,
            msg.sender,
            _imageUrl,
            _caption,
            block.timestamp
        );
    }

    /**
     * @notice Likes a post and tips the creator.
     * @dev Requires exactly the likeCost. Prevents self-liking and double-liking.
     * @param _postId The ID of the post to like.
     */
    function likePost(uint256 _postId) external payable {
        Post storage post = posts[_postId];
        require(_postId > 0 && _postId <= postCount, "Post does not exist");
        require(msg.value == likeCost, "Incorrect tip amount");
        require(post.creator != msg.sender, "Creators cannot like their own posts");
        require(!hasLiked[_postId][msg.sender], "Post already liked");

        // Transfer funds to creator
        (bool success, ) = payable(post.creator).call{value: msg.value}("");
        require(success, "Transfer failed");

        // Update state
        post.likes++;
        post.totalEarned += msg.value;
        totalEarnedByUser[post.creator] += msg.value;
        hasLiked[_postId][msg.sender] = true;

        emit PostLiked(_postId, msg.sender, post.creator, msg.value);
    }

    /**
     * @notice Retrieves all posts from the platform.
     * @return An array of all Post structs.
     */
    function getAllPosts() external view returns (Post[] memory) {
        Post[] memory allPosts = new Post[](postCount);
        for (uint256 i = 1; i <= postCount; i++) {
            allPosts[i - 1] = posts[i];
        }
        return allPosts;
    }

    /**
     * @notice Checks if a user has liked a specific post.
     * @param _postId The ID of the post.
     * @param _user The address of the user to check.
     * @return bool True if the user has liked the post, false otherwise.
     */
    function checkLiked(uint256 _postId, address _user) external view returns (bool) {
        return hasLiked[_postId][_user];
    }
}
