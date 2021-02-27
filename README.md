
# 需求文档

## 主界面
1. 进入APP 
    - 询问服务器版本号，是否弹窗提示更新
2. header头
    - 头像：点击进入服务中心
        - 服务中心包含：
            - 个人资料：
                - 头像，账户等
                - 展示Tag标签 [体验用户或VIP用户]
                - 点击可进入个人信息设置
                    - 可上传头像、修改用户名、修改密码
            - 主题&布局
                - 提供>=2种配色方案
                - 修改主页的五大类为单列或双列
            - 充值中心
                - 付费方案未定
            - 用户常见问题
                - 跳转至网页
            - 联系客服
                - 客服电话、QQ、微信联系方式
            - 关于我们
                - 同济大学振动舒适度课题组+二维码分享
            - 最下方显示当前版本：1.0.0 (立即更新)
    - LOGO 
    - 搜索框按钮 
        - 点击后进入搜索页面
        - 搜索方案：仅限于搜索知识点



3. container内容
## 知识点
1. 先展示六大章的Card：
    - 结构动力学概述
    - 单自由度体系
    - 多自由度体系
    - 分布参数体系
    - 随机振动
    - 地震工程

2. 点击Card后进入本大类按节划分的知识点列表  
    - 以小节为单位呈列表展开 

3. 点击小节，进入知识点详情
    - 图文描述，  
    - 附带例题
        - 页面右下方 “随堂练习” 打开做题页面，随机选出包含该知识点的题目开始练习

## 自测题
### 展示四个Card
1. 专题练习
    - 基本和知识点的呈现形式一致，不同的是点进去后展示的不是知识点而是题目
2. 真题组卷
    - 进入后以书架形式呈现多套试题 
        - 无试题图片则使用默认通用图片
    - 点击后开始真题测试
3. 随心做
    - 拉动条形式的 选择题目数量 1-50
        - 该数量会保存，下次自动为该数量
    - 点击开始做题，随机选择该数量个题目开始
4. 错题集
    - 显示错误的题目列表，可单选直接进入单条题目
    - 下方按钮 “再做一遍” 直接从当前顺序开始自测
### 做题界面
1. 侧边栏
    - 打开后出现已编排的试题列表
        - 小方块内有题号的形式展现，一行可3-5个方块
        - 已做答的与未作答的方块有颜色区分（绿）
        - 点击方块跳转至任意一题
    - 下方一个按钮 评卷 （做了几题不想做其他题了）
        - 评卷仅对已作答的题目进行答案比对

2. 主界面
    - 上方左右分别为上一题、下一题的跳转
    - 正文为render-html渲染的题目图文
    - 下方为可点击的选项
        - 附加选项：我不会，选择后视为已作答
        - 点击后自动跳转下一题
        - 如果为最后一题则直接评卷
    - 付费用户功能？：查看解析
        - 下方划出提示框，展示当前题目的解析
3. 评卷
    - 比较答案 将正确率输出即可
    - 所有错题已添加至错题集

## 遇见 
1. 主界面
    - 随机一个短篇故事（哪里找？是否有量足够大的故事库）
    - 下拉刷新另一个故事

4. footer底部
    - 知识点
    - 自测题
    - 遇见（默认加载页面）
