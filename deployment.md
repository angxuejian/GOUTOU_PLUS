## 部署说明
---
### 准备阶段
---
1. 请先准备好 APPID, APPSecret; **(APPID, APPSecret 各两份哦)**
2. 请先在准备好的 APPID 中**开通云开发功能并且获取到云开发的环境ID哦！**([不会开通云开发功能戳这里](./wxCloudDevelopment))
3. clone 项目到本地
    ```
    git clone https://github.com/angxuejian/GOUTOU_PLUS.git
    ```
4. clone 成功后会看到 **GOUTOU_PLUS** 文件夹，进入文件夹后会有以下文件;
    > **gt_shop文件夹为用户端小程序代码**

    > **gt_manage文件夹为管理端小程序代码**

    ![GOUTOU_PLUS文件夹](./img/a.png)

5. 恭喜哦！ 你已经拥有的全部源代码了。我们就先来部署 **gt_shop文件夹下的小程序代码**

### gt_shop小程序部署
---
1. 将项目导入至微信开发工具中; 别忘了把 **APPID替换了哦** 要不然会提示你没有权限打开哦！

    ![导入项目](./img/d.png)

2. 在 **miniprogram > app.js** 中 替换 云开发环境id；([不知道云开发环境id，戳这里](./wxCloudDevelopment))

    ![替换云开发环境id](./img/g.png)

3. 部署**cloudfunctions目录下的**云函数
    - CloudAPIBase >> 统一请求操作数据库函数;

    ![云函数](./img/h.png)

    > 创建并部署完成后，打开云开发，查询是否成功,出现**已部署**则部署成功

    ![部署云函数](./img/i.png)

4. 创建数据库集合; [数据库详情字段信息戳这里](./wxDatabaseInfo)
    - user               >> 用户表集合

    - user-address       >> 用户地址表集合
    - user-order         >> 用户订单表集合
    - user-shopping-cart >> 用户购物车表集合
    - shop-goods         >> 商品表集合

    ![创建数据库](./img/j.png)

    > 将上面的集合名称全部创建即可; 

5. 完成？
    - 这时候gt_shop 小程序就已经全部部署完成了，保存后重新编译即可，但是打开之后应该是没有商品的，因为**shop-goods表中并没有数据**
        1. 自己手动在shop-goods表中添加数据。([添加字段详情信息, 戳这里]())
        2. 将 gt_manage小程序部署好，在gt_manage小程序中的**添加商品页面中**添加商品

### gt_manage小程序部署
----

1. 重复上文 **gt_shop小程序部署中的第1，第2条**  更改APPID，更改云环境ID; 还记得 **准备阶段的第1，第2条吗？** 这是第二套的小程序APPID，云环境ID。不要和 **gt_shop小程序的一样哦**

2. 部署云函数与gt_shop小程序部署中的 第3条一样的方法部署; 
    - **这里要注意**
    - 在 **cloudfunctions目录下的 > function > index.js** 中的**APPID和APPSecret**替换成**gt_shop小程序的 APPID和APPSecret**

    - 替换成功后，我们就可以**通过云函数操作gt_shop小程序中的数据库了**，这样就可以实现**管理**的作用了

3. 创建数据库集合与gt_shop小程序部署中的 第4条一样的方法创建； [数据库详情字段信息戳这里](./wxDatabaseInfo)
    - user >> 用户表

4. 完成？
    - 进行到这里，就已经gt_manage小程序就已经全部部署完成了，快去**添加商品**吧！


### 写的什么，完全看不懂
---
1. 算了，没完全看明白的，可以私聊，解惑

    - 邮箱： ydoghead@sina.cn 或 xuejian.ang@gmail.com

    - 微信： youbing_ang
    
    - QQ:   1251537708

> 无事不要骚扰哦