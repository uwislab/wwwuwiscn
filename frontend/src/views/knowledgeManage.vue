<template>
  <div class="knowledge-base-page">
    <div class="upload-btn-container">
      <el-button type="primary" @click="showUploadDialog = true">上传文件</el-button>
    </div>

    <el-dialog v-model="showUploadDialog" title="上传文件" width="500px">
      <div class="dialog-content">
        <el-upload
          ref="uploadRef"
          :on-change="handleFileChange"
          :auto-upload="false"
          :multiple="false"
          style="margin-bottom: 20px;"
        >
          <el-button slot="trigger" type="primary">选择文件</el-button>
        </el-upload>
        <el-radio-group v-model="retrieveMethod">
          <el-radio label="text">按连续空行划分</el-radio>
          <!-- <el-radio label="keyword">按关键词检索</el-radio> -->
        </el-radio-group>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleConfirm">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <div class="file-list">
      <pre v-for="(knowledge) in nowKnowledge" style="border: 1px solid #ddd; padding: 10px; margin: 10px 0;">
        {{ knowledge }}
      </pre>
    </div>
    <!-- 分页条 -->
    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[1, 5, 8]"
            layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
            @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-start" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import api from '../utils/axios';

// 弹窗显示
const showUploadDialog = ref(false);
// 暂存文件
const tempfile = ref(null);
// 检索方式
const retrieveMethod = ref('text');
// 文件是否读取完成的标志
const fileReadComplete = ref(false);
const allData = ref([]);
const nowKnowledge = ref([]);
const currentPage = ref(1);
const pageSize = ref(5);
const total = ref(800);

const getKnowledge = async () => {
  try {
    const res = await api.get('/knowledge/getKnowledge');
    if (res.data.flag === true) {
      allData.value = res.data.result;
      total.value = allData.value.length;
       updateCurrentPageData(); // 首次加载后更新当前页数据
    } else {
      ElMessage.error('获取知识库失败');
    }
  } catch (error) {
    ElMessage.error('获取知识库失败，请检查网络或重试');
   console.error('获取知识库错误：', error);
  }
}
getKnowledge();
// 更新当前页数据（根据页码和每页数量切片）
    const updateCurrentPageData = () => {
      const start = (currentPage.value - 1) * pageSize.value;
      const end = start + pageSize.value;
      nowKnowledge.value = allData.value.slice(start, end);
    };
//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size
    currentPage.value = 1;
    updateCurrentPageData();
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    currentPage.value = num
    updateCurrentPageData();
}
// 文件选择处理（暂存）
const handleFileChange = (uploadedFileInfo) => {
  fileReadComplete.value = false;
  // 确保获取到的是 File 对象
  const uploadedFile = uploadedFileInfo.raw;
  if (!uploadedFile) {
    ElMessage.warning('未获取到有效的文件对象');
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    tempfile.value = {
      rawFile: uploadedFile,
      content: e.target.result
    };
    fileReadComplete.value = true;
  };
  reader.readAsText(uploadedFile);
};

// 确认上传
const handleConfirm = async () => {
  if (!fileReadComplete.value) {
    ElMessage.warning('文件正在读取，请稍候');
    return;
  }

  if (!tempfile.value) {
    ElMessage.warning('请选择文件');
    return;
  }

  const formData = new FormData();
  formData.append('file', tempfile.value.rawFile);

  try {
    const res = await api.put('/knowledge/blankRow', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (res.data.flag === true) {
      ElMessage.success('文件上传成功');
      // 上传成功处理
      showUploadDialog.value = false;
      tempfile.value = null;
      fileReadComplete.value = false;
    } else {
      ElMessage.error('文件上传失败');
    }
  } catch (error) {
    ElMessage.error('文件上传失败，请检查网络或重试');
    console.error('上传文件错误：', error);
  }
};

// 取消操作
const handleCancel = () => {
  tempfile.value = null;
  fileReadComplete.value = false;
  showUploadDialog.value = false;
};
</script>

<style scoped>
.knowledge-base-page {
  padding: 20px;
}

.upload-btn-container {
  margin-bottom: 20px;
}

.file-list pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}

.dialog-content {
  padding: 20px;
}

.el-upload {
  width: 100%;
}
</style>    