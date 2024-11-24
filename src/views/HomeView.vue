<template>
  <div>
    <h1>Posts</h1>

    <!-- Форма для добавления нового поста -->
    <form @submit.prevent="handleAddPost">
      <input v-model="newPost.title" placeholder="Post Title" required />
      <textarea v-model="newPost.body" placeholder="Post Body" required></textarea>
      <button type="submit">Add Post</button>
    </form>

    <!-- Кнопка для загрузки постов -->
    <button @click="fetchPosts" :disabled="isLoading || posts.length > 0">
      {{ posts.length > 0 ? "Posts Loaded" : "Load Posts" }}
    </button>

    <p v-if="error">{{ error }}</p>

    <!-- Список постов -->
    <ul v-if="!isLoading && posts.length">
      <li v-for="post in posts" :key="post.id">
        <router-link :to="{ name: 'Post', params: { id: post.id }}">{{ post.title }}</router-link>
        <button @click="startEditing(post)">Edit</button>
        <button @click="deletePost(post.id)">Delete</button>
      </li>
    </ul>

    <p v-if="isLoading">Loading...</p>

    <!-- Модальное окно для редактирования поста -->
    <div v-if="editingPost">
      <h3>Edit Post</h3>
      <form @submit.prevent="handleEditPost">
        <input v-model="editingPost.title" placeholder="Post Title" required />
        <textarea v-model="editingPost.body" placeholder="Post Body" required></textarea>
        <button type="submit">Save Changes</button>
        <button type="button" @click="cancelEditing">Cancel</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { usePostStore, Post } from '@/stores/postStore';

export default defineComponent({
  name: 'HomeView',
  setup() {
    const postStore = usePostStore();

    // Реактивные свойства для Pinia Store
    const posts = computed(() => postStore.posts);
    const isLoading = computed(() => postStore.isLoading);
    const error = computed(() => postStore.error);

    // Форма для добавления нового поста
    const newPost = ref<Omit<Post, 'id'>>({
      title: '',
      body: '',
      userId: 1, // Статический userId
    });

    // Текущее редактирование поста
    const editingPost = ref<Post | null>(null);

    // Действия Pinia Store
    const fetchPosts = postStore.fetchPosts;
    const addPost = postStore.addPost;
    const editPost = postStore.editPost;
    const deletePost = postStore.deletePost;

    // Добавление нового поста
    const handleAddPost = () => {
      addPost(newPost.value);
      newPost.value = { title: '', body: '', userId: 1 }; // Очистка формы
    };

    // Начало редактирования
    const startEditing = (post: Post) => {
      editingPost.value = { ...post }; // Копируем свойства поста
    };

    // Завершение редактирования
    const handleEditPost = () => {
      if (editingPost.value) {
        editPost(editingPost.value); // Сохраняем изменения
        editingPost.value = null; // Закрываем форму редактирования
      }
    };

    // Отмена редактирования
    const cancelEditing = () => {
      editingPost.value = null;
    };

    return {
      posts,
      isLoading,
      error,
      newPost,
      editingPost,
      fetchPosts,
      handleAddPost,
      startEditing,
      handleEditPost,
      cancelEditing,
      deletePost,
    };
  },
});
</script>
