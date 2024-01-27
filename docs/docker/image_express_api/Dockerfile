# 使用 Node.js 的官方镜像作为基础镜像
FROM node:14

# 设置环境变量 env_in_image
ENV env_in_image=ThisIsEnvInImage

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json 到容器中
COPY package*.json ./

# 安装 Node.js 依赖
RUN npm install

# 复制服务器文件到容器中
COPY . .

# 暴露端口 3000，可以不填
# EXPOSE 3000

# 启动 Express 服务器
CMD ["node", "index.js"]