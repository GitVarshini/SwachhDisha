-- SwachhDisha Initial Seed Data
USE swachhdisha;

-- Clear any existing records in reverse dependency order
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE report_updates;
TRUNCATE TABLE waste_reports;
TRUNCATE TABLE hotspot_areas;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Seed Users (password for admin is admin123, citizen is citizen123)
INSERT INTO users (id, name, email, password_hash, phone, role) VALUES
('usr_admin_01', 'Municipal Sanitation Officer', 'admin@swachhdisha.com', '$2b$10$hID8YNErLdt7p7xCWx8hXuJU216AMLn1gRSM2Sm.uDorb5Q9BiWLq', '+91 98480 22331', 'ADMIN'),
('usr_cit_01', 'Varshini A.', 'varshini.amudala06@gmail.com', '$2b$10$UW/hIRvqD4N87NA/xIgsNuvu0UreWVEEjN/SlYshhmjR4V5mxnv9u', '+91 94401 55667', 'CITIZEN'),
('usr_cit_02', 'Ramesh Rao', 'ramesh.rao@gmail.com', '$2b$10$UW/hIRvqD4N87NA/xIgsNuvu0UreWVEEjN/SlYshhmjR4V5mxnv9u', '+91 99882 11223', 'CITIZEN'),
('usr_cit_03', 'Sunita Reddy', 'sunita.reddy@gmail.com', '$2b$10$UW/hIRvqD4N87NA/xIgsNuvu0UreWVEEjN/SlYshhmjR4V5mxnv9u', '+91 98765 43210', 'CITIZEN'),
('usr_cit_04', 'Dr. K. Srinivas', 'dr.srinivas@gmail.com', '$2b$10$UW/hIRvqD4N87NA/xIgsNuvu0UreWVEEjN/SlYshhmjR4V5mxnv9u', '+91 97001 23456', 'CITIZEN');

-- 2. Seed Waste Reports
INSERT INTO waste_reports (id, category, severity, description, address, ward, latitude, longitude, photo_url, status, is_anonymous, reporter_id, reporter_name, reporter_contact, created_at, updated_at) VALUES
('REP-2026-8091', 'plastic', 'HIGH', 'Heavy blockage of roadside stormwater drain caused by thousands of single-use beverage bottles and polyethylene carry bags. Water stagnant and beginning to overflow onto pedestrian footpath.', 'Near Pillar 142, Metro Junction Outer Ring Road', 'Ward 7 - Metro Junction & Market', 17.3984, 78.4812, NULL, 'IN_PROGRESS', FALSE, 'usr_cit_01', 'Varshini A.', '+91 94401 55667', '2026-10-02 08:30:00', '2026-10-04 10:15:00'),
('REP-2026-8092', 'medical', 'CRITICAL', 'Illegally dumped clinic waste including discarded intravenous tubes, syringe needles, and blood collection vials found exposed near municipal primary school perimeter fence.', 'Plot 44, Lane 3 behind Community Health Centre, Old Bazaar', 'Ward 15 - Old Bazaar & Textile Row', 17.3752, 78.4719, NULL, 'VERIFIED', TRUE, NULL, NULL, NULL, '2026-10-03 11:45:00', '2026-10-03 16:20:00'),
('REP-2026-8093', 'organic', 'MEDIUM', 'Decomposing wholesale vegetable crates and fruit pulp left uncollected for 3 days outside wholesale mandi. Strong foul odor attracting stray cattle and pack flies.', 'Wholesale Mandi Gate 2, Subzi Market Road', 'Ward 15 - Old Bazaar & Textile Row', 17.3688, 78.4795, NULL, 'PENDING', FALSE, 'usr_cit_01', 'Varshini A.', '+91 94401 55667', '2026-10-04 06:10:00', '2026-10-04 06:10:00'),
('REP-2026-8094', 'construction', 'HIGH', 'Night dumping of approximately 4 metric tons of concrete demolition rubble, broken masonry slabs, and ceramic tiles obstructing the two-wheeler lane.', 'Survey No. 89, University Link Road, near East Campus Gate', 'Ward 4 - Green Park & University', 17.4125, 78.4930, NULL, 'VERIFIED', FALSE, 'usr_cit_02', 'Ramesh Rao', '+91 99882 11223', '2026-10-01 14:20:00', '2026-10-02 09:00:00'),
('REP-2026-8095', 'e-waste', 'LOW', 'Commercial shop dumped broken cathode ray monitors, charred inverter batteries, and plastic circuit casings adjacent to the transformer enclosure.', 'Electronics Lane, Opposite State Bank branch', 'Ward 12 - Civic Center & Bus Stand', 17.3871, 78.4845, NULL, 'RESOLVED', FALSE, 'usr_cit_01', 'Varshini A.', '+91 94401 55667', '2026-09-28 10:00:00', '2026-09-30 17:40:00'),
('REP-2026-8096', 'hazardous', 'CRITICAL', 'Leaking chemical drums emitting pungent chemical fumes near the public water canal inlet. Immediate municipal hazmat team intervention requested.', 'Canal Bank, Phase 2 Industrial Bypass Road', 'Ward 18 - Industrial Belt & Warehouses', 17.3620, 78.5020, NULL, 'IN_PROGRESS', TRUE, NULL, NULL, NULL, '2026-10-04 09:15:00', '2026-10-04 11:00:00'),
('REP-2026-8097', 'mixed', 'MEDIUM', 'Overflowing public secondary dumper bin with garbage scattered up to 20 meters across the road after weekend festival crowd.', 'Near Old Bus Stand Central Roundabout', 'Ward 12 - Civic Center & Bus Stand', 17.3895, 78.4770, NULL, 'RESOLVED', FALSE, 'usr_cit_03', 'Sunita Reddy', '+91 98765 43210', '2026-09-29 16:30:00', '2026-10-01 12:00:00'),
('REP-2026-8098', 'plastic', 'HIGH', 'Open burning of synthetic plastic packaging and thermocol crates behind the warehouse cluster causing dense noxious black smoke.', 'Behind Plot 12B, Warehouse Alley 4', 'Ward 18 - Industrial Belt & Warehouses', 17.3580, 78.5140, NULL, 'PENDING', FALSE, 'usr_cit_01', 'Varshini A.', '+91 94401 55667', '2026-10-05 01:20:00', '2026-10-05 01:20:00'),
('REP-2026-8099', 'organic', 'LOW', 'Piles of seasonal pruned tree branches and garden shrub cuttings left on road curb following street maintenance.', 'Park Avenue 4th Cross, Green Park Colony', 'Ward 4 - Green Park & University', 17.4190, 78.4880, NULL, 'RESOLVED', FALSE, 'usr_cit_04', 'Dr. K. Srinivas', '+91 97001 23456', '2026-09-27 08:15:00', '2026-09-28 15:00:00'),
('REP-2026-8100', 'mixed', 'MEDIUM', 'Littered plastic pouches, cups, and food wrappers on riverfront steps following weekend night bazaar.', 'Ghat Steps No. 3, Riverside Promenade', 'Ward 22 - Riverside Colony & Ghats', 17.3710, 78.4620, NULL, 'IN_PROGRESS', FALSE, 'usr_cit_01', 'Varshini A.', '+91 94401 55667', '2026-10-03 18:00:00', '2026-10-04 08:30:00');

-- 3. Seed Report Updates / Timeline History
INSERT INTO report_updates (id, report_id, status, message, updated_by, created_at) VALUES
('upd_8091_1', 'REP-2026-8091', 'PENDING', 'Citizen report logged with high severity. Assigned to Ward 7 Zonal Officer.', 'System Automated Router', '2026-10-02 08:30:00'),
('upd_8091_2', 'REP-2026-8091', 'VERIFIED', 'Field Inspector inspected stormwater drain. Verified critical blockage from non-biodegradable plastics.', 'Zonal Inspector Ward 7', '2026-10-03 09:10:00'),
('upd_8091_3', 'REP-2026-8091', 'IN_PROGRESS', 'Hydraulic desilting vehicle and 4-person sanitation crew deployed on site. Clearing drain culvert.', 'Sanitation Superintending Officer', '2026-10-04 10:15:00'),

('upd_8092_1', 'REP-2026-8092', 'PENDING', 'Anonymous biohazard report received near school zone.', 'Citizen Dispatch Desk', '2026-10-03 11:45:00'),
('upd_8092_2', 'REP-2026-8092', 'VERIFIED', 'Municipal Health Officer confirmed clinical waste dumping. Area cordoned off with safety tape; show-cause notice initiated to nearby private clinics.', 'Dr. Ananya Sen, Health Officer', '2026-10-03 16:20:00'),

('upd_8093_1', 'REP-2026-8093', 'PENDING', 'Report logged by citizen Varshini A. Queued for morning vegetable market clearing round.', 'Central Portal Dispatch', '2026-10-04 06:10:00'),

('upd_8094_1', 'REP-2026-8094', 'PENDING', 'Debris obstruction logged on University Link Road.', 'Public Complaint Line', '2026-10-01 14:20:00'),
('upd_8094_2', 'REP-2026-8094', 'VERIFIED', 'Verified obstruction. Tipper truck requested from Municipal Works Yard.', 'Ward 4 Supervisor', '2026-10-02 09:00:00'),

('upd_8095_1', 'REP-2026-8095', 'PENDING', 'Citizen reported discarded electronics near transformer.', 'Online Grievance System', '2026-09-28 10:00:00'),
('upd_8095_2', 'REP-2026-8095', 'VERIFIED', 'Commercial inspector verified hazardous heavy metals and lithium batteries.', 'Ward 12 Officer', '2026-09-29 11:20:00'),
('upd_8095_3', 'REP-2026-8095', 'IN_PROGRESS', 'Certified e-waste recycling agency vehicle dispatched.', 'Material Recovery Officer', '2026-09-30 10:00:00'),
('upd_8095_4', 'REP-2026-8095', 'RESOLVED', 'All e-waste safely collected, cataloged, and transported to municipal authorized recycling hub.', 'Material Recovery Officer', '2026-09-30 17:40:00'),

('upd_8096_1', 'REP-2026-8096', 'PENDING', 'Emergency chemical hazard alert received.', 'Civic Emergency Escalation', '2026-10-04 09:15:00'),
('upd_8096_2', 'REP-2026-8096', 'VERIFIED', 'State Pollution Control Board notified. Verified solvent drum leaks.', 'Industrial Zone Officer', '2026-10-04 10:00:00'),
('upd_8096_3', 'REP-2026-8096', 'IN_PROGRESS', 'Chemical containment crew applying neutralizing sorbents and placing overpack salvage drums.', 'Hazmat Taskforce Alpha', '2026-10-04 11:00:00'),

('upd_8097_1', 'REP-2026-8097', 'PENDING', 'Overflowing dumper bin reported by citizen Sunita Reddy.', 'Public Complaint Line', '2026-09-29 16:30:00'),
('upd_8097_2', 'REP-2026-8097', 'IN_PROGRESS', 'Compactor truck rerouted to bus stand roundabout.', 'Sanitation Dispatch', '2026-09-30 07:00:00'),
('upd_8097_3', 'REP-2026-8097', 'RESOLVED', 'Dumper emptied and surrounding pavement swept and lime-powder disinfected.', 'Sanitation Dispatch', '2026-10-01 12:00:00'),

('upd_8098_1', 'REP-2026-8098', 'PENDING', 'Open burning complaint received. Ward 18 night squad alerted.', 'Citizen Dispatch Desk', '2026-10-05 01:20:00'),

('upd_8099_1', 'REP-2026-8099', 'RESOLVED', 'Horticultural debris collected by green waste dumper truck.', 'Green Park Zone Inspector', '2026-09-28 15:00:00'),

('upd_8100_1', 'REP-2026-8100', 'PENDING', 'Report logged for promenade steps.', 'Citizen Portal', '2026-10-03 18:00:00'),
('upd_8100_2', 'REP-2026-8100', 'IN_PROGRESS', 'Morning riverfront sanitation sweep in progress.', 'Riverside Ward Supervisor', '2026-10-04 08:30:00');

-- 4. Seed Hotspot Areas
INSERT INTO hotspot_areas (id, name, ward, report_count, severity, common_category, last_reported_at, latitude, longitude, description, resolution_rate) VALUES
('HOT-01', 'Metro Junction Underpass & Stormwater Culvert', 'Ward 7 - Metro Junction & Market', 38, 'CRITICAL', 'plastic', '2026-10-04 10:15:00', 17.3980, 78.4810, 'Chronic bottleneck where multi-lane flyover footpaths meet central arterial stormwater drains. High density of single-use plastic cups, food wrappers, and commercial transit packaging.', 68),
('HOT-02', 'Industrial Chemical Canal Corridor', 'Ward 18 - Industrial Belt & Warehouses', 42, 'CRITICAL', 'hazardous', '2026-10-05 01:20:00', 17.3600, 78.5080, 'Unmonitored peripheral alleyways behind industrial sheds with repeated midnight dumping of toxic sludge, industrial paint thinners, and illegal plastic incineration heaps.', 54),
('HOT-03', 'Old Bazaar Meat & Produce Alley', 'Ward 15 - Old Bazaar & Textile Row', 29, 'HIGH', 'organic', '2026-10-04 06:10:00', 17.3710, 78.4760, 'High daily perishable volume without sufficient closed cold-storage composting bins. Rapid decay causes recurring pest hazards and runoff into neighborhood stormwater channels.', 79),
('HOT-04', 'University Link Road Expansion Stretch', 'Ward 4 - Green Park & University', 22, 'HIGH', 'construction', '2026-10-02 09:00:00', 17.4110, 78.4940, 'Unlit roadside margins frequently used by private construction contractors to dump brick rubble and excavation clay, narrowing pedestrian walking tracks.', 72),
('HOT-05', 'Civic Center Inter-State Bus Terminus', 'Ward 12 - Civic Center & Bus Stand', 19, 'MEDIUM', 'mixed', '2026-10-01 12:00:00', 17.3880, 78.4800, 'High passenger transit volume causing periodic overflowing of secondary waste bins during peak commute hours. Strong street-vendor packaging spillover.', 84),
('HOT-06', 'Riverside Promenade Weekend Ghats', 'Ward 22 - Riverside Colony & Ghats', 15, 'MEDIUM', 'plastic', '2026-10-04 08:30:00', 17.3700, 78.4630, 'Post-weekend accumulation of takeaway beverage containers and snack wrappers along the pedestrian riverfront steps and stone breakwaters.', 86);
