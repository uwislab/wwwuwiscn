<template>
    <div class="code-display">
        <highlightjs language="c" :code="formattedCode" />
        <button @click="goBack">返回编辑</button>
    </div>
</template>

<script src="../../public/js/blockDefinitions.js"></script>
<script>
import { useRouter } from 'vue-router'


export default {
    data() {
        return {
            xmlData: localStorage.getItem('snapXML'),
            cCode: useBlockParser(this.xmlData).cCode,
        }
    },
    computed: {
        formattedCode() {
            return `#include <stdio.h>\n\nint main() {\n${this.cCode.value}\n\treturn 0;\n}`
        }
    },
    methods: {
        goBack() {
            const router = useRouter()
            router.back()
        }
    }
}
</script>

<style scoped>
.code-display {
    padding: 24px;
    max-width: 800px;
    margin: 0 auto;
}

button {
    margin-top: 20px;
    padding: 12px 24px;
    background: #4CAF50;
}
</style>