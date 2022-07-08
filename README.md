# react-project
project-template 基础模板（不带菜单）  
project-template-menu 基础模板（带菜单）  
project-pure 基础模板（不带 ant-design）  
project-base 项目模板（带系统管理，登录，注销，修改密码，修改个人信息）

### 1.1 .cache-loader
编译缓存，修改 __config__/theme.js 后需要删除该缓存文件重新运行，不然会有编译缓存。 
### 1.2 __config__
项目的 typescript 图片配置，antd 主题自定义配置。 
### 1.3 build
webpack 编译配置，需关注 webpack.config.js 文件，后台代理在 devServer 中的 proxy 中。
### 1.4 dist
项目打包后输出路径。
### 1.5 node_modules
执行 npm install 后产生的依赖目录
### 1.6 scripts
暂时为项目自动化部署的配置及其脚本文件，打包部署时需要关注该文件夹中的 config.js。自动化部署可参考云盘中的自动化部署那块。
### 1.7 src 项目源代码
* -components 该文件夹存放项目中使用到的组件（包括公共组件和项目过程中产生的组件），该文件夹中有 index.ts 文件，该文件是组件导出，其余地方使用组件应从 index 引入。  
* -static 该文件夹存放项目静态文件，比如 公共的css ，图片文件，js 文件等。  
#### <font color='red'>注意：utils 中的希望大家多看看，在写之前在里面找找有没有，没有再写。</font>
* -utils -> Ajax 封装的请求方法，页面内请求都从这里调用。
* -utils -> CommonAPI 提出来的公共请求，存储多个页面常用的请求，如数据字典的请求。
* -utils -> CommonFunc 提出来的公共方法，存储多个页面常用的方法，如时间格式化。
* -utils -> CommonInterface 提出来的公共接口，存储多个页面常用的 Interface，一般和后台的实体挂钩，比如 基础实体。
* -utils -> CommonVars 提出来的公共变量，存储多个页面常用的变量，比如项目名称，主题色等。
* -views 存放页面文件，一个文件夹对应一个模块，该文件夹中有 index.ts 文件，该文件是页面的导出，其余地方使用页面应从 index 引入。
* app.tsx 应用入口。
* index.tsx 路由配置。

### 1.8 .babelrc
babel 配置文件。
### 1.9 .eslintrc.js
eslint 配置文件，每次拉新项目下来需要手动开启 eslint 检验。
### 1.10 package.json
项目管理配置文件，新项目启动需手动修改该文件中的 name，description 字段。
### 1.11 postcss.config.js
postcss 配置文件。
### 1.12 tsconfig.json
ts 配置文件。

# 如何使用 swagger 获取接口等。
### 拉取定义文件
1. 修改 swagger.config.mjs 文件，参考注释修改。
2. 运行命令 node interface
3. 可以看到生成 src/utils/swaggerDTO.d.ts 文件。

### 拉取不同模块的接口文件
1. 修改 swagger.config.mjs 文件，参考注释修改（如果已经更改了则无需再次更改）。
2. 运行命令 <br />
node api name="模块名称" moduleName="输出的文件的名称"<br />
此处解释一下 name，如图所示。<br />
没图，意会吧。（其实有，但我不知道放在哪里）
3. 可以看到生成 src/utils/services/[moduleName].ts