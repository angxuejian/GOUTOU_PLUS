## 数据库信息
---
<br>

> 以下表中都会有 **_id** 字段; 该字段均为 微信自动生成, 不用管哦

<br>

> 下面声明的变量, 仅适用于下面集合 value 列 的 值 
```
const $img = http://img.xx.jpg 或 云文件 ID
const $date = db.serverDate() 或 集合中创建 date 类型
const $list = [
    $img,
    $img,
    ....
]
const $spec = [
    {
        cover: $img, >> 规格图片 >> string
        id: "1", >> 规格id >> string >> 代码生成
        name: "规格一", >> 规格名称 >> string
        price: 120, >> 规格的价钱 >> number
        sum: 50, >>  规格的库存 >> number
    },
    ....
]
const $gender = 1 >> 1男 2女 0未知

const $order_spec = {
    cover: $img, >> 规格图片 >> string
    id: "1", >> 规格id >> string >> 代码生成
    name: "规格一", >> 规格名称 >> string
    price: 120, >> 规格的价钱 >> number
}

const $goods_array = [
    {
        goods_number: 1, >> 商品数量 >> number
        title: "超好吃的坚果", >> 商品名称 >> string
        goods_price: 120, >> 当前商品的总价 >> number
        goods_spec: $order_spec, >> 当前商品的规格 >> object
        goods_id: 7498b..., >> 商品的 _id >> string 
    },
    ....
]

const $shipping_info = {
    shipping_address: "北京市 北京市 东城区 鼓楼广场230号", >> 收货地址 >> string
    shipping_name: "ang", >> 收货人姓名 >> string
    shipping_tel: "12345678910", >> 收货人电话 >> string
}

const $refund_info = {
    r_reason: "拍错了", >> 退款理由 >> string
    r_remark: "这个商品拍错了, 请尽快退款", >> 退款备注说明 >> string
    r_state: $r_state, >> 退款状态 >> number
    r_refuse: "您已经将吊牌撕掉了, 暂不能退款", >> 拒绝退款 >> string
}

const $delivery_info = {
    d_id: openid, >> 配送人的openid >> string 
    d_nickName: ang, >> 配送人的名称 >> string
    d_state: $d_state, >> 物流状态 >> number 
}

const $state = 0 
>> {
   0: 全部订单, 
   1: 待付款, 
   2：待发货, 
   3: 待收货, { 1: '配送中', 2: '已送达'}
   4: 退款, { 1: 申请退款中, 2: '退款成功', 3: '拒绝退款', 4: '取消退款' }, 
   5：完成订单
}

const $r_state = 1
>> {
   1: 申请退款中, 
   2: '退款成功', 
   3: '拒绝退款', 
   4: '取消退款',
}

const $d_state = 1
>> {
    1: 已配送, 
    2: 已送达,
}
```

### gt_shop小程序数据库信息
---

1. shop-goods表集合 >> 商品表

    key         | value      | type   | desc      
    ---         | ---        | ---    | ---       
    cover       | $img       | string | 商品封面图片
    create_time | $date      | date   | 创建时间
    def_price   | 189-389    | string | 商品价格区间
    detail_array| $list      | arrry  | 商品详情图片
    spec_array  | $spec      | array  | 商品规格
    swiper_array| $list      | array  | 商品的轮播图
    shelf       | true       | boolean| 商品的是否上架
    title       | 超好吃的坚果| string | 商品的名称

<br>

2. user表集合  >> 用户表

    key        | value   | type   | desc
    ---        | ---     | ---    | ---
    avatarUrl  | $img    | string | 用户头像
    city       | Hongkou | string | 用户城市
    country    | China   | string | 用户国家
    creare_time| $date   | date   | 注册时间
    gender     | $gender | number | 用户性别
    language   | zh_CN   | string | 使用语言
    nickName   | ang     | string | 用户昵称
    province   | Shanghai| string | 用户省份
    user_id    | openid  | string | 用户的openid

<br>

3. user-address表集合 >> 用户收货地址表

    key             | value            | type    | desc
    ---             | ---              | ---     | ---
    caeate_time     | $date            | date    | 创建时间
    defaults        | true             | boolean | 是否设置为默认地址
    shipping_name   | ang              | string  | 收件人
    shipping_tel    | 12345678910      | string  | 收件人电话号码
    user_id         | openid           | string  | 用户的openid
    shipping_address| 鼓楼广场230号     |  string | 用户详情地址
    shipping_city   | 北京市北京市东城区 |  string | 用户省市区

<br>

4. user-order表集合 >> 用户订单表

    key          | value         | type   | desc
    ---          | ---           | ---    | ---
    create_time  | $date         | date   | 创建订单时间
    all_price    | 189           | number | 订单的价钱
    goods_array  | $goods_array  | array  | 下单的订单商品
    order_number | GT2020...     | string | 订单号
    state        | $state        | number | 订单状态
    user_id      | openid        | string | 用户的openid
    accept_msg   | true          | boolean| 用户是否订阅消息
    backup_state | $state        | number | 用户申请退款后, 又取消退款, 保存最近一次的订单状态
    title        | 干果坚果       | string | 商品名称
    shipping_info| $shipping_info| object | 收货人信息
    refund_info  | $refund_info  | object | 用户申请退款
    delivery_info| $delivery_info| object | 物流信息

<br>

5. user-shopping-cart表集合 >> 用户购物车表

    key         | value      | type  | desc
    ---         | ---        | ---   | ---
    goods_numer | $order_spec| object| 订单商品规格
    create_time | $date      | date  | 加入购物车时间
    goods_id    | 7498b...   | string| 商品id
    goods_numer | 1          | number| 购买数量
    user_id     | openid     | string| 用户的openid
    title       | 干果坚果    | string| 商品名称

<br>


### gt_manage小程序数据库信息
---

1. user表集合  >> 用户表

    key        | value   | type   | desc
    ---        | ---     | ---    | ---
    avatarUrl  | $img    | string | 用户头像
    city       | Hongkou | string | 用户城市
    country    | China   | string | 用户国家
    creare_time| $date   | date   | 注册时间
    gender     | $gender | number | 用户性别
    language   | zh_CN   | string | 使用语言
    nickName   | ang     | string | 用户昵称
    province   | Shanghai| string | 用户省份
    user_id    | openid  | string | 用户的openid

<br>

2. wx-secret表集合 >> 只用于 存储 A小程序的 APPID 和 APPSecret

    key       | value | type  | desc
    ---       | ---   | ---   | ---
    app_id    | wx... | string| A小程序的 APPID
    app_secret| b7... | string| A小程序的 APPSecret

<br>

3. wx-token表集合 >> 只用于 存储 access_token 来校验请求 

    key  | value | type  | desc
    ---  | ---   | ---   | ---
    tokne| sk... | string| 用来请求A小程序的时携带的 access_token

<br>