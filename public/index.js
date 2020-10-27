/*
聊天室

*/

var socket = io('http://localhost:3000')
var name,img

//添加点击事件
$('#ul_box li').on('click', function () {
    $(this).addClass('check_li_now').siblings().removeClass('check_li_now')
})
//登录事件
$("#button_login").on("click", () => {
    //获取用户名
    var username = $(".login_ipt").val().trim()
    if (!username) {
        alert("请输入用户名")
    } else {
        //获取选择的图片
        var avatar = $("#ul_box li.check_li_now img").attr('src')
        console.log(
            avatar, username
        )

        //告诉socket.io服务，进行登录
        socket.emit('login', { username, avatar })
    }


})
let count = 0
socket.on("login_", data => {
    console.log(data, "返回数据")
    count = data.count
    //登录成功
    if (count == 200) {
        name = data.msg.username,
        img = data.msg.avatar
        $('#login_box').fadeOut()
        $("#wechat").fadeIn()

        $(".user_header img").attr("src", data.msg.avatar)
        $('.user_name').text(data.msg.username)

    } else if (count == 300) {
        alert("用户名重复")
    }





})

//监听用户消息
socket.on("addUser", (data) => {
    console.log(data, "广播数据")
    $('#show_txt').append(
        `
       <div class="system_news">
                    <p>系统提示：${data.username}加入群聊</p>
        </div>
       `
    )
})

//左侧列表

socket.on('new', data => {
    $('#qun_msg').text(`狗腿子群（${data.length}）人`)
    console.log(data.length, "sssss")
    $('.users_ul').html('')
    data.forEach(item => {

        $('.users_ul').append(`
        <li class="users_li">
        <div class="users_li_header">
            <img src=${item.avatar} alt="">
        </div>
        <div class="users_li_name">${item.username}</div>
        </li>
        `)
    });
})

socket.on("delUser",data=>{
    console.log(data,"-------------------")
    $('#show_txt').append(
        `
       <div class="system_news">
                    <p>系统提示：${data.username}离开群聊</p>
        </div>
       `
    )
})

//聊天功能

$("#sub_btn").on('click',()=>{
    console.log(name,img)
    var content  = $("#go_input").val().trim()
    $("#go_input").val('')
    if(!content)return alert("请输入内容")
    socket.emit("sendMes",{
        msg:content,
        user:{
            name,img
        }
    })
})
//接受消息
socket.on("newMes",data=>{
    console.log(data)
    
})