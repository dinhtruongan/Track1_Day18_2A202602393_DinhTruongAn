# Day 18–19 — Multiple Prototypes & Human–AI Design

**Trạng thái:** Báo cáo cá nhân trong bộ bài nhóm Tomorrow, sử dụng dữ liệu Day 17 và thiết kế/prototype A/B/C chung. Feedback prototype là biểu mẫu chờ điền từ phiên kiểm thử.

## 1. Thông tin cá nhân và nhóm

- Họ tên: Đinh Trường An · MHV: 2A202602393.
- Nhóm Tomorrow: Đinh Trường An, Trần Phạm Thái Vũ, Hoàng Anh Tài.
- Case A — AI Tutor: Diagnostic Refresher, kế thừa Day 17.
- Theo [quy cách nộp trên VLearn](https://vlearn.dev/course/k04-l34-p2-t1/reader?day=D05&part=codelab-f3fc688af6874124b3d45f0d65a5a14e-s21-doc), repo đặt tên `Track1_Day18_2A202602393_DinhTruongAn` và có sáu tệp Markdown ở thư mục gốc.
- Tài liệu và prototype chung của nhóm được lưu tại [kho làm việc Tomorrow](https://github.com/elysszxje/Track1_Day19_2A202602695_TranPhamThaiVu/tree/338de81e5b4fd0bbd9ee485593db036b905b5c72); các thành viên sử dụng chung theo quy định của lab.

## 2. Hypothesis Problem

Khi **tự làm bài thực hành kỹ thuật và gặp một bước hoặc lỗi chưa hiểu** (Situation), **học viên** (User) gặp khó khăn trong việc **hoàn thành bài và hiểu cách làm** (Job), vì **phải ghép hướng dẫn từ nhiều nguồn chưa gắn đủ với bài đang làm** (Barrier), dẫn đến **nguy cơ tốn thêm thời gian đối chiếu và gián đoạn tiến độ** (Consequence).

Notes Day 17 của Vũ kể việc hỏi AI từng bước, đối chiếu tài liệu deploy rồi hỏi bạn; người tham gia nói đã deploy được. Notes của An cho thấy việc tra cứu khi gặp thuật ngữ mới; record RAG của Tài cho thấy dùng nhiều nguồn khi vướng Re-ranking. Điểm chung là hành vi tìm trợ giúp ngoài bài; mức độ chi phí và nguyên nhân vẫn khác nhau. Chi tiết nguồn và các ẩn số nằm trong [design sheet](three-option-design-sheet.md).

## 3. Three Solution Options

| Option | Cơ chế | Người quyết định | Đánh đổi cần kiểm tra |
|---|---|---|---|
| A — Checklist và tra cứu | Người học chủ động mở tài liệu, tự đọc và tự sửa code | Người học tự chọn cách sửa | Tự chủ cao nhưng có thể mất công tổng hợp/gõ mã |
| B — Hướng dẫn từng bước | Hệ thống hỏi chẩn đoán, đề xuất ba bước; người học sửa/duyệt từng bước | Người học duyệt mỗi bước | Nhiều thao tác hơn, có thể giúp hiểu quy trình |
| C — Bản vá chủ động | Hệ thống tạo diff; người học xem, chỉnh hoặc bác bỏ trước khi áp dụng | Người học duyệt bản vá | Nhanh hơn ở happy path, cần kiểm tra để tránh nhận bản vá sai |

Cả ba dùng cùng một lỗi Cloud Run giả lập, cùng code/log và cùng nhiệm vụ. Không chạy deploy thật hay gọi model thật. Canned output và điểm 92%/45% trong prototype là dữ liệu mô phỏng, không phải độ tin cậy được đo. [Trải nghiệm A/B/C](https://dinhtruongan.github.io/Track1_Day18_2A202602393_DinhTruongAn/) · [Nguồn và cách mở](prototype-link.md).

## 4. Đóng góp cá nhân

Tôi cung cấp Interview Record Day 17 của lượt HV-A01: câu chuyện buổi học Track 1, cách ghi chú, xem lại video và tra cứu. Hồ sơ này được đưa vào Evidence Snapshot để đối chiếu với notes của Vũ và Tài, cùng các giới hạn về episode, thời gian và nguyên nhân chưa rõ.

Trong bản tổng hợp này, tôi sử dụng AI để đối chiếu ba Practice Notes, giữ chung bối cảnh deploy cho A/B/C và trình bày bảng Human–AI theo bốn trụ cột. Tôi yêu cầu chỉnh cách trình bày để tài liệu phản ánh công việc chung của nhóm Tomorrow, đồng thời chọn một hướng Next Change cụ thể để kiểm tra tiếp.

Prototype A/B/C là sản phẩm dùng chung. Phần xác định option tôi chịu trách nhiệm chính dựng và công việc hỗ trợ đồng đội chưa có thông tin phân công để điền.

## 5. Dữ liệu kiểm thử và bài học

- [prototype-feedback-note.md](prototype-feedback-note.md): khung ghi phiên cá nhân A–B–C và bảy hành vi cần quan sát.
- [group-feedback-synthesis.md](group-feedback-synthesis.md): tổng hợp ba Practice Notes Day 17, các giả thuyết rút ra và ma trận chờ dữ liệu test A/B/C.
- **Next Change dự kiến:** thêm lựa chọn “Hướng dẫn từng bước” từ màn review diff C sang B, giữ cùng code/task. Dựa trên hướng C + B trong thiết kế chung, thu hẹp thành một thay đổi để kiểm tra; chưa coi là kết quả test.
- **Still Unproven:** hoàn thành nhiệm vụ, khả năng phát hiện bản vá sai, nhu cầu dùng lại, hiệu quả học và retention đều chưa được xác minh bằng tester thực tế.

## 6. AI Support Log

Codex đọc repo nguồn, đối chiếu VLearn, tổng hợp ba notes Day 17 và chuẩn hóa sáu tệp. Nhật ký chi tiết ở [ai-support-log.md](ai-support-log.md).

## Kiểm tra theo rubric

| Gate | Trạng thái của bộ bài này |
|---|---|
| Evidence Continuity | Có nguồn Day 17 và hypothesis năm thành tố; hậu quả vẫn là giả thuyết |
| Meaningful Options | Có ba cơ chế khác nhau trên cùng task |
| Human Control | Bảng thiết kế đủ bốn trụ cột; mã prototype có các điều khiển duyệt, sửa, dừng và phục hồi |
| Test-ready | Link công khai hoạt động; A/B/C dùng chung task và dữ liệu mẫu. Chưa xác minh khả năng tự hoàn thành của người dùng ngoài nhóm |
| Learning, Not Praise | Có tổng hợp Day 17; ma trận feedback A/B/C chờ ba phiên kiểm thử |


