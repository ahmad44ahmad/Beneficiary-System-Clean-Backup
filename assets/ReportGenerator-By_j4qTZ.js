import{k as p,r as d,j as e,p as g,F as n,b as x,x as m,l as b,n as h,$ as u,a0 as v,E as f,a1 as y,G as j}from"./index-BOMQ6ZnB.js";const w=[{id:"beneficiary_summary",title:"تقرير ملخص المستفيد",description:"ملخص شامل لحالة المستفيد والأهداف والتقدم",icon:b,color:"blue"},{id:"ipc_compliance",title:"تقرير الامتثال IPC",description:"تقرير مكافحة العدوى والتفتيشات الأسبوعية",icon:h,color:"green"},{id:"empowerment_progress",title:"تقرير التمكين والأهداف",description:"تفاصيل الأهداف التأهيلية ونسب الإنجاز",icon:n,color:"purple"},{id:"monthly_center",title:"التقرير الشهري للمركز",description:"إحصائيات شاملة للمركز والخدمات المقدمة",icon:u,color:"teal"}],N=({report:a,onGenerate:r,generating:l})=>{const i=a.icon,o={blue:{bg:"bg-blue-50",icon:"text-blue-600",button:"bg-blue-600 hover:bg-blue-700"},green:{bg:"bg-green-50",icon:"text-green-600",button:"bg-green-600 hover:bg-green-700"},purple:{bg:"bg-purple-50",icon:"text-purple-600",button:"bg-purple-600 hover:bg-purple-700"},teal:{bg:"bg-teal-50",icon:"text-teal-600",button:"bg-teal-600 hover:bg-teal-700"}},t=o[a.color]||o.blue;return e.jsx("div",{className:`${t.bg} rounded-2xl p-5 hover-lift transition-all`,children:e.jsxs("div",{className:"flex items-start gap-4",children:[e.jsx("div",{className:"p-3 bg-white rounded-xl shadow-sm",children:e.jsx(i,{className:`w-6 h-6 ${t.icon}`})}),e.jsxs("div",{className:"flex-1",children:[e.jsx("h3",{className:"font-bold text-gray-800 mb-1",children:a.title}),e.jsx("p",{className:"text-sm text-gray-600 mb-4",children:a.description}),e.jsxs("div",{className:"flex gap-2",children:[e.jsxs("button",{onClick:()=>r(a.id),disabled:l,className:`flex-1 py-2 ${t.button} text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all`,children:[l?e.jsx(v,{className:"w-4 h-4 animate-spin"}):e.jsx(f,{className:"w-4 h-4"}),l?"جاري الإنشاء...":"تحميل PDF"]}),e.jsx("button",{className:"px-3 py-2 bg-white border rounded-lg hover:bg-gray-50 transition-colors",children:e.jsx(y,{className:"w-4 h-4 text-gray-500"})}),e.jsx("button",{className:"px-3 py-2 bg-white border rounded-lg hover:bg-gray-50 transition-colors",children:e.jsx(j,{className:"w-4 h-4 text-gray-500"})})]})]})]})})},C=async a=>{const l={beneficiary_summary:"تقرير ملخص المستفيد",ipc_compliance:"تقرير الامتثال لمكافحة العدوى",empowerment_progress:"تقرير التمكين والأهداف التأهيلية",monthly_center:"التقرير الشهري للمركز"}[a]||"تقرير",i=new Date().toLocaleDateString("ar-SA"),o=`
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>${l}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');
        * { font-family: 'Cairo', sans-serif; margin: 0; padding: 0; box-sizing: border-box; }
        body { padding: 40px; background: white; color: #1f2937; }
        .header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #0d9488; }
        .header h1 { font-size: 28px; color: #14415a; margin-bottom: 10px; }
        .header p { color: #6b7280; }
        .logo { width: 80px; margin-bottom: 20px; }
        .section { margin-bottom: 30px; }
        .section h2 { font-size: 18px; color: #0d9488; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb; }
        .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 20px; }
        .stat-card { background: #f0fdfa; padding: 15px; border-radius: 12px; text-align: center; }
        .stat-card .value { font-size: 24px; font-weight: 700; color: #14415a; }
        .stat-card .label { font-size: 12px; color: #6b7280; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 12px; text-align: right; border-bottom: 1px solid #e5e7eb; }
        th { background: #f8fafc; font-weight: 600; color: #14415a; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #9ca3af; }
        @media print { body { padding: 20px; } }
    </style>
</head>
<body>
    <div class="header">
        <h1>وزارة الموارد البشرية والتنمية الاجتماعية</h1>
        <p>مركز التأهيل الشامل</p>
        <h2 style="margin-top: 20px; color: #0d9488;">${l}</h2>
        <p>تاريخ التقرير: ${i}</p>
    </div>
    
    <div class="section">
        <h2>ملخص الإحصائيات</h2>
        <div class="stat-grid">
            <div class="stat-card">
                <div class="value">85%</div>
                <div class="label">معدل الامتثال</div>
            </div>
            <div class="stat-card">
                <div class="value">12</div>
                <div class="label">أهداف نشطة</div>
            </div>
            <div class="stat-card">
                <div class="value">45</div>
                <div class="label">مستفيد</div>
            </div>
            <div class="stat-card">
                <div class="value">94%</div>
                <div class="label">نسبة التحصين</div>
            </div>
        </div>
    </div>
    
    <div class="section">
        <h2>التفاصيل</h2>
        <table>
            <thead>
                <tr>
                    <th>البند</th>
                    <th>الحالة</th>
                    <th>ملاحظات</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>مكافحة العدوى</td>
                    <td style="color: #22c55e;">✓ ممتاز</td>
                    <td>جميع الفحوصات مكتملة</td>
                </tr>
                <tr>
                    <td>التمكين والتأهيل</td>
                    <td style="color: #22c55e;">✓ جيد جداً</td>
                    <td>3 أهداف محققة هذا الشهر</td>
                </tr>
                <tr>
                    <td>الرعاية الصحية</td>
                    <td style="color: #22c55e;">✓ ممتاز</td>
                    <td>جميع التحصينات محدثة</td>
                </tr>
            </tbody>
        </table>
    </div>
    
    <div class="footer">
        <p>تم إنشاء هذا التقرير بواسطة نظام بصيرة 2.0</p>
        <p>© ${new Date().getFullYear()} وزارة الموارد البشرية والتنمية الاجتماعية</p>
    </div>
</body>
</html>`,t=window.open("","_blank");t&&(t.document.write(o),t.document.close(),t.focus(),setTimeout(()=>{t.print()},500))},T=()=>{const a=p(),[r,l]=d.useState(null),[i,o]=d.useState({from:new Date().toISOString().split("T")[0],to:new Date().toISOString().split("T")[0]}),t=async s=>{l(s),await new Promise(c=>setTimeout(c,1e3)),await C(s),l(null)};return e.jsxs("div",{className:"min-h-screen bg-gray-50 p-6",dir:"rtl",children:[e.jsx("div",{className:"flex justify-between items-start mb-8",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("button",{onClick:()=>a(-1),className:"p-2 hover:bg-gray-100 rounded-lg",children:e.jsx(g,{className:"w-5 h-5"})}),e.jsx("div",{className:"p-3 bg-purple-100 rounded-xl",children:e.jsx(n,{className:"w-8 h-8 text-purple-600"})}),e.jsxs("div",{children:[e.jsx("h1",{className:"text-2xl font-bold text-gray-800",children:"مولد التقارير"}),e.jsx("p",{className:"text-gray-500",children:"إنشاء وتصدير التقارير بصيغة PDF"})]})]})}),e.jsxs("div",{className:"bg-white rounded-2xl p-5 shadow-sm mb-6",children:[e.jsxs("h3",{className:"font-bold text-gray-800 mb-4 flex items-center gap-2",children:[e.jsx(x,{className:"w-5 h-5 text-purple-600"}),"نطاق التاريخ"]}),e.jsxs("div",{className:"flex gap-4 items-center flex-wrap",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm text-gray-600 mb-1",children:"من"}),e.jsx("input",{type:"date",value:i.from,onChange:s=>o({...i,from:s.target.value}),className:"px-4 py-2 border rounded-lg"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm text-gray-600 mb-1",children:"إلى"}),e.jsx("input",{type:"date",value:i.to,onChange:s=>o({...i,to:s.target.value}),className:"px-4 py-2 border rounded-lg"})]}),e.jsxs("button",{className:"px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center gap-2 self-end",children:[e.jsx(m,{className:"w-4 h-4"}),"خيارات متقدمة"]})]})]}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:w.map(s=>e.jsx(N,{report:s,onGenerate:t,generating:r===s.id},s.id))})]})};export{T as ReportGenerator,T as default};
