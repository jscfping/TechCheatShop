




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


docker tag asp-dotnet-web-60 asp-dotnet-web-60:0.0.1 # 對已存在image上版本
```


```bash

# 已先於docs/docker/image_express_api 中build好image: docker build -t image_express_api:0.0.1 .

minikube image load image_express_api:0.0.1 # 把本機的image傳給minikube，不傳的話他可能跑去DockerHub抓

kubectl apply -f deployment.yaml

kubectl get pods

minikube service express-api-nodeport

minikube delete # 重置全部設定


# k8s的docker run -it --rm busybox:1.36.1 sh
kubectl run busybox --image=busybox:1.36.1 --restart=Never -- sleep 3600
kubectl exec -it busybox -- sh
kubectl delete pod busybox

kubectl run busybox --rm --tty -i --restart='Never' --image=busybox:1.36.1 --namespace default --env abc=de123 --command -- sh # 一句話

# 強制刪除pod
kubectl delete pod express-api-5995b8d65-97b7g --force --grace-period=0
```


```bash
docker tag simple-express-server:0.0.1 {DockerHubUser}/simple-express-server:0.0.1 #这个命令不会改变原始镜像，而是为同一个镜像添加一个额外的引用名称
docker push {DockerHubUser}/simple-express-server:0.0.1
```




# multipass + k3s

於host

```bash
multipass list

sudo snap run multipass launch --name k3s --cpus 1 --memory 2G --disk 10G # 即master-node

multipass mount $HOME/work k3s:/home/ubuntu/work #假設~/work為工作目錄、對應虛擬機內的~/work

multipass shell k3s # 進去k3s內(非走SSH通道)


```

於master-node
```bash
curl -sfL https://get.k3s.io | sh - # 安裝k3s

```

於host
```bash
TOKEN=$(multipass exec k3s sudo cat /var/lib/rancher/k3s/server/node-token)
MASTER_IP=$(multipass info k3s | grep IPv4 | awk '{print $2}') # 就是multipass list的IPv4

echo $TOKEN
echo $MASTER_IP

multipass launch --name worker1 --cpus 1 --memory 2G --disk 10G
multipass launch --name worker2 --cpus 1 --memory 2G --disk 10G

# 在worker节点虚拟机上安装k3s
for f in 1 2; do
    multipass exec worker$f -- bash -c "curl -sfL https://get.k3s.io | K3S_URL=\"https://$MASTER_IP:6443\" K3S_TOKEN=\"$TOKEN\" sh -"
done


multipass stop worker1 # 關閉虛擬機
multipass start worker1 # 開機虛擬機
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

```bash

kubectl config get-contexts # 多台k8s叢集，看你的kubectl可以選那些
kubectl config use-context minikube # 切換叢集 minikube
kubectl config use-context docker-desktop # 切換叢集 docker-desktop
```


