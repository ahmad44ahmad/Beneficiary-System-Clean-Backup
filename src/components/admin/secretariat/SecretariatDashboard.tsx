import React, { useState } from 'react';
import { incomingMail as initialIncoming, outgoingMail as initialOutgoing, meetingMinutes as initialMinutes } from '../../../data/secretariat';
import { IncomingMail, OutgoingMail, MeetingMinute } from '../../../types';
import { IncomingMailForm } from './IncomingMailForm';
import { OutgoingMailForm } from './OutgoingMailForm';
import { MeetingMinutesForm } from './MeetingMinutesForm';
import { FileText, Send, Network, Plus, Search, Filter } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';

export const SecretariatDashboard = () => {
    const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing' | 'meetings'>('incoming');

    // State
    const [incomingData, setIncomingData] = useState<IncomingMail[]>(initialIncoming);
    const [outgoingData, setOutgoingData] = useState<OutgoingMail[]>(initialOutgoing);
    const [minutesData, setMinutesData] = useState<MeetingMinute[]>(initialMinutes);

    // Modal State
    const [showIncomingForm, setShowIncomingForm] = useState(false);
    const [showOutgoingForm, setShowOutgoingForm] = useState(false);
    const [showMeetingForm, setShowMeetingForm] = useState(false);

    return (
        <div className="space-y-6 p-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">السكرتارية والاتصالات الإدارية</h1>
                    <p className="text-gray-500">إدارة الصادر والوارد ومحاضر الاجتماعات</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b">
                <button
                    onClick={() => setActiveTab('incoming')}
                    className={`pb-3 px-4 flex items-center gap-2 transition-colors border-b-2 ${activeTab === 'incoming'
                            ? 'border-primary-600 text-primary-600 font-semibold'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <FileText className="w-5 h-5" />
                    الوارد
                </button>
                <button
                    onClick={() => setActiveTab('outgoing')}
                    className={`pb-3 px-4 flex items-center gap-2 transition-colors border-b-2 ${activeTab === 'outgoing'
                            ? 'border-green-600 text-green-600 font-semibold'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Send className="w-5 h-5 transform -rotate-45" />
                    الصادر
                </button>
                <button
                    onClick={() => setActiveTab('meetings')}
                    className={`pb-3 px-4 flex items-center gap-2 transition-colors border-b-2 ${activeTab === 'meetings'
                            ? 'border-purple-600 text-purple-600 font-semibold'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Network className="w-5 h-5" />
                    الاجتماعات
                </button>
            </div>

            {/* Content Area */}
            <div className="min-h-[500px]">
                {/* Incoming Mail Tab */}
                {activeTab === 'incoming' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                            <div className="flex gap-3 w-1/2">
                                <div className="relative w-full">
                                    <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
                                    <input type="text" placeholder="بحث في الوارد..." className="w-full pr-10 pl-4 py-2 border rounded-md text-sm" />
                                </div>
                                <Button variant="outline"><Filter className="w-4 h-4" /></Button>
                            </div>
                            <Button onClick={() => setShowIncomingForm(true)}>
                                <Plus className="w-4 h-4 ml-2" />
                                وارد جديد
                            </Button>
                        </div>

                        <Card>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-right">
                                    <thead className="bg-gray-50 text-gray-600 font-medium">
                                        <tr>
                                            <th className="p-4">رقم القيد</th>
                                            <th className="p-4">التاريخ</th>
                                            <th className="p-4">الموضوع</th>
                                            <th className="p-4">الجهة المرسلة</th>
                                            <th className="p-4">الإدارة المستلمة</th>
                                            <th className="p-4">الأهمية</th>
                                            <th className="p-4">الحالة</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {incomingData.map(mail => (
                                            <tr key={mail.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="p-4 font-mono text-gray-500">{mail.letterNumber}</td>
                                                <td className="p-4">{mail.date}</td>
                                                <td className="p-4 font-medium text-gray-900">{mail.subject}</td>
                                                <td className="p-4">{mail.sender}</td>
                                                <td className="p-4">{mail.receiverDept}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-xs ${mail.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                                                            mail.priority === 'top_urgent' ? 'bg-red-900 text-white' : 'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {mail.priority === 'normal' ? 'عادي' : mail.priority === 'urgent' ? 'عاجل' : 'عاجل جداً'}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-xs ${mail.status === 'processed' ? 'bg-green-100 text-green-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {mail.status === 'processed' ? 'تم التوجيه' : 'قيد الإجراء'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Outgoing Mail Tab */}
                {activeTab === 'outgoing' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                            <div className="flex gap-3 w-1/2">
                                <div className="relative w-full">
                                    <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
                                    <input type="text" placeholder="بحث في الصادر..." className="w-full pr-10 pl-4 py-2 border rounded-md text-sm" />
                                </div>
                                <Button variant="outline"><Filter className="w-4 h-4" /></Button>
                            </div>
                            <Button onClick={() => setShowOutgoingForm(true)} className="bg-green-600 hover:bg-green-700">
                                <Plus className="w-4 h-4 ml-2" />
                                صادر جديد
                            </Button>
                        </div>
                        <Card>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-right">
                                    <thead className="bg-gray-50 text-gray-600 font-medium">
                                        <tr>
                                            <th className="p-4">رقم القيد</th>
                                            <th className="p-4">التاريخ</th>
                                            <th className="p-4">الموضوع</th>
                                            <th className="p-4">الإدارة المصدرة</th>
                                            <th className="p-4">الوجهة</th>
                                            <th className="p-4">الحالة</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {outgoingData.map(mail => (
                                            <tr key={mail.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="p-4 font-mono text-gray-500">{mail.letterNumber}</td>
                                                <td className="p-4">{mail.date}</td>
                                                <td className="p-4 font-medium text-gray-900">{mail.subject}</td>
                                                <td className="p-4">{mail.senderDept}</td>
                                                <td className="p-4">{mail.destination}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-xs ${mail.status === 'sent' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {mail.status === 'sent' ? 'تم الإرسال' : 'مسودة'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Meetings Tab */}
                {activeTab === 'meetings' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                            <div className="flex gap-3 w-1/2">
                                <div className="relative w-full">
                                    <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
                                    <input type="text" placeholder="بحث في الاجتماعات..." className="w-full pr-10 pl-4 py-2 border rounded-md text-sm" />
                                </div>
                            </div>
                            <Button onClick={() => setShowMeetingForm(true)} className="bg-purple-600 hover:bg-purple-700">
                                <Plus className="w-4 h-4 ml-2" />
                                اجتماع جديد
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {minutesData.map(minute => (
                                <Card key={minute.id} className="p-5 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900">محضر اجتماع</h3>
                                            <p className="text-gray-500 text-sm">{minute.date} | {minute.time}</p>
                                        </div>
                                        <div className="bg-purple-100 p-2 rounded-lg">
                                            <Network className="w-5 h-5 text-purple-600" />
                                        </div>
                                    </div>

                                    <div className="space-y-3 text-sm">
                                        <div>
                                            <p className="text-gray-500 text-xs">المكان</p>
                                            <p className="font-medium">{minute.location}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-xs">جدول الأعمال</p>
                                            <p className="line-clamp-2">{minute.agenda}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-xs mb-1">الحضور ({minute.attendees.length})</p>
                                            <div className="flex -space-x-2 space-x-reverse overflow-hidden">
                                                {minute.attendees.slice(0, 5).map((att, i) => (
                                                    <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-600" title={att}>
                                                        {att.charAt(0)}
                                                    </div>
                                                ))}
                                                {minute.attendees.length > 5 && (
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] text-gray-500">
                                                        +{minute.attendees.length - 5}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t flex justify-between items-center">
                                        <span className="text-xs text-gray-500">{minute.actionItems?.length || 0} مهام متابعة</span>
                                        <button className="text-purple-600 text-sm hover:underline">عرض التفاصيل</button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {showIncomingForm && (
                <IncomingMailForm
                    onSave={(mail) => {
                        setIncomingData(prev => [mail, ...prev]);
                        setShowIncomingForm(false);
                    }}
                    onCancel={() => setShowIncomingForm(false)}
                />
            )}

            {showOutgoingForm && (
                <OutgoingMailForm
                    onSave={(mail) => {
                        setOutgoingData(prev => [mail, ...prev]);
                        setShowOutgoingForm(false);
                    }}
                    onCancel={() => setShowOutgoingForm(false)}
                />
            )}

            {showMeetingForm && (
                <MeetingMinutesForm
                    onSave={(minute) => {
                        setMinutesData(prev => [minute, ...prev]);
                        setShowMeetingForm(false);
                    }}
                    onCancel={() => setShowMeetingForm(false)}
                />
            )}
        </div>
    );
};
