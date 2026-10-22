<template>
  <div class="app-container">
    <router-view />
  </div>
</template>

<style>
body {
  margin: 0;
  background-color: #121212;
  color: white;
  font-family: sans-serif;
  display: flex;
  justify-content: center;
  min-height: 100vh;
}
.app-container {
  width: 100%;
  max-width: 800px;
}
</style>
