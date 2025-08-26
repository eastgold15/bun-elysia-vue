<script setup lang="ts">
import ThemeSwitch from "../component/ThemeSwitch.vue";
import { useAppConfigStore } from "../store/appConfig";
import { useCounterStore } from "../store/counter";

// 使用 Pinia stores
const counterStore = useCounterStore();
const configStore = useAppConfigStore();

// 可以直接解构使用（响应式会保持）
const { count, doubleCount, isEven, historyLength } = counterStore;
const { theme } = configStore;
</script>
</script>

<template>
  <div class="p-6 max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg space-y-4">
    <h1 class="text-2xl font-bold text-center text-gray-900 dark:text-white">
      计数器演示
    </h1>
    
    <!-- 主要计数显示 -->
    <div class="text-center space-y-2">
      <div class="text-4xl font-bold text-blue-600 dark:text-blue-400">
        {{ count }}
      </div>
      <div class="text-sm text-gray-600 dark:text-gray-300">
        双倍值: {{ doubleCount }}
      </div>
      <div class="text-sm text-gray-600 dark:text-gray-300">
        {{ isEven ? '偶数' : '奇数' }}
      </div>
    </div>
    
    <!-- 操作按钮 -->
    <div class="flex space-x-2 justify-center">
      <button 
        @click="counterStore.increment()" 
        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
      >
        +1
      </button>
      <button 
        @click="counterStore.decrement()" 
        class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
      >
        -1
      </button>
      <button 
        @click="counterStore.reset()" 
        class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
      >
        重置
      </button>
    </div>
    
    <!-- 历史记录 -->
    <div v-if="historyLength > 0" class="space-y-2">
      <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-200">
        操作历史 ({{ historyLength }} 项)
      </h3>
      <div class="flex space-x-2">
        <button 
          @click="counterStore.undoLastChange()" 
          class="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 transition-colors"
        >
          撤销
        </button>
        <button 
          @click="counterStore.clearHistory()" 
          class="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600 transition-colors"
        >
          清空历史
        </button>
      </div>
    </div>
    
    <!-- 主题信息 -->
    <div class="border-t pt-4">
      <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">
        当前主题: {{ theme }}
      </p>
      <ThemeSwitch />
    </div>
  </div>
</template>