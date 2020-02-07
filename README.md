# Structural-Dynamics
 华东理工大学项目组-结构动力学代码仓库


# 需求文档

## 主界面
1. 进入APP 
    - 询问服务器版本号，是否弹窗提示更新
2. 侧边栏
    - 头像，账户等
        - 展示Tag标签 [体验用户或VIP用户]
        - 点击可进入个人信息设置
            - 可上传头像、修改用户名、修改密码
    - 充值中心
        - 付费方案未定
    - 主题&布局
        - 提供>=2种配色方案
        - 修改主页的五大类为单列或双列
    - 用户常见问题
        - 跳转至网页
    - 联系客服
        - 客服电话、QQ、微信联系方式
    - 软件下载地址
        - 跳转至网页
    - 关于我们
        - 同济大学振动舒适度课题组+二维码分享
    - 最下方显示当前版本：1.0.0 (立即更新)
3. header头
    - 侧边栏打开按钮
    - LOGO 
    - 搜索框按钮 
        - 点击后展开
        - 搜索方案？？？你们为什么想着整个搜索？
            - 搜索结果为三栏：相关知识点、相关题目、相关故事
                - 跳转知识点
                - 跳转单条题目
                - 跳转故事

4. footer底部
    - 知识点
    - 自测题
    - 遇见

## 知识点
1. 先展示六大类的Card：
    - 结构动力学概述
    - 单自由度体系
    - 多自由度体系
    - 分布参数体系
    - 随机振动
    - 地震工程

2. 点击Card后进入本大类按章节划分的知识点列表  
    - 树结构呈现，列表可展开
    - 章结点呈现形式：  + 自由场表面的地面运动 
    - 知识结点呈现形式： - 强地面运动建模    [难易标签] 

3. 点击章结点，进入章节概述
    - 简单的图文描述，以标题加正文的形式  
    - 如果该章节已上传PPT，则有以下功能
        - PPT预览按钮，使用doc-viewer打开服务器端PPT进行预览，
        - PPT下载按钮，下载服务器端文件至手机（可选功能）

4. 点击知识点结点，进入知识点详情
    - 简单的图文描述附带书上例题
        - 页面右下方 “随心练” 新打开做题页面，随机包含该知识点的题目1—2题
        - 页面左下方 “题目” 显示包含该知识点的题目列表，可通过单选或多选开始自测。
            - 题目列表呈现形式：- C2018复变函数  [是否做过 做过则√][难易标签]

## 自测题
### 展示三个Card
1. 专题练习
    - 同上先选择五大类的Card之一，进入章节划分的知识点列表
    - 章节和知识点结点呈现形式 + 自由场表面的地面运动  [按钮:随心做]
        - 点击随心做按钮，随机范围内5题开始自测
        - 点击其中某结点，显示范围内题目列表，可通过单选或多选开始自测。
        - 题目列表呈现形式：- C2018复变函数  [是否做过 做过则√][难易标签]
2. 真题组卷
    - 进入后以书架形式呈现多套试题 
        - 无试题图片则使用默认通用图片
    - 点击后开始真题测试
3. 随心做
    - 拉动条形式的 选择题目数量 1-50
        - 该数量会保存，下次自动为该数量
    - 点击开始做题，随机选择该数量个题目开始

### 做题界面
1. 侧边栏
    - 打开后出现已编排的试题列表
        - 已做答的与未作答的有颜色区分（绿）
        - 点击跳转至任意一题
    - 下方一个按钮 评卷 （做了几题不想做其他题了）
        - 评卷仅对已作答的题目进行答案比对

2. 主界面
    - 上方左右分别为上一题、下一题的跳转
    - 正文为render-html渲染的题目图文
    - 下方为可点击的选项
        - 附加选项：我不会，选择后视为已作答
        - 点击后自动跳转下一题
        - 如果为最后一题则直接评卷

3. 评卷
    - 比较答案 将正确率输出即可
    - 所有错题已添加至错题集

## 遇见 
1. 主界面
    - 随机一个短篇故事（哪里找？是否有量足够大的故事库）
    - 下拉刷新另一个故事