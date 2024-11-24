<template>
  <div>
    <h1>Post Details</h1>
    <button @click="$router.back()">Back</button>
    <div v-if="post">
      <h2>{{ post.title }}</h2>
      <p>{{ post.body }}</p>
    </div>
    <p v-else>Post not found.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue';
import { usePostStore } from '@/stores/postStore';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'PostView',
  setup() {
    const route = useRoute();
    const postStore = usePostStore();

    // Получаем ID поста из маршрута
    const postId = computed(() => Number(route.params.id));

    // Ищем пост в Pinia Store
    const post = computed(() => postStore.posts.find((p) => p.id === postId.value));

    // Загружаем посты при необходимости
    onMounted(async () => {
      if (!postStore.posts.length) {
        await postStore.fetchPosts();
      }
    });

    return { post };
  },
});
</script>
