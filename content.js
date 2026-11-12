/* AnLAB — DỮ LIỆU NỘI DUNG (cây thư mục + danh sách bài/ứng dụng).
   Blog Editor tự cập nhật file này khi bạn đăng bài; có thể sửa tay nếu cần.
   folders: thư mục (kind "posts" = có thư mục con chứa bài; kind "apps" = liệt kê ứng dụng).
   items: mỗi bài / ứng dụng (type "post" | "app"). */
window.ANLAB_DATA={
 "folders": [
  {
   "id": "blog",
   "icon": "📝",
   "vi": "Blog",
   "en": "Blog",
   "kind": "posts",
   "subs": [
    {
     "id": "suy-ngam",
     "vi": "Suy ngẫm",
     "en": "Reflection"
    },
    {
     "id": "quan-ly-san-xuat",
     "vi": "Quản lý sản xuất",
     "en": "Production management"
    },
    {
     "id": "lich-su-van-hoa",
     "vi": "Lịch sử – Văn hoá",
     "en": "History & culture"
    }
   ]
  },
  {
   "id": "kien-thuc",
   "icon": "📚",
   "vi": "Kiến thức",
   "en": "Knowledge",
   "kind": "posts",
   "subs": [
    {
     "id": "qc",
     "vi": "QC – Kiểm soát chất lượng",
     "en": "QC – Quality control"
    },
    {
     "id": "tho-rap",
     "vi": "Thợ ráp – Lắp dựng",
     "en": "Fit-up & assembly"
    },
    {
     "id": "tho-han",
     "vi": "Thợ hàn – Quy trình hàn",
     "en": "Welding procedures"
    },
    {
     "id": "ndt",
     "vi": "NDT – Siêu âm, MT, PT",
     "en": "NDT – UT, MT, PT"
    },
    {
     "id": "tieu-chuan",
     "vi": "Tiêu chuẩn EN / AWS / ISO",
     "en": "Standards EN / AWS / ISO"
    }
   ]
  },
  {
   "id": "cong-cu",
   "icon": "🛠",
   "vi": "Công cụ",
   "en": "Tools",
   "kind": "apps",
   "subs": []
  },
  {
   "id": "hoc-tap",
   "icon": "🎓",
   "vi": "Học tập",
   "en": "Learning",
   "kind": "apps",
   "subs": []
  },
  {
   "id": "tro-choi",
   "icon": "🎮",
   "vi": "Trò chơi",
   "en": "Games",
   "kind": "apps",
   "subs": []
  },
  {
   "id": "mo-phong",
   "icon": "🧪",
   "vi": "Mô phỏng",
   "en": "Simulation",
   "kind": "apps",
   "subs": []
  },
  {
   "id": "huong-dan",
   "icon": "📖",
   "vi": "Hướng dẫn phần mềm",
   "en": "Software guides",
   "kind": "posts",
   "subs": [
    {
     "id": "easypdf",
     "vi": "EasyPDF",
     "en": "EasyPDF"
    }
   ]
  }
 ],
 "items": [
  {
   "type": "post",
   "folder": "blog",
   "sub": "quan-ly-san-xuat",
   "href": "blog-rua-va-tho-bon-cuoc-dua-bon-bai-hoc-ve-quan-ly-san-xuat.html",
   "vi": "RÙA VÀ THỎ – BỐN CUỘC ĐUA, BỐN BÀI HỌC VỀ QUẢN LÝ SẢN XUẤT",
   "en": "THE TORTOISE AND THE HARE – FOUR RACES, FOUR LESSONS IN PRODUCTION MANAGEMENT",
   "sumVi": "Chúng ta thường kể chuyện Rùa và Thỏ để ca ngợi sự kiên trì. Nhưng nếu cuộc đua được tổ chức thêm ba lần nữa, liệu Rùa có tiếp tục chiến thắng?",
   "sumEn": "We often tell the story of the Tortoise and the Hare to celebrate perseverance. But what if they raced three more times? Would the Tortoise keep winning?",
   "date": "2026-11-12",
   "img": "blog-rua-va-tho-bon-cuoc-dua-bon-bai-hoc-ve-quan-ly-san-xuat.webp",
   "imgEn": "blog-rua-va-tho-bon-cuoc-dua-bon-bai-hoc-ve-quan-ly-san-xuat-en.webp"
  },
  {
   "type": "post",
   "folder": "blog",
   "sub": "suy-ngam",
   "href": "blog-the-sigh-of-a-patriot.html",
   "vi": "THUẬT HOÀI",
   "en": "The Sigh of a patriot",
   "sumVi": "CÓ NHỮNG ANH HÙNG, DẪU CHÍ LỚN KHÔNG THÀNH, VẪN KHIẾN HẬU THẾ NGHIÊNG MÌNH KÍNH PHỤC.",
   "sumEn": "SOME HEROES, THOUGH THEIR GREATEST AMBITIONS REMAIN UNFULFILLED, STILL COMMAND THE DEEPEST RESPECT AND ADMIRATION OF GENERATIONS TO COME.",
   "date": "2026-11-11",
   "img": "blog-the-sigh-of-a-patriot.webp",
   "imgEn": "blog-the-sigh-of-a-patriot-en.webp"
  },
  {
   "type": "post",
   "folder": "blog",
   "sub": "suy-ngam",
   "href": "blog-chi-thuong-dam-binh.html",
   "vi": "Chỉ Thượng Đàm Binh",
   "en": "Waging War on Paper",
   "sumVi": "Bàn binh trên giấy – ngẫm chuyện xưa, luận việc nay: lý thuyết và thực tiễn không đối lập, mà bổ sung, kiểm chứng và cùng phát triển.",
   "sumEn": "Talking war on paper — reflecting on the past to reason about today's work: theory and practice are not opposites, they complement, verify and grow together.",
   "date": "2026-11-11",
   "img": "blog-chi-thuong-dam-binh.webp",
   "imgEn": "blog-chi-thuong-dam-binh-en.webp"
  },
  {
   "type": "app",
   "folder": "hoc-tap",
   "href": "on-ly-thuyet-lai-xe-trang.html",
   "vi": "Ôn Lý Thuyết Lái Xe – Bộ 600 câu hỏi mới nhất",
   "en": "Driving Theory Practice – Latest 600 Questions",
   "sumVi": "Bộ 600 câu hỏi lý thuyết lái xe mới nhất. Học nhanh, nhớ lâu, thi đậu ngay. Chạy ngay trên trình duyệt.",
   "sumEn": "The latest 600 driving-theory questions. Learn fast, remember longer, pass first time. Runs right in your browser.",
   "date": "2026-10-21",
   "img": "on-ly-thuyet-lai-xe-banner.webp",
   "imgEn": "on-ly-thuyet-lai-xe-banner-en.webp",
   "meta": "Web"
  },
  {
   "type": "app",
   "folder": "hoc-tap",
   "href": "toan-4-phieu-luu.html",
   "vi": "Toán 4 Phiêu Lưu – Game học toán lớp 4",
   "en": "Toán 4 Phiêu Lưu – Grade 4 Math Game",
   "sumVi": "Game học toán lớp 4 vui nhộn: học vui, dễ hiểu, tự tin làm bài. Chạy ngay trên trình duyệt, không cần cài đặt.",
   "sumEn": "A fun Grade 4 maths game: learn happily, understand easily, tackle homework with confidence. Runs in your browser — nothing to install.",
   "date": "2026-10-25",
   "img": "toan-4-phieu-luu-banner.webp",
   "imgEn": "toan-4-phieu-luu-banner-en.webp",
   "meta": "Web"
  },
  {
   "type": "app",
   "folder": "hoc-tap",
   "href": "hoc-go-10-ngon.html",
   "vi": "Học gõ chữ bàn phím máy tính 10 ngón vui nhộn",
   "en": "Fun Ten-Finger Computer Keyboard Typing Practice",
   "sumVi": "Luyện gõ bàn phím bằng 10 ngón tay vui nhộn, dễ nhớ. Chạy ngay trên trình duyệt, không cần cài đặt.",
   "sumEn": "Practise typing with all ten fingers in a fun, easy-to-remember way. Runs in your browser — nothing to install.",
   "date": "2026-10-21",
   "img": "hoc-go-10-ngon-banner.webp",
   "imgEn": "hoc-go-10-ngon-banner-en.webp",
   "meta": "Web"
  },
  {
   "type": "app",
   "folder": "cong-cu",
   "href": "easypdf.html",
   "vi": "EasyPDF – Đọc & chỉnh sửa PDF, Office, ảnh, IFC 3D",
   "en": "EasyPDF – Read & edit PDF, Office, images, 3D IFC",
   "sumVi": "Đọc, sửa PDF, Word, Excel, PowerPoint, ảnh và xem mô hình IFC 3D ngay trên điện thoại hoặc trình duyệt.",
   "sumEn": "Read and edit PDF, Word, Excel, PowerPoint and images, and view 3D IFC models — right on your phone or in your browser.",
   "date": "2026-10-30",
   "img": "easypdf-web-banner-640.webp",
   "imgEn": "easypdf-web-banner-en-640.webp",
   "meta": "Android · Web"
  }
 ]
};
