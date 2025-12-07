<template>
    <div class="ww-dashboard-layout">
        <div class="ww-sidebar" :style="sidebarStyle">
            <div class="ww-sidebar-header">{{ content.logoText }}</div>
            <div class="ww-sidebar-nav">
                <div 
                    v-for="(item, index) in menuItems" 
                    :key="index" 
                    class="ww-nav-item"
                >
                    {{ item.label }}
                </div>
            </div>
        </div>
        <div class="ww-main">
            <div v-if="content.showTopbar" class="ww-topbar">{{ content.pageTitle }}</div>
            <div class="ww-content">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        content: { type: Object, required: true },
        /* wwEditor:start */
        wwEditorState: { type: Object, required: true },
        /* wwEditor:end */
    },
    computed: {
        sidebarStyle() {
            return {
                width: this.content.sidebarWidth || '220px',
                backgroundColor: this.content.sidebarBgColor || '#1e293b',
            };
        },
        menuItems() {
            return this.content.menuItems || [];
        },
    },
};
</script>

<style lang="scss" scoped>
.ww-dashboard-layout {
    display: flex;
    width: 100%;
    min-height: 300px;
    background: #f1f5f9;
}

.ww-sidebar {
    display: flex;
    flex-direction: column;
    color: #fff;
    flex-shrink: 0;
}

.ww-sidebar-header {
    padding: 16px;
    font-weight: 600;
    font-size: 16px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
}

.ww-sidebar-nav {
    padding: 8px;
}

.ww-nav-item {
    padding: 10px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    
    &:hover {
        background: rgba(255, 255, 255, 0.1);
    }
}

.ww-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.ww-topbar {
    padding: 16px 20px;
    background: #fff;
    border-bottom: 1px solid #e2e8f0;
    font-weight: 600;
    font-size: 16px;
}

.ww-content {
    flex: 1;
    padding: 20px;
}
</style>
