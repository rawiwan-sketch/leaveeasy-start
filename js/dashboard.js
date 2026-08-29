// ─────────────────────────────────────────────────────────────
// js/dashboard.js — หน้าที่ 5 แดชบอร์ดสรุป
// สัปดาห์ที่ 6: เป็นโครงหน้าจอ นับจากข้อมูลตัวอย่างใน js/data.js
//               (การนับจากฐานข้อมูลจริงเป็นงานของสัปดาห์ที่ 7 ตาม spec ข้อ 4)
// ─────────────────────────────────────────────────────────────

(function () {
  var สถานะทั้งหมด = ["รอพิจารณา", "อนุมัติ", "ไม่อนุมัติ"];
  var ใบลาทั้งหมด = window.LEAVE_DATA.leaveRequests;

  แสดงกล่องตัวเลข();
  แสดงรายการล่าสุด();

  // กล่องตัวเลข 3 กล่อง กดแล้วไปหน้ารายการพร้อมกรองสถานะนั้นไว้
  function แสดงกล่องตัวเลข() {
    var html = "";
    สถานะทั้งหมด.forEach(function (สถานะ) {
      var จำนวน = ใบลาทั้งหมด.filter(function (ใบ) { return ใบ.status === สถานะ; }).length;
      html +=
        '<a class="stat" href="leave-requests.html?status=' + encodeURIComponent(สถานะ) + '">' +
        '<div class="number">' + จำนวน + "</div>" +
        ป้ายสถานะ(สถานะ) +
        "</a>";
    });
    document.getElementById("กล่องตัวเลข").innerHTML = html;
  }

  // ใบลาที่ยื่นล่าสุด 5 ใบ เรียงใหม่ก่อนเก่าตามวันที่ยื่น
  function แสดงรายการล่าสุด() {
    var ล่าสุด = ใบลาทั้งหมด
      .slice()
      .sort(function (ก, ข) { return ข.createdAt.localeCompare(ก.createdAt); })
      .slice(0, 5);

    if (ล่าสุด.length === 0) {
      document.getElementById("รายการล่าสุด").innerHTML = "<p>ยังไม่มีใบขอลาในระบบ</p>";
      return;
    }

    var html =
      "<table><thead><tr>" +
      "<th>หัวข้อ</th>" +
      "<th>สถานะ</th>" +
      '<th class="hide-mobile">ผู้ขอลา</th>' +
      '<th class="hide-mobile">วันที่ยื่น</th>' +
      "</tr></thead><tbody>";

    ล่าสุด.forEach(function (ใบ) {
      html +=
        '<tr class="clickable" data-id="' + esc(ใบ.id) + '">' +
        "<td>" + esc(ใบ.title) + "</td>" +
        "<td>" + ป้ายสถานะ(ใบ.status) + "</td>" +
        '<td class="hide-mobile">' + esc(ใบ.requesterName) + "</td>" +
        '<td class="hide-mobile">' + esc(ใบ.createdAt) + "</td>" +
        "</tr>";
    });

    html += "</tbody></table>";
    var กล่อง = document.getElementById("รายการล่าสุด");
    กล่อง.innerHTML = html;

    กล่อง.querySelectorAll("tr.clickable").forEach(function (แถว) {
      แถว.addEventListener("click", function () {
        location.href = "leave-request-detail.html?id=" + แถว.dataset.id;
      });
    });
  }
})();
