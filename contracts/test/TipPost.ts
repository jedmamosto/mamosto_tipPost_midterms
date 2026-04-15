import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("TipPost", function () {
  async function deployFixture() {
    const [owner, otherAccount] = await ethers.getSigners();
    const TipPost = await ethers.getContractFactory("TipPost");
    const tipPost = await TipPost.deploy();
    return { tipPost, owner, otherAccount };
  }

  const imageUrl = "https://example.com/image.jpg";
  const caption = "Check out this photo!";
  const likeCost = ethers.parseEther("0.0001");

  describe("Step 1: Post creation + event", function () {
    it("Should create a post and emit PostCreated event", async function () {
      const { tipPost, owner } = await loadFixture(deployFixture);

      await expect(tipPost.createPost(imageUrl, caption))
        .to.emit(tipPost, "PostCreated")
        .withArgs(1, owner.address, imageUrl, caption, anyUint);

      const post = await tipPost.posts(1);
      expect(post.id).to.equal(1);
      expect(post.creator).to.equal(owner.address);
      expect(post.imageUrl).to.equal(imageUrl);
      expect(post.caption).to.equal(caption);
    });
  });

  describe("Step 2: Successful like + ETH transfer", function () {
    it("Should increment likes, transfer ETH, and emit PostLiked event", async function () {
      const { tipPost, owner, otherAccount } = await loadFixture(deployFixture);

      // owner (Account A) creates a post
      await tipPost.createPost(imageUrl, caption);

      // otherAccount (Account B) likes the post
      const initialCreatorBalance = await ethers.provider.getBalance(owner.address);

      await expect(tipPost.connect(otherAccount).likePost(1, { value: likeCost }))
        .to.emit(tipPost, "PostLiked")
        .withArgs(1, otherAccount.address, owner.address, likeCost);

      const post = await tipPost.posts(1);
      expect(post.likes).to.equal(1);
      expect(post.totalEarned).to.equal(likeCost);

      // Verify ETH transfer
      const finalCreatorBalance = await ethers.provider.getBalance(owner.address);
      expect(finalCreatorBalance - initialCreatorBalance).to.equal(likeCost);

      // Verify totalEarnedByUser update
      expect(await tipPost.totalEarnedByUser(owner.address)).to.equal(likeCost);
    });
  });

  describe("Step 3: Double-like reverts", function () {
    it("Should revert if the same user tries to like twice", async function () {
      const { tipPost, otherAccount } = await loadFixture(deployFixture);
      await tipPost.createPost(imageUrl, caption);

      await tipPost.connect(otherAccount).likePost(1, { value: likeCost });

      await expect(
        tipPost.connect(otherAccount).likePost(1, { value: likeCost })
      ).to.be.revertedWith("Post already liked");
    });
  });

  describe("Step 4: Self-like reverts", function () {
    it("Should revert if the creator tries to like their own post", async function () {
      const { tipPost, owner } = await loadFixture(deployFixture);
      await tipPost.createPost(imageUrl, caption);

      await expect(
        tipPost.connect(owner).likePost(1, { value: likeCost })
      ).to.be.revertedWith("Creators cannot like their own posts");
    });
  });
});

// Helper for matching any uint in events
const anyUint = (val: any) => true;
