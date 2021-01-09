(function () {
    // 全局变量
    let tableData = null;
    // 事件绑定
    function bindEvent() {
        // 菜单列表切换
        const menuList = document.getElementsByTagName("dl")[0];
        const container = document.getElementsByClassName("container");
        menuList.addEventListener("click", e => {
            if (e.target.tagName === "DD") {
                document.getElementsByClassName("active")[0].className = "";
                e.target.className = "active";
                [].slice.apply(container).forEach(item => {
                    item.style.display = "none";
                });
                document.getElementById(e.target.getAttribute("data-id")).style.display = "block";
            } else {
                return false;
            }
        })
        // 新增学生
        const addStudentBtn = document.getElementsByClassName("add-submit")[0],
            dd = document.getElementsByTagName("dd")[0];
        addStudentBtn.addEventListener("click", e => {
            e.preventDefault();
            const form = document.getElementById("add-student-form");
            const data = getFormData(form);
            if (data) {
                const result = saveData("https://open.duyiedu.com/api/student/addStudent", Object.assign({
                    appkey: "yuanxin_1581084491320"
                }, data));
                if (result.status === "fail") {
                    alert(result.msg)
                } else {
                    alert("新增成功");
                    renderStuList();
                    dd.click();
                }
            }
        })
        // 编辑列表
        const tbody = document.getElementsByTagName("tbody")[0];
        tbody.addEventListener("click", e => {
            editList(e);
        })
    }
    // 渲染学生列表数据
    function renderStuList() {
        // 获取学生列表数据
        const result = saveData("https://open.duyiedu.com/api/student/findAll", {
            appkey: "yuanxin_1581084491320"
        })
        let str = "";
        const tbody = document.getElementsByTagName("tbody")[0];
        const nowYear = new Date().getFullYear();
        tableData = result.data;
        result.data.forEach((item, index) => {
            const {
                sNo,
                name,
                sex,
                email,
                birth,
                phone,
                address
            } = item;
            str = `<tr>
            <td>${sNo}</td>
            <td>${name}</td>
            <td>${sex === 0 ? "男" : "女"}</td>
            <td>${email}</td>
            <td>${nowYear - birth}</td>
            <td>${phone}</td>
            <td>${address}</td>
            <td>
                <button class="btn edit" data-index=${index}>编辑</button>
                <button class="btn delete" data-sNo=${sNo}>删除</button>
            </td>
        </tr>`
            tbody.innerHTML += str;
        })
    }
    // 编辑列表
    function editList(e) {
        if (e.target.tagName !== "BUTTON") {
            return;
        }
        const isEdit = e.target.classList.contains("edit");
        if (isEdit) {
            const modal = document.getElementById("modal");
            modal.style.display = "block";
            dataBackFill();
            // 提交修改
            const modalBtn = document.getElementsByClassName("modal-btn")[0];
            modalBtn.addEventListener("click", e => {
                e.preventDefault();
                const form = document.getElementsByClassName("modal-form")[0];
                // 获取表单数据
                const data = getFormData(form);
                console.log(data)
                if (data) {
                    const result = saveData("https://open.duyiedu.com/api/student/updateStudent", Object.assign({
                        appkey: "yuanxin_1581084491320"
                    }, data));
                    if (result.status === "fail") {
                        alert(result.msg);
                    } else {
                        alert("修改成功");
                        modal.style.display = "none";
                        renderStuList();
                    }
                }
            })
        } else {
            const sNo = e.target.getAttribute("data-sNo");
            console.log(sNo)
            const result = saveData("https://open.duyiedu.com/api/student/delBySno", {
                appkey: "yuanxin_1581084491320",
                sNo
            })
            if(result.status === "fail"){
                alert(msg);
            }else{
                alert("删除成功");
                renderStuList();
            }
        }
        // 数据回填
        function dataBackFill() {
            const modalForm = document.getElementsByClassName("modal-form")[0],
                index = e.target.getAttribute("data-index"),
                tableItem = tableData[index];
            for (const prop in tableItem) {
                if (modalForm[prop]) {
                    modalForm[prop].value = tableItem[prop];
                }
            }
        }
    }
    // 获取表单数据
    function getFormData(form) {
        const name = form.name.value,
            sex = form.sex.value,
            sNo = form.sNo.value,
            email = form.email.value,
            birth = form.birth.value,
            phone = form.phone.value,
            address = form.address.value;
        if (name || sex || sNo || email || birth || phone || address) {
            return {
                name,
                sex,
                sNo,
                email,
                birth,
                phone,
                address
            }
        } else {
            return;
        }
    }

    function saveData(url, param) {
        var result = null;
        var xhr = null;
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else {
            xhr = new ActiveXObject('Microsoft.XMLHTTP');
        }
        if (typeof param == 'string') {
            xhr.open('GET', url + '?' + param, false);
        } else if (typeof param == 'object') {
            var str = "";
            for (var prop in param) {
                str += prop + '=' + param[prop] + '&';
            }
            xhr.open('GET', url + '?' + str, false);
        } else {
            xhr.open('GET', url + '?' + param.toString(), false);
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    result = JSON.parse(xhr.responseText);
                }
            }
        }
        xhr.send();
        return result;
    }

    function init() {
        renderStuList();
        bindEvent();
    }
    init();
}())