<template>
    <div class="dashboard-layout">
        <aside class="sidebar" :style="sidebarStyles">
            <div class="logo">{{ content.logoText }}</div>
            <nav class="nav">
                <slot name="sidebar"></slot>
            </nav>
        </aside>
        <main class="main-content">
            <wwLayout path="dashboardContent"></wwLayout>
        </main>
    </div>
</template>

<script>
export default {
    props: {
        content: { type: Object, required: true },
        wwElementState: { type: Object, required: true },
    },
    emits: ["update:content"],
    computed: {
        sidebarStyles() {
            return {
                width: this.content.sidebarWidth || "250px",
                backgroundColor: this.content.sidebarBgColor || "#1e293b",
            };
        },
    },
};
</script>

<style scoped>
.dashboard-layout {
    display: flex;
    width: 100%;
    min-height: 100vh;
}

.sidebar {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    color: white;
}

.logo {
    padding: 20px;
    font-size: 20px;
    font-weight: bold;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.nav {
    flex: 1;
    padding: 16px;
}

.main-content {
    flex: 1;
    min-width: 0;
    background-color: #f1f5f9;
}
</style>
