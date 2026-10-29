function PriorityBadge({ priority }) {
  const normalizedPriority = priority?.toLowerCase();

  if (normalizedPriority === 'urgent') {
    return <span className="priority-urgent">เร่งด่วน</span>;
  }

  if (normalizedPriority === 'normal') {
    return <span className="priority-normal">ปกติ</span>;
  }

  // CP-B4.2: Edge Case กรณีเป็นค่าอื่น หรือไม่มีค่าส่งมา
  return <span className="priority-unknown">ไม่ระบุ</span>;
}

export default PriorityBadge;