<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { UploadFileInfo } from 'naive-ui';
import { NButton, NModal, NUpload } from 'naive-ui';
import { Cropper } from 'vue-advanced-cropper';
import { fetchUpdateUserAvatar } from '@/service/api/system';
import { useAuthStore } from '@/store/modules/auth';
import defaultAvatar from '@/assets/imgs/soybean.jpg';
import 'vue-advanced-cropper/dist/style.css';

interface CropperOptions {
  img: string;
  fileName: string;
  stencilProps: {
    aspectRatio: number;
  };
}

interface CropperRef {
  getResult: () => {
    canvas: HTMLCanvasElement;
  };
}

const authStore = useAuthStore();

const showModal = ref(false);
const imageUrl = ref(authStore.userInfo.user?.avatar || defaultAvatar);
const cropperRef = ref<CropperRef | null>(null);

// 图片裁剪数据
const options = reactive<CropperOptions>({
  img: imageUrl.value,
  fileName: '',
  stencilProps: {
    aspectRatio: 1
  }
});

/** 编辑头像 */
function handleEdit() {
  showModal.value = true;
}

/** 处理文件选择 */
async function handleFileSelect(data: { file: UploadFileInfo }) {
  const file = data.file.file;
  if (!file) return false;

  if (!file.type.includes('image/')) {
    window.$message?.error('请上传图片类型文件（JPG、PNG等）');
    return false;
  }

  const reader = new FileReader();
  reader.onload = () => {
    options.img = reader.result as string;
    options.fileName = file.name;
  };
  reader.readAsDataURL(file);

  return false;
}

/** 处理裁剪 */
async function handleCrop() {
  if (!cropperRef.value) return;

  const { canvas } = cropperRef.value.getResult();

  // 将 canvas 转换为 blob
  canvas.toBlob(async (blob: Blob | null) => {
    if (!blob) return;

    const formData = new FormData();
    formData.append('avatarfile', blob, options.fileName || 'avatar.png');

    const { error } = await fetchUpdateUserAvatar(formData);
    if (!error) {
      window.$message?.success('头像更新成功！');
      imageUrl.value = URL.createObjectURL(blob);
      handleClose();
    }
  }, 'image/png');
}

/** 关闭对话框 */
function handleClose() {
  showModal.value = false;
  options.img = imageUrl.value;
}
</script>

<template>
  <div class="avatar-wrapper" @click="handleEdit">
    <div class="avatar-container">
      <img :src="imageUrl" alt="user-avatar" class="avatar-image" />
      <div class="avatar-overlay">
        <SvgIcon icon="ep:plus" class="text-24px" />
      </div>
    </div>

    <NModal v-model:show="showModal" preset="card" title="修改头像" class="w-400px" @close="handleClose">
      <div class="upload-container">
        <div v-if="options.img !== imageUrl" class="cropper-container">
          <Cropper ref="cropperRef" class="cropper" :src="options.img" :stencil-props="options.stencilProps" />
        </div>
        <img v-else :src="imageUrl" alt="user-avatar" class="preview-image" />
        <div class="button-group">
          <NUpload accept=".jpg,.jpeg,.png,.gif" :max="1" :show-file-list="false" @before-upload="handleFileSelect">
            <NButton class="upload-button">选择图片</NButton>
          </NUpload>
          <NButton v-if="options.img !== imageUrl" type="primary" class="upload-button" @click="handleCrop">
            确认裁剪
          </NButton>
        </div>
      </div>
    </NModal>
  </div>
</template>

<style lang="scss" scoped>
.avatar-wrapper {
  display: inline-block;
  cursor: pointer;
}

.avatar-container {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;

  &:hover .avatar-overlay {
    opacity: 1;
  }
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s ease;
  color: #fff;
}

.upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px 0;
}

.cropper-container {
  width: 100%;
  height: 300px;
}

.cropper {
  height: 100%;
  background: #f8f8f8;
}

.preview-image {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #eee;
}

.button-group {
  display: flex;
  gap: 12px;
}

.upload-button {
  min-width: 100px;
}
</style>
