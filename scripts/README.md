docker 镜像构建说明
===

### 构建基本环境镜像
*  目的:

    构建nodejs基本运行环境
*  脚本:

    scripts/build_docker_image_mepc_node.sh
*  Dockerfile:

    Dockerfiles/Dockerfile_mepc_node
*  生成镜像:

    registry.gli.space:5000/mepc_node:latest


***
### 构建打包镜像
*  目的:

    构建mepc打包用镜像用于打包
*  脚本:

    scripts/build_docker_image_mepc.sh
*  Dockerfile:

    Dockerfiles/Dockerfile
*  生成镜像:

    mepc_build:latest
    

***
### 执行打包
*  目的:

    执行mepc_build:latest进行打包工作
*  脚本:

    scripts/run_docker_release.sh
*  使用镜像:

    mepc_build:latest
*  生成结果:

    dist目录
    

***
### 构建nginx运行镜像
*  目的:

    基于nginxdocker镜像打包入dist目录生成可运行镜像
*  脚本:

    scripts/build_docker_image_mepc_nginx.sh
*  Dockerfile:

    Dockerfile
*  生成镜像:

    registry.gli.space:5000/mepc_nginx:$TAG

***
### 与jenkins的联动
* jenkins脚本：

```
$WORKSPACE/scripts/build_docker_image_mepc.sh latest
$WORKSPACE/scripts/run_docker_release.sh latest

sudo $WORKSPACE/scripts/build_docker_image_mepc_nginx.sh $BUILD_NUMBER
```