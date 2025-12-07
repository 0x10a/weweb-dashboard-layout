<template>
    <div class="ww-dashboard-layout">
        <!-- Sidebar -->
        <aside class="ww-sidebar" :class="{ 'ww-collapsed': isCollapsed }" :style="sidebarStyles">
            <!-- Logo Header -->
            <div class="ww-sidebar-header">
                <div class="ww-logo-area">
                    <span class="ww-logo-icon">📊</span>
                    <span v-if="!isCollapsed" class="ww-logo-text">{{ content.logoText }}</span>
                </div>
            </div>

            <!-- Navigation -->
            <nav class="ww-sidebar-nav">
                <div v-for="(item, index) in menuItems" :key="index" class="ww-nav-item-wrapper">
                    <div
                        class="ww-nav-item"
                        :class="{ 'ww-active': activeIndex === index }"
                        @click="handleItemClick(item, index)"
                    >
                        <span class="ww-nav-icon">{{ item.icon || '📁' }}</span>
                        <span v-if="!isCollapsed" class="ww-nav-label">{{ item.label }}</span>
                    </div>
                </div>
            </nav>

            <!-- Footer -->
            <div class="ww-sidebar-footer">
                <div class="ww-user-section">
                    <span class="ww-user-avatar">👤</span>
                    <div v-if="!isCollapsed" class="ww-user-info">
                        <span class="ww-user-name">{{ content.userName }}</span>
                    </div>
                </div>
            </div>
        </aside>

        <!-- Main Area -->
        <div class="ww-main-area">
            <!-- Top Bar -->
            <header v-if="content.showTopbar" class="ww-topbar">
                <div class="ww-topbar-left">
                    <button class="ww-topbar-btn" @click="toggleCollapse">☰</button>
                    <span class="ww-page-title">{{ content.pageTitle }}</span>
                </div>
            </header>

            <!-- Content Area (WeWeb Drop Zone) -->
            <main class="ww-content-area">
                <wwLayout path="dashboardContent" />
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
    data() {
        return {
            isCollapsed: false,
            activeIndex: 0,
        };
    },
    computed: {
        menuItems() {
            return this.content.menuItems || [
                { label: 'Dashboard', icon: '📊' },
                { label: 'Analytics', icon: '📈' },
                { label: 'Users', icon: '👥' },
                { label: 'Settings', icon: '⚙️' },
            ];
        },
        sidebarStyles() {
            return {
                backgroundColor: this.content.sidebarBgColor || '#1e293b',
                width: this.isCollapsed ? '60px' : (this.content.sidebarWidth || '240px'),
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
        toggleCollapse() {
            this.isCollapsed = !this.isCollapsed;
            this.$emit('trigger-event', { name: 'toggle-collapse', event: { collapsed: this.isCollapsed } });
        },
        handleItemClick(item, index) {
            this.activeIndex = index;
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
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.ww-sidebar {
    display: flex;
    flex-direction: column;
    transition: width 0.2s ease;
    overflow: hidden;
    flex-shrink: 0;
    color: #fff;
}

.ww-collapsed {
    .ww-logo-text,
    .ww-nav-label,
    .ww-user-info {
        display: none;
    }
}

.ww-sidebar-header {
    padding: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.ww-logo-area {
    display: flex;
    align-items: center;
    gap: 12px;
}

.ww-logo-icon {
    font-size: 24px;
}

.ww-logo-text {
    font-size: 16px;
    font-weight: 600;
}

.ww-sidebar-nav {
    flex: 1;
    padding: 8px;
    overflow-y: auto;
}

.ww-nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.15s;

    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }

    &.ww-active {
        background-color: rgba(255, 255, 255, 0.2);
    }
}

.ww-nav-icon {
    font-size: 18px;
}

.ww-nav-label {
    font-size: 14px;
}

.ww-sidebar-footer {
    padding: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.ww-user-section {
    display: flex;
    align-items: center;
    gap: 12px;
}

.ww-user-avatar {
    font-size: 24px;
}

.ww-user-name {
    font-size: 14px;
}

.ww-main-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: #f8fafc;
}

.ww-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 24px;
    background-color: #fff;
    border-bottom: 1px solid #e2e8f0;
}

.ww-topbar-left {
    display: flex;
    align-items: center;
    gap: 16px;
}

.ww-topbar-btn {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    padding: 8px;
    border-radius: 6px;

    &:hover {
        background-color: #f1f5f9;
    }
}

.ww-page-title {
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
}

.ww-content-area {
    flex: 1;
    padding: 24px;
    min-height: 200px;
}
</style>
