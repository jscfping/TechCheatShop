




```bash
minikube version
minikube start
minikube status

kubectl get nodes
kubectl get svc
```


於`docs/k8s/simple`

# 建image和測試
```bash
docker build -t simple-express-server:0.0.1 .

docker run --rm -d -p 3000:3000 -e PORT=3000 simple-express-server:0.0.1

# 上傳至DockerHub
docker tag simple-express-server:0.0.1 {DockerHubUser}/simple-express-server:0.0.1 #这个命令不会改变原始镜像，而是为同一个镜像添加一个额外的引用名称
docker push {DockerHubUser}/simple-express-server:0.0.1
```


```bash

# 已先於docs/docker/image_express_api 中build好image: docker build -t image_express_api:0.0.1 .

minikube image load image_express_api:0.0.1 # 把本機的image傳給minikube，不傳的話他可能跑去DockerHub抓

kubectl apply -f deployment.yaml

kubectl get pods

minikube service express-api-nodeport

minikube delete # 重置全部設定
```


```bash
docker tag simple-express-server:0.0.1 {DockerHubUser}/simple-express-server:0.0.1 #这个命令不会改变原始镜像，而是为同一个镜像添加一个额外的引用名称
docker push {DockerHubUser}/simple-express-server:0.0.1
```




# multipass + k3s

於host

```bash
multipass list
multipass shell k3s


sudo snap run multipass launch --name k3s --cpus 2 --memory 8G --disk 10G # 即master-node
multipass shell k3s # 進去k3s內(非走SSH通道)


```

於master-node
```bash
curl -sfL https://get.k3s.io | sh - # 安裝k3s

```

於host
```bash
TOKEN=$(multipass exec k3s sudo cat /var/lib/rancher/k3s/server/node-token)
MASTER_IP=$(multipass info k3s | grep IPv4 | awk '{print $2}')

echo $TOKEN
echo $MASTER_IP

multipass launch --name worker1 --cpus 2 --memory 8G --disk 10G
multipass launch --name worker2 --cpus 2 --memory 8G --disk 10G

# 在worker节点虚拟机上安装k3s
for f in 1 2; do
    multipass exec worker$f -- bash -c "curl -sfL https://get.k3s.io | K3S_URL=\"https://$MASTER_IP:6443\" K3S_TOKEN=\"$TOKEN\" sh -"
done
```





```bash

sudo kubectl get nodes
sudo kubectl get svc
sudo kubectl get pods
sudo kubectl get pods -o wide

sudo kubectl get deployment
sudo kubectl get replicaset
 
sudo kubectl get all
 
sudo kubectl expose deployment nginx-deployment
 
sudo kubectl describe service nginx-deployment


sudo kubectl delete service nginx-deployment
 
sudo kubectl run nginx --image=nginx
sudo kubectl create deployment ngnix-deployment --image=nginx
sudo kubectl delete deployment ngnix-deployment


sudo kubectl logs ngnix-deployment-5459848d79-gq2dg



sudo kubectl exec -it ngnix-deployment-5459848d79-gq2dg -- /bin/bash

sudo kubectl get namespace #預設在default
```




# 其他常用 bash
```bash
ssh u@192.168.1.1 # 使用u使用者登入linux 192.168.1.1的SSH server


```
