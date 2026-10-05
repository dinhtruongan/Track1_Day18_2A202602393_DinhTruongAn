# Three-option Design Sheet — Tomorrow

Tài liệu thiết kế chung của nhóm Tomorrow: Đinh Trường An, Trần Phạm Thái Vũ và Hoàng Anh Tài. Ba phương án cùng giải một tình huống học tập, khác nhau về cơ chế trợ giúp và quyền quyết định giữa người học với AI.

## 1. Evidence Snapshot từ Day 17

| Nguồn | Dữ kiện tự thuật | Diễn giải có thể có | Giới hạn |
|---|---|---|---|
| An-HV-A01 — [notes cá nhân](https://github.com/dinhtruongan/Track1_Day17_2A202602393_DinhTruongAn/blob/main/interview/notes.md) | Ghi chú từ khóa, xem lại video, tra Google/AI; Phase 1 nhiều thuật ngữ lạ hơn Phase 2 | Độ quen kiến thức có thể ảnh hưởng công sức tra cứu | Chưa có episode đủ chi tiết hay số phút |
| Vu-P01 — notes do Vũ cung cấp; cũng được mô tả trong kho tài liệu chung | Hỏi AI hướng dẫn deploy, đối chiếu tài liệu, hỏi bạn; kết quả deploy được | Có nhu cầu hiểu quy trình và kiểm tra hướng dẫn | Chưa đo thời gian, lỗi, hậu quả; không chứng minh workaround kém hiệu quả |
| Tai-RAG — record trong `Day17-Team-Plan (1).md` đã được nhóm cung cấp; [tổng hợp Day 17](https://github.com/dinhtruongan/Track1_Day17_2A202602393_DinhTruongAn/blob/main/README.md#4-ba-practice-notes-của-nhóm) | Người học nêu được điểm vướng Re-ranking; tìm Google/Medium, hỏi ChatGPT rồi xem slide. Record ghi khoảng 45 phút và nộp muộn | Có tín hiệu về nhiều bước tìm trợ giúp; khả năng gọi tên điểm vướng làm yếu A trong ca này | Audio không đi kèm; record 45 phút và quote “mất cả buổi tối” chưa nhất quán. Repo Vũ còn mô tả một ca GenAI khác, chưa có transcript gốc ở repo này để đối chiếu |

**Hypothesis:** Khi tự làm bài kỹ thuật và gặp bước/lỗi chưa hiểu, học viên muốn hoàn thành và hiểu bài, nhưng phải ghép nhiều nguồn chưa gắn đủ với task, có thể tăng công đối chiếu và gián đoạn tiến độ. Không kết luận đã bác bỏ thiếu kiến thức nền hoặc xác nhận pain B.

**Ẩn số:** họ đổi nguồn vì hướng dẫn sai, thiếu ngữ cảnh, chưa biết quy trình hay chỉ đang kiểm tra thông thường? Công sức có đủ lớn để đáng giải? Hướng dẫn sẵn có đã đủ tốt chưa?

**Điều có thể làm giả thuyết yếu đi:** người học hoàn thành và giải thích được bài bằng tài liệu hiện có với ít công sức; việc đối chiếu nhiều nguồn là lựa chọn học chủ động, không gây gián đoạn đáng kể; hoặc khó khăn chủ yếu do thiếu kiến thức tiên quyết thay vì thiếu ngữ cảnh trợ giúp.

### Bối cảnh bổ sung: tự học video GenAI

Evidence Snapshot chung còn mô tả ca `Tai-P-01`: người học xem video GenAI/Deep Learning, chụp slide, lưu Notion rồi gửi ChatGPT. Theo bản tổng hợp đó, người học nhận xét câu trả lời chỉ theo slide, thiếu mạch video. Đây là dữ kiện được dẫn lại từ tài liệu chung, khác ca Tai-RAG đã cung cấp trước đó; không cộng hai ca thành hai người tham gia độc lập hoặc gộp thời lượng của chúng.

Ca này bổ sung một cách giải thích cho barrier: trợ giúp có thể thiếu ngữ cảnh của toàn bài. Mong muốn có recap video được giữ trong Solution Parking Lot, chưa dùng để kết luận người học cần một feature cụ thể. Transcript được kho tài liệu chung dẫn qua thư mục đồng cấp chưa có trong bộ bài này.

### Kế thừa Solution Parking Lot

| Hướng Day 17 | Cách dùng khi phân kỳ A/B/C |
|---|---|
| Diagnostic refresher | B giữ phần hỏi chẩn đoán và hướng dẫn theo bước |
| Bản đồ kiến thức tiên quyết | A dùng hướng tự xem tài liệu/điểm cần kiểm tra |
| Glossary trong bài | A giữ tra cứu khái niệm theo ngữ cảnh |
| Explainer theo nội dung bài/code | B giải thích từng bước; C đề xuất diff dựa trên fixture |
| Checkpoint quiz | Giữ trong parking lot; chưa thêm vào ba luồng để tránh mở rộng phạm vi |

Cloud Run là fixture kỹ thuật cụ thể từ bộ prototype chung để kiểm tra cơ chế trợ giúp; không phải lỗi đã quan sát trong cả ba notes Day 17. Các note PM/RAG giúp giữ bối cảnh học tập và giả thuyết trợ giúp theo ngữ cảnh.

## 2. Comparison Contract

- Cùng actor: người học có nền JS cơ bản, đang làm bài deploy.
- Cùng task: nhận ra và xử lý lỗi port/host của Express trên Cloud Run.
- Cùng fixture: code ban đầu hardcode `PORT = 3000`, bind `localhost`; cùng terminal log mô phỏng và tài liệu tham chiếu.
- Cùng đích: chọn/sửa mã, kiểm tra kết quả trên prototype, giải thích lý do sửa. Không đổi task giữa A/B/C.
- Common context/content giữ phần lớn màn bối cảnh, editor, dữ liệu và nút kiểm tra giống nhau; “70%” là cam kết phạm vi thiết kế, không phải số đo thống kê.
- Khác tại critical interaction: tự sửa từ checklist (A), duyệt từng bước (B), duyệt cả diff (C).
- Mỗi option bắt đầu từ trạng thái sạch, không kế thừa mã đã sửa ở option trước. Thứ tự xoay vòng giúp phân bổ ảnh hưởng thứ tự, không loại bỏ hoàn toàn hiệu ứng học lại cùng lỗi.

Fixture Cloud Run là bài tập tổng hợp từ kho tài liệu chung, không phải lỗi đã quan sát ở Vu-P01. Với Cloud Run service, ingress cần nghe trên `0.0.0.0` và cổng nền tảng cung cấp qua `PORT`; mặc định 8080, có thể cấu hình khác. [Container runtime contract](https://docs.cloud.google.com/run/docs/container-contract#port).

## 3. Options và Distance Check

| Option | Khởi phát | Quy trình | Quyết định cuối | Recovery |
|---|---|---|---|---|
| A | Người học mở checklist/tra cứu | Đọc nguồn, tự kết nối nguyên nhân và tự sửa editor | Người học | Sửa lại; khôi phục code/checklist |
| B | Người học yêu cầu hướng dẫn | Câu chẩn đoán → PORT → host → Dockerfile; sửa/duyệt từng bước | Người học ở mỗi bước | Skip, Back, Stop/Resume, hướng khác |
| C | Khi mở tab mô phỏng phát hiện lỗi | Xem diff → duyệt/chỉnh/bác bỏ → kiểm tra | Người học duyệt cả bản vá | Reject, Customize, Rollback, Report Wrong |

A–B khác vì B chia cấu trúc quyết định và có bước duyệt; A–C khác vì C tạo bản vá chủ động còn A yêu cầu tự sửa; B–C khác vì B duyệt từng phần còn C duyệt bản vá tổng thể. Đây là khác biệt cơ chế, không phải đổi màu/wording.

## 4. Human–AI Decision Table

| Trụ cột | A | B | C |
|---|---|---|---|
| Expectation | Checklist/tra cứu có sẵn, không tự sửa | Một câu chẩn đoán và ba bước, mỗi bước cần duyệt | Bản vá đề xuất, chưa áp dụng vào mã |
| Role & Agency | Người tự tìm và sửa; hệ thống trả canned result | Hệ thống tổ chức bước; người sửa/duyệt/skip | Hệ thống tạo diff; người apply/customize/reject |
| Evidence & Uncertainty | Link docs; query ngoài fixture báo không tìm thấy | Trích dẫn theo bước; giải thích phù hợp câu chẩn đoán | Docs cạnh diff; 92%/45% là giả lập, không dùng như xác suất đúng |
| Control & Recovery | Reset, sửa editor, khôi phục mã | Back, skip, stop/resume; không tự chèn khi chưa duyệt | Reject khóa đề xuất; rollback; customize; report lưu cục bộ |

## 5. Test Prompt

**Context question (tối đa hai phút):** “Gần đây bạn có từng gặp khó khăn khi làm một bước deploy hoặc sửa lỗi bài tập kỹ thuật không? Kể ngắn lần đó.”

**Outcome task:** “Trên màn hình là một bài deploy gặp lỗi. Với mỗi phương án, hãy tìm nguyên nhân, chọn cách sửa và kiểm tra kết quả. Sau đó giải thích cách sửa bạn chọn.”

Không hướng dẫn tên nút hoặc bấm hộ. Khi kẹt: “Bạn đang dự định làm gì tiếp theo?” Sau ba option: “Mỗi cách giúp hoặc làm khó bạn ở đâu? Bạn chọn cách nào và chấp nhận đánh đổi gì?”

Ghi bảy hành vi: first action, hesitation, đọc/bỏ qua evidence, misunderstanding, help needed, correction/recovery, selected option/trade-off. Dữ liệu AI trả lời trong prototype là canned output; dữ liệu tester cần thu thật, không suy ra từ code.


## Nguồn tài liệu nhóm

[Kho thiết kế chung Tomorrow — bản lưu do Trần Phạm Thái Vũ quản lý](https://github.com/elysszxje/Track1_Day19_2A202602695_TranPhamThaiVu/tree/338de81e5b4fd0bbd9ee485593db036b905b5c72). Evidence Day 17 và giới hạn từng record được ghi tại mục 1.

