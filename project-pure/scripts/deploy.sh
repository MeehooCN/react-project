#!/bin/bash
# 此文件仅供参考
# 进入放置 deploy.sh 的目录
cd /opt/view
# 删除原目录
rm -rf company_share
# 解压
unzip dist.zip
# 修改名称
mv dist company_share
# 删除压缩包
rm -rf dist.zip
