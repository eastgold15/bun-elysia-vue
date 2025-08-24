
<script setup>
import { onMounted, onUnmounted, ref } from "vue";

const showHeader = ref(false);
const showFooter = ref(false);
const scrollContainer = ref(null);

const handleScroll = () => {
	if (scrollContainer.value) {
		const { scrollTop, scrollHeight, clientHeight } = scrollContainer.value;

		// 向下滚动超过50px时显示header
		showHeader.value = scrollTop > 50;

		// 滚动到接近底部时显示footer
		showFooter.value = scrollTop + clientHeight >= scrollHeight - 100;
	}
};

onMounted(async () => {
	if (scrollContainer.value) {
		scrollContainer.value.addEventListener("scroll", handleScroll);
	}
});

onUnmounted(() => {
	if (scrollContainer.value) {
		scrollContainer.value.removeEventListener("scroll", handleScroll);
	}
});
</script>

<template>
  <div class="relative w-screen h-screen overflow-hidden">
    <!-- 固定的header，初始隐藏 -->
    <header 
      class="fixed top-0 left-0 right-0 h-15 bg-gradient-to-r from-blue-500 to-purple-600 text-white z-50 transform transition-transform duration-300 ease-in-out shadow-lg"
      :class="showHeader ? 'translate-y-0' : '-translate-y-full'"
    >
      <nav class="flex items-center h-full px-8 gap-8">
        <router-link 
          to="/" 
          class="px-4 py-2 rounded-lg transition-all duration-200 hover:bg-white/20 active:bg-white/30"
          :class="$route.path === '/' ? 'bg-white/30 font-bold' : ''"
        >
          首页
        </router-link>
        <router-link 
          to="/counter" 
          class="px-4 py-2 rounded-lg transition-all duration-200 hover:bg-white/20 active:bg-white/30"
          :class="$route.path === '/counter' ? 'bg-white/30 font-bold' : ''"
        >
          计数器
        </router-link>
      </nav>
    </header>

    <!-- 主要内容区域 -->
    <main 
      ref="scrollContainer"
      class="  w-full h-full scroll-container scroll-smooth"
    >
      <div class="min-h-[200vh] p-8">
        <RouterView />
        <!-- 添加一些内容来测试滚动 -->
        <div class="mt-8 space-y-4">
          <div v-for="i in 50" :key="i" class="p-4 bg-gradient-to-r from-pink-400 to-red-500 text-white rounded-lg text-center font-medium shadow-md hover:shadow-lg transition-shadow">
            内容区域 {{ i }}
          </div>
        </div>
      </div>
    </main>

    <!-- 固定的footer，初始隐藏 -->
    <footer 
      class="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-r from-blue-500 to-purple-600 text-white z-50 transform transition-transform duration-300 ease-in-out shadow-lg"
      :class="showFooter ? 'translate-y-0' : 'translate-y-full'"
    >
      <div class="flex items-center justify-center h-full px-8">
        <p class="text-sm">© 2024 我的应用 - 页面底部</p>
      </div>
    </footer>
  </div>
</template>


