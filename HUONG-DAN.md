# Hướng dẫn chỉnh sửa website portfolio

Tài liệu này dành cho Quỳnh Anh. Bạn **không cần biết lập trình**. Gần như mọi thứ hiển thị trên website (tên, chức danh, email, dự án, ảnh, đoạn giới thiệu...) đều nằm trong **một file duy nhất: `data.json`**. Muốn đổi nội dung nào, bạn chỉ sửa chữ trong file đó, rồi lưu lại.

> Lưu ý nhỏ: website là tiếng Anh, nên nội dung bạn gõ vào `data.json` cũng là tiếng Anh. Các chữ cố định như "Works", "About", "Contact", "Resume", "Available for work" không nằm trong `data.json` và không đổi ở đây.

---

## 1. Đọc `data.json` như thế nào

`data.json` là một danh sách các mục, mỗi mục có **tên** và **giá trị** nằm trong dấu ngoặc kép, ví dụ:

```json
"email": "quynhanh.qa1236@gmail.com",
```

Bạn chỉ sửa phần **giá trị** (phần bên phải dấu hai chấm, nằm trong ngoặc kép). **Không sửa phần tên** (như `"email"`), vì website tìm đúng theo tên đó.

Các mục lớn trong `data.json` và chúng điều khiển gì:

| Mục | Điều khiển |
|---|---|
| `site` | Thông tin chung: tên, chức danh, email, CV, địa điểm, trạng thái nhận việc, mạng xã hội |
| `home` | Ảnh chân dung ở trang chủ |
| `works` | Đoạn giới thiệu ở đầu trang Works |
| `about` | Trang About: đoạn tiểu sử, ảnh, 4 mảng dịch vụ |
| `categories` | Các nhóm (mảng) dự án, hiện thành các nút lọc ở trang Works |
| `projects` | Toàn bộ dự án (mỗi dự án là một khối `{ ... }`) |

---

## 2. Mục `site`: thông tin chung

```json
"site": {
  "name": "Quỳnh Anh",
  "heroName": "Quynh Anh",
  "titles": ["Senior Graphic Designer", "Visual Artist"],
  "email": "quynhanh.qa1236@gmail.com",
  "resume": "files/cv.pdf",
  "location": "Hanoi, VN",
  "availableForWork": true,
  "social": [
    { "name": "Behance", "url": "" },
    { "name": "Dribbble", "url": "" }
  ]
}
```

- **`name`**: tên đầy đủ (có dấu). Hiện ở dòng bản quyền cuối trang Contact và trong tiêu đề tab trình duyệt.
- **`heroName`**: tên viết ở dòng chào lớn trang chủ ("Welcome to Art space of ..."). Cả tên hiện màu cam. Các từ đứng trước được viết hoa kiểu chữ có chân; riêng từ **cuối cùng**, **chữ cái đầu** là chữ to kiểu thư pháp, các chữ còn lại viết hoa kiểu có chân (ví dụ "Quynh Anh": "QUYNH" viết hoa, còn trong "Anh" thì chữ **A** to kiểu thư pháp, "NH" viết hoa theo sau).
- **`titles`**: chức danh ở trang chủ. Hiển thị tối đa 2 chức danh, nối nhau bằng dấu `&` ("Senior Graphic Designer & Visual Artist"). Nếu chỉ có 1 chức danh thì chỉ hiện chức danh đó, không có dấu `&`.
- **`email`**: hiện ở trang Works (khung email cuối trang) và trang Contact; bấm vào sẽ mở thư mới. Để trống `""` thì khung email ở trang Works biến mất; ở trang Contact khung vẫn còn nhưng chỉ có câu mời liên hệ, không có địa chỉ email.
- **`resume`**: đường dẫn file CV cho nút **Resume** ở thanh trên cùng. Hiện tại là `files/cv.pdf`. **Để trống `""` thì nút Resume biến mất.** Cách thay file CV: xem mục 6.
- **`location`**: hiện ở trang Contact cùng đồng hồ ("Hanoi, VN — 08:32 AM"). Giờ luôn là giờ Hà Nội.
- **`availableForWork`**: `true` thì trang Contact hiện dòng **"Available for work"** với chấm tròn màu cam phía trước. Đổi thành `false` thì dòng đó ẩn đi. Chỉ gõ `true` hoặc `false`, **không** có ngoặc kép, viết thường.
- **`social`**: các mạng xã hội ở góc trên trang Contact. Chúng cũng hiện thay cho menu ở đầu trang khi người xem cuộn xuống cuối các trang dài (About, trang dự án).
  - Có link: `{ "name": "Behance", "url": "https://www.behance.net/ten-cua-ban" }` thì chữ Behance bấm được và mở tab mới.
  - **Để `"url": ""` (trống) thì chữ vẫn hiện nhưng chỉ là chữ thường, không bấm được.** Hiện tại cả 4 mạng đều đang để trống; khi có link, dán vào giữa 2 dấu ngoặc kép.
  - Muốn bớt một mạng xã hội: xóa cả khối `{ "name": ..., "url": ... }` của nó (nhớ xử lý dấu phẩy, xem mục 8).

---

## 3. Mục `home`, `works`, `about`

```json
"home":  { "photo": "images/home-portrait.jpg" },
"works": { "intro": "Below are selected projects I have worked on ..." },
"about": {
  "bio": "Đoạn 1...\n\nĐoạn 2...\n\nĐoạn 3...",
  "photo": "images/about-photo.jpg",
  "services": [
    { "name": "Digital Illustration", "description": "..." }
  ],
  "process": ["The Brief & Keywords", "Brainstorm & Moodboard", "..."]
}
```

- **`home.photo`**: ảnh chân dung trang chủ. **`about.photo`**: ảnh trang About. Muốn đổi ảnh: tải ảnh mới lên (mục 5) rồi sửa đường dẫn cho khớp.
- **`works.intro`**: đoạn chữ giới thiệu ở đầu trang Works.
- **`about.bio`**: đoạn tiểu sử ở trang About. **Cách xuống đoạn mới:** trong `data.json`, mỗi giá trị chữ phải nằm trên **một dòng duy nhất** (không bấm Enter giữa chừng). Để tách đoạn, gõ `\n\n` (dấu gạch chéo ngược, chữ n, lặp 2 lần, viết liền, không có khoảng trắng ở giữa) vào chỗ muốn ngắt. Ví dụ:

  ```json
  "bio": "Đoạn thứ nhất.\n\nĐoạn thứ hai.\n\nĐoạn thứ ba."
  ```

  Trên website, mỗi đoạn sẽ nằm riêng với một khoảng cách ở giữa. Muốn thêm đoạn thứ tư: thêm `\n\n` rồi viết tiếp trước dấu ngoặc kép cuối.

  **In đậm một cụm chữ:** đặt cụm đó giữa hai cặp dấu sao `**`, viết liền, không có khoảng trắng giữa dấu sao và chữ. Ví dụ `"I am **Quỳnh Anh**, a Senior..."` sẽ hiện "Quỳnh Anh" in đậm. Thiếu một cặp `**` thì dấu sao hiện ra nguyên văn, không có gì hỏng.
- **`about.services`**: các mảng dịch vụ, mỗi mảng gồm `name` (tên) và `description` (mô tả ngắn). Các mảng tự chia thành hai cột. Muốn thêm một mảng: sao chép cả một khối `{ "name": ..., "description": ... }`, dán nối tiếp (cách nhau bằng dấu phẩy) rồi sửa chữ.
- **`about.process`**: các bước trong mục "Design Approach Process" ở trang About. Mỗi bước là một chuỗi trong ngoặc kép, cách nhau dấu phẩy; số thứ tự 1, 2, 3… trong vòng tròn cam được tự đánh theo thứ tự.

---

## 4. Dự án và các nhóm dự án

### Các nhóm (`categories`)

```json
"categories": [
  { "id": "brand-identity", "name": "Brand Identity" },
  { "id": "digital-illustration", "name": "Digital Illustration" },
  { "id": "digital-social-design", "name": "Digital & Social Design" },
  { "id": "photography", "name": "Photography" }
]
```

- `name` là chữ hiện ở nút lọc và nhãn trên mỗi thẻ dự án. Bạn có thể sửa thoải mái.
- `id` là "mã" để dự án gắn vào nhóm. **Đừng đổi `id`** nếu chưa chắc, vì nếu đổi thì phải đổi `"category"` của mọi dự án thuộc nhóm đó cho khớp.
- Thứ tự các nút lọc trên trang Works giống thứ tự trong danh sách này (nút **All** luôn đứng đầu).
- Nhóm chưa có dự án nào thì khi bấm sẽ hiện dòng "Chưa có dự án nào trong mảng này."
- Nên giữ nguyên 4 nhóm này. Nếu muốn thêm nhóm mới hãy nhờ người làm web hỗ trợ lần đầu.

### Một dự án (`projects`)

Đây là dự án đầu tiên, đã rút gọn:

```json
{
  "id": "habitify-brand-identity",
  "project": "Habitify",
  "category": "brand-identity",
  "year": 2019,
  "company": "Unstatic Co.",
  "tags": ["Brand Identity", "Logo Design"],
  "cover": "images/habitify-brand-identity/cover.jpg",
  "intro": [
    "Đoạn giới thiệu thứ nhất của dự án.",
    "Đoạn giới thiệu thứ hai."
  ],
  "introImages": [
    "images/habitify-brand-identity/intro-1.jpg",
    "images/habitify-brand-identity/intro-2.jpg",
    "images/habitify-brand-identity/intro-3.jpg",
    "images/habitify-brand-identity/intro-4.jpg"
  ],
  "sections": [
    {
      "text": "Chữ mô tả phần 1.",
      "images": [
        "images/habitify-brand-identity/section-1-1.jpg",
        "images/habitify-brand-identity/section-1-2.jpg"
      ]
    }
  ]
}
```

Từng mục nghĩa là gì:

- **`id`**: mã riêng của dự án, dùng để tạo đường dẫn (`project.html?id=habitify-brand-identity`). Chỉ dùng **chữ thường không dấu, số và dấu gạch ngang**, không có khoảng trắng. **Mỗi dự án phải có `id` khác nhau.** Nếu hai dự án trùng `id`, website chỉ giữ dự án đứng trước và hiện thông báo cảnh báo ở đầu trang.
- **`project`**: tên dự án hiện trên thẻ và ở đầu trang dự án.
- **`category`**: **phải đúng một trong 4 mã** `brand-identity`, `digital-illustration`, `digital-social-design`, `photography`. Gõ sai thì dự án bị bỏ qua và website hiện thông báo cảnh báo.
- **`year`** và **`company`**: hiện thành dòng "2019 . Unstatic Co." dưới tên dự án. `year` là số, **không** có ngoặc kép.
- **`tags`**: các nhãn nhỏ ở đầu trang dự án (hiện dạng ". Brand Identity"). Thêm bao nhiêu nhãn cũng được, mỗi nhãn một chuỗi trong ngoặc kép, cách nhau bằng dấu phẩy.
- **`cover`**: ảnh bìa hiện trên thẻ ở trang Works.
- **`intro`**: các đoạn giới thiệu ở đầu trang dự án. **Mỗi đoạn là một chuỗi riêng**, cách nhau dấu phẩy (khác với `about.bio`, ở đây không cần `\n\n`).
- **`introImages`**: lưới ảnh cạnh phần giới thiệu (thiết kế hiện tại hợp với 4 ảnh).
- **`sections`**: các phần tiếp theo của trang dự án, từ trên xuống dưới. Mỗi phần có `text` (đoạn chữ) và `images` (thường là 2 ảnh đặt cạnh nhau). Muốn thêm phần mới: sao chép cả khối `{ "text": ..., "images": [...] }`.
  - **Tùy chọn `"fit": "contain"`**: mặc định ảnh được cắt để lấp đầy khung. Nếu ảnh của bạn bị cắt mất phần quan trọng (ví dụ logo sát mép), thêm `"fit": "contain"` vào phần đó để hiện **nguyên ảnh, không cắt** (khung có thể còn viền trống). Ví dụ:

    ```json
    {
      "text": "Logo variations.",
      "fit": "contain",
      "images": [
        "images/habitify-brand-identity/section-1-1.jpg",
        "images/habitify-brand-identity/section-1-2.jpg"
      ]
    }
    ```

    Chữ `fit` đặt ngang hàng với `text` và `images`, và áp dụng cho các ảnh của riêng phần đó.

### Thêm, xóa, đổi thứ tự dự án

- **Thêm dự án:** trong `"projects": [ ... ]`, sao chép **nguyên một khối** từ dấu `{` đầu của một dự án đến dấu `}` cuối của nó, dán ngay sau dấu `}` của dự án trước và **thêm dấu phẩy ở giữa hai khối**. Sau đó sửa: `id` (phải mới, chưa ai dùng), `project`, `category`, `year`, `company`, `tags`, các đường dẫn ảnh, `intro`, `sections`.
- **Xóa dự án:** xóa cả khối `{ ... }` của nó, nhớ giữ cho dấu phẩy đúng (mục 8).
- **Đổi thứ tự:** **thứ tự dự án trên trang Works đúng bằng thứ tự trong danh sách `projects`**. Dự án đứng trước thì hiện trước. Các thẻ xen kẽ ô vuông và ô rộng theo vị trí, nên đổi thứ tự cũng đổi cách bố trí. Muốn dời dự án, cắt cả khối và dán sang vị trí mới (nhớ dấu phẩy).

---

## 5. Cách thêm/đổi ảnh

1. Mỗi dự án có một thư mục ảnh riêng: `images/<id của dự án>/`, ví dụ `images/habitify-brand-identity/`. Ảnh chung (chân dung trang chủ, ảnh About) nằm thẳng trong `images/`.
2. Tải ảnh lên đúng thư mục (trên github.com: mở thư mục `images` > **Add file** > **Upload files**). Với dự án mới, hãy kéo thả **cả thư mục ảnh** từ máy tính vào (thư mục phải đặt tên đúng bằng `id` của dự án); GitHub sẽ giữ nguyên cấu trúc thư mục. Nếu thư mục của dự án đã có sẵn thì chỉ cần mở thư mục đó rồi tải ảnh lên.
3. Trong `data.json`, ghi đường dẫn đúng **y hệt tên file đã tải lên**:
   `"cover": "images/habitify-brand-identity/cover.jpg"`
4. **Tên file phân biệt chữ hoa/chữ thường** (`Cover.jpg` khác `cover.jpg`) trên GitHub Pages. Nên đặt tên **chữ thường, không dấu, không khoảng trắng**, dùng dấu gạch ngang. Ghi sai tên thì chỗ đó chỉ hiện ô xám.
5. **Định dạng nên dùng:** `jpg`, `png` hoặc `webp`. **Kích thước hợp lý:** rộng khoảng 2000px, mỗi ảnh nhẹ hơn khoảng 1 MB để trang tải nhanh (có thể nén bằng các công cụ như Squoosh trước khi tải lên).
6. Hiện chưa có ảnh dự án thật: chỗ nào chưa có ảnh sẽ hiện ô màu xám. Đó là bình thường, không phải lỗi.

---

## 6. Thay file CV (nút Resume)

1. Chuẩn bị file CV mới, **đặt tên `cv.pdf`**.
2. Trên github.com, mở thư mục `files`, chọn **Add file** > **Upload files**, tải `cv.pdf` lên (cùng tên thì file mới sẽ thay file cũ).
3. Không cần sửa `data.json` nếu giữ nguyên tên `cv.pdf` (mục `"resume": "files/cv.pdf"`).

Nếu muốn **ẩn nút Resume**: sửa thành `"resume": ""`.

---

## 7. Cách sửa file trên github.com và chờ thay đổi

Khi website đã được đăng lên (xem mục 10), cách sửa như sau:

1. Vào trang kho (repository) của website trên github.com, đăng nhập.
2. Bấm vào file **`data.json`**.
3. Bấm biểu tượng **cây bút chì** (Edit this file) ở góc phải phía trên nội dung file.
4. Sửa chữ cần đổi. Chỉ sửa trong phạm vi dấu ngoặc kép, đừng xóa dấu `,` `{` `}` `[` `]` `"`.
5. Bấm nút xanh **Commit changes...**, rồi bấm **Commit changes** lần nữa trong hộp hiện ra (để trống ô mô tả cũng được).
6. **Đợi khoảng 1 phút** để GitHub cập nhật website. Mở website và nhấn **tải lại cứng** nếu chưa thấy đổi: `Ctrl + Shift + R` (Windows) hoặc `Cmd + Shift + R` (Mac). Trên điện thoại, đóng hẳn tab rồi mở lại.

Mẹo: sửa **từng chút một**, lưu, rồi xem thử. Nếu có lỗi, bạn biết ngay lỗi nằm ở chỗ vừa sửa.

---

## 8. Bốn lỗi thường gặp khi sửa `data.json`

Nếu `data.json` bị sai, website sẽ hiện thông báo tiếng Việt như: **"File data.json đang bị lỗi ở dòng 25, cột 7..."**. Hãy mở `data.json`, nhìn quanh **số dòng** đó (thường lỗi nằm ở dòng đó hoặc ngay dòng liền trước), sửa rồi lưu lại. Bốn lỗi hay gặp nhất:

**1. Có dấu phẩy sau mục cuối cùng.** Mục cuối của một danh sách hoặc một khối thì **không** có dấu phẩy.

```json
Sai:  "tags": ["Brand Identity", "Logo Design",]
Đúng: "tags": ["Brand Identity", "Logo Design"]
```

**2. Thiếu dấu phẩy giữa hai mục.** Giữa hai mục liền nhau (hai dòng, hai khối `{ }`) phải có dấu phẩy.

```json
Sai:  "year": 2019
      "company": "Unstatic Co."
Đúng: "year": 2019,
      "company": "Unstatic Co."
```

**3. Dùng ngoặc kép cong “ ”.** Khi gõ trong Word, Google Docs hay ghi chú, ngoặc kép thường bị tự đổi thành “ ” (cong). JSON chỉ nhận ngoặc kép thẳng `"`. Nếu soạn nội dung ở nơi khác rồi dán vào, hãy kiểm tra và thay lại bằng `"` thẳng cho dấu bao quanh giá trị.

```json
Sai:  “project”: “Habitify”
Đúng: "project": "Habitify"
```

**4. Có dấu ngoặc kép `"` nằm trong đoạn chữ.** Nếu trong câu có dấu `"`, phải viết thành `\"` (thêm gạch chéo ngược phía trước), nếu không website tưởng đoạn chữ đã kết thúc ở đó.

```json
Sai:  "bio": "I believe every project has its own "personality.""
Đúng: "bio": "I believe every project has its own \"personality.\""
```

(Đoạn `bio` thật trong `data.json` đang dùng đúng cách này.) Cách đơn giản nhất: tránh dùng ngoặc kép trong nội dung, hoặc dùng dấu nháy đơn `'`.

Ngoài ra: **đừng bấm Enter xuống dòng ở giữa một đoạn chữ** trong dấu ngoặc kép (JSON không cho). Để xuống đoạn trong `bio`, dùng `\n\n` như mục 3.

Nếu sửa xong mà website không lên và bạn không tìm ra lỗi: bấm **Cancel changes** (nếu chưa lưu), hoặc mở lịch sử file (**History**) trên github.com để quay lại bản trước, rồi nhờ người làm web xem giúp.

---

## 9. Một vài thông báo khác có thể gặp

- **"Không tìm thấy dự án."**: đường dẫn dự án sai hoặc `id` dự án đã bị đổi/xóa.
- **Khung cảnh báo đầu trang** (nền màu be, viền dưới màu cam) ("Dữ liệu trong data.json có vấn đề nhỏ..."): website vẫn chạy nhưng đã bỏ qua một số dự án có `category` không tồn tại hoặc `id` bị trùng. Đọc dòng cảnh báo để biết dự án nào, rồi sửa lại.
- **Ảnh không hiện, chỉ thấy ô xám:** kiểm tra tên file và đường dẫn trong `data.json` (đúng chữ hoa/thường, đúng thư mục, đúng đuôi `.jpg`/`.png`).

---

## 10. Khi đã có GitHub

Hiện tại bạn chưa cần làm gì với GitHub. Khi bạn đã có tài khoản, **người làm web sẽ đăng website lên và bật chế độ hiển thị** (GitHub Pages), rồi gửi bạn đường link website cùng đường link kho mã nguồn. Sau đó, việc sửa nội dung chỉ là làm theo mục 7: mở `data.json`, sửa bằng cây bút chì, **Commit changes**, đợi khoảng 1 phút. Việc tải ảnh lên (mục 5) và đổi CV (mục 6) cũng làm ngay trên github.com, không cần cài thêm phần mềm nào.
