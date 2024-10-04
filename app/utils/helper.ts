export const calculateOverdueFee = (borrowDate: Date, dueDate: Date): number => {
    const now = new Date();
    const overdueDays = Math.ceil((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
  
    if (overdueDays <= 0) {
      return 0; // No fee if returned on or before due date
    }
  
    // Calculate fee logic (example: $1 per day overdue)
    const fee = overdueDays * 1.00; // Adjust calculation method as per your fee structure
  
    return fee;
  };