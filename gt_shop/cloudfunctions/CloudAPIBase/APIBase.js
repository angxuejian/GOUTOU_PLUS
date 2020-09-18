  // 生成订单号
  const getOrderNumber = function () {
    let random_one = Math.ceil(Math.random() * 10); //随机数 1
    let random_two = Math.ceil(Math.random() * 10); //随机数 2
    let year = new Date().getFullYear(); // 获取当前年份
    let temp = new Date().getTime(); //获取当前时间戳
    return `GT${year}${random_one}${temp}${random_two}`
  }

  const APIBase = function () {
    return {

      // 添加
      add: function (db, event, OPENID) {
        /*
          db: 数据库操作实例
          event: {
            base: string => 要查询的数据库 集合
            is_order: boolean => 是否添加订单
            add_data: object => 添加的数据
            is_add: boolean => 是否添加用户
          },
          OPENID: 用户的openid
        */
        const {
          base,
          add_data = {},
          is_order = false,
          is_add = true
        } = event;
        var adata = add_data
        if(is_add) {
          adata = Object.assign(add_data, {
            user_id: OPENID
          })
        }
        adata.create_time = db.serverDate()
        is_order && (adata.order_number = getOrderNumber())
        return db.collection(base).add({
          data: adata
        })
      },

      // 获取
      get: function (db, event, OPENID) {
        /*
          db: 数据库操作实例
          event: {
            base: string => 要查询的数据库 集合
            by: string => asc(升序) desc(降序)
            where_data: object => 查询条件
            is_where: boolean => 是否查询个人数据
          },
          OPENID: 用户的openid
        */
        const {
          base,
          by = 'asc',
          where_data = {},
          is_where = true
        } = event;
        let _db = db.collection(base)
        let wdata = where_data

        if (is_where) {
          wdata = Object.assign(where_data, {
            user_id: OPENID
          });
        }
        _db = _db.where(wdata).orderBy('create_time', by)
        return _db.get()
      },

      // 一次性查询多个 非相同数据
      getCommand: function (db, event) {
        /* 
        db:  数据库操作实例
        event: {
          base: string => 要查询的数据库 集合
          command_data: {
            key: string => 集合中 key 名 
            values: array => 要查询的 [值1， 值2]
          }
        }
        */
        const {
          base,
          command_data = {}
        } = event;
        const _ = db.command
        console.log({
          [command_data.key]: command_data.values
        })
        return db.collection(base).where({
          [command_data.key]: _.in(command_data.values)
        }).get()
      },

      // 删除
      remove: function (db, event) {
        /*
        db:  数据库操作实例
        event: {
          base: string => 要查询的数据库 集合
          remove_list: array => 要删除的 列表
        }
        */
        const {
          base,
          remove_list
        } = event;
        const _ = db.command
        return db.collection(base).where({
          _id: _.in(remove_list)
        }).remove()
      },

      // 更新
      update: function (db, event) {
        /*
          db: 数据库操作实例
          event: {
            base: string => 要查询的数据库 集合
            where_data: object => 查询条件
            update_data: object => 更新的数据
          }
        */
        const {
          base,
          where_data,
          update_data
        } = event;
        return db.collection(base).where(where_data).update({
          data: update_data
        })
      },

      // 左外连表
      lookup: function (db, event) {
        /*
          db: 数据库操作实例,
          event: {
            base: 集合 名
            look_data: object => 左外连表的条件
            key: string => 过滤的 key 名
            match_list: array => 除 该列表以为的值 过滤掉 
          }
        */
        const {
          base,
          look_data = {},
          key,
          match_list = []
        } = event
        let _db = db.collection(base).aggregate().lookup(look_data)

        if (key) {
          console.log(match_list, '这是空的？')
          const _ = db.command
          _db = _db.match({
            [key]: _.in(match_list)
          })
        }

        return _db.end()
      },
    }
  }

  module.exports = APIBase()