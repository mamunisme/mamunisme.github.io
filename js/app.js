/**
 * Inisiasi awal 
 */
(function mounted() {
    //masukan data tabel
    getTableData();

    //untuk memilih tanggal 
    $("#d_o_b").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: '1975:2019',
    });
    $("#edit_d_o_b").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: '1975:2019',
    })
})();

/**
 * Membuat id unik untuk penginputan data baru
 */
function guid() {
    return parseInt(Date.now() + Math.random());
}

/**
 * menyimpan data baru
 */
function saveMemberInfo() {
    var keys = ['full_name', 'gelar', 'email', 'd_o_b', 'jabatan'];
    var obj = {};

    keys.forEach(function (item, index) {
        var result = document.getElementById(item).value;
        if (result) {
            obj[item] = result;
        }
    })

    var members = getMembers();

    if (!members.length) {
        $('.show-table-info').addClass('hide');
    }

    if (Object.keys(obj).length) {
        var members = getMembers();
        obj.id = guid();
        members.push(obj);
        var data = JSON.stringify(members);
        localStorage.setItem("members", data);
        clearFields();
        obj.d_o_b = calculateAge(obj.d_o_b);
        insertIntoTableView(obj, getTotalRowOfTable());
        $('#addnewModal').modal('hide')
    }
}

/**
 * membersihkan form inputan
 */
function clearFields() {
    $('#input_form')[0].reset();
}

/** 
 * mengambil semua data pada localstorage
 */
function getMembers() {
    var memberRecord = localStorage.getItem("members");
    var members = [];
    if (!memberRecord) {
        return members;
    } else {
        members = JSON.parse(memberRecord);
        return members;
    }
}

/**
 * Format Umur
 */
function getFormattedMembers() {
    var members = getMembers();

    members.forEach(function (item, index) {
        item.d_o_b = calculateAge(item.d_o_b);
    });

    return members;
}


/**
 * fungsi untuk menghitung umur 
 * 
 * @param {string} date 
 */
function calculateAge(date) {
    var today = new Date();
    var birthDate = new Date(date);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}


/**
 * Populating Table with stored data
 */
function getTableData() {
    $("#member_table").find("tr:not(:first)").remove();

    var searchKeyword = $('#member_search').val();
    var members = getFormattedMembers();

    //console.log(members)

    var filteredMembers = members.filter(function (item, index) {
        return item.full_name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            item.gelar.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            item.email.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            item.jabatan.toLowerCase().includes(searchKeyword.toLowerCase())
    });

    if (!filteredMembers.length) {
        $('.show-table-info').removeClass('hide');
    } else {
        $('.show-table-info').addClass('hide');
    }

    filteredMembers.forEach(function (item, index) {
        insertIntoTableView(item, index + 1);
    })
}

/**
 * fungsi untuk manambahkan data ke dalam table view
 * 
 * @param {object} item 
 * @param {int} tableIndex 
 */
function insertIntoTableView(item, tableIndex) {
    var table = document.getElementById('member_table');
    var row = table.insertRow();
    var idCell = row.insertCell(0);
    var fullNameCell = row.insertCell(1);
    var gelarCell = row.insertCell(2);
    var emailCell = row.insertCell(3);
    var dateOfBirthCell = row.insertCell(4);
    var jabatanCell = row.insertCell(5);
    var actionCell = row.insertCell(6);

    idCell.innerHTML = tableIndex;
    fullNameCell.innerHTML = item.full_name;
    gelarCell.innerHTML = item.gelar;
    emailCell.innerHTML = item.email;
    dateOfBirthCell.innerHTML = item.d_o_b;
    jabatanCell.innerHTML = '<a class="tag">' + item.jabatan + '</a>'
    var guid = item.id;

    actionCell.innerHTML = '<button class="btn btn-sm btn-default" onclick="showMemberData(' + guid + ')">View</button> ' +
        '<button class="btn btn-sm btn-primary" onclick="showEditModal(' + guid + ')">Edit</button> ' +
        '<button class="btn btn-sm btn-danger" onclick="showDeleteModal(' + guid + ')">Delete</button>';
}


/**
 * jumlah row tabel 
 */
function getTotalRowOfTable() {
    var table = document.getElementById('member_table');
    return table.rows.length;
}

/**
 * menampilkan data personel kedalam modal
 * 
 * @param {string} id 
 */
function showMemberData(id) {
    var allMembers = getMembers();
    var member = allMembers.find(function (item) {
        return item.id == id;
    })

    $('#show_full_name').val(member.full_name);
    $('#show_gelar').val(member.gelar);
    $('#show_email').val(member.email);
    $('#show_d_o_b').val(member.d_o_b);
    $('#show_jabatan').val(member.jabatan);

    $('#showModal').modal();

}


/**
 * menampilkan modal untuk ubah data
 * 
 * @param {string} id 
 */
function showEditModal(id) {
    var allMembers = getMembers();
    var member = allMembers.find(function (item) {
        return item.id == id;
    })

    $('#edit_full_name').val(member.full_name);
    $('#edit_gelar').val(member.gelar);
    $('#edit_email').val(member.email);
    $('#edit_d_o_b').val(member.d_o_b);
    $('#edit_jabatan').val(member.jabatan);
    $('#member_id').val(id);

    $('#editModal').modal();
}


/**
 * update/ubah data personel ke local storage
 */
function updateMemberData() {

    var allMembers = getMembers();
    var memberId = $('#member_id').val();

    var member = allMembers.find(function (item) {
        return item.id == memberId;
    })

    member.full_name = $('#edit_full_name').val();
    member.gelar = $('#edit_gelar').val();
    member.email = $('#edit_email').val();
    member.d_o_b = $('#edit_d_o_b').val();
    member.jabatan = $('#edit_jabatan').val();

    var data = JSON.stringify(allMembers);
    localStorage.setItem('members', data);

    $("#member_table").find("tr:not(:first)").remove();
    getTableData();
    $('#editModal').modal('hide')
}

/**
 * menampilkan modal konfirmasi delete
 * 
 * @param {int} id 
 */
function showDeleteModal(id) {
    $('#deleted-member-id').val(id);
    $('#deleteDialog').modal();
}

/**
 * Hapus data personil
 */
function deleteMemberData() {
    var id = $('#deleted-member-id').val();
    var allMembers = getMembers();

    var storageUsers = JSON.parse(localStorage.getItem('members'));

    var newData = [];

    newData = storageUsers.filter(function (item, index) {
        return item.id != id;
    });

    var data = JSON.stringify(newData);

    localStorage.setItem('members', data);
    $("#member_table").find("tr:not(:first)").remove();
    $('#deleteDialog').modal('hide');
    getTableData();

}

/**
 * Sorting table data through type, e.g: first_name, email, last_name etc.
 * 
 * @param {string} type 
 */
function sortBy(type) {
    $("#member_table").find("tr:not(:first)").remove();


    var totalClickOfType = parseInt(localStorage.getItem(type));

    if (!totalClickOfType) {
        totalClickOfType = 1;
        localStorage.setItem(type, totalClickOfType);
    } else {
        if (totalClickOfType == 1) {
            totalClickOfType = 2;
        } else {
            totalClickOfType = 1;
        }
        localStorage.setItem(type, totalClickOfType);
    }

    var searchKeyword = $('#member_search').val();
    var members = getFormattedMembers();



    var sortedMembers = members.sort(function (a, b) {
        return (totalClickOfType == 2) ? a[type] > b[type] : a[type] < b[type];
    });

    console.log(sortedMembers);

    sortedMembers.forEach(function (item, index) {
        insertIntoTableView(item, index + 1);
    })
}