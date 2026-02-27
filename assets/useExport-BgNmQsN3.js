import{r as m}from"./vendor-react-B_mBVdC8.js";function S(){const[r,o]=m.useState(!1),l=m.useCallback((s={})=>{o(!0),setTimeout(()=>{window.print(),o(!1)},100)},[]),p=m.useCallback((s,i,e={})=>{o(!0);const{title:t="تقرير",subtitle:n,orientation:d="portrait"}=e,a=`
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>${t}</title>
    <style>
        @page { size: A4 ${d}; margin: 2cm; }
        * { box-sizing: border-box; }
        body {
            font-family: 'Cairo', 'Tajawal', 'Arial', sans-serif;
            direction: rtl;
            text-align: right;
            color: #1a1a1a;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 3px solid #148287;
            padding-bottom: 15px;
        }
        .logo-section {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            margin-bottom: 10px;
        }
        .title { font-size: 24px; font-weight: bold; color: #14415a; margin: 0; }
        .subtitle { font-size: 14px; color: #666; margin-top: 5px; }
        .timestamp { font-size: 12px; color: #888; margin-top: 5px; }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th {
            background: linear-gradient(135deg, #148287 0%, #0d6567 100%);
            color: white;
            padding: 12px 15px;
            border: 1px solid #0d6567;
            font-weight: 600;
            font-size: 14px;
        }
        td {
            padding: 10px 15px;
            border: 1px solid #e0e0e0;
            font-size: 13px;
        }
        tr:nth-child(even) { background: #f8fafc; }
        tr:hover { background: #e8f4f8; }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 11px;
            color: #888;
            border-top: 1px solid #e0e0e0;
            padding-top: 15px;
        }
        .stats-row {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin: 15px 0;
            font-size: 13px;
        }
        .stat-item { color: #148287; font-weight: 600; }
        @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo-section">
            <h1 class="title">${t}</h1>
        </div>
        ${n?`<div class="subtitle">${n}</div>`:""}
        <div class="timestamp">تاريخ الطباعة: ${new Date().toLocaleDateString("ar-SA")} - ${new Date().toLocaleTimeString("ar-SA")}</div>
    </div>
    
    <div class="stats-row">
        <span class="stat-item">إجمالي السجلات: ${s.length}</span>
    </div>

    <table>
        <thead>
            <tr>
                ${i.map(f=>`<th>${f.header}</th>`).join("")}
            </tr>
        </thead>
        <tbody>
            ${s.map(f=>`
                <tr>
                    ${i.map(h=>`<td>${f[h.key]??"-"}</td>`).join("")}
                </tr>
            `).join("")}
        </tbody>
    </table>

    <div class="footer">
        نظام بصيرة - مركز التأهيل الشامل بمنطقة الباحة<br/>
        وزارة الموارد البشرية والتنمية الاجتماعية
    </div>

    <script>
        window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
        };
    <\/script>
</body>
</html>`,c=window.open("","_blank");c&&(c.document.write(a),c.document.close()),setTimeout(()=>o(!1),500)},[]);return{print:l,printTable:p,isPrinting:r}}function x(r){const{filename:o,columns:l,data:p,title:s,includeTimestamp:i=!0}=r;let e="\uFEFF";s&&(e+=`"${s}"
`,i&&(e+=`"تاريخ التصدير: ${new Date().toLocaleDateString("ar-SA")}"
`),e+=`
`),e+=l.map(t=>`"${t.header}"`).join(",")+`
`,p.forEach(t=>{const n=l.map(d=>{let a=t[d.key];return d.format?a=d.format(a):d.type==="date"&&a?a=new Date(a).toLocaleDateString("ar-SA"):d.type==="boolean"&&(a=a?"نعم":"لا"),`"${String(a??"").replace(/"/g,'""')}"`});e+=n.join(",")+`
`}),g(e,`${o}.csv`,"text/csv;charset=utf-8")}function b(r){const{filename:o,columns:l,data:p,title:s,includeTimestamp:i=!0}=r;let e=`<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
<Styles>
    <Style ss:ID="Header">
        <Font ss:Bold="1" ss:Size="12"/>
        <Interior ss:Color="#148287" ss:Pattern="Solid"/>
        <Font ss:Color="#FFFFFF"/>
        <Alignment ss:Horizontal="Center" ss:ReadingOrder="RightToLeft"/>
    </Style>
    <Style ss:ID="Title">
        <Font ss:Bold="1" ss:Size="16"/>
        <Alignment ss:Horizontal="Center" ss:ReadingOrder="RightToLeft"/>
    </Style>
    <Style ss:ID="Data">
        <Alignment ss:Horizontal="Right" ss:ReadingOrder="RightToLeft"/>
    </Style>
</Styles>
<Worksheet ss:Name="البيانات">
<Table>`;const t=s?3:1;s&&(e+=`
<Row ss:Index="1">
    <Cell ss:MergeAcross="${l.length-1}" ss:StyleID="Title">
        <Data ss:Type="String">${u(s)}</Data>
    </Cell>
</Row>`,i&&(e+=`
<Row>
    <Cell ss:MergeAcross="${l.length-1}">
        <Data ss:Type="String">تاريخ التصدير: ${new Date().toLocaleDateString("ar-SA")}</Data>
    </Cell>
</Row>`)),e+=`
<Row ss:Index="${t}">`,l.forEach(n=>{e+=`
    <Cell ss:StyleID="Header">
        <Data ss:Type="String">${u(n.header)}</Data>
    </Cell>`}),e+=`
</Row>`,p.forEach((n,d)=>{e+=`
<Row ss:Index="${t+d+1}">`,l.forEach(a=>{let c=n[a.key],f="String";a.format?c=a.format(c):a.type==="date"&&c?c=new Date(c).toLocaleDateString("ar-SA"):a.type==="boolean"?c=c?"نعم":"لا":a.type==="number"&&typeof c=="number"&&(f="Number"),e+=`
    <Cell ss:StyleID="Data">
        <Data ss:Type="${f}">${u(String(c??""))}</Data>
    </Cell>`}),e+=`
</Row>`}),e+=`
</Table>
</Worksheet>
</Workbook>`,g(e,`${o}.xls`,"application/vnd.ms-excel")}function y(r){const{columns:o,data:l,title:p,includeTimestamp:s=!0,orientation:i="portrait"}=r,e=`
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>${p||"تقرير"}</title>
    <style>
        @page { size: A4 ${i}; margin: 2cm; }
        body {
            font-family: 'Cairo', 'Tajawal', 'Arial', sans-serif;
            direction: rtl;
            text-align: right;
            color: #1a1a1a;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #148287;
            padding-bottom: 15px;
        }
        .title { font-size: 24px; font-weight: bold; color: #14415a; }
        .timestamp { font-size: 12px; color: #666; margin-top: 5px; }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        th {
            background: #148287;
            color: white;
            padding: 10px;
            border: 1px solid #0d6567;
            font-weight: bold;
        }
        td {
            padding: 8px 10px;
            border: 1px solid #ddd;
        }
        tr:nth-child(even) { background: #f8fafc; }
        tr:hover { background: #e8f4f8; }
        .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 10px;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="header">
        ${p?`<div class="title">${p}</div>`:""}
        ${s?`<div class="timestamp">تاريخ التصدير: ${new Date().toLocaleDateString("ar-SA")} ${new Date().toLocaleTimeString("ar-SA")}</div>`:""}
    </div>
    <table>
        <thead>
            <tr>
                ${o.map(n=>`<th>${n.header}</th>`).join("")}
            </tr>
        </thead>
        <tbody>
            ${l.map(n=>`
                <tr>
                    ${o.map(d=>{let a=n[d.key];return d.format?a=d.format(a):d.type==="date"&&a?a=new Date(a).toLocaleDateString("ar-SA"):d.type==="boolean"&&(a=a?"نعم":"لا"),`<td>${a??""}</td>`}).join("")}
                </tr>
            `).join("")}
        </tbody>
    </table>
    <div class="footer">
        نظام بصيرة - مركز التأهيل الشامل بالباحة
    </div>
    <script>window.print();<\/script>
</body>
</html>`,t=window.open("","_blank");t&&(t.document.write(e),t.document.close())}function u(r){return r.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;")}function g(r,o,l){const p=new Blob([r],{type:l}),s=URL.createObjectURL(p),i=document.createElement("a");i.href=s,i.download=o,document.body.appendChild(i),i.click(),document.body.removeChild(i),URL.revokeObjectURL(s)}function T(){const[r,o]=m.useState(!1),l=m.useCallback((i,e,t={})=>{o(!0);try{const n={filename:t.filename||"export",title:t.title,subtitle:t.subtitle,columns:e,data:i,includeTimestamp:t.includeTimestamp??!0,orientation:t.orientation||"portrait"};b(n)}finally{setTimeout(()=>o(!1),500)}},[]),p=m.useCallback((i,e,t={})=>{o(!0);try{const n={filename:t.filename||"export",title:t.title,subtitle:t.subtitle,columns:e,data:i,includeTimestamp:t.includeTimestamp??!0,orientation:t.orientation||"portrait"};x(n)}finally{setTimeout(()=>o(!1),500)}},[]),s=m.useCallback((i,e,t={})=>{o(!0);try{const n={filename:t.filename||"export",title:t.title,subtitle:t.subtitle,columns:e,data:i,includeTimestamp:t.includeTimestamp??!0,orientation:t.orientation||"portrait"};y(n)}finally{setTimeout(()=>o(!1),500)}},[]);return{exportToExcel:l,exportToCsv:p,exportToPdf:s,isExporting:r}}const $=[{key:"name",header:"الاسم"},{key:"age",header:"العمر",type:"number"},{key:"room",header:"رقم الغرفة"},{key:"wing",header:"الجناح"},{key:"status",header:"الحالة الصحية",format:r=>{switch(r){case"stable":return"مستقر";case"needs_attention":return"يحتاج متابعة";case"critical":return"حرج";default:return String(r||"-")}}},{key:"ipc_status",header:"حالة IPC",format:r=>{switch(r){case"safe":return"آمن";case"monitor":return"تحت المراقبة";case"alert":return"تنبيه";default:return String(r||"-")}}},{key:"admission_date",header:"تاريخ القبول",type:"date"}];export{$ as B,T as a,S as u};
