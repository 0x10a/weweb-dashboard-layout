<template>
    <div class="ww-dashboard-layout">
        <!-- Sidebar -->
        <aside class="ww-sidebar" :style="sidebarStyle">
            <div class="ww-sidebar-header">
                <span class="ww-logo">{{ content.logoText || 'Dashboard' }}</span>
            </div>
            <nav class="ww-sidebar-nav">
                <div 
                    v-for="(item, index) in menuItems" 
                    :key="index"
                    class="ww-nav-item"
                    @click="handleMenuClick(item, index)"
                >
                    {{ item.label || 'Menu Item' }}
                </div>
            </nav>
        </aside>
        
        <!-- Main Content -->
        <main class="ww-main">
            <wwLayout path="children"></wwLayout>
        </main>
    </div>
</template>

<script>
export default {
    props: {
        content: { type: Object, required: true },
        wwElementState: { type: Object, required: true },
    },
    emits: ['trigger-event'],
    computed: {
        menuItems() {
            return this.content.menuItems || [];
        },
        sidebarStyle() {
            return {
                backgroundColor: this.content.sidebarBgColor || '#1e293b',
                width: this.content.sidebarWidth || '240px',
            };
        },
    },
    methods: {
        handleMenuClick(item, index) {
            this.$emit('trigger-event', {
                name: 'menu-item-click',
                event: { item, index },
            });
        },
    },
};
</script>

<style scoped>
.ww-dashboard-layout {
    display: flex;
    min-height: 100vh;
    width: 100%;
}

.ww-sidebar {
    display: flex;
    flex-direction: column;
    color: white;
    flex-shrink: 0;
}

.ww-sidebar-header {
    padding: 20px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
}

.ww-logo {
    font-size: 18px;
    font-weight: 600;
}

.ww-sidebar-nav {
    padding: 12px;
    flex: 1;
}

.ww-nav-item {
    padding: 10px 12px;
    border-radius: 6px;
    cursor: pointer;
    margin-bottom: 4px;
    transition: background 0.2s;
}

.ww-nav-item:hover {
    background: rgba(255,255,255,0.1);
}

.ww-main {
    flex: 1;
    background: #f8fafc;
    padding: 24px;
}
</style>
