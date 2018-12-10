layui.use(["element", "laypage"], () => {
    let element = layui.element
    let laypage = layui.laypage
    const $ = layui.$

    element.tabDelete('demo', 'xxx')


    laypage.render({
        elem: "laypage",
        count: $("#laypage").data("maxnum"),
        limit: 2,
        groups: 3,
        curr: location.pathname.replace("/page/", ""),
        jump(obj, f) {
            $("#laypage a").each((i, v) => {
                let pageValue = `/page/${$(v).data("page")}`
                if ($(v).data("page") > 0 && $(v).data("page") < $("#laypage a").length) {
                    v.href = pageValue
                }
            })
        }
    })
})
