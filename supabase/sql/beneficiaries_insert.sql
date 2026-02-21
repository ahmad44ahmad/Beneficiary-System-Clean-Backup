-- Inserting 147 beneficiaries
-- Generated: 2025-12-23

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'f0af26df-d909-51ae-8ff3-1097086555eb',
    'لاحق يحيى شوعان علي جابر الحساني',
    '1055754009',
    'MALE',
    'ACTIVE',
    '1419-09-24',
    '1434-01-10',
    'A',
    '101',
    '1',
    'يحيى شوعان',
    '555754009',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '6ff18f37-c928-5527-9b78-b35f7893c11f',
    'ياسر صالح سعيد بريك ال بريك الغامدي',
    NULL,
    'MALE',
    'ACTIVE',
    '1396-07-01',
    '1413-12-06',
    'A',
    NULL,
    NULL,
    NULL,
    '506194389',
    'اخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '23adacbb-378d-5873-82c9-c3e44a98bbe8',
    'عامر موسى علي عمر ال منامس عسيري',
    NULL,
    'MALE',
    'ACTIVE',
    '1405-07-01',
    '1433-08-21',
    'A',
    NULL,
    NULL,
    NULL,
    'N/A',
    'State Ward'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '23b12af8-c1f8-586a-834b-e2950e23fc38',
    'سارة أحمد (حالة اختبار)',
    NULL,
    'FEMALE',
    'ACTIVE',
    '1385-01-01',
    '1400-01-01',
    'A',
    NULL,
    NULL,
    NULL,
    '0500000000',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '1131a435-04fa-54ef-98d1-e7ccf9cbcb0f',
    'عواض سلطان مطير الرفاعي الغامدي',
    NULL,
    'MALE',
    'ACTIVE',
    '1375-07-01',
    '1443-02-24',
    'A',
    NULL,
    NULL,
    NULL,
    '506783237',
    'أخيه'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '414a25ca-c4ca-574e-9081-15776a65f11f',
    'سعيد محمد ضافر محمد القرني',
    NULL,
    'MALE',
    'ACTIVE',
    '1399-01-25',
    '1413-12-29',
    'A',
    NULL,
    NULL,
    NULL,
    '555273947',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '3c5a0cf7-24ea-5647-aee6-648488f86e28',
    'علي عامر محمد ال سلام الشهري',
    NULL,
    'MALE',
    'ACTIVE',
    '1395-07-01',
    '1435-01-08',
    'A',
    NULL,
    NULL,
    NULL,
    '554732260',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '88b4bcf1-0454-5ccd-b437-457069bd0263',
    'عبد الكريم حسن عبد الله احمد الزهراني',
    NULL,
    'MALE',
    'ACTIVE',
    '1406-06-18',
    '1433-09-05',
    'A',
    NULL,
    NULL,
    NULL,
    '558884361',
    'اخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'bd5497ac-ccc6-5c9f-9341-6d953d6fbe32',
    'محمد صالح شافي مثيب الرفاعي الغامدي',
    NULL,
    'MALE',
    'ACTIVE',
    '1408-12-03',
    '1427-02-27',
    'A',
    NULL,
    NULL,
    NULL,
    '534059605',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '10ef5e9b-15a5-5cf6-a19a-b6a44f594d58',
    'صالح ناصر فلاح حمود الدحروجي الشهراني',
    NULL,
    'MALE',
    'ACTIVE',
    '1411-01-29',
    '1425-03-22',
    'A',
    NULL,
    NULL,
    NULL,
    '554471270',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'b7117a64-8629-5c7a-9bb4-840148ebb4f0',
    'صالح حامد صالح سعد ال محسن الشمراني',
    NULL,
    'MALE',
    'ACTIVE',
    '1408-06-29',
    '1435-08-26',
    'A',
    NULL,
    NULL,
    NULL,
    '500538573',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'b10a3ba5-0b18-5edc-8406-2614c1dff7cc',
    'سطام فراج سلطان نايش الحارثي',
    NULL,
    'MALE',
    'ACTIVE',
    '1412-05-24',
    '1433-11-10',
    'A',
    NULL,
    NULL,
    NULL,
    '530044339',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '4362c0b1-2c02-5c2d-b176-870c6650126b',
    'محمد عبد الله مسفر مفرح ال مفرح الغامدي',
    NULL,
    'MALE',
    'ACTIVE',
    '1406-10-02',
    '1414-05-25',
    'A',
    NULL,
    NULL,
    NULL,
    '555773269',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '35ac065d-362c-57f4-ac44-f94c6ebc9cf3',
    'عبد الرحمن علي عبد الرحمن عمر السليماني',
    NULL,
    'MALE',
    'ACTIVE',
    '1400-10-14',
    '1414-07-27',
    'A',
    NULL,
    NULL,
    NULL,
    '542555433',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '76641d57-039c-534f-b910-4707056f03c5',
    'محمد جمعان احمد عبد الله الزهراني',
    NULL,
    'MALE',
    'ACTIVE',
    '1396-07-01',
    '1414-05-15',
    'A',
    NULL,
    NULL,
    NULL,
    '555499945',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '8a0baead-c316-5f99-8e1c-fd908ad082bd',
    'عبد العزيز حسن عامر محمد الشهري',
    NULL,
    'MALE',
    'ACTIVE',
    '1414-08-10',
    '1426-11-08',
    'A',
    NULL,
    NULL,
    NULL,
    '505379053',
    'اخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '2ee09114-eb49-555f-a3cb-fa6bc1df4e58',
    'عبد الواحد عبد الله عويد مبارك اللهيبي الحربي',
    NULL,
    'MALE',
    'ACTIVE',
    '1392-01-20',
    '1414-08-01',
    'A',
    NULL,
    NULL,
    NULL,
    '564424232',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'eddc5f01-db4f-5ba3-8889-bf331d0c6537',
    'عبد الرحمن علي موجان علي الموجان الغامدي',
    NULL,
    'MALE',
    'ACTIVE',
    '1396-07-01',
    '1414-04-02',
    'A',
    NULL,
    NULL,
    NULL,
    '505660174',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '0891cadd-d5f6-5da1-b0f6-a8adb3624e67',
    'علي عبد الله محمد مسفر الشمراني',
    NULL,
    'MALE',
    'ACTIVE',
    '1401-10-25',
    '1420-05-14',
    'A',
    NULL,
    NULL,
    NULL,
    '532883339',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'eba554f8-d08a-5574-a8ba-9c3f4badaa2f',
    'منصور احمد سالم القرني',
    NULL,
    'MALE',
    'ACTIVE',
    '1402-06-26',
    '1440-01-03',
    'A',
    NULL,
    NULL,
    NULL,
    '504752093',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '5e0649f6-ce37-5abe-ae92-53019d7efcb4',
    'مصعب سعيد عبد ربه محمد الحسني الزهراني',
    NULL,
    'MALE',
    'ACTIVE',
    '1415-12-08',
    '1432-03-06',
    'A',
    NULL,
    NULL,
    NULL,
    '508800568',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'd5515412-f315-5757-a302-f16a2fb56db2',
    'غميص موسى غميص عائض ال مبسان الحارثي',
    NULL,
    'MALE',
    'ACTIVE',
    '1403-02-10',
    '1412-08-08',
    'A',
    NULL,
    NULL,
    NULL,
    '550855524',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '050db5e4-9a0f-53da-b70e-4085062a6ac8',
    'يوسف سعيد يعقوب مخفور القرني',
    NULL,
    'MALE',
    'ACTIVE',
    '1414-04-13',
    '1433-07-26',
    'A',
    NULL,
    NULL,
    NULL,
    '553363394',
    'اب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'cf4172a1-b5f0-5604-8627-7ab9308a3da5',
    'سلمان سفر احمد علي الكريمي العمري',
    NULL,
    'MALE',
    'ACTIVE',
    '1404-03-21',
    '1420-05-15',
    'A',
    NULL,
    NULL,
    NULL,
    '503941018',
    'ب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '3700af3f-8630-598b-b434-813838e5c4d1',
    'سعدي ناصر محمد عوير البيشي',
    NULL,
    'MALE',
    'ACTIVE',
    '1417-09-03',
    '1433-03-14',
    'A',
    NULL,
    NULL,
    NULL,
    '548437599',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'c9343331-0d9e-5cbb-880f-e90ebe407695',
    'علي حسن ركبان محمد الزهيري الغامدي',
    NULL,
    'MALE',
    'ACTIVE',
    '1398-07-01',
    '1413-12-01',
    'A',
    NULL,
    NULL,
    NULL,
    '554638690',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'b5191b10-c975-51c9-a292-2baa06ada960',
    'خضران فاضل سعيد مبارك البشيري الزهراني',
    NULL,
    'MALE',
    'ACTIVE',
    '1390-11-01',
    '1414-05-11',
    'A',
    NULL,
    NULL,
    NULL,
    '550332121',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '3c5a0cf7-24ea-5647-aee6-648488f86e28',
    'حسن عامر محمد ال سلام الشهري',
    NULL,
    'MALE',
    'ACTIVE',
    '1379-04-05',
    '1425-01-08',
    'A',
    NULL,
    NULL,
    NULL,
    '555994216',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '23adacbb-378d-5873-82c9-c3e44a98bbe8',
    'احمد موسى علي عمر ال منامس عسيري',
    NULL,
    'MALE',
    'ACTIVE',
    '1410-07-01',
    '1433-08-21',
    'A',
    NULL,
    NULL,
    NULL,
    '503755193',
    'عم'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'fbb02972-e2d3-5f37-8ad4-40ad2b70fc5f',
    'عبد الرحمن عامر محمد سعيد ال سلام الشهري',
    NULL,
    'MALE',
    'ACTIVE',
    '1397-04-07',
    '1425-01-08',
    'A',
    NULL,
    NULL,
    NULL,
    '554732260',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '6519ef11-4eef-5454-bd85-a56e0c4caf8a',
    'يوسف صالح عثمان المشيخي المالكي',
    NULL,
    'MALE',
    'ACTIVE',
    '1398-05-29',
    '1423-07-26',
    'A',
    NULL,
    NULL,
    NULL,
    '505786399',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '982d00f6-f3c1-50f2-8d35-405a70ac1c6d',
    'سعيد عبد العزيز عبد القوي بكر',
    NULL,
    'MALE',
    'ACTIVE',
    '1414-07-02',
    '1416-05-01',
    'A',
    NULL,
    NULL,
    NULL,
    'ظروف خاصة',
    'خاصة'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '23adacbb-378d-5873-82c9-c3e44a98bbe8',
    'علي موسى علي عمر ال منامس عسيري',
    NULL,
    'MALE',
    'ACTIVE',
    '1407-07-01',
    '1433-08-21',
    'A',
    NULL,
    NULL,
    NULL,
    '503755193',
    'عم'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'bf81d403-22bc-594d-9400-1e69c4e193f5',
    'احمد سالم سويد سالم ال خفير',
    NULL,
    'MALE',
    'ACTIVE',
    '1389-07-01',
    '1414-03-25',
    'A',
    NULL,
    NULL,
    NULL,
    '556222655',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'e0a0d7f2-a7c8-5cbc-a4cd-767736c2d512',
    'ابراهيم احمد عمر الفقيه الحضريتي',
    NULL,
    'MALE',
    'ACTIVE',
    '1392-02-01',
    '1415-04-02',
    'A',
    NULL,
    NULL,
    NULL,
    '537871814',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'ba299bf9-6ad4-584f-8bbf-c66c516c645d',
    'مذكر مفلح مذكر فلاح السبيعي',
    NULL,
    'MALE',
    'ACTIVE',
    '1401-07-01',
    '1425-05-29',
    'A',
    NULL,
    NULL,
    NULL,
    '503041026',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'b55392d9-f8d7-5672-99b3-9ec616e31b5e',
    'ابراهيم محمد رافع علي ال فلتان الشمراني',
    NULL,
    'MALE',
    'ACTIVE',
    '1412-03-05',
    '1413-11-21',
    'A',
    NULL,
    NULL,
    NULL,
    '506749120',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '9f9a60e6-65f2-5ec1-850f-6bf5c0cbc21c',
    'سفر عائض عيد الزهيري الغامدي',
    NULL,
    'MALE',
    'ACTIVE',
    '1395-07-01',
    '1416-01-29',
    'A',
    NULL,
    NULL,
    NULL,
    '555815570',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '6d3c5181-0b19-5436-b21f-b4943760bd7c',
    'صالح حمد محمد الشهراني',
    NULL,
    'MALE',
    'ACTIVE',
    '1414-08-17',
    '1435-01-16',
    'A',
    NULL,
    NULL,
    NULL,
    '530082920',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'ae856c41-9392-5ba0-b541-2bb3eb536b8b',
    'خالد محمد يحيى عايض عبد الرحمن العسيري',
    NULL,
    'MALE',
    'ACTIVE',
    '1409-06-23',
    '1434-02-1',
    'A',
    NULL,
    NULL,
    NULL,
    '562932766',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '2cf5548c-60bb-518e-a47a-90913ef9dc6b',
    'شباب مبارك وبير سعيد الرحماني',
    NULL,
    'MALE',
    'ACTIVE',
    '1398-01-20',
    '1414-03-29',
    'A',
    NULL,
    NULL,
    NULL,
    '506525876',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'ed6a0bde-df4b-5fe3-9975-dcf7140fb8fd',
    'حمدان عائض علي عائض البطناني الشمراني',
    NULL,
    'MALE',
    'ACTIVE',
    '1404-11-01',
    '1434-08-10',
    'A',
    NULL,
    NULL,
    NULL,
    '552158212',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'd3cd7f46-0b15-5d59-b5a4-e04e4c2224d8',
    'جمعان سفر شريم سعيد الحلي الغامدي',
    NULL,
    'MALE',
    'ACTIVE',
    '1408-03-21',
    '1414-01-03',
    'A',
    NULL,
    NULL,
    NULL,
    '504584865',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'f2d83190-6f7e-56df-949a-be2a1b16519e',
    'احمد مسفر سعيد مسفر ال طريس الغامدي',
    NULL,
    'MALE',
    'ACTIVE',
    '1397-07-01',
    '1414-02-07',
    'A',
    NULL,
    NULL,
    NULL,
    '504584047',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '1de38b2d-4f5f-5522-aba9-47ece90eca64',
    'عبد الله حسن عواض rده العصماني المالكي',
    NULL,
    'MALE',
    'ACTIVE',
    '1381-07-01',
    '1414-01-03',
    'A',
    NULL,
    NULL,
    NULL,
    '550033563',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '4c48768d-ff1b-5888-91e0-6082293452bc',
    'عبد الله احمد حسن علي العمري الزهراني',
    NULL,
    'MALE',
    'ACTIVE',
    '1423-11-15',
    '1438-11-16',
    'A',
    NULL,
    NULL,
    NULL,
    '505784755',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '4e11244e-5c50-58ce-960f-0ec6f10c27ec',
    'عبد الناصر علي سعيد سعدي ال سعدي الغامدي',
    NULL,
    'MALE',
    'ACTIVE',
    '1404-07-01',
    '1413-12-26',
    'A',
    NULL,
    NULL,
    NULL,
    '568989607',
    'والدته'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'f6b6caaf-be78-5c7a-9d4d-c3bcacbc9b20',
    'احمد محمد غرم احمد الزهراني',
    NULL,
    'MALE',
    'ACTIVE',
    '1400-07-01',
    '1414-02-07',
    'A',
    NULL,
    NULL,
    NULL,
    '505554942',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '88fc4816-d475-52c2-ab4d-2eff5743c2ed',
    'فهد عطيه عالي محمد الزهراني',
    NULL,
    'MALE',
    'ACTIVE',
    '1405-09-05',
    '1414-10-21',
    'A',
    NULL,
    NULL,
    NULL,
    '555664645',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '08d2743c-bab2-5fe1-acc4-b9efcf02d381',
    'عبد الله سعد حنش الغامدي',
    NULL,
    'MALE',
    'ACTIVE',
    '1405-06-12',
    '1417-03-05',
    'A',
    NULL,
    NULL,
    NULL,
    '598064599',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '4d058db3-06f1-5a9a-9ace-ea0bef779d83',
    'حمود محمد ثواب ال ثواب الشمراني',
    NULL,
    'MALE',
    'ACTIVE',
    '1408-01-01',
    '1414--12-18',
    'A',
    NULL,
    NULL,
    NULL,
    '508748858',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'bd6f85c0-628e-511f-af73-874f17dbe218',
    'صالح احمد سعيد سودان السويدي الزهراني',
    NULL,
    'MALE',
    'ACTIVE',
    '1418-06-11',
    '1425-05-29',
    'A',
    NULL,
    NULL,
    NULL,
    '556782756',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '21e965f6-dea6-5cef-a599-ddad04e838fd',
    'حسن صالح علي عبد الله ال mصلح',
    NULL,
    'MALE',
    'ACTIVE',
    '1392-07-01',
    '1413-11-29',
    'A',
    NULL,
    NULL,
    NULL,
    '551299907',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '120742b3-1ba5-5ca6-a88b-94d7eee337ba',
    'علي سعيد علي قرميش ال مصبح الغامدي',
    NULL,
    'MALE',
    'ACTIVE',
    '1406-06-15',
    '1416-06-15',
    'A',
    NULL,
    NULL,
    NULL,
    '550072281',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '2cc7fcb3-96b6-5eb2-9f26-962e8033c65c',
    'فهد mريع علي mريع المحمدي الشهراني',
    NULL,
    'MALE',
    'ACTIVE',
    '1410-09-02',
    '1413-12-29',
    'A',
    NULL,
    NULL,
    NULL,
    '505748144',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '1bcf83f8-842f-59f5-9f0c-39e937dd7e39',
    'سعيد لاهي صخران ابراهيم الاحمدي الزهراني',
    NULL,
    'MALE',
    'ACTIVE',
    '1398-07-01',
    '1425-08-04',
    'A',
    NULL,
    NULL,
    NULL,
    '533345751',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '70e0f090-d7e7-5838-b219-e59cb1233b2d',
    'سمير عبد الكريم سعيد الكناني الزهراني',
    NULL,
    'MALE',
    'ACTIVE',
    '1404-11-02',
    '1413-04-02',
    'A',
    NULL,
    NULL,
    NULL,
    '557558050',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '27991e77-94ed-5309-9aac-694e106d40ed',
    'mشاري مبارك بخيت مبارك الحسني الزهراني',
    NULL,
    'MALE',
    'ACTIVE',
    '1420-11-01',
    '1439-02-23',
    'A',
    NULL,
    NULL,
    NULL,
    '559202982',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'c8dfa2e6-da43-5540-b662-1a664f3fce98',
    'عبد الله سالم معتق سالم ال معتق',
    NULL,
    'MALE',
    'ACTIVE',
    '1401-08-05',
    '1414-02-07',
    'A',
    NULL,
    NULL,
    NULL,
    '509639282',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'e1f361b6-e226-5c41-82d1-4da269dc70cc',
    'عبد الرحمن محفوظ غرم الله ال عيضه الغامدي',
    NULL,
    'MALE',
    'ACTIVE',
    '1416-06-18',
    '1436-04-07',
    'A',
    NULL,
    NULL,
    NULL,
    '555786123',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '62a0dbe3-bd46-5e42-a7eb-f895e51bb16e',
    'عبد الرحمن حامد محمد لاحق الفقيه الغامدي',
    NULL,
    'MALE',
    'ACTIVE',
    '1409-02-07',
    '1425-05-18',
    'A',
    NULL,
    NULL,
    NULL,
    '506565956',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '2f842beb-3583-5a83-9e2e-6523a01934a7',
    'محسن عبيس محمد احمد البردي',
    NULL,
    'MALE',
    'ACTIVE',
    '1389-03-23',
    '1414-05-11',
    'A',
    NULL,
    NULL,
    NULL,
    '502856065',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '83c22b26-6ab6-5358-8e39-3ab456ebd9c7',
    'احمد ناصر فرحان عبد العزيز البادي الغامدي',
    NULL,
    'MALE',
    'ACTIVE',
    '1414-12-11',
    '1433-07-02',
    'A',
    NULL,
    NULL,
    NULL,
    '540299948',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '736d4573-9d6d-5539-8c8d-3476a9537c93',
    'فهد سعيد عوضه جمعان الحلي الغامدي',
    NULL,
    'MALE',
    'ACTIVE',
    '1405-11-13',
    '1432-10-20',
    'A',
    NULL,
    NULL,
    NULL,
    '504582566',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '935ae5ec-3a07-521b-b518-1880e26a021d',
    'محمد حسن صميد حسن الفلاحي الزهراني',
    NULL,
    'MALE',
    'ACTIVE',
    '1413-10-21',
    '1425-05-19',
    'A',
    NULL,
    NULL,
    NULL,
    '551522056',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '162f1c1b-c1bb-58cc-a3c7-8368610e13a3',
    'سعيد علي سعد عوضه محمد الاحمري',
    NULL,
    'MALE',
    'ACTIVE',
    '1420-03-13',
    '1438-12-28',
    'A',
    NULL,
    NULL,
    NULL,
    '509498265',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '07de43f6-af50-5fc3-b0aa-d72e9c304856',
    'سلمان جمعان علي ال حمران القحطاني',
    NULL,
    'MALE',
    'ACTIVE',
    '1412-04-17',
    '1434-04-28',
    'A',
    NULL,
    NULL,
    NULL,
    '509681372',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '0c82b8ee-be76-508c-a2ed-a3d3e45f3f0c',
    'صابر سعد محمد حسين البشري الزهراني',
    NULL,
    'MALE',
    'ACTIVE',
    '1408-1128',
    '1425-09-15',
    'A',
    NULL,
    NULL,
    NULL,
    '503770187',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '2277c44b-9a7b-58ff-ad33-e09d88416168',
    'ماجد مرعي صالح احمد الحسني الزهراني',
    NULL,
    'MALE',
    'ACTIVE',
    '1406-10-7',
    '1416-02-26',
    'A',
    NULL,
    NULL,
    NULL,
    '558918878',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'e8663a25-4ad1-5f40-b39f-65cf022ffaf2',
    'عبد الرحمن صحفان خضر الخزمري',
    NULL,
    'MALE',
    'ACTIVE',
    '1396-07-01',
    '1400-07-18',
    'A',
    NULL,
    NULL,
    NULL,
    '553923028',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '50c9f43f-f5d0-5503-a987-fa66d849d31a',
    'سعد مناحي سحمان عبد الله السويدي',
    NULL,
    'MALE',
    'ACTIVE',
    '1403-03-06',
    '1414-10-08',
    'A',
    NULL,
    NULL,
    NULL,
    '537272808',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'e27bb082-fefb-5fd1-963b-388ed7c7fe42',
    'نايف صالح زهيد عبد الله الغامدي',
    NULL,
    'MALE',
    'ACTIVE',
    '1405-07-01',
    '1415-03-26',
    'A',
    NULL,
    NULL,
    NULL,
    '507503136',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'e6e99239-f14b-53c0-8cc2-905b3e869ad5',
    'محمد جمعان محمد سعيد ال خنيف الزهراني',
    NULL,
    'MALE',
    'ACTIVE',
    '1396-07-01',
    '1414-02-07',
    'A',
    NULL,
    NULL,
    NULL,
    '557704489',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '55d42a05-095e-53f7-9394-bf4f2be00d70',
    'على عبد الرحمن معيض احمد السهيمي',
    NULL,
    'MALE',
    'ACTIVE',
    '1403-11-19',
    '1425-07-19',
    'A',
    NULL,
    NULL,
    NULL,
    '552116345',
    'أx'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'fa4f44bb-afa2-5baa-b77e-3120ab3267ae',
    'ابراهيم عبد الله محمد ال خاشعي الغامدي',
    NULL,
    'MALE',
    'ACTIVE',
    '1381-07-01',
    '1413-06-22',
    'A',
    NULL,
    NULL,
    NULL,
    '177226861',
    'اخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '71ddafd7-a68d-521d-a9f6-2fa9c436c3fb',
    'نصيب منسي محمود القرني السهيمي',
    NULL,
    'MALE',
    'ACTIVE',
    '1399-04-20',
    '1435-11-01',
    'A',
    NULL,
    NULL,
    NULL,
    '555761267',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'fe320355-39b7-59b3-a06f-a67660f90222',
    'فيصل عايض مفلح مفيلح الدوسري',
    NULL,
    'MALE',
    'ACTIVE',
    '1391-06-08',
    '1414-07-02',
    'A',
    NULL,
    NULL,
    NULL,
    '550992067',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '9b22e7ff-39fa-5892-9648-5cd5e5c24f9e',
    'الحميدي حمدان زيد زياد الصاعدي',
    NULL,
    'MALE',
    'ACTIVE',
    '1406-06-22',
    '1414-04-02',
    'A',
    NULL,
    NULL,
    NULL,
    '504358069',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'b7117a64-8629-5c7a-9bb4-840148ebb4f0',
    'محمد علي احمد محمد عكور حمدي',
    NULL,
    'MALE',
    'ACTIVE',
    '1420-06-03',
    '1435-09-20',
    'A',
    NULL,
    NULL,
    NULL,
    '553770671',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'e8c37b73-a0a2-5d41-a33d-81d13c73078c',
    'بدر احمد محمد محسن لغبي العبدلي',
    NULL,
    'MALE',
    'ACTIVE',
    '1422-08-27',
    '1434-01-14',
    'A',
    NULL,
    NULL,
    NULL,
    '565365600',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'ba2c8ac7-45ed-568b-a19f-7a4181be6818',
    'محمد عائض حمدان جمل الزهيري الغامدي',
    NULL,
    'MALE',
    'ACTIVE',
    '1421-05-01',
    '1433-05-01',
    'A',
    NULL,
    NULL,
    NULL,
    '503772586',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'b8b699b0-69e5-5d6f-bdb1-741e67cfd9b3',
    'ثواب مثيب ثواب زيدان القميشي المطيري',
    NULL,
    'MALE',
    'ACTIVE',
    '1409-11-20',
    '1414-02-09',
    'A',
    NULL,
    NULL,
    NULL,
    '554001300',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '000fec7f-a1c9-5bc3-9e0d-5bb563fc6df7',
    'صالح سعيد علي السويدي الزهراني',
    NULL,
    'MALE',
    'ACTIVE',
    '1418-06-11',
    '1425-05-29',
    'A',
    NULL,
    NULL,
    NULL,
    '507599482',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'c822ece0-cba4-536f-8cf9-eb2fe2ab0737',
    'ناصر ضاوي مسفر سفر الهجهاجي الغامدي',
    NULL,
    'MALE',
    'ACTIVE',
    '1414-10-13',
    '1429-02-12',
    'A',
    NULL,
    NULL,
    NULL,
    '503724534',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '9e583bd6-b4f1-5b6a-855c-80909469f8f0',
    'غرم الله دهاسي علي محمد البيضاني الزهراني',
    NULL,
    'MALE',
    'ACTIVE',
    '1409-01-01',
    '1414-07-18',
    'A',
    NULL,
    NULL,
    NULL,
    '598582347',
    'ب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '9fee85dd-4516-5b2a-a301-ff8729cccd68',
    'ظافر حسن ظافر سفر ال جريش الغامدي',
    NULL,
    'MALE',
    'ACTIVE',
    '1403-01-11',
    '1420-11-16',
    'A',
    NULL,
    NULL,
    NULL,
    '504761639',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '839fd487-8877-54aa-ad7c-7ea10531e2c4',
    'عيسى حسن محسن حسن الحسني الزهراني',
    NULL,
    'MALE',
    'ACTIVE',
    '1395-07-01',
    '1414-01-01',
    'A',
    NULL,
    NULL,
    NULL,
    '504585490',
    'اب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '66d5e032-0c63-52de-a9ca-bc9c70885838',
    'فيصل محسن حسين يحيى العجلان',
    NULL,
    'MALE',
    'ACTIVE',
    '1408-03-02',
    '1413-12-03',
    'A',
    NULL,
    NULL,
    NULL,
    '505778577',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '0878ade8-17a7-5a4c-913d-7c39453e432a',
    'حمدان حمود محمد المسلمي الغامدي',
    NULL,
    'MALE',
    'ACTIVE',
    '1403-10-03',
    '1435-03-21',
    'A',
    NULL,
    NULL,
    NULL,
    '547550708',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'c9c5d278-761a-5e9e-8110-e5d7ce5f8836',
    'امجد محمد احمد مقايص',
    NULL,
    'MALE',
    'ACTIVE',
    '1408-05-17',
    '1439-10-10',
    'A',
    NULL,
    NULL,
    NULL,
    '501178789',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'e8c37b73-a0a2-5d41-a33d-81d13c73078c',
    'حسان احمد محمد محسن لغبي العبدلي',
    NULL,
    'MALE',
    'ACTIVE',
    '1421-08-07',
    '1434-01-14',
    'A',
    NULL,
    NULL,
    NULL,
    '565365600',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'f45f3839-36cd-578d-8400-bd9342f187c9',
    'عبد الخالق صالح محمد حافظ علي فرحان القرني',
    NULL,
    'MALE',
    'ACTIVE',
    '1411-10-23',
    '1424-08-01',
    'A',
    NULL,
    NULL,
    NULL,
    '540336108',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '8b2857e9-f0ea-57c9-b5d0-f0dacacc908f',
    'طارق عبد الرحمن عبد القادر صويلح الغامدي',
    NULL,
    'MALE',
    'ACTIVE',
    '1402-03-14',
    '1435-07-26',
    'A',
    NULL,
    NULL,
    NULL,
    '547381265',
    'أبن أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '027efe87-8a9b-566d-81c7-784e03c45fc5',
    'مازن صالح علي سعيد ال ضايح الحارثي',
    NULL,
    'MALE',
    'ACTIVE',
    '1411-12-09',
    '1423-09-04',
    'A',
    NULL,
    NULL,
    NULL,
    '503697826',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '186f7ba1-24cf-558b-81bb-24b1836f866b',
    'محمد ناصر سالم قزعان الحارثي',
    NULL,
    'MALE',
    'ACTIVE',
    '1415-11-25',
    '1428-02-25',
    'A',
    NULL,
    NULL,
    NULL,
    '557254144',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '2eb0cd4c-327d-5dc3-b97f-bf8b4a32b0d5',
    'ماجد سعيد محمد شتحان الجندبي الزهراني',
    NULL,
    'MALE',
    'ACTIVE',
    '1400-07-07',
    '1435-01-14',
    'A',
    NULL,
    NULL,
    NULL,
    '503546048',
    'اب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '9790c672-28c7-55df-bd1e-76f34f51c767',
    'علي ناصر مسفر حسين ال شيبان الغامدي',
    NULL,
    'MALE',
    'ACTIVE',
    '1394-07-01',
    '1413-11-25',
    'A',
    NULL,
    NULL,
    NULL,
    '507770250',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '1567b08a-d962-5436-b15b-fee584ea076c',
    'محمد عبد العزيز احمد حسن العسيري',
    NULL,
    'MALE',
    'ACTIVE',
    '1403-05-13',
    '1434-04-28',
    'A',
    NULL,
    NULL,
    NULL,
    '559742139',
    'خاله'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'edcdc2e6-58f6-5e2f-87f0-3c868882835c',
    'حمود علي قزعه احمد الحسني الزهراني',
    NULL,
    'MALE',
    'ACTIVE',
    '1392-07-01',
    '1413-12-04',
    'A',
    NULL,
    NULL,
    NULL,
    '552032167',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '9b74f3ca-a4c7-50de-b906-d1ef83dfbe28',
    'عبد الله سعيد خميس محمد القرشي الزهراني',
    NULL,
    'MALE',
    'ACTIVE',
    '1396-08-04',
    '1415-03-02',
    'A',
    NULL,
    NULL,
    NULL,
    '555149866',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '49872e1e-b999-5dd0-b0c6-4fc53fd81fdc',
    'عبد الله علي محمد فايز ال سالم العيسى',
    NULL,
    'MALE',
    'ACTIVE',
    '1405-04-13',
    '1433-04-14',
    'A',
    NULL,
    NULL,
    NULL,
    '559231644',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '98277bfc-d3ef-528f-83a6-8a64f7213341',
    'عبد الله محمد غرم الله محمد الفقيه الغامدي',
    NULL,
    'MALE',
    'ACTIVE',
    '1411-08-27',
    '1414-07-03',
    'A',
    NULL,
    NULL,
    NULL,
    '544825824',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '329f2765-a76f-5520-b7fa-ecf038b19935',
    'محمد عبد الله عائض فرحان القرني',
    NULL,
    'MALE',
    'ACTIVE',
    '1409-04-03',
    '1422-08-20',
    'A',
    NULL,
    NULL,
    NULL,
    '566668483',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '5225c3e6-4527-567f-a0fa-b381d467f732',
    'علي ساعد عيد مساعد الاحمدي الزهراني',
    NULL,
    'MALE',
    'ACTIVE',
    '1399-07-01',
    '1434-01-24',
    'A',
    NULL,
    NULL,
    NULL,
    '537414636',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'fd4c2b7d-2088-5279-9620-13a6ac7c3a49',
    'فيصل ناصر سعيد صالح ال خضران',
    NULL,
    'MALE',
    'ACTIVE',
    '1406-05-28',
    '1413-11-21',
    'A',
    NULL,
    NULL,
    NULL,
    '504587009',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '9e6954b3-c17f-561c-a0e0-f8c217c7eb50',
    'محمد علي باخش علي الزهراني',
    NULL,
    'MALE',
    'ACTIVE',
    '1399-07-01',
    '1426-01-13',
    'A',
    NULL,
    NULL,
    NULL,
    '501081169',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '1d8b69b7-f932-5ae3-86b7-0102996a7066',
    'عصام عبد الرحيم عبد العزيز محمد',
    NULL,
    'MALE',
    'ACTIVE',
    '1417-11-24',
    '1419-06-16',
    'A',
    NULL,
    NULL,
    NULL,
    'ظروف خاصة',
    'خاصة'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '9fad1975-59d8-55bc-9bbc-09bdc0dbf080',
    'سالم ناصر سالم علي ال صعدي الشهري',
    NULL,
    'MALE',
    'ACTIVE',
    '1425-07-07',
    '1431-04-29',
    'A',
    NULL,
    NULL,
    NULL,
    '535741007',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'fb5fc6fc-4ac6-54d2-bfec-00d57ab5ece3',
    'سلطان ناصر سالم علي ال صعدي الشهري',
    NULL,
    'MALE',
    'ACTIVE',
    '1421-03-02',
    '1431-06-25',
    'A',
    NULL,
    NULL,
    NULL,
    '535741007',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'c0693881-8c4c-5bd3-a8d4-9792d8e4d8fe',
    'عبد الله صالح عبد الله محمد ال مسافر القرني',
    NULL,
    'MALE',
    'ACTIVE',
    '1423-11-05',
    '1432-09-27',
    'A',
    NULL,
    NULL,
    NULL,
    '505795962',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '25b21794-4e6c-56dd-9171-30790cb9164b',
    'بخيت سالم مبروك وقيتان الهجهاجي الغامدي',
    NULL,
    'MALE',
    'ACTIVE',
    '1422-09-17',
    '1434-11-02',
    'A',
    NULL,
    NULL,
    NULL,
    '555784015',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '25366d6e-3b90-5f65-8bdf-01e774cfd560',
    'جمعان احمد ابو الخير الغامدي',
    NULL,
    'MALE',
    'ACTIVE',
    '1392-07-01',
    '1413-11-24',
    'A',
    NULL,
    NULL,
    NULL,
    '550006183',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '87bc1e62-cb8b-5ab0-914e-e77db5d058a5',
    'عبد الله علي محمد سعيد الاخاضره العلياني',
    NULL,
    'MALE',
    'ACTIVE',
    '1402-07-01',
    '1413-12-01',
    'A',
    NULL,
    NULL,
    NULL,
    '506781343',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'b9cfb460-bca8-5b28-aaad-7bc3d3ab55f0',
    'عبد الله مبارك عبد الله مبارك الحسني الزهراني',
    NULL,
    'MALE',
    'ACTIVE',
    '1396-07-01',
    '1413-11-26',
    'A',
    NULL,
    NULL,
    NULL,
    '177520125',
    'أفب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'c2daed3b-dc10-58ad-987e-56b14d57daf7',
    'محمد احمد محمد عقيل ال ملاط الحاتمي',
    NULL,
    'MALE',
    'ACTIVE',
    '1395-10-20',
    '1412-06-10',
    'A',
    NULL,
    NULL,
    NULL,
    '553693544',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '96da1ac9-f05b-504f-8a52-1e4bdcd0a5af',
    'محمد بصير منير نوير المسعودي',
    NULL,
    'MALE',
    'ACTIVE',
    '1401-10-12',
    '1414-05-11',
    'A',
    NULL,
    NULL,
    NULL,
    '506526692',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'b2f47807-2810-561e-8928-a55c8d77a3a1',
    'محمد حمدان علان راجح السهيمي',
    NULL,
    'MALE',
    'ACTIVE',
    '1405-02-04',
    '1416-03-25',
    'A',
    NULL,
    NULL,
    NULL,
    '554585714',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '8528cede-e776-563f-abfe-94f95a5380fa',
    'سعيد عالي سحمي الغامدي',
    NULL,
    'MALE',
    'ACTIVE',
    '1393-07-01',
    '1440-01-23',
    'A',
    NULL,
    NULL,
    NULL,
    '555784378',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '808ab297-b40c-5583-9b0f-ecaa70c672f6',
    'عبد الاله علي عبد الله بنيه الغامدي',
    NULL,
    'MALE',
    'ACTIVE',
    '1419-09-02',
    '1433-08-06',
    'A',
    NULL,
    NULL,
    NULL,
    '501416899',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'd1ff6a02-7082-58ce-8c77-3e73ac2a1162',
    'عبد الله هلال عبد الرحمن ضيف الله الشلوي',
    NULL,
    'MALE',
    'ACTIVE',
    '1417-11-25',
    '1427-06-26',
    'A',
    NULL,
    NULL,
    NULL,
    '502052763',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '53f466e7-7d6b-5bef-a129-8a3779f39d08',
    'عبدالله خلوفه خلف خلوفه الخثعمي',
    NULL,
    'MALE',
    'ACTIVE',
    '1416-7-15',
    '1440-2-26',
    'A',
    NULL,
    NULL,
    NULL,
    '505797291',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'f6af60ea-4fc5-5c61-a2bd-93bcc06f1214',
    'فيصل دامس مانع مشعل الشهري',
    NULL,
    'MALE',
    'ACTIVE',
    '1422-01-10',
    '1433-12-01',
    'A',
    NULL,
    NULL,
    NULL,
    '505940810',
    'خاله'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '40377dbf-231b-59c1-a20c-84c1f78593a6',
    'ثامر نايف احمد محمد العبدلي المالكي',
    NULL,
    'MALE',
    'ACTIVE',
    '1426-09-23',
    '1435-10-02',
    'A',
    NULL,
    NULL,
    NULL,
    '556660366',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '4705e7bb-b4e9-5b45-93b8-e40653a90145',
    'فؤاد عبدالله ساحب الغامدي',
    NULL,
    'MALE',
    'ACTIVE',
    '1425-06-13',
    '1433-05-10',
    'A',
    NULL,
    NULL,
    NULL,
    '533299931',
    'أم'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '61bd2b85-b4c3-5c01-95dd-7f27c18811ff',
    'خالد محسن غدران مطر العبادله السهيمي',
    NULL,
    'MALE',
    'ACTIVE',
    '1425-07-15',
    '1434-02-24',
    'A',
    NULL,
    NULL,
    NULL,
    '504154918',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'f852d941-740a-58f8-bdfc-c319097223f4',
    'عبد الخالق سالم محمد عبد الرحيم',
    NULL,
    'MALE',
    'ACTIVE',
    '1423-08-19',
    '1436-05-14',
    'A',
    NULL,
    NULL,
    NULL,
    'ظروف خاصة',
    'ظروف خاصة'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '222306d8-152c-542f-8e67-b179d8d2220c',
    'عبد الله سعيد راشد الغامدي',
    NULL,
    'MALE',
    'ACTIVE',
    '1411-10-07',
    '1418-01-10',
    'A',
    NULL,
    NULL,
    NULL,
    '555796861',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'c822ece0-cba4-536f-8cf9-eb2fe2ab0737',
    'عبد الرحمن سعد سعيد حربي ال حربي القرني',
    NULL,
    'MALE',
    'ACTIVE',
    '1420-06-26',
    '1432-11-01',
    'A',
    NULL,
    NULL,
    NULL,
    '505852786',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '11b0597f-1b8e-5582-942a-ca1164385bfd',
    'سعيد سعد سعيد ال مسعود العمري',
    NULL,
    'MALE',
    'ACTIVE',
    '1412-04-11',
    '1436-04-08',
    'A',
    NULL,
    NULL,
    NULL,
    '506070559',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'd4f686ab-43f5-565d-bc81-c1dfc6a05b99',
    'منير عبد الله صالح عطيه الشاطي الغامدي',
    NULL,
    'MALE',
    'ACTIVE',
    '1412-12-28',
    '1419-05-11',
    'A',
    NULL,
    NULL,
    NULL,
    '506770617',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'f6cb158d-b8bf-5c95-b3f7-fa061664be91',
    'عادل سعد عبد الله علي الضعين',
    NULL,
    'MALE',
    'ACTIVE',
    '1416-06-23',
    '1423-05-21',
    'A',
    NULL,
    NULL,
    NULL,
    '552033670',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '6407e903-eb54-5974-a80d-60ea43728a72',
    'مرعي عوضه خلوفه مرعى الشهري',
    NULL,
    'MALE',
    'ACTIVE',
    '1416-12-04',
    '1429-05-08',
    'A',
    NULL,
    NULL,
    NULL,
    '503029545',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'f0af26df-d909-51ae-8ff3-1097086555eb',
    'عبد العزيز عوضه سعد خليوي الزهيري الغامدي',
    NULL,
    'MALE',
    'ACTIVE',
    '1419-08-03',
    '1433-03-19',
    'A',
    NULL,
    NULL,
    NULL,
    '500869619',
    'خال'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'e530e139-5b63-59bc-ba81-751f71a74124',
    'حسين علي حسين الزهراني',
    NULL,
    'MALE',
    'ACTIVE',
    '1412-05-12',
    '1425-07-06',
    'A',
    NULL,
    NULL,
    NULL,
    '555889664',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '8e3d4a70-4535-51df-88e4-76568f6158cb',
    'سامي حزمي ردعان حزمي ال محسين القرني',
    NULL,
    'MALE',
    'ACTIVE',
    '1414-01-06',
    '1435-08-05',
    'A',
    NULL,
    NULL,
    NULL,
    '503740544',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '6a480b1d-ed27-5bb2-adec-0e80aa5128a3',
    'مروان سلمان تركي عبد الرحمن',
    NULL,
    'MALE',
    'ACTIVE',
    '1412-08-18',
    '1414-04-19',
    'A',
    NULL,
    NULL,
    NULL,
    'ظروف خاصة',
    'ظروف خاصة'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'dfc7eeb6-5b4c-5f0f-8c57-b2f6997ff6c6',
    'ظافر عبد الرحمن طالع محمد ال سلام الشهري',
    NULL,
    'MALE',
    'ACTIVE',
    '1413-03-10',
    '1434-03-10',
    'A',
    NULL,
    NULL,
    NULL,
    '555994216',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'd4e1507a-8c46-5f00-ae00-2356cca2714c',
    'معتز عبد الظاهر علي عبد الباقي',
    NULL,
    'MALE',
    'ACTIVE',
    '1412-07-24',
    '1416-05-01',
    'A',
    NULL,
    NULL,
    NULL,
    'ظروف خاصة',
    'ظروف خاصة'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '194c36a0-2b4b-500f-a3e7-d33cecb2367d',
    'غرم الله قينان غرم الله خميس الغامدي',
    NULL,
    'MALE',
    'ACTIVE',
    '1411-03-28',
    '1425-05-06',
    'A',
    NULL,
    NULL,
    NULL,
    '505784683',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '0f593a70-2744-5321-839f-c5b7e9fc3913',
    'عبد الله عبد الرحمن طالع محمد الشهري',
    NULL,
    'MALE',
    'ACTIVE',
    '1399-09-26',
    '1434-05-11',
    'A',
    NULL,
    NULL,
    NULL,
    '555994216',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'df3d9af3-a300-5a0c-9f4f-ede1e58fe24e',
    'احمد علي عبد الله علي الشهري',
    NULL,
    'MALE',
    'ACTIVE',
    '1410-10-01',
    '1414-04-20',
    'A',
    NULL,
    NULL,
    NULL,
    '551243893',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '61b1aceb-c8e7-53bd-ab39-76f06d487e68',
    'متعب سعيد فارس علي ال كريمي',
    NULL,
    'MALE',
    'ACTIVE',
    '1407-02-06',
    '1414-11-07',
    'A',
    NULL,
    NULL,
    NULL,
    '538455059',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'cb88ace3-0373-552b-8554-e0cbb8f0adac',
    'عبد الله علي حمدان الغامدي',
    NULL,
    'MALE',
    'ACTIVE',
    '1401-07-01',
    '1410-02-27',
    'A',
    NULL,
    NULL,
    NULL,
    '556551314',
    'أخ'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'f6fd76c9-1485-59c0-a848-d48e8b4eecbb',
    'سعد علي فايز غانم ال هزاع القرني',
    NULL,
    'MALE',
    'ACTIVE',
    '1403-07-01',
    '1418-08-26',
    'A',
    NULL,
    NULL,
    NULL,
    '552837998',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'df3d9af3-a300-5a0c-9f4f-ede1e58fe24e',
    'محمد علي عبد الله علي الشهري',
    NULL,
    'MALE',
    'ACTIVE',
    '1410-10-01',
    '1414-01-20',
    'A',
    NULL,
    NULL,
    NULL,
    '551243893',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '89855627-f733-5d70-a1cd-0f2a576102d7',
    'صقر خلف خلوفة الخثعمي',
    NULL,
    'MALE',
    'ACTIVE',
    '1422-11-11',
    '1440-02-26',
    'A',
    NULL,
    NULL,
    NULL,
    '505797291',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    'a0ead205-bbd3-5f46-b951-1335a4b9c0e5',
    'خلوفة خلف خلوفة الخثعمي',
    NULL,
    'MALE',
    'ACTIVE',
    '1404-07-01',
    '1440-02-26',
    'A',
    NULL,
    NULL,
    NULL,
    '505797291',
    'أب'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();


-- Verify count
SELECT COUNT(*) as total_beneficiaries FROM beneficiaries;
