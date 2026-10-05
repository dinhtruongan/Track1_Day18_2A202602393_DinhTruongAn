# Prototype A/B/C — cách mở

**Source chung:** [prototype/index.html của Vũ](https://github.com/elysszxje/Track1_Day19_2A202602695_TranPhamThaiVu/blob/338de81e5b4fd0bbd9ee485593db036b905b5c72/prototype/index.html).

**Bản clone local:** `C:\Users\Administrator\OneDrive\Desktop\pm\Day19-source-ThaiVu\prototype\index.html`. Mở file này bằng trình duyệt; CSS/JS nằm cùng thư mục. Ba tab A/B/C là ba phương án của cùng prototype. Đường dẫn GitHub ở trên là link mã nguồn, không phải link demo chạy trực tiếp.

**Demo A/B/C:** [Mở prototype Tomorrow](https://dinhtruongan.github.io/Track1_Day18_2A202602393_DinhTruongAn/). Chọn tab A, B hoặc C trong cùng trang. Mã prototype kế thừa từ Vũ được lưu ở nhánh `gh-pages`; nhánh `main` giữ đúng sáu tệp báo cáo.

## Tổ chức trải nghiệm

| Phiên | Thứ tự | Trạng thái |
|---|---|---|
| An | A → B → C | Chưa có test thực tế |
| Vũ | B → C → A | Repo nguồn có note mô phỏng; chưa dùng như evidence thật |
| Tài | C → A → B | Repo nguồn có note mô phỏng; chưa dùng như evidence thật |

Dùng cùng code/log và task cho cả ba. Reset từng option trước mỗi tester. Để người tham gia tự đọc, bấm, sửa và giải thích. Giữ observer drawer đóng trong lúc tester thao tác, mở để ghi notes khi cần.

Ở C có kịch bản bản vá sai chỉ xử lý Dockerfile, bỏ qua code. Sau happy path, đưa cùng kịch bản này cho mỗi tester và ghi phản ứng; không nhắc trước họ phải Reject hoặc Rollback. Đánh dấu khi facilitator can thiệp.

App dùng canned output, mô phỏng deploy và lưu scratchpad cục bộ. Không gọi LLM/Cloud Run thật; kiểm tra mẫu code không phải validator JavaScript tổng quát hay bằng chứng deploy production thành công.

