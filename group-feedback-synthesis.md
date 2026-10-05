# Group Feedback Synthesis — Tomorrow

## 1. Tổng hợp dữ liệu đầu vào Day 17

Nguồn: [ba Practice Notes của nhóm](https://github.com/dinhtruongan/Track1_Day17_2A202602393_DinhTruongAn/blob/main/README.md) và các bản notes/plan thành viên đã cung cấp. Bộ thiết kế A/B/C dùng chung tại [kho làm việc Tomorrow](https://github.com/elysszxje/Track1_Day19_2A202602695_TranPhamThaiVu/tree/338de81e5b4fd0bbd9ee485593db036b905b5c72).

| Note | Dữ kiện tự thuật đã có | Diễn giải dùng để thiết kế | Điều còn chưa biết |
|---|---|---|---|
| An-HV-A01 | Ghi chú từ khóa lạ, xem video lại, tra Google/AI; Phase 1 tốn thêm thời gian vì thuật ngữ mới | Hỗ trợ liên quan trực tiếp nội dung bài có thể hữu ích | Chưa có episode/time rõ; độ quen kiến thức có thể là nguyên nhân chính |
| Vu-P01 | Chưa biết quy trình deploy; hỏi AI từng bước, đối chiếu docs, hỏi bạn; kết quả deploy được | Nên kiểm tra trợ giúp theo bước và khả năng xem nguồn ngay trong task | Workaround có thể đã đủ tốt; chưa biết chi phí/hậu quả |
| Tai-RAG | Record kể tìm Google/Medium, hỏi ChatGPT và xem slide khi vướng Re-ranking; gọi tên được điểm vướng | Có thể cần giải thích gắn với task thay vì chẩn đoán lại từ đầu | Chưa đối chiếu audio; số liệu 45 phút và lời “mất cả buổi tối” chưa nhất quán |

## 2. Pattern và các nhánh cạnh tranh

Cả ba note kể tìm trợ giúp khi tự học; đây là điểm chung về hành vi. Bối cảnh PM, deploy và RAG khác nhau nên không kết luận cùng một nguyên nhân hoặc mức độ pain.

- **Nhánh ngữ cảnh/workaround:** học viên phải ghép nhiều nguồn để giải quyết điểm vướng.
- **Nhánh kiến thức nền:** công sức tăng vì chưa quen khái niệm hoặc kỹ năng.
- **Nhánh quy trình:** người học cần các bước cụ thể cho công cụ/tác vụ mới.

Notes Vũ tạo điểm tựa cho fixture deploy. Notes An và Tài giúp giữ trọng tâm hiểu bài và bối cảnh trợ giúp. Lỗi Cloud Run, diff và số confidence là dữ liệu mẫu của prototype; không lấy từ sự kiện phỏng vấn này.

## 3. Cách ba option kiểm tra cùng hypothesis

A cho người học tự tra cứu và sửa; B chia quy trình thành bước có duyệt; C tạo diff để người học review. Cùng task và fixture để quan sát công sức, mức hiểu và khả năng phục hồi khi đề xuất sai. Không đổi sang ba vấn đề rời rạc.

## 4. Ma trận feedback prototype — chờ dữ liệu phiên test

| Phiên | Thứ tự dự kiến | First action / hesitation | Evidence / misunderstanding | Help / recovery | Lựa chọn và trade-off |
|---|---|---|---|---|---|
| An điều phối | A–B–C | — | — | — | — |
| Vũ điều phối | B–C–A | — | — | — | — |
| Tài điều phối | C–A–B | — | — | — | — |

Tài liệu mô phỏng của nhóm có một bảng được ghi là “Simulated Field Testing Dataset”; các event, tên tester và quote từ bảng đó chưa được dùng làm dữ kiện trong bản này. Khi có notes thực tế, điền ma trận trên và nêu nguồn từng phiên.

## 5. Next Change

**Hướng kiểm tra xuất phát từ Day 17:** cho người học xem hướng dẫn và nguồn ngay trong ngữ cảnh task, giảm công ghép tài liệu, giữ quyền duyệt.

**Next Change chọn cho vòng thiết kế tiếp theo:** thêm một lựa chọn “Hướng dẫn từng bước” ngay tại màn review diff của C, chuyển sang luồng B và giữ nguyên code/task hiện tại. Người học có thể chọn xem bản vá nhanh hoặc hiểu từng bước trước khi duyệt.

Quyết định này cụ thể hóa hướng kết hợp C + B trong [bản tổng hợp chung](https://github.com/elysszxje/Track1_Day19_2A202602695_TranPhamThaiVu/blob/338de81e5b4fd0bbd9ee485593db036b905b5c72/group-feedback-synthesis.md), thu hẹp thành đúng một thay đổi có thể kiểm tra. Day 17 cho thấy nhu cầu tìm hướng dẫn và đối chiếu; chưa cho biết người học thích luồng nhanh hay luồng từng bước. Đây là quyết định thiết kế dự kiến, chưa phải kết luận từ ba phiên test thực tế.

**Tiêu chí kiểm tra:** quan sát người học có tự tìm được đường chuyển C → B khi chưa hiểu diff, có tiếp tục cùng task mà không cần người điều phối chỉ dẫn, và có giải thích được lý do sửa PORT/host sau khi hoàn thành hay không. Giữ A làm phương án đối chiếu; chưa loại A chỉ dựa trên dữ liệu mô phỏng.

### Các tình huống cần kiểm tra từ bảng mô phỏng

| Tín hiệu thiết kế | Cách dùng trong vòng tiếp theo |
|---|---|
| B tạo cảm giác kiểm soát nhờ duyệt từng bước | Quan sát hành vi duyệt/sửa/skip; hỏi lý do, không mặc định B thắng |
| C hấp dẫn vì nhanh nhưng bản vá sai cần recovery | Đưa cùng một tình huống đề xuất sai vào test và ghi reject/customize/rollback |
| A có thể tốn công tự tổng hợp | So sánh thao tác và mức hiểu trên cùng task, giữ A làm đối chứng |
| Thứ tự trải nghiệm có thể ảnh hưởng lựa chọn | Xoay vòng A–B–C, B–C–A, C–A–B; ghi nhận ảnh hưởng học lại |

Các nội dung này là tín hiệu từ bộ mô phỏng được tài liệu chung mô tả, không chuyển thành số đo, quote hay kết quả phiên cá nhân của An.

## 6. Still Unproven

Chưa biết nhu cầu so với workaround đang dùng, task completion và thời gian A/B/C, mức hiểu/nhớ kiến thức, khả năng nhận ra bản vá sai hoặc ảnh hưởng thứ tự. Ba phiên ngắn sau này cũng chỉ giúp chỉnh interaction, không đủ chứng minh giá trị thị trường.

