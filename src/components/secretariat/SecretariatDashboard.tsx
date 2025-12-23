import React, { useState } from 'react';
import { IncomingMail, OutgoingMail, MeetingMinute } from '../../types';
import { IncomingMailForm } from './IncomingMailForm';
import { OutgoingMailForm } from './OutgoingMailForm';
import { MeetingMinutesForm } from './MeetingMinutesForm';
import { FileText, Send, Inbox, Users, Plus, Search, Calendar, Paperclip, MoreVertical } from 'lucide-react';

export const SecretariatDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing' | 'meetings'>('incoming');
    const [searchTerm, setSearchTerm] = useState('');

    // Modal States
    const [showIncomingForm, setShowIncomingForm] = useState(false);
    const [showOutgoingForm, setShowOutgoingForm] = useState(false);
    const [showMeetingForm, setShowMeetingForm] = useState(false);

    // Mock Data
    const [incomingMail, setIncomingMail] = useState<IncomingMail[]>([
        {
            id: '1',
            date: '2024-03-10',
            subject: 'تعميم بخصوص إجازة عيد الفطر',
            sender: 'وزارة الموارد البشرية',
            receiverDept: 'director',
            letterNumber: 'HR-2024-105',
            priority: 'normal',
            status: 'pending',
            notes: 'للاطلاع والتعميم'
        },
        {
            id: '2',
            date: '2024-03-12',
            subject: 'طلب تقرير طبي للمستفيد أحمد',
            sender: 'مستشفى الملك فهد',
            receiverDept: 'medical',
            letterNumber: 'MED-992',
            priority: 'urgent',
            status: 'processed'
        }
    ]);

    const [outgoingMail, setOutgoingMail] = useState<OutgoingMail[]>([
        {
            id: '1',
            date: '2024-03-11',
            subject: 'الرفع باحتياجات المركز للربع الثاني',
            destination: 'الإدارة العامة بمنطقة الرياض',
            senderDept: 'director',
            letterNumber: 'CEN-2024-55',
            priority: 'normal',
            status: 'sent'
        }
    ]);

    const [meetings, setMeetings] = useState<MeetingMinute[]>([
        {
            id: '1',
            date: '2024-03-01',
            time: '10:00',
            location: 'قاعة الاجتماعات الرئيسية',
            attendees: ['المدير العام', 'رئيس القسم الطبي', 'رئيس الخدمة الاجتماعية'],
            agenda: 'مناقشة خطة قبول المستفيدين الجدد',
            decisions: 'تمت الموافقة على قبول 5 حالات جديدة',
            actionItems: [
                { task: 'إعداد ملفات الحالات الجديدة', assignee: 'رئيس الخدمة الاجتماعية', dueDate: '2024-03-15', status: 'pending' },
                { task: 'تجهيز الأسرة', assignee: 'مشرف السكن', dueDate: '2024-03-14', status: 'completed' }
            ]
        }
    ]);

    // Handlers
    const handleIncomingSubmit = (data: Omit<IncomingMail, 'id' | 'status'>) => {
        const newItem: IncomingMail = {
            ...data,
            id: Math.random().toString(36).substr(2, 9),
            status: 'pending'
        };
        setIncomingMail([newItem, ...incomingMail]);
        setShowIncomingForm(false);
    };

    const handleOutgoingSubmit = (data: Omit<OutgoingMail, 'id' | 'status'>) => {
        const newItem: OutgoingMail = {
            ...data,
            id: Math.random().toString(36).substr(2, 9),
            status: 'draft'
        };
        setOutgoingMail([newItem, ...outgoingMail]);
        setShowOutgoingForm(false);
    };

    const handleMeetingSubmit = (data: Omit<MeetingMinute, 'id'>) => {
        const newItem: MeetingMinute = {
            ...data,
            id: Math.random().toString(36).substr(2, 9)
        };
        setMeetings([newItem, ...meetings]);
        setShowMeetingForm(false);
    };

    const renderIncomingTable = () => (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التاريخ</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم الخطاب</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الجهة المرسلة</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الموضوع</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الأهمية</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {incomingMail
                        .filter(item => item.subject.includes(searchTerm) || item.letterNumber.includes(searchTerm))
                        .map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.letterNumber}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.sender}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{item.subject}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${item.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                                            item.priority === 'top_urgent' ? 'bg-red-200 text-red-900' :
                                                'bg-green-100 text-green-800'}`}>
                                        {item.priority === 'urgent' ? 'عاجل' : item.priority === 'top_urgent' ? 'عاجل جداً' : 'عادي'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${item.status === 'processed' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {item.status === 'processed' ? 'تمت المعالجة' : 'قيد الانتظار'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <button className="text-blue-600 hover:text-blue-900"><MoreVertical size={18} /></button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );

    const renderOutgoingTable = () => (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التاريخ</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الجهة المرسل إليها</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الموضوع</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">القسم المرسل</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الأهمية</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {outgoingMail.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.destination}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{item.subject}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.senderDept}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${item.priority === 'urgent' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                    {item.priority === 'urgent' ? 'عاجل' : 'عادي'}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${item.status === 'sent' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {item.status === 'sent' ? 'تم الإرسال' : 'مسودة'}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderMeetingsTable = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meetings.map((meeting) => (
                <div key={meeting.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center text-gray-600">
                            <Calendar size={18} className="ml-2" />
                            <span className="text-sm font-medium">{meeting.date} | {meeting.time}</span>
                        </div>
                        <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {meeting.location}
                        </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2" title={meeting.agenda}>
                        {meeting.agenda.split('\n')[0]}...
                    </h3>

                    <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-1">قرارات:</p>
                        <p className="text-sm text-gray-800 line-clamp-2">{meeting.decisions}</p>
                    </div>

                    <div className="border-t pt-4">
                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">المهام ({meeting.actionItems.length})</h4>
                        <ul className="space-y-2">
                            {meeting.actionItems.slice(0, 2).map((task, idx) => (
                                <li key={idx} className="flex justify-between items-center text-sm">
                                    <span className="truncate flex-1 ml-2">{task.task}</span>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${task.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {task.status === 'completed' ? 'منجز' : 'قيد التنفيذ'}
                                    </span>
                                </li>
                            ))}
                            {meeting.actionItems.length > 2 && (
                                <li className="text-xs text-blue-600 text-center cursor-pointer">
                                    +{meeting.actionItems.length - 2} مهام إضافية
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">السكرتارية الإدارية</h1>
                    <p className="text-gray-500 mt-1">تتبع المراسلات والاجتماعات الإدارية</p>
                </div>

                <button
                    onClick={() => {
                        if (activeTab === 'incoming') setShowIncomingForm(true);
                        else if (activeTab === 'outgoing') setShowOutgoingForm(true);
                        else setShowMeetingForm(true);
                    }}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <Plus size={20} className="ml-2" />
                    {activeTab === 'incoming' ? 'تسجيل وارد جديد' :
                        activeTab === 'outgoing' ? 'تسجيل صادر جديد' : 'تسجيل محضر اجتماع'}
                </button>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg p-1 shadow-sm inline-flex">
                <button
                    onClick={() => setActiveTab('incoming')}
                    className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'incoming' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                        }`}
                >
                    <Inbox size={18} className="ml-2" />
                    البريد الوارد
                </button>
                <button
                    onClick={() => setActiveTab('outgoing')}
                    className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'outgoing' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                        }`}
                >
                    <Send size={18} className="ml-2" />
                    البريد الصادر
                </button>
                <button
                    onClick={() => setActiveTab('meetings')}
                    className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'meetings' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                        }`}
                >
                    <Users size={18} className="ml-2" />
                    الاجتماعات والمحاضر
                </button>
            </div>

            {/* Search Filter - Optional global filter */}
            <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="بحث في السجلات..."
                    className="w-full pl-4 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Content */}
            <div className="min-h-[500px]">
                {activeTab === 'incoming' && renderIncomingTable()}
                {activeTab === 'outgoing' && renderOutgoingTable()}
                {activeTab === 'meetings' && renderMeetingsTable()}
            </div>

            {/* Modals */}
            {showIncomingForm && (
                <IncomingMailForm
                    onClose={() => setShowIncomingForm(false)}
                    onSubmit={handleIncomingSubmit}
                />
            )}
            {showOutgoingForm && (
                <OutgoingMailForm
                    onClose={() => setShowOutgoingForm(false)}
                    onSubmit={handleOutgoingSubmit}
                />
            )}
            {showMeetingForm && (
                <MeetingMinutesForm
                    onClose={() => setShowMeetingForm(false)}
                    onSubmit={handleMeetingSubmit}
                />
            )}
        </div>
    );
};
