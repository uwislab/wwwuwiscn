<template>
    <div ref="scratchContainer" style="width: 800px; height: 600px;"></div>
</template>

<script>
import { ScratchGui } from 'scratch-gui';

export default {
    mounted() {
        // 初始化Scratch编辑器
        const container = this.$refs.scratchContainer;
        this.scratchGui = new ScratchGui({
            container,
            projectData: {}, // 可传入初始项目数据
            extensionPaths: [], // 扩展插件路径
            language: 'zh-cn' // 设置中文界面
        });

        // 处理窗口大小变化
        window.addEventListener('resize', () => {
            this.scratchGui.setSize(container.offsetWidth, container.offsetHeight);
        });
    },
    beforeDestroy() {
        // 销毁编辑器实例
        this.scratchGui.destroy();
    }
};
</script>