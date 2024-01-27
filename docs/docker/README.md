





# 基礎操作(以`windows bash`為主)

下方附有`常用bash操作`

## `image_express_api` 表image相關操作
## `compose_visits` 表compose相關操作，搭配redis紀錄拜訪次數


```bash

#確認資訊
docker version


# 使用busybox做一個container後，執行，但因為沒東西就又關閉了
docker run busybox


# 開機後執行echo hi there後關閉
docker run busybox echo hi there!


docker run -it busybox # 開機後進入CLI (it表示互動)，這會建一個container
docker run -it -d busybox # 讓他開啟bash(-d表示背景執行)，這會建一個container

####################錯誤示範####################
docker run hello-world echo 123 # 報錯
docker run -it hello-world # 無反應



docker ps # 正在運行的containers
docker ps --all # 所有的containers

docker image ls
```




`docker run` = `docker create` + `docker start`

```bash
docker create busybox watch -n 1 date
# 回 cc36cd94b3d63efd79578ffe36f7239aefab7e97d79e5683da8fcd942a54ab34

# docker start僅用於啟動並執行，-a的話會把其輸出輸出到CLI。
docker start -a cc36cd94b3d63efd79578ffe36f7239aefab7e97d79e5683da8fcd942a54ab34

# 如果要啟動後執行命令要再docker exec
docker start cc36cd94b3d63efd79578ffe36f7239aefab7e97d79e5683da8fcd942a54ab34
docker exec cc36cd94b3d63efd79578ffe36f7239aefab7e97d79e5683da8fcd942a54ab34 ps


####################docker log####################
docker create busybox echo 123 # 回 a9a2af4c800caf734e2cbdfe14b466ce03d72cb4d69d293df00f22082d3cb6c3

docker logs a9a2af4c800caf734e2cbdfe14b466ce03d72cb4d69d293df00f22082d3cb6c3 # 看他輸出的東西



# docker stop(SIGTERM會慢慢關機，默認給程序10秒，如果還關不了就kill了)
docker create busybox watch -n 1 date # 回 d2fafb160e6b39a7265cb7006cc4bf27a271cc34ec9ba9e91d441498538c12b8
docker start d2fafb160e6b39a7265cb7006cc4bf27a271cc34ec9ba9e91d441498538c12b8
docker stop d2fafb160e6b39a7265cb7006cc4bf27a271cc34ec9ba9e91d441498538c12b8
docker kill d2fafb160e6b39a7265cb7006cc4bf27a271cc34ec9ba9e91d441498538c12b8 # 直接關機(SIGKILL)


# 因為busybox的image有包cmd`sh`，所以下列兩個指令有一樣效果
docker run -it --rm busybox:1.36.1
docker run -it --rm busybox:1.36.1 sh

# 使用其他程式
docker run -it --rm busybox:1.36.1 ping 8.8.8.8
docker run -it --rm busybox:1.36.1 watch -n 1 date #沒sh，要從container外面關


docker run -it --rm --name my-busybox -e my_var='12 3' -v /$(pwd)/docker_busybox:/busybox busybox:1.36.1
echo $my_var

docker run -it --rm \
--name my-busybox \
-e my_var='12 3' \
-v /$(pwd)/docker_busybox:/busybox \
busybox:1.36.1

# 離開的話ctrl+D，表該sh結束。sh結束，就沒東西跑了，所以整個container結束
```


# redis簡易使用範例
```bash
docker run redis # 先跑這個

# 連線到主機再執行
docker exec -it c154dfb7e40b redis-cli #再在別個bash跑這個
127.0.0.1:6379> SET v 5
# OK
127.0.0.1:6379> get v
# "5"


docker run -d --rm \
--name some-redis \
-p 6379:6379 \
redis:7.2.4 --requirepass "redispw" 
# 不一定要密碼( --requirepass "redispw" 可以不要)
```



# 清除

```bash
docker system prune
docker system prune -a # images也清掉
```








# build image

`image_express_api`目錄

```bash
# 於$(repo)/docs/docker/image_express_api/
docker build -t image_express_api . # .表示pwd/Dockerfile
docker build -t image_express_api:0.0.1 . # 版本 0.0.1

# 於$(repo)/docs/docker/
docker build --no-cache --progress=plain -t image_express_api2 -f $(pwd)/image_express_api/Dockerfile $(pwd)/image_express_api
# --no-cache 使用cache
# --progress=plain 列出詳細過程
# 若以前順序跑過則可以使用cache，因為docker是一層一層疊上去
# 所以疊的順序若沒變，則會抓cache來用

docker run -d --rm --name express_api -p 3001:3000 -e PORT='3000' -e env_in_run='i am in run 3001' -e proxy_url='http//:localhost:3001' image_express_api
# 本機的3001對到container內的3000


docker run -d --rm --name express_api3000 -p 3001:3000 -e PORT='3000' -e env_in_run='i am in run 3001' -e proxy_url='http://host.docker.internal:3001' image_express_api:0.0.1
docker run -d --rm --name express_api3002 -p 3002:3000 -e PORT='3000' -e env_in_run='i am in run 3002' -e proxy_url='http://host.docker.internal:3001' image_express_api:0.0.1
# proxy_url='http//:localhost:3001'對container來說他抓不到東西，要藉由http://host.docker.internal讓docker幫你導址

docker exec -it 75c31cc2fa4f bash # 針對執行的container再使用bash登入一個使用者

docker run -it --rm image_express_api:0.0.1 bash # 不跑Dockerfile的CMD，而跑其bash

```



# attach
```bash
docker attach de2474d23a9f # 貼去PID=1，不太有用
```



# commit
- 基础镜像层（Base Image Layer）：这是容器文件系统的基础，通常包含操作系统和一些基本工具。例如，一个基于 Ubuntu 的 Docker 镜像会在这一层包含 Ubuntu 操作系统的文件。

- 中间层（Intermediate Layers）：在基础镜像之上，可以添加多个中间层。这些层通常是由 Dockerfile 中定义的命令创建的，比如安装软件包或复制文件到镜像中。

- 可写层（Writable Layer）：当容器启动时，Docker 会在所有只读层的顶部添加一个可写层。容器内的所有运行时改变，如新文件的创建和现有文件的修改，都会发生在这个可写层。当容器停止时，这些改变不会影响镜像的只读层，但可以被提交（commit）到一个新的镜像中，从而保留下来。

- 存储驱动（Storage Drivers）：Docker 使用存储驱动来管理文件系统层的细节。存储驱动负责在容器内部和宿主机之间高效地映射和管理文件。常见的存储驱动包括 Overlay2、AUFS、Btrfs 等。

- 数据卷（Volumes）：容器可以使用数据卷来持久化数据。数据卷是独立于容器的一部分，可以被挂载到容器内的特定路径。数据卷不属于容器的层次化文件系统，而是直接在宿主机上进行数据存储。
```bash
# 環境變數相關設置也會保留
docker commit -c 'CMD ["node", "index.js"]' 75c31cc2fa4f
# 回應sha256:b03a7c5334b09180926642545c20f5e41983f317de482bff973f2d06fab79773
docker image ls
docker run -d --rm --name express_api3003 -p 3003:3000 -e PORT='3000' -e env_in_run='i am in run 3003' -e proxy_url='http://host.docker.internal:3001' b03a7c5334b09180926642545c20f5e41983f317de482bff973f2d06fab79773
docker run -it --rm b03a7c5334b09180926642545c20f5e41983f317de482bff973f2d06fab79773 bash

docker commit -c 'CMD ["node", "index.js"]' 75c31cc2fa4f new_express_api:0.0.1 # 存成new_express_api:0.0.1
docker run -it --rm new_express_api:0.0.1 bash
```




# docker compose

`docs/docker/compose_visits`目錄

使用image測試
```bash
# 於$(repo)/docs/docker/compose_visits/
docker build -t visit_api .

# 先開啟redis
docker run -d --rm \
--name some-redis \
-p 6379:6379 \
redis:7.2.4 --requirepass "redispw" 

docker run -d --rm \
--name visit_api3001 \
-p 3001:3000 \
-e PORT='3000' \
-e msg='3001的api' \
-e redisConnectionString='redis://:redispw@host.docker.internal:6379' \
-e proxyUrl='http://host.docker.internal:3001' \
visit_api

```

compose

```bash
# 於$(repo)/docs/docker/compose_visit
docker-compose up # 類似docker run(若沒有則docker build)
docker-compose up --build # 不管有沒有build過都重新docker build + run
docker-compose up --build -d #-d表示背景執行

docker-compose build --no-cache # 純粹build且no-cache

# pwd有docker-compose.yaml才有東西
docker-compose down # 移除
docker-compose ps

# 於$(repo)/docs/docker/
docker-compose -f compose_visits/docker-compose.yml up
docker-compose -f compose_visits/docker-compose.yml down

```



# 常用bash操作


```bash
ps # 看有哪些程序

# 結束PID為123的程序，-9為強制結束
kill 123
kill -9 123

pwd #現在所在
echo $(pwd)

echo 123
echo 123 45
echo 123 45 > data.txt
export myvar=5
echo $myvar


echo 12345 | cat # 把左側的12345 丟給右側的cat作為輸入(即輸出12345)

# cat回應用法
cat #1 enter
123 # 标准输入123
123 # 回應123

env # 查看現在環境變數
```