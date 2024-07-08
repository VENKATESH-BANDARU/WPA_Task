const { Post } = require('../models/index.model');
const notifyClients = require('../server');


class postData {
    async createPost(req, res) {
        try {
            const post = await Post.create(req.body);
            notifyClients('userActivity', { type: 'create', userId: post.userId, post });
            notifyClients('postActivity', { type: 'create', postId: post.id, post });
            res.status(201).json(post);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getAllPosts(req, res) {
        try {
            const posts = await Post.findAll();
            res.json(posts);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async singlePost(req, res) {
        const post = await Post.findByPk(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post);
    } catch(error) {
        res.status(400).json({ error: error.message });
    }

    async updatePost(req, res) {
        try {
            const post = await Post.findByPk(req.params.id);
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            await post.update(req.body);

            res.json(post);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async deletePost(req, res) {
        try {
            const post = await Post.findByPk(req.params.id);
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            await post.destroy();
            res.json({ message: 'Post deleted successfully' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new postData();