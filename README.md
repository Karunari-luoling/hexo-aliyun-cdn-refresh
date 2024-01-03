# 安装
```
npm i hexo-cdn-refresher
```
# 使用
在 hexo 或主题的配置文件中添加如下内容即可启用插件：
```
hacr:
  # 是否启用插件
  enable: true
  # 是否在发布后自动执行脚本
  auto_push: true
  # 网站地址
  site: https://byer.top/
  Access:
  # 阿里云CDN Access Token
    accessKeyId: L##########################2
    accessKeySecret: 9######################EH
  RefreshOpts:
    # 刷新类型 refresh刷新 push预热 both刷新cdn后预热
    type: refresh
    # 刷新目录directory 刷新文件file并在_data中创建refresh-list.json文件内容为["https://byer.top/1.png","https://byer.top/2.png"]
    method: directory
    # 设置both时的预热延迟时间
    time: 15000
```
输入`hexo hacr`手动刷新cdn或者将配置改为`auto_push: true`