<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style>
:root {
  /* Tema escuro */
  --color-background: #121212;
  --color-surface: #1e1e1e;
  --color-surface-variant: #2d2d2d;
  --color-text: #ffffff;
  --color-text-secondary: #b3b3b3;
  --color-primary: #ffffff;
  --color-secondary: #a0a0a0;
  --color-border: #333333;
  --color-error: #cf6679;
  --color-success: #03dac6;
  --color-accent: #bb86fc;
  --color-shadow: rgba(0, 0, 0, 0.5);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Roboto', Arial, sans-serif;
}

body {
  background-color: var(--color-background);
  color: var(--color-text);
  line-height: 1.6;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.btn {
  display: inline-block;
  background-color: var(--color-primary);
  color: var(--color-background);
  border: none;
  padding: 12px 24px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  border-radius: 4px;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn:hover {
  background-color: var(--color-secondary);
  box-shadow: 0 2px 8px var(--color-shadow);
  transform: translateY(-1px);
}

.form-group {
  margin-bottom: 24px;
  position: relative;
}

.form-control {
  width: 100%;
  padding: 12px 16px;
  background-color: var(--color-surface-variant);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 16px;
  color: var(--color-text);
  transition: all 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 2px rgba(187, 134, 252, 0.3);
}

.form-control::placeholder {
  color: var(--color-text-secondary);
  opacity: 0.7;
}

.error-message {
  color: var(--color-error);
  font-size: 14px;
  margin-top: 8px;
  display: flex;
  align-items: center;
}

.errorMessage {
  color: var(--color-error);
  font-size: 14px;
  display: flex;
  align-items: center;
}

.error-input {
  border: 1px solid var(--color-error) !important;
}

.success-message {
  color: var(--color-success);
  font-size: 14px;
  margin-top: 8px;
  display: flex;
  align-items: center;
}

a {
  text-decoration: none;
}
</style>
