<template>
    <div class="ww-dashboard-layout">
        <!-- Sidebar -->
        <aside class="ww-sidebar" :style="sidebarStyle">
            <div class="ww-sidebar-header">
                <span class="ww-logo">{{ content.logoText }}</span>
            </div>
            <nav class="ww-sidebar-nav">
                <div 
                    v-for="(item, index) in content.menuItems" 
                    :key="index" 
                    class="ww-nav-item"
                    @click="onMenuClick(item, index)"
                >
                    {{ item.label }}
                </div>
            </nav>
        </aside>

        <!-- Main -->
        <div class="ww-main">
            <header v-if="content.showTopbar" class="ww-topbar">
                <span>{{ content.pageTitle }}</span>
            </header>
            <main class="ww-content">
                <wwLayout path="children" direction="column" />
            </main>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        content: { type: Object, required: true },
        wwElementState: { type: Object, required: true },
        /* wwEditor:start */
        wwEditorState: { type: Object, required: true },
        /* wwEditor:end */
    },
    emits: ['trigger-event'],
    computed: {
        sidebarStyle() {
            return {
                width: this.content.sidebarWidth || '240px',
                backgroundColor: this.content.sidebarBgColor || '#1e293b',
            };
        },
        isEditing() {
            /* wwEditor:start */
            return this.wwEditorState.editMode === wwLib.wwEditorHelper.EDIT_MODES.EDITION;
            /* wwEditor:end */
            // eslint-disable-next-line no-unreachable
            return false;
        },
    },
    methods: {
        onMenuClick(item, index) {
            this.$emit('trigger-event', { name: 'menu-item-click', event: { item, index } });
        },
    },
};
</script>

<style lang="scss" scoped>
.ww-dashboard-layout {
    display: flex;
    min-height: 100vh;
    width: 100%;
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
    font-size: 18px;
}

.ww-sidebar-nav {
    flex: 1;
    padding: 8px;
}

.ww-nav-item {
    padding: 10px 12px;
    border-radius: 6px;
    cursor: pointer;
    
    &:hover {
        background: rgba(255, 255, 255, 0.1);
    }
}

.ww-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #f8fafc;
}

.ww-topbar {
    padding: 16px 24px;
    background: #fff;
    border-bottom: 1px solid #e2e8f0;
    font-weight: 600;
}

.ww-content {
    flex: 1;
    padding: 24px;
}
</style>
