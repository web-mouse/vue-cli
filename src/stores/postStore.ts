import { defineStore } from 'pinia';
import axios from 'axios';

export interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
}

interface PostState {
    posts: Post[];
    isLoading: boolean;
    error: string | null;
}

export const usePostStore = defineStore('postStore', {
    state: (): PostState => ({
        posts: [],
        isLoading: false,
        error: null,
    }),
    actions: {
        async fetchPosts() {
            if (this.posts.length > 0) return;

            this.isLoading = true;
            this.error = null;

            try {
                const response = await axios.get<Post[]>('https://jsonplaceholder.typicode.com/posts');
                this.posts = response.data;
            } catch (error) {
                console.error('Fetch posts failed:', error);
                this.error = 'Failed to fetch posts.';
            } finally {
                this.isLoading = false;
            }
        },

        async addPost(newPost: Omit<Post, 'id'>) {
            try {
                const response = await axios.post<Post>('https://jsonplaceholder.typicode.com/posts', newPost);

                // Используем максимальный ID + 1
                const maxId = this.posts.reduce((max, post) => Math.max(max, post.id), 0);
                const postWithId: Post = { ...response.data, id: maxId + 1 };

                this.posts.unshift(postWithId); // Добавляем новый пост с реальным ID
            } catch (error) {
                console.error('Add post failed:', error);
                this.error = 'Failed to add post.';
            }
        },

        async editPost(updatedPost: Post) {
            try {
                console.log('Editing post:', updatedPost);

                const response = await axios.put<Post>(
                    `https://jsonplaceholder.typicode.com/posts/${updatedPost.id}`,
                    {
                        title: updatedPost.title,
                        body: updatedPost.body,
                        userId: updatedPost.userId,
                    }
                );

                console.log('Server response:', response.data);

                const index = this.posts.findIndex((post) => post.id === updatedPost.id);
                if (index !== -1) {
                    this.posts[index] = response.data;
                }
            } catch (error) {
                console.error('Edit post failed:', error);
                this.error = 'Failed to edit post.';
            }
        },

        async deletePost(postId: number) {
            try {
                await axios.delete(`https://jsonplaceholder.typicode.com/posts/${postId}`);
                this.posts = this.posts.filter((post) => post.id !== postId); // Удаляем пост из локального массива
            } catch (error) {
                console.error('Delete post failed:', error);
                this.error = 'Failed to delete post.';
            }
        },
    },
});
