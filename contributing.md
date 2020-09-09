### 项目的贡献指南

+ 你好小伙伴, 来到这里，看来是有Bug或你有新的好主意了，非常欢迎和感谢来贡献的小伙伴 👏🏻👏🏻👏🏻

+ **提示哦！** 为了代码风格一致，观赏性考虑。Pull Request 时需要注意以下几点 
    - 数据库集合命名规则: 多个单词以 **-** 为连接 **(例: name-name)** 
    - 数据库集合key命名规则: 多个单词以 **_** 为连接 **(例: name_name)** >> (用户信息则直接用微信返回字段使用，请忽略user集合中的key)
    - js 中的命名规则 均为 驼峰命名; **(例: nameName)**
    - 每个js方法请在 **声明时** 添加注释; 例:
    ```
      // 请求全部商品列表  >> 这里 添加注释哦！
      getGoodsArray: function() {}
    ```
    - 添加公共方法时参数注释风格; 例:
    ```
      // 全局get请求方法
      get: function(params) {
        /*
          params: {
              url: string => // 请求地址
              data: object => // get请求需要携带的参数
              list: array: => // 可能会需要的数组
              ... 
          }
        */
        >> 按照 (key: value的类型 => // 注释) 形式就行撰写
      }
    ```

#### Pull Request步骤

1. 请先 将项目**fork**一份到自己的github上
2. 在自己的github上 clone 已经fork的项目
3. 进入 clone 过来的项目中 添加上游远程仓库; 复制以下命令，在 git 命令中执行
    ```
    $ git remote add upstream https://github.com/angxuejian/GOUTOU_PLUS.git
    ```
    执行成功后，可以使用 git remote -v 来查看远程仓库; 出现以下字段，则成功
    ```
    $ git remote -v

    origin https:// .... (fetch) >> .... 为你的git地址
    origin https:// .... (push)
    upstream https://github.com/angxuejian/GOUTOU_PLUS.git (fetch)
    upstream https://github.com/angxuejian/GOUTOU_PLUS.git (push)
    ```
4.  创建一个新分支
    ```
    $ git checkout -b new_branch
    ```
5. **撰写出你的贡献代码**

6. 提交你的代码
   ```
   $ git push origin new_branch
   ```
7. 提交成功后，登录github 打开项目会出现一个绿色的按钮 **点击Compare & request -> 检查代码无误后 -> 点击Create pull request 来Pull Request**;


> 再次欢迎小伙伴们来提出意见和贡献代码哦！👊🏻👊🏻