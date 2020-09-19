# GOUTOU_PLUS
## 注：项目中的.md文件中，有些需要加载图片，如加载失败，可 clone 到本地查看。图片均在项目包中
#### [gt_shop](./gt_shop) 目录下为用户端小程序源码

#### [gt_manage](./gt_manage) 目录下为管理端小程序源码


## 动手打造属于自己的小商店

### 应用场景
----
> 需求：在短时间(或长时间)内可以获得一件商品或服务
- 场景还原
    1. 小杨在小王的店里购买了零食大礼包
    2. 小王收到订单信息，看到小杨的地址在店附近(或其他地区)选择商家自配(或物流)
    3. 配送至小杨手上，小杨窝在床上吃着零食刷着剧
### 目标用户
---
1. **使用者：社区、校园、区域内的小规模人群** > **扩大至全国范围**
2. **开发者：0成本快速构建一套属于自己的小店** > **用户多了不要忘了升级云开发哦**
### 实现思路
---

+ **使用 1个主小程序云数据库 + N个副小程序云数据库**
+ **使用HTTP API 或者 触发云函数来实现 1 + N 个小程序云数据库互通**
+ **实现自己想要的产品 或 功能**

    😎😎

### 架构图
---
![架构图](https://mmbiz.qpic.cn/mmbiz_png/xoIzuYKVBOysHymgKylRcZYianNuIOj9Mwcywkm2pegNJAdYjnuSqKk6hPTqeoPk7erN8VMjEZJwCPXvic56UM3Q/0?wx_fmt=png)
![思维导图](https://mmbiz.qpic.cn/mmbiz_png/xoIzuYKVBOysHymgKylRcZYianNuIOj9MOv0crTtPBzTG6fsqicYTo3fSOqEBrBYHy0ia0RYziaicic2Fkm3FFVIaejw/0?wx_fmt=png)
### 效果截图
---
- A小程序截图

    ![狗头的店](https://mmbiz.qpic.cn/mmbiz_png/xoIzuYKVBOyE0bg6xibFCCzia4WiaXsaBicCN596k5mTKfmEhicZo6iaO85PhergbrrQvYg6Ll5pQQN35vOtFQicluqRg/0?wx_fmt=png)
        
- B小程序截图

    ![狗头管理](https://mmbiz.qpic.cn/mmbiz_png/xoIzuYKVBOyE0bg6xibFCCzia4WiaXsaBicCDGcPoWYl6hRgE3q3TRvKMmib35ibTiaZ1cZAoXwX1ibR7SzAyUdTHpHl3Q/0?wx_fmt=png)

### 视频介绍及使用
---

> https://v.qq.com/x/page/o3153pxavtk.html

### 代码链接
---

> https://github.com/angxuejian/GOUTOU_PLUS

**or**
```
$ git clone https://github.com/angxuejian/GOUTOU_PLUS.git
```

### 作品
---
- A小程序(审核未通过, 附上体验版)

	![狗头的店](https://mmbiz.qpic.cn/mmbiz_png/xoIzuYKVBOyE0bg6xibFCCzia4WiaXsaBicCr2wuWo9Et5zuYLa9uCFZYuAcITeDCWGSAEFns8a0J5AZryoB6A1JQg/0?wx_fmt=png)

- B小程序(审核通过, 附上正式版)

    ![狗头管理](https://mmbiz.qpic.cn/mmbiz_png/xoIzuYKVBOyE0bg6xibFCCzia4WiaXsaBicCvibCF40QsPYxQGjbSarhs5OEzzU6ibVpPrHaauQOfI68uaicMNbnZjDkg/0?wx_fmt=png)

### 作者
---
**喜欢狗头并且随心所欲的小杨！YANG MAN**  🤞🤞

### 最后
---
- 项目内的支付，物流均为未接入，需要自己开通接入才能使用哦😜😜
- 觉得有意思，去点 star 哦！

### 参考文献
---
- [UI欣赏](https://huaban.com/pins/3112350630/)
- [木子叶兮](https://huaban.com/pins/3144327938/)
- [徒步流云](https://huaban.com/pins/2922418769/)
- [皮卡啾_](https://huaban.com/pins/3103497844/)
- [懒xuan](https://huaban.com/pins/3191764848/)
- [图怪兽](https://818ps.com/muban/zitisheji.html)
- [熊猫办公](https://www.tukuppt.com/)
- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
- 微信小商店
- 阿里巴巴图标库

### 一点小建议
---
- 希望官方以后出现关联小程序的权限, **多个小程序关联后可以只开通一个云数据库**，这样开发的花样会不会更多呢？