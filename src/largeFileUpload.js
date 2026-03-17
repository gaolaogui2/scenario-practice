/**
 * 大文件分片上传
 * @param {File} file - 要上传的文件
 * @param {Object} options - 配置选项
 * @param {number} options.chunkSize - 分片大小（默认 2MB）
 * @param {number} options.concurrentLimit - 并发上传数量（默认 3）
 * @param {string} options.uploadUrl - 上传接口地址
 * @param {Function} options.onProgress - 进度回调
 * @param {Function} options.onSuccess - 成功回调
 * @param {Function} options.onError - 错误回调
 */
function largeFileUpload(file, options = {}) {
  const {
    chunkSize = 2 * 1024 * 1024, // 2MB
    concurrentLimit = 3,
    uploadUrl = "/api/upload",
    onProgress = () => {},
    onSuccess = () => {},
    onError = () => {},
  } = options;

  // 生成文件唯一标识
  const fileId = `${file.name}-${file.size}-${file.lastModified}`;

  // 计算分片数量
  const totalChunks = Math.ceil(file.size / chunkSize);

  // 已上传分片记录
  const uploadedChunks = new Set();

  // 创建分片
  const createChunks = () => {
    const chunks = [];
    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      chunks.push({
        index: i,
        blob: file.slice(start, end),
        total: totalChunks,
      });
    }
    return chunks;
  };

  // 上传单个分片
  const uploadChunk = async (chunk, retryCount = 3) => {
    const formData = new FormData();
    formData.append("file", chunk.blob);
    formData.append("fileId", fileId);
    formData.append("index", chunk.index);
    formData.append("total", chunk.total);
    formData.append("filename", file.name);

    try {
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`上传失败: ${response.status}`);
      }

      const result = await response.json();
      uploadedChunks.add(chunk.index);
      return result;
    } catch (error) {
      // 重试机制
      if (retryCount > 0) {
        return uploadChunk(chunk, retryCount - 1);
      }
      throw error;
    }
  };

  // 使用调度器控制并发（可复用之前的 Schedular）
  const uploadWithConcurrency = async (chunks) => {
    let completedCount = 0;

    // 简单并发控制实现
    const running = new Set();
    const queue = [...chunks];

    const runNext = async () => {
      if (queue.length === 0) return;
      if (running.size >= concurrentLimit) return;

      const chunk = queue.shift();
      running.add(chunk);

      try {
        await uploadChunk(chunk);
        completedCount++;
        onProgress({
          progress: (completedCount / totalChunks) * 100,
          uploaded: completedCount,
          total: totalChunks,
        });
      } finally {
        running.delete(chunk);
        runNext();
      }

      runNext();
    };

    // 启动并发任务
    const initialTasks = Math.min(concurrentLimit, chunks.length);
    const promises = [];
    for (let i = 0; i < initialTasks; i++) {
      promises.push(runNext());
    }

    await Promise.all(promises);
  };

  // 通知服务器合并分片
  const mergeChunks = async () => {
    const response = await fetch(`${uploadUrl}/merge`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileId,
        filename: file.name,
        total: totalChunks,
      }),
    });
    return response.json();
  };

  // 主执行流程
  const execute = async () => {
    try {
      // 1. 检查是否已上传（秒传逻辑）
      const checkResponse = await fetch(`${uploadUrl}/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId }),
      });
      const checkResult = await checkResponse.json();

      if (checkResult.exists) {
        onProgress({
          progress: 100,
          uploaded: totalChunks,
          total: totalChunks,
        });
        onSuccess(checkResult);
        return;
      }

      // 2. 创建分片并上传
      const chunks = createChunks();
      await uploadWithConcurrency(chunks);

      // 3. 合并分片
      const mergeResult = await mergeChunks();

      onSuccess(mergeResult);
    } catch (error) {
      onError(error);
    }
  };

  execute();
}

// HTML: <input type="file" id="fileInput" />
const fileInput = document.getElementById("fileInput");

fileInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  largeFileUpload(file, {
    chunkSize: 1 * 1024 * 1024, // 1MB 分片
    concurrentLimit: 4, // 最多 4 个并发
    uploadUrl: "/api/upload",

    onProgress: ({ progress, uploaded, total }) => {
      console.log(`上传进度：${progress.toFixed(2)}% (${uploaded}/${total})`);
      // 更新进度条 UI
      document.getElementById("progress").style.width = `${progress}%`;
    },

    onSuccess: (result) => {
      console.log("上传成功:", result);
    },

    onError: (error) => {
      console.error("上传失败:", error);
    },
  });
});

export { largeFileUpload };

/**
 * 分片上传
 */

class LargeFileUpload {
  file;
  chunkSize;
  concurrentLimit;
  uploadUrl;
  onProgress;
  onSuccess;
  onError;

  fileId;
  totalChunks;
  uploadedChunks;
  constructor(
    file,
    {
      chunkSize = 2 * 1024 * 1024,
      concurrentLimit = 3,
      uploadUrl = "/api/upload",
      onProgress = () => {},
      onSuccess = () => {},
      onError = () => {},
    },
  ) {
    this.file = file;
    this.chunkSize = chunkSize;
    this.concurrentLimit = concurrentLimit;
    this.uploadUrl = uploadUrl;
    this.onProgress = onProgress;
    this.onSuccess = onSuccess;
    this.onError = onError;

    this.fileId = `${file.name}-${file.size}-${file.lastModified}`;
    this.totalChunks = Math.ceil(file.size / chunkSize);
    this.uploadedChunks = new Set();

    this.execute();
  }

  async execute() {
    try {
      // 1. 检查是否已经上传（秒传）
      const checkResponse = await fetch(`${this.uploadUrl}/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId: this.fileId }),
      });

      const checkResult = checkResponse.json();

      if (checkResult.exists) {
        this.onProgress({
          progress: 100,
          uploaded: this.totalChunks,
          total: this.totalChunks,
        });
        this.onSuccess(checkResult);
        return;
      }

      // 2. 创建分片并上传
      const chunks = this.createChunks();
      await uploadWithConcurrency(chunks);

      // 3. 合并分片
      const mergeResult = await mergeChunks();
      onSuccess(mergeResult);
    } catch (e) {
      this.onError(e);
    }
  }

  createChunks() {
    const chunks = [];
    for (let i = 0; i < this.totalChunks; i++) {
      const start = i * this.chunkSize;
      const end = Math.min(start + this.chunkSize, this.file.size);
      chunks.push({
        index: i,
        blob: this.file.slice(start, end),
        total: this.totalChunks,
      });
    }
    return chunks;
  }

  async uploadWithConcurrency(chunks) {
    let completedCount = 0;
    const running = new Set();
    const queue = [...chunks];

    const runNext = async () => {
      if (queue.length === 0 || running.size >= this.concurrentLimit) {
        return;
      }

      const chunk = queue.shift();
      running.add(chunk);

      try {
        await uploadChunk(chunk);
        completedCount++;
        this.onProgress({
          progress: (completedCount / this.totalChunks) * 100,
          uploaded: completedCount,
          total: this.totalChunks,
        });
      } catch (e) {
        this.onError(e);
      } finally {
        running.delete(running);
        runNext();
      }
      runNext();
    };

    // 并发
    const initialTasks = Math.min(this.concurrentLimit, chunks.length);
    const promises = [];
    for (let i = 0; i < initialTasks; i++) {
      promises.push(runNext());
    }
    await Promise.all(promises);
  }

  async mergeChunks() {
    const response = await fetch(`${uploadUrl}/merge`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileId,
        filename: file.name,
        total: totalChunks,
      }),
    });
    return response.json();
  }
}
