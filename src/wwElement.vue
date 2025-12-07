<template>
  <div class="ww-dashboard-layout" :style="layoutStyles">
    <!-- Sidebar -->
    <aside class="ww-sidebar" :class="{ 'ww-collapsed': isCollapsedState }" :style="sidebarStyles">
      <!-- Logo Header -->
      <div class="ww-sidebar-header">
        <div class="ww-logo-area">
          <img v-if="content.logoUrl" :src="content.logoUrl" alt="Logo" class="ww-logo-img" />
          <div v-else class="ww-logo-icon" :style="{ color: content.logoColor }">
            <component :is="getIcon(content.logoIcon)" :size="24" />
          </div>
          <span v-if="!isCollapsedState" class="ww-logo-text" :style="{ color: content.textColor }">
            {{ content.logoText }}
          </span>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="ww-sidebar-nav">
        <div v-for="(section, sectionIndex) in menuSections" :key="sectionIndex" class="ww-nav-section">
          <span v-if="!isCollapsedState && section.label" class="ww-section-label" :style="{ color: content.sectionLabelColor }">
            {{ section.label }}
          </span>
          
          <div v-for="(item, index) in section.items" :key="item.id || index" class="ww-nav-item-wrapper">
            <div 
              class="ww-nav-item"
              :class="{ 'ww-active': activeItemId === item.id }"
              :style="getNavItemStyle(item)"
              @click="handleItemClick(item, index)"
            >
              <component :is="getIcon(item.icon)" :size="18" class="ww-nav-icon" />
              <span v-if="!isCollapsedState" class="ww-nav-label">{{ item.label }}</span>
              <component 
                v-if="!isCollapsedState && item.children && item.children.length" 
                :is="getIcon('chevron-right')"
                :size="14" 
                class="ww-nav-arrow"
                :class="{ 'ww-rotated': expandedItems.includes(item.id) }"
              />
              <span v-if="!isCollapsedState && item.badge" class="ww-nav-badge" :style="badgeStyle">
                {{ item.badge }}
              </span>
            </div>
            
            <!-- Sub-menu -->
            <div v-if="item.children && item.children.length && expandedItems.includes(item.id) && !isCollapsedState" class="ww-nav-submenu">
              <div 
                v-for="(child, childIndex) in item.children" 
                :key="child.id || childIndex"
                class="ww-nav-subitem"
                :class="{ 'ww-active': activeItemId === child.id }"
                :style="getSubItemStyle(child)"
                @click.stop="handleSubItemClick(child, childIndex)"
              >
                {{ child.label }}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <!-- Footer -->
      <div class="ww-sidebar-footer">
        <!-- Promo Card -->
        <div v-if="!isCollapsedState && content.showPromoCard" class="ww-promo-card" :style="promoCardStyle">
          <div class="ww-promo-content">
            <strong :style="{ color: content.textColor }">{{ content.promoTitle }}</strong>
            <p :style="{ color: content.mutedTextColor }">{{ content.promoDescription }}</p>
          </div>
          <button class="ww-promo-btn" :style="promoBtnStyle" @click="handlePromoClick">
            {{ content.promoButtonText }}
          </button>
        </div>

        <!-- User Profile -->
        <div class="ww-user-section" @click="toggleUserMenu">
          <img :src="content.userAvatar" alt="User" class="ww-user-avatar" />
          <div v-if="!isCollapsedState" class="ww-user-info">
            <span class="ww-user-name" :style="{ color: content.textColor }">{{ content.userName }}</span>
            <span class="ww-user-email" :style="{ color: content.mutedTextColor }">{{ content.userEmail }}</span>
          </div>
          <component v-if="!isCollapsedState" :is="getIcon('more-vertical')" :size="16" class="ww-user-menu-btn" :style="{ color: content.mutedTextColor }" />
          
          <!-- User Dropdown Menu -->
          <div v-if="showUserMenu && !isCollapsedState" class="ww-user-dropdown">
            <div class="ww-dropdown-header">
              <img :src="content.userAvatar" alt="User" class="ww-dropdown-avatar" />
              <div class="ww-dropdown-user-info">
                <span class="ww-dropdown-name">{{ content.userName }}</span>
                <span class="ww-dropdown-email">{{ content.userEmail }}</span>
              </div>
            </div>
            <div class="ww-dropdown-divider"></div>
            <div 
              v-for="(menuItem, idx) in content.userMenuItems" 
              :key="idx"
              class="ww-dropdown-item"
              @click.stop="handleUserMenuClick(menuItem)"
            >
              <component :is="getIcon(menuItem.icon)" :size="16" />
              <span>{{ menuItem.label }}</span>
            </div>
            <div class="ww-dropdown-divider"></div>
            <div class="ww-dropdown-item" @click.stop="handleLogout">
              <component :is="getIcon('log-out')" :size="16" />
              <span>{{ content.logoutLabel }}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Area -->
    <div class="ww-main-area" :style="mainAreaStyle">
      <!-- Top Bar -->
      <header v-if="content.showTopbar" class="ww-topbar" :style="topbarStyle">
        <div class="ww-topbar-left">
          <button v-if="content.allowCollapse" class="ww-topbar-btn" @click="toggleCollapse">
            <component :is="getIcon('panel-left')" :size="18" />
          </button>
          
          <div v-if="content.showSearch" class="ww-search-container" :style="searchContainerStyle">
            <component :is="getIcon('search')" :size="16" class="ww-search-icon" />
            <input 
              type="text" 
              :placeholder="content.searchPlaceholder" 
              class="ww-search-input"
              v-model="searchQuery"
              @input="handleSearch"
            />
          </div>
        </div>

        <div class="ww-topbar-right">
          <button v-if="content.showNotifications" class="ww-topbar-btn ww-notification" @click="handleNotificationClick">
            <component :is="getIcon('bell')" :size="18" />
            <span v-if="content.notificationCount > 0" class="ww-notification-badge"></span>
          </button>
          <button v-if="content.showThemeToggle" class="ww-topbar-btn" @click="handleThemeToggle">
            <component :is="getIcon('sun')" :size="18" />
          </button>
          <button v-if="content.showSettings" class="ww-topbar-btn" @click="handleSettingsClick">
            <component :is="getIcon('settings')" :size="18" />
          </button>
          <div class="ww-topbar-profile" @click="showTopbarMenu = !showTopbarMenu">
            <img :src="content.userAvatar" alt="User" class="ww-topbar-avatar" />
            
            <!-- Topbar User Dropdown Menu -->
            <div v-if="showTopbarMenu" class="ww-topbar-dropdown">
              <div class="ww-dropdown-header">
                <img :src="content.userAvatar" alt="User" class="ww-dropdown-avatar" />
                <div class="ww-dropdown-user-info">
                  <span class="ww-dropdown-name">{{ content.userName }}</span>
                  <span class="ww-dropdown-email">{{ content.userEmail }}</span>
                </div>
              </div>
              <div class="ww-dropdown-divider"></div>
              <div 
                v-for="(menuItem, idx) in content.userMenuItems" 
                :key="idx"
                class="ww-dropdown-item"
                @click.stop="handleUserMenuClick(menuItem)"
              >
                <component :is="getIcon(menuItem.icon)" :size="16" />
                <span>{{ menuItem.label }}</span>
              </div>
              <div class="ww-dropdown-divider"></div>
              <div class="ww-dropdown-item" @click.stop="handleLogout">
                <component :is="getIcon('log-out')" :size="16" />
                <span>{{ content.logoutLabel }}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Content Area (WeWeb Drop Zone) -->
      <main class="ww-content-area" :style="contentAreaStyle">
        <wwLayout path="children" ww-responsive="wwLayout"></wwLayout>
      </main>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import * as LucideIcons from 'lucide-vue-next';

export default {
  name: 'DashboardLayout',
  
  components: {
    ...LucideIcons
  },

  props: {
    content: {
      type: Object,
      default: () => ({})
    },
    uid: {
      type: String,
      default: ''
    }
  },

  emits: ['trigger-event', 'update:content'],

  setup(props, { emit }) {
    const isCollapsedState = ref(props.content.isCollapsed || false);
    const activeItemId = ref(props.content.activeItemId || '');
    const expandedItems = ref([]);
    const showUserMenu = ref(false);
    const showTopbarMenu = ref(false);
    const searchQuery = ref('');

    watch(() => props.content.isCollapsed, (newVal) => {
      isCollapsedState.value = newVal;
    });

    watch(() => props.content.activeItemId, (newVal) => {
      activeItemId.value = newVal;
    });

    // Computed styles
    const layoutStyles = computed(() => ({
      '--layout-bg': props.content.sidebarBgColor || '#F4F4F6'
    }));

    const sidebarStyles = computed(() => ({
      backgroundColor: props.content.sidebarBgColor || '#F4F4F6',
      width: isCollapsedState.value ? (props.content.collapsedWidth || '60px') : (props.content.sidebarWidth || '240px')
    }));

    const mainAreaStyle = computed(() => ({
      borderTopLeftRadius: props.content.contentBorderRadius || '12px',
      marginTop: props.content.contentMarginTop || '0px',
      backgroundColor: '#fff'
    }));

    const contentAreaStyle = computed(() => ({
      backgroundColor: props.content.contentBgColor || '#fff'
    }));

    const topbarStyle = computed(() => ({
      borderTopLeftRadius: props.content.contentBorderRadius || '12px'
    }));

    const searchContainerStyle = computed(() => ({
      backgroundColor: props.content.searchBgColor || '#f1f5f9'
    }));

    const badgeStyle = computed(() => ({
      backgroundColor: props.content.badgeBgColor || '#0f172a',
      color: props.content.badgeTextColor || '#fff'
    }));

    const promoCardStyle = computed(() => ({
      backgroundColor: props.content.promoCardBg || '#fff'
    }));

    const promoBtnStyle = computed(() => ({
      backgroundColor: props.content.promoBtnBg || '#0f172a',
      color: props.content.promoBtnColor || '#fff'
    }));

    // Icon helper - handles both "icon-name" and "lucide/icon-name" formats
    const getIcon = (name) => {
      if (!name) return LucideIcons.Circle;
      
      // Remove "lucide/" or any other prefix like "phosphor/" etc.
      let iconName = name;
      if (name.includes('/')) {
        iconName = name.split('/').pop();
      }
      
      // Convert kebab-case to PascalCase
      const pascalCase = iconName.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join('');
      
      const icon = LucideIcons[pascalCase];
      if (icon) return icon;
      
      // Try with different variations
      // Some icons might have numbers, try to handle them
      const variations = [
        pascalCase,
        pascalCase.replace(/(\d+)/g, '$1'), // Keep numbers as-is
        iconName.replace(/-/g, ''), // Remove dashes completely
      ];
      
      for (const variation of variations) {
        if (LucideIcons[variation]) return LucideIcons[variation];
      }
      
      console.warn('Icon not found:', name, '-> tried:', pascalCase);
      return LucideIcons.Circle;
    };

    // Transform flat menuItems to grouped menuSections
    const menuSections = computed(() => {
      const items = props.content.menuItems || [];
      const sections = {};
      
      items.forEach(item => {
        const sectionLabel = item.section || 'Menu';
        if (!sections[sectionLabel]) {
          sections[sectionLabel] = {
            label: sectionLabel,
            items: []
          };
        }
        sections[sectionLabel].items.push(item);
      });
      
      return Object.values(sections);
    });

    const getNavItemStyle = (item) => {
      const isActive = activeItemId.value === item.id;
      return {
        backgroundColor: isActive ? (props.content.activeItemBg || 'rgba(0,0,0,0.06)') : 'transparent',
        color: isActive ? (props.content.activeItemColor || '#0f172a') : (props.content.textColor || '#0f172a')
      };
    };

    const getSubItemStyle = (child) => {
      const isActive = activeItemId.value === child.id;
      return {
        color: isActive ? (props.content.activeItemColor || '#0f172a') : (props.content.mutedTextColor || '#64748b'),
        backgroundColor: isActive ? (props.content.activeItemBg || 'rgba(0,0,0,0.06)') : 'transparent',
        borderLeftColor: isActive ? (props.content.activeItemColor || '#0f172a') : 'transparent'
      };
    };

    // Event handlers
    const toggleCollapse = () => {
      isCollapsedState.value = !isCollapsedState.value;
      emit('trigger-event', {
        name: 'toggle-collapse',
        event: { collapsed: isCollapsedState.value }
      });
    };

    const handleItemClick = (item, index) => {
      if (item.children && item.children.length) {
        const idx = expandedItems.value.indexOf(item.id);
        if (idx > -1) {
          expandedItems.value.splice(idx, 1);
        } else {
          expandedItems.value.push(item.id);
        }
      } else {
        activeItemId.value = item.id;
        emit('trigger-event', {
          name: 'menu-item-click',
          event: { item, index, route: item.route || '' }
        });
      }
    };

    const handleSubItemClick = (child, index) => {
      activeItemId.value = child.id;
      emit('trigger-event', {
        name: 'menu-item-click',
        event: { item: child, index, route: child.route || '' }
      });
    };

    const toggleUserMenu = () => {
      showUserMenu.value = !showUserMenu.value;
      showTopbarMenu.value = false;
    };

    const handleUserMenuClick = (menuItem) => {
      showUserMenu.value = false;
      showTopbarMenu.value = false;
      emit('trigger-event', {
        name: 'user-menu-click',
        event: { item: menuItem, action: menuItem.action || '' }
      });
    };

    const handleLogout = () => {
      showUserMenu.value = false;
      showTopbarMenu.value = false;
      emit('trigger-event', {
        name: 'logout-click',
        event: {}
      });
    };

    const handlePromoClick = () => {
      emit('trigger-event', {
        name: 'promo-click',
        event: {}
      });
    };

    const handleSearch = () => {
      emit('trigger-event', {
        name: 'search',
        event: { query: searchQuery.value }
      });
    };

    const handleNotificationClick = () => {
      emit('trigger-event', {
        name: 'notification-click',
        event: {}
      });
    };

    const handleThemeToggle = () => {
      emit('trigger-event', {
        name: 'theme-toggle',
        event: {}
      });
    };

    const handleSettingsClick = () => {
      emit('trigger-event', {
        name: 'settings-click',
        event: {}
      });
    };

    return {
      isCollapsedState,
      activeItemId,
      expandedItems,
      showUserMenu,
      showTopbarMenu,
      searchQuery,
      layoutStyles,
      sidebarStyles,
      mainAreaStyle,
      contentAreaStyle,
      topbarStyle,
      searchContainerStyle,
      badgeStyle,
      promoCardStyle,
      promoBtnStyle,
      menuSections,
      getIcon,
      getNavItemStyle,
      getSubItemStyle,
      toggleCollapse,
      handleItemClick,
      handleSubItemClick,
      toggleUserMenu,
      handleUserMenuClick,
      handleLogout,
      handlePromoClick,
      handleSearch,
      handleNotificationClick,
      handleThemeToggle,
      handleSettingsClick
    };
  }
};
</script>

<style scoped>
/* ========== LAYOUT ========== */
.ww-dashboard-layout {
  display: grid !important;
  grid-template-columns: auto 1fr;
  width: 100% !important;
  min-height: 100vh;
  background-color: var(--layout-bg, #F4F4F6) !important;
}

/* ========== SIDEBAR ========== */
.ww-sidebar {
  grid-column: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  transition: width 0.2s ease;
  overflow: hidden;
}

.ww-sidebar:hover {
  overflow-y: auto;
}

.ww-sidebar::-webkit-scrollbar {
  width: 4px;
}

.ww-sidebar::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.2);
  border-radius: 4px;
}

/* Header */
.ww-sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 25px 16px 8px 16px;
  min-height: 49px;
}

.ww-logo-area {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ww-logo-img {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.ww-logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Icon SVG styles */
.ww-icon-svg {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
}

.ww-icon-svg :deep(svg) {
  width: 100%;
  height: 100%;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.ww-logo-icon .ww-icon-svg {
  width: 24px;
  height: 24px;
}

.ww-dropdown-icon {
  width: 16px;
  height: 16px;
}

.ww-logo-text {
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
}

/* Navigation */
.ww-sidebar-nav {
  flex: 1;
  padding: 8px 12px;
}

.ww-nav-section {
  margin-bottom: 8px;
}

.ww-section-label {
  display: block;
  padding: 8px 16px;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.ww-nav-item-wrapper {
  position: relative;
}

.ww-nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 13px;
  border-radius: 6px;
}

.ww-nav-item:hover {
  background: rgba(0,0,0,0.04);
}

.ww-nav-icon {
  flex-shrink: 0;
}

.ww-nav-label {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ww-nav-arrow {
  transition: transform 0.2s ease;
}

.ww-nav-arrow.ww-rotated {
  transform: rotate(90deg);
}

.ww-nav-badge {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
}

/* Submenu */
.ww-nav-submenu {
  padding-left: 44px;
}

.ww-nav-subitem {
  position: relative;
  padding: 8px 16px 8px 12px;
  font-size: 13px;
  cursor: pointer;
  border-left: 2px solid transparent;
  margin-left: -2px;
  transition: all 0.15s ease;
}

.ww-nav-subitem:hover {
  color: #0f172a;
}

/* Footer */
.ww-sidebar-footer {
  margin-top: auto;
  padding: 12px;
}

/* Promo Card */
.ww-promo-card {
  padding: 14px;
  border-radius: 10px;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

.ww-promo-content {
  margin-bottom: 12px;
}

.ww-promo-content strong {
  display: block;
  font-size: 13px;
  margin-bottom: 4px;
}

.ww-promo-content p {
  font-size: 11px;
  margin: 0;
  line-height: 1.4;
}

.ww-promo-btn {
  width: 100%;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.15s;
}

.ww-promo-btn:hover {
  opacity: 0.9;
}

/* User Section */
.ww-user-section {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
}

.ww-user-section:hover {
  background: rgba(0,0,0,0.04);
}

.ww-user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.ww-user-info {
  flex: 1;
  min-width: 0;
}

.ww-user-name {
  display: block;
  font-size: 13px;
  font-weight: 500;
}

.ww-user-email {
  display: block;
  font-size: 11px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ww-user-menu-btn {
  cursor: pointer;
}

/* User Dropdown Menu */
.ww-user-dropdown {
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  margin-bottom: 8px;
  padding: 8px 0;
  z-index: 1000;
}

.ww-dropdown-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
}

.ww-dropdown-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.ww-dropdown-user-info {
  flex: 1;
}

.ww-dropdown-name {
  display: block;
  color: #0f172a;
  font-size: 13px;
  font-weight: 500;
}

.ww-dropdown-email {
  display: block;
  color: #64748b;
  font-size: 11px;
}

.ww-dropdown-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 4px 0;
}

.ww-dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  color: #64748b;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s;
}

.ww-dropdown-item:hover {
  background: #f8fafc;
  color: #0f172a;
}

/* Collapsed State */
.ww-sidebar.ww-collapsed .ww-logo-text,
.ww-sidebar.ww-collapsed .ww-section-label,
.ww-sidebar.ww-collapsed .ww-nav-label,
.ww-sidebar.ww-collapsed .ww-nav-arrow,
.ww-sidebar.ww-collapsed .ww-nav-badge,
.ww-sidebar.ww-collapsed .ww-nav-submenu,
.ww-sidebar.ww-collapsed .ww-promo-card,
.ww-sidebar.ww-collapsed .ww-user-info,
.ww-sidebar.ww-collapsed .ww-user-menu-btn {
  display: none;
}

.ww-sidebar.ww-collapsed .ww-nav-item {
  justify-content: center;
  padding: 12px;
}

.ww-sidebar.ww-collapsed .ww-user-section {
  justify-content: center;
}

.ww-sidebar.ww-collapsed .ww-sidebar-header {
  justify-content: center;
}

/* ========== MAIN AREA ========== */
.ww-main-area {
  grid-column: 2;
  display: flex !important;
  flex-direction: column !important;
  min-height: 100vh;
  background: #fff;
  box-shadow: 0 0 20px rgba(0,0,0,0.05);
}

/* Top Bar */
.ww-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 24px;
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
  flex-shrink: 0;
}

.ww-topbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.ww-topbar-btn {
  position: relative;
  background: none;
  border: none;
  color: #64748b;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ww-topbar-btn:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.ww-topbar-btn.ww-notification .ww-notification-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 8px;
  height: 8px;
  background: #ef4444;
  border-radius: 50%;
  border: 2px solid #fff;
}

.ww-search-container {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  min-width: 280px;
}

.ww-search-icon {
  color: #94a3b8;
  flex-shrink: 0;
}

.ww-search-input {
  flex: 1;
  border: none;
  background: none;
  outline: none;
  font-size: 13px;
  color: #0f172a;
}

.ww-search-input::placeholder {
  color: #94a3b8;
}

.ww-topbar-right {
  display: flex;
  align-items: center;
  gap: 4px;
}

.ww-topbar-profile {
  position: relative;
  cursor: pointer;
  margin-left: 8px;
}

.ww-topbar-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.ww-topbar-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  margin-top: 8px;
  padding: 8px 0;
  z-index: 1000;
  min-width: 220px;
}

/* ========== CONTENT AREA ========== */
.ww-content-area {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.ww-content-slot {
  min-height: 200px;
  width: 100%;
  display: block;
}
</style>
