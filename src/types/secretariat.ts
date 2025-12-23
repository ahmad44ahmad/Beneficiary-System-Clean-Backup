export interface IncomingMail {
    id: string;
    date: string; // Date received
    subject: string;
    sender: string; // Source (e.g., Ministry branch)
    receiverDept: string; // Internal destination
    letterNumber: string; // External ref number
    priority: 'normal' | 'urgent' | 'top_urgent';
    status: 'pending' | 'processed' | 'archived';
    attachmentUrl?: string;
    notes?: string;
}

export interface OutgoingMail {
    id: string;
    date: string; // Date sent
    subject: string;
    destination: string; // External destination
    senderDept: string; // Internal source
    letterNumber: string; // Internal ref number
    priority: 'normal' | 'urgent';
    status: 'draft' | 'sent' | 'archived';
    attachmentUrl?: string;
    notes?: string;
}

export interface MeetingMinute {
    id: string;
    date: string;
    time: string;
    location: string;
    attendees: string[]; // List of names
    agenda: string;
    decisions: string;
    actionItems: {
        task: string;
        assignee: string;
        dueDate: string;
        status: 'pending' | 'completed';
    }[];
}
