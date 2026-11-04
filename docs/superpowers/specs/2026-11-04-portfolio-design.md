# Portfolio Quỳnh Anh — Tài liệu thiết kế

Ngày: 2026-11-04
Nguồn thiết kế: Figma `Portfolio-QA-2026` — https://www.figma.com/design/gXl7FNrqXRYnto6xjqxxif/Portfolio-QA-2026?node-id=1-2 (fileKey `gXl7FNrqXRYnto6xjqxxif`, page `1:2`)

## 1. Mục đích

Portfolio cá nhân của Quỳnh Anh (Senior Graphic Designer & Visual Artist), dựng đúng theo thiết kế Figma, host trên GitHub Pages. Toàn bộ nội dung nằm trong **một file `data.json`**; Quỳnh Anh (không phải dev) tự sửa file này trên giao diện web của GitHub, web tự cập nhật sau khi GitHub Pages publish lại (~1 phút). Không cần build, không cần cài gì.

## 2. Mục tiêu / Không làm / Điều cấm

**Mục tiêu**
- Giao diện bám sát Figma (desktop 1920), có bản responsive tự thiết kế cho tablet/mobile nhưng giữ đúng style.
- Mọi nội dung hiển thị (chữ, link, ảnh, danh sách dự án, dịch vụ, mạng xã hội, CV) lấy từ `data.json`.
- Quỳnh Anh sửa JSON dễ dàng: cấu trúc phẳng, tên trường dễ hiểu, kèm hướng dẫn tiếng Việt.

**Không làm (lần này)**
- Không có CMS, backend, form gửi mail, analytics.
- Không dựng lại các màn app Tendoo (bảng giá, popup, dashboard…) bằng HTML — chúng là **ảnh nội dung dự án**.
- Không deploy lên GitHub lúc này (chưa có tài khoản; người dùng cung cấp sau). Chỉ chuẩn bị sẵn cho GitHub Pages.

**Điều cấm (làm vậy là hỏng dù chạy được)**
- **Không gộp giao diện thành ảnh.** Chữ, nút, menu, logo chữ, tiêu đề, tag, khối layout phải là phần tử HTML/CSS thật. Chỉ những thứ vốn là ảnh bitmap trong Figma (ảnh dự án, ảnh chân dung, hình minh hoạ nét như cô gái cầm iPad, cube, con mắt, chat bubble…) mới là file ảnh. Icon nhỏ (mũi tên, icon tải) dùng SVG inline.
- Không sửa nội dung cứng trong HTML — nội dung phải đi từ JSON.
- Không để JSON lỗi làm trắng trang mà không có thông báo (xem mục 6).

## 3. Ràng buộc

- Host: GitHub Pages (static). URL dạng `<user>.github.io` hoặc `<user>.github.io/<repo>` → **mọi đường dẫn phải là đường dẫn tương đối**, chạy đúng cả khi site nằm trong thư mục con.
- Công nghệ: HTML + CSS + JavaScript thuần (ES modules được), không framework, không bước build. `fetch('data.json')` lúc chạy.
- Thư mục dự án: `/Users/ngocsangair/Documents/voice/portfolio-qa/`.
- Font và màu lấy chính xác từ Figma (dùng Figma MCP `get_design_context` / `get_variable_defs` trên các node ở mục 4). Font: dùng Google Fonts nếu có. Nếu font Figma không có trên Google Fonts → dùng font Google Fonts gần nhất **có hỗ trợ tiếng Việt**, ghi rõ trong báo cáo; chỉ self-host font gốc khi người dùng đưa file font (có bản quyền web). *(Quyết định của Claude.)*
- Tiêu đề lớn trang Home giữ **không dấu, in hoa** như Figma ("QUYNH ANH") — lấy từ trường riêng `site.heroName`; các chỗ khác (copyright, bio) dùng `site.name` có dấu. *(Quyết định của Claude.)*
- Ngôn ngữ nội dung: tiếng Anh như Figma (dữ liệu mẫu).

## 4. Các trang (đã chốt với người dùng)

Mỗi mục là **một trang riêng**. Node Figma tham chiếu:

| Trang | File | Node Figma |
|---|---|---|
| Home | `index.html` | `2796:61531` |
| Works | `works.html` | phần trên của `2796:61567` (tiêu đề "Works", đoạn giới thiệu, lưới thẻ, dải "Let's talk" + email) |
| About | `about.html` | phần dưới của `2796:61567` (tiêu đề "About", đoạn bio, cụm hình minh hoạ, 4 dịch vụ) |
| Contact | `contact.html` | `2796:61498` |
| Chi tiết dự án | `project.html?id=<id>` | ví dụ `2796:61649` (Habitify), `2796:63798` (Nami), `2796:63836` (Tendoo) |

### Header chung (mọi trang trừ Contact)
Trái: menu dọc Works / About / Contact. Giữa: logo chữ "QA" (chữ, không phải ảnh). Phải: icon tải + "Resume" màu cam → tải file CV (ghi chú Figma "DOWN CV VỀ Ở ĐÂY"). Link của trang hiện tại nên có trạng thái active (builder tự chọn cách thể hiện kín đáo, hợp style).

### Home
Đúng như `2796:61531`: tiêu đề "Welcome to Art space of Quynh Anh" (chữ cái đầu viết tay), nút tròn mũi tên xuống, ảnh chân dung bên trái, cụm 3 hình minh hoạ bên phải, dòng "Senior Graphic Designer & Visual Artist" ở dưới. Các chữ này lấy từ JSON (tên, chức danh). Nút mũi tên xuống dẫn sang trang Works.

### Works
- Tiêu đề "Works", đoạn giới thiệu ("Below are selected projects…").
- **Nút filter** theo mảng: All + 4 mảng. Lọc tại chỗ, không tải lại trang; nên ghi filter vào URL (`works.html?category=brand-identity`) để chia sẻ được.
- **Lưới thẻ xếp so le** như Figma: thẻ ảnh vuông xen kẽ thẻ ảnh chữ nhật ngang, lặp lại khi có nhiều thẻ hơn 4. Mỗi thẻ: nhãn mảng (". Brand Identity"), ảnh bìa, tên dự án, "năm . công ty".
- **Mỗi thẻ = một cặp (dự án, mảng)**. Một dự án có 2 mảng → 2 thẻ.
- Bấm thẻ → đi thẳng tới trang chi tiết của đúng cặp đó.
- Cuối trang: dải chữ chạy "Got a project in mind? Let's talk." (marquee lặp) + khung email. **Dải này chỉ có ở trang Works.**

### About
Tiêu đề "About", đoạn bio, cụm hình minh hoạ xung quanh (macbook, bảng màu, ipad, poster, sao ý tưởng, cube, sparkle, chat bubble — theo vị trí Figma), ảnh lớn ở giữa, 4 dịch vụ chia 2 cột (tên + mô tả), hình cô gái chụp ảnh "say hi".

### Contact
Theo ghi chú Figma: **trang này ẩn header**. Contact **chỉ là trang riêng**, không phải footer chung cho các trang khác (người dùng đã xác nhận). Muốn rời trang thì bấm logo QA về Home. Thay cho header là: trái — danh sách link BEHANCE / DRIBBBLE / INSTAGRAM / LINKEDIN có mũi tên chéo; giữa — logo QA (vẫn bấm về Home). Giữa trang: tiêu đề "Contact", câu "Let's start your project today. Drop me a line.", email (bấm được `mailto:`), các hình minh hoạ. Dưới cùng: "© 2026 Quỳnh Anh. All rights reserved" — "Hanoi, VN — HH:MM AM/PM" — "● Available for work".
- **Giờ Hà Nội là giờ thật**, tính theo múi giờ `Asia/Ho_Chi_Minh` (không theo giờ máy người xem), cập nhật mỗi phút.
- Dòng "Available for work" bật/tắt được từ JSON.

### Chi tiết dự án
Theo `2796:61649`: tiêu đề "Works" lớn; trái: tên dự án (cam, in hoa) + "năm . công ty" + các đoạn mô tả; phải trên: các tag (". Brand Identity . Logo Design"); lưới 2×2 ảnh cạnh phần mô tả; sau đó lặp **khối "một đoạn chữ toàn chiều ngang + 2 ảnh lớn cạnh nhau"**. Số khối tuỳ dữ liệu. Ảnh trong dự án có thể là bất kỳ kích thước nào (ảnh app Tendoo dọc 375×812…) → hiển thị trong khung theo tỉ lệ Figma bằng `object-fit: cover`; builder được phép cho phép một khối dùng `fit: contain` nếu cần (để trong JSON).
- `id` không tồn tại → hiện thông báo "Không tìm thấy dự án" và link về Works.

## 5. Mảng (đã chốt)

Đúng 4 mảng, thứ tự: **Brand Identity, Digital Illustration, Digital & Social Design, Photography**. (Các tên "Graphic Design / Visual Design / Illustration / Branding" trong lưới Figma là placeholder cũ — bỏ.)

Các "dải tiêu đề" trong Figma (`2796:63874` "brand identity", `2796:64514`, `2796:64630`, `2796:64670`) chỉ là nhãn tổ chức trong file Figma, không phải UI.

## 6. Dữ liệu — `data.json`

Nguyên tắc: Quỳnh Anh sửa được mà không hiểu code. Ít lồng nhau, tên trường tiếng Anh ngắn gọn, ảnh chỉ ghi tên file trong thư mục `images/`.

Đơn vị dữ liệu của bài chi tiết là **"work"** = một cặp (dự án, mảng). Mỗi work có `id` riêng dùng trong URL. Cấu trúc tham khảo (builder có thể chỉnh tên trường nếu giữ được độ đơn giản):

```json
{
  "site": {
    "name": "Quỳnh Anh",
    "titles": ["Senior Graphic Designer", "Visual Artist"],
    "email": "quynhanh.qa1236@gmail.com",
    "resume": "files/cv.pdf",
    "location": "Hanoi, VN",
    "availableForWork": true,
    "social": [
      { "name": "Behance",   "url": "" },
      { "name": "Dribbble",  "url": "" },
      { "name": "Instagram", "url": "" },
      { "name": "LinkedIn",  "url": "" }
    ]
  },
  "home": { "photo": "images/home-portrait.jpg" },
  "works": { "intro": "Below are selected projects ..." },
  "about": {
    "bio": "I am Quỳnh Anh, ...",
    "photo": "images/about-photo.jpg",
    "services": [
      { "name": "Digital Illustration", "description": "..." }
    ]
  },
  "categories": [
    { "id": "brand-identity", "name": "Brand Identity" },
    { "id": "digital-illustration", "name": "Digital Illustration" },
    { "id": "digital-social-design", "name": "Digital & Social Design" },
    { "id": "photography", "name": "Photography" }
  ],
  "projects": [
    {
      "id": "tendoo-brand-identity",
      "project": "Tendoo",
      "category": "brand-identity",
      "year": 2025,
      "company": "Viettel Telecom",
      "tags": ["Brand Identity", "Logo Design"],
      "cover": "images/tendoo/brand-cover.jpg",
      "intro": ["Đoạn 1...", "Đoạn 2..."],
      "introImages": ["...", "...", "...", "..."],
      "sections": [
        { "text": "...", "images": ["...", "..."] }
      ]
    }
  ]
}
```

- Thứ tự trong mảng `projects` = thứ tự hiển thị trên Works.
- Ảnh bị thiếu/không tải được → hiện ô màu xám nhạt như placeholder Figma, không vỡ layout.
- Dữ liệu mẫu ban đầu (theo các dải nhóm trong Figma, chữ mô tả và ảnh là placeholder) — 11 work:
  - Brand Identity: Habitify (2019, Unstatic Co.), Nami Innovation (2024, Nami Foundation), Tendoo (2025, Viettel Telecom)
  - Digital Illustration: Good Moods (2024, Good Moods), Nami Innovation (2024, Nami Foundation), Tendoo (2025, Viettel Telecom), Sci Labs (2024, Nami Innovation)
  - Digital & Social Design: Habitify, Nami Innovation, Tendoo
  - Photography: Habitify
- **JSON lỗi cú pháp** → trang hiện thông báo rõ bằng tiếng Việt ("File data.json đang bị lỗi ở dòng …") thay vì trắng trang.

### File template cho người dùng
Người dùng sẽ tự điền nội dung thật sau. Giao: `data.json` (đã có dữ liệu mẫu đúng cấu trúc, các link mạng xã hội để trống) + `HUONG-DAN.md` tiếng Việt: cách sửa JSON trên github.com, cách upload ảnh vào `images/`, cách thay CV, các lỗi JSON hay gặp (thiếu dấu phẩy, ngoặc kép), cách thêm/xoá một work.

## 7. Ảnh từ Figma

Xuất từ Figma các ảnh bitmap/minh hoạ đang dùng trong các trang (ảnh chân dung `image 3191`, các hình `01-co-gai-cam-ipad`, `02-con-mat-viewfinder`, `03-khoi-cube`, `04-co-gai-thinking`, `03-chat-bubble`, `01-email-bay`, `06-click`, `03-macbook-mo-gap`, `06-bang-mau-hoa-si`, `02-ipad-va-apple-pencil`, `04-poster-bay`, `01-chom-sao-y-tuong`, `05-sparkle-cam`, `03-chat-bubble-cam`, `02-co-gai-chup-anh-say-hi`…). Hình minh hoạ trang trí là một phần giao diện → giữ cố định trong code/thư mục `assets/`, không đưa vào JSON (trừ ảnh chân dung Home và ảnh About). Tối ưu dung lượng (WebP/PNG nén) cho web.

## 8. Responsive

Không có thiết kế mobile trong Figma; builder tự thiết kế, giữ: nền kem, chữ đen, nhấn cam, font serif + chữ đầu viết tay cho tiêu đề, khoảng trắng rộng. Tối thiểu 3 mốc: desktop (≥1280), tablet, mobile (≤480). Trên mobile: header gọn (menu có thể thu thành nút), lưới Works về 1 cột (vẫn xen kẽ vuông/ngang), lưới ảnh dự án về 1 cột, cụm hình minh hoạ thu nhỏ hoặc sắp lại sao không đè chữ. Desktop lớn hơn 1920 căn giữa, không kéo giãn vô hạn.

## 9. Để lại cho builder

- Tên file CSS/JS, cách tổ chức code.
- Hiệu ứng nhỏ (hover thẻ, chuyển trang, tốc độ marquee) — nhẹ nhàng, hợp style.
- Cách thể hiện trạng thái active của menu và nút filter.
- Kiểm thử: mở bằng một static server cục bộ, kiểm tra cả 5 trang ở 3 kích thước, kiểm tra JSON lỗi và ảnh thiếu.

## 10. Các quyết định là của Claude (người dùng chưa xác nhận riêng)

- HTML/CSS/JS thuần, không build; `fetch` JSON lúc chạy.
- URL chi tiết `project.html?id=...`; filter ghi vào URL.
- Nút mũi tên trên Home dẫn sang Works.
- Hình minh hoạ trang trí cố định trong code, không cho sửa qua JSON.
- Cấu trúc JSON ở mục 6.
