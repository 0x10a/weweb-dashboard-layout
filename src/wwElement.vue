<template>
    <div class="dashboard-minimal">
        <div class="sidebar">
            <div class="sidebar-header">Dashboard Test</div>
        </div>
        <div class="main-content">
            <wwLayout path="dashboardContent" class="content-layout"></wwLayout>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DashboardLayout',
    props: {
        content: { type: Object, required: true },
        uid: { type: String, required: true }
    },
    emits: ['trigger-event', 'update:content'],
    setup() {
        return {};
    }
};
</script>

<style scoped>
.dashboard-minimal {
    display: flex;
    width: 100%;
    height: 100vh;
    font-family: system-ui, -apple-system, sans-serif;
}

.sidebar {
    width: 250px;
    background: #1e293b;
    color: white;
}

.sidebar-header {
    padding: 20px;
    font-weight: bold;
}

.main-content {
    flex: 1;
    background: #f1f5f9;
}

.content-layout {
    width: 100%;
    height: 100%;
    min-height: 200px;
}
</style>
