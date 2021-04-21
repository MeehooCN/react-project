#!/bin/bash
# 此文件仅供参考
# 进入放置项目的目录
cd /opt/view
# 新建日期
currentDate=$(date +%Y%m%d%H%M)
# 新建备份目录
mkdir -p /opt/backup/$currentDate
# 备份原目录
cp -r /opt/view/company_share /opt/backup/$currentDate/company_share
# 删除原目录
rm -rf company_share
# 解压
unzip dist.zip
# 修改名称
mv dist company_share
# 删除压缩包
rm -rf dist.zip
