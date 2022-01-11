$(function(){
    // 点击“去注册账号”的连接
    $('#link_reg').on('click',function(){
        $('.login-box').hide()
        // 适用于通过 jQuery 隐藏的元素，或在CSS中声明 display:none 的元素
        $('.reg-box').show()
    })
    // 点击“去登录”的连接
    $('#link_login').on('click',function(){
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 从layui中获取form对象
    // 导入jQuery.js就可以使用$这个对象。layui同理，可以直接使用layui这个对象
    var form = layui.form
    var layer = layui.layer
    // 通过form.verify自定义校验规则
    form.verify({
        // 自定义一个pwd的校验规则
        pwd:[/^[\S]{6,12}$/,'密码必须6-12位！！！并且不能出现空格'],
        repwd: function(value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败,则return一个提示消息即可
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
              return '两次密码不一致！'
            }
          }
    })

    //监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        // 1. 阻止默认的提交行为
        e.preventDefault()
        // 2. 发起Ajax的POST请求
        // 注意写法：$('#form_reg [name=username]').val()
        var data = {
          username: $('#form_reg [name=username]').val(),
          password: $('#form_reg [name=password]').val()
        }
        $.post('http://www.liulongbin.top:3007/api/reguser', data, function(res) {
          if (res.status !== 0) {
            return layer.msg(res.message)
          }
        //layui提供：内置提供的弹出框
        layer.msg('注册成功，请登录！')
          // 模拟人的点击行为：注册成功之后，自动点击“去登陆”，让其停留在登录的界面。对这个a连接进行点击
          $('#link_login').click()
        })
    })

    //监听登录表单的提交事件
    // 除了on，我们也可以直接用submit绑定事件
    $('#form_login').submit(function(e) {
        // 阻止默认提交行为
        e.preventDefault()
        $.ajax({
          url: '/api/login',
          method: 'POST',
          // 除了手动拼接之外，还可以快速获取表单中的数据
          //$this就是#form_login这个对象。serialize()方法可以快速获取表单数据 
          data: $(this).serialize(),
          //成功之后的回调函数
          success: function(res) {
            if (res.status !== 0) {
              return layer.msg('登录失败！')
            }
            layer.msg('登录成功！')
            // 将登录成功得到的 token 字符串，保存到 localStorage 中
            localStorage.setItem('token', res.token)
            // console.log(res.token);
            // 跳转到后台主页
            location.href = '/index.html'
          }
        })
      })


})