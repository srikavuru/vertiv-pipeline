import React, { useState, useEffect } from 'react';
import { Upload, X, GripVertical, Mail, Phone, Building, User, Calendar, Edit2, Save, MoreHorizontal, Search, Download, Trash2, Copy, Star, Menu, Pin, FileText, FileSpreadsheet } from 'lucide-react';
import Papa from 'papaparse';

// Your restored backup data
const RESTORED_BACKUP = {"boards":{"board1":{"name":"Main Board","type":"recruitment","pinned":true,"columns":{"todo":{"title":"To Do","cards":[]},"screen":{"title":"Screen","cards":[]},"inProgress":{"title":"In Progress","cards":[]},"done":{"title":"Done","cards":[]}},"_order":1770237517972,"statusOptions":["New Lead","Contacted","Qualified","Proposal Sent","Negotiating","Closed Won","Closed Lost"]},"board_1770154264914":{"name":"Tomorrow Tasks","type":"todo","pinned":true,"statusOptions":["Low","Medium","High"],"columns":{"todo":{"title":"To Do","cards":[]},"col_1770238537675":{"title":"Done","cards":[{"id":1770154298571.9448,"title":"Check in on NorCA District Manager","description":"","dueDate":"2026-02-04","priority":"Medium","completed":false,"isPriority":false,"subtasks":[]}]}},"_order":1770237517973},"board_1770129608301":{"name":"Switchgear","type":"recruitment","pinned":false,"columns":{"todo":{"title":"New Lead","cards":[]},"inProgress":{"title":"Contacted","cards":[{"id":1770137581271.007,"title":"Alexander Arenivas","fileData":null,"uploadDate":"2/3/2026","clientName":"Alexander Arenivas","companyName":"Ameresco Inc","email":"alexarenivas@gmail.com","phone":"(505) 554-5678","dealValue":"","notes":"Licensed Journeyman Electrician with 12+ years of professional experience specializing in industrial, commercial, utility and oil field projects. Holds journeyman licenses in New Mexico, Colorado, Texas, and Montana. Expertise includes electrical systems and controls, AC/DC motors and drives, PLCs, generators and transformers, troubleshooting, and PV installation/maintenance. OSHA 10/30 certified. Experience spans refineries, power plants, nuclear plants, compressor stations, and substations.","followUpDate":"2026-02-05","status":"2nd Attempt","isPriority":false},{"id":1770138246926.9517,"title":"Aden Guerra","fileData":null,"uploadDate":"2/3/2026","clientName":"Aden Guerra","companyName":"nStone Corporation","email":"adenguerra02@gmail.com","phone":"(512) 688-7311","notes":"Recent electrical engineering graduate from Texas Tech University with power electronics focus. Currently working as Associate Intern at nStone Corporation and Contractor at Sandia National Laboratories. Experience in electrical systems analysis, power distribution, PCB design, solar system design, and field verification of electrical drawings. Background includes student assistant role and search quality rating work.","followUpDate":"","status":"2nd Attempt","isPriority":false},{"id":1770140760423.718,"title":"Rosalinda Leialoha","fileData":null,"uploadDate":"2/3/2026","clientName":"Rosalinda Leialoha","companyName":"Russelectric, a Siemens Business","email":"rosalinda.leialoha@gmail.com","phone":"951-963-4844","notes":"Field Service Engineer with 30+ years in power systems for critical facilities. Expertise in LV/MV switchgear, ATS, UPS, PLC/HMI programming, SCADA/EPMS integration. Currently at Russelectric (Siemens) since 2018, specializing in commissioning, troubleshooting, and emergency response for hospitals and data centers. Bilingual English/Spanish, BS in Electrical Engineering.","followUpDate":"","status":"2nd Attempt","isPriority":false},{"id":1770222210342.6594,"title":"Jose Garcia","fileData":null,"uploadDate":"2/4/2026","clientName":"Jose Garcia","companyName":"BD","email":"13AlfonsoPena@Gmail.com","phone":"(915) 245-8173","notes":"Staff Operational Technology Engineer with 5+ years of progressive experience across electrical engineering, MES/SAP systems, and quality assurance. Background spans Schneider Electric (field service for UPS/switchgear), Lucid Motors (MES engineer driving 30% throughput increase), and BD (OT engineer managing Tulip MES in FDA-regulated medical device environments). Skills include PLC programming, SQL, Python, SolidWorks, AutoCAD, IQ/OQ/PQ validation, 21 CFR Part 11 compliance, CAPA tracking, and cross-functional project leadership. Holds a BS in Mechanical Engineering from UTEP.","followUpDate":"","status":"Contacted","isPriority":false},{"id":1770221580048.9695,"title":"Albaro Ramirez","fileData":null,"uploadDate":"2/4/2026","clientName":"Albaro Ramirez","companyName":"Schneider Electrical","email":"Ramirezalv99@gmail.com","phone":"(531) 321-1116","notes":"Electrical Testing Associate with hands-on experience in testing, troubleshooting, wiring, and quality control of low- and medium-voltage equipment such as switchgear, switchboards, panelboards, and breakers. Skilled in operating specialized test equipment including High Pot, current injectors, and multimeters. Prior experience as a Wiring Associate at Schneider Electric, Welder/Installer at Robert's Iron Works, and Weld Team Lead managing 20 welders at Kawasaki Motors. Bilingual in English and Spanish with training and leadership experience.","followUpDate":"","status":"Contacted","isPriority":false},{"id":1770222696509.6067,"title":"Atienzo, Brian FST, Switchgear El Paso, TX.pdf","fileData":null,"uploadDate":"2/4/2026","clientName":"","companyName":"","email":"","phone":"","notes":"Error extracting data from resume","followUpDate":"","status":"Contacted","isPriority":false}]},"screen":{"title":"Scheduled","cards":[{"id":1770138654522.0703,"title":"Jason Durbin","fileData":null,"uploadDate":"2/3/2026","clientName":"Jason Durbin","companyName":"Alpha Southwest-Impel","email":"jasondurbin102@gmail.com","phone":"(505) 506-8023","notes":"Journeyman Electrician with 20+ years specializing in wastewater facilities, municipal water systems, pump stations, and large-scale motor/pump operations. Expertise in PLCs, SCADA systems, VFDs, relay logic controls, and blower systems. Crew lead with experience managing teams, preparing quotes, and overseeing multiple projects. Holds Associates in Applied Science Electrical and active NM Journeyman License.","followUpDate":"","status":"Scheduled","isPriority":false},{"id":1770140288747.5115,"title":"Rene Salazar","fileData":null,"uploadDate":"2/3/2026","clientName":"Rene Salazar","companyName":"Trimad Consultants, LLC","email":"salazar2107@sbcglobal.net","phone":"(956) 522-0829","notes":"Construction Manager with extensive electrical/electronic engineering background. Experience in civil construction, HVAC systems, transmission relay work, PLC programming, and industrial automation. Holds CDL Class-A, EPA 608 certification, OSHA 30, and TDLR certifications. Skilled in welding, SCADA systems, fiber optics, and heavy equipment operation. Over 20 years of technical experience across utilities, manufacturing, and construction sectors.","followUpDate":"","status":"Scheduled","isPriority":false},{"id":1770152438650.9663,"title":"Ryan Williams","fileData":null,"uploadDate":"2/3/2026","clientName":"Ryan Williams","companyName":"Take 5 Oil Change","email":"ryansenior09@gmail.com","phone":"(318) 639-8373","notes":"Associate of Applied Science in Instrumentation and Electrical Technology (4.0 GPA, 2025). Skills in PLC Programming (ControlLogix), process control systems, instrument calibration, motor controls, and electrical theory. Work background includes lube technician, industrial and auto painting, business ownership, and U.S. Air Force crew chief with F-22 aircraft maintenance experience.","followUpDate":"","status":"Scheduled","isPriority":false}]},"done":{"title":"Done","cards":[{"id":1770129920885.0168,"title":"Nicholas Gardner","fileData":null,"uploadDate":"2/3/2026","clientName":"Nicholas Gardner","companyName":"Premier Generator","email":"gnick95.ng@gmail.com","phone":"662-891-7346","dealValue":"","notes":"Experienced electrical technician with 8+ years in the Navy (GSE 2) maintaining gas turbine engines and generators, followed by current role as Team Lead at Premier Generator since 2022. Expertise in power generation systems, troubleshooting electrical and mechanical issues, switchgear and transformer maintenance, and team leadership. Skilled in diagnostics, preventive/corrective maintenance, and ensuring compliance with OSHA, NFPA, and NEC standards. Strong background in medium-voltage systems and mission-critical environments.","followUpDate":"","status":"Screened","isPriority":false},{"id":1770129948994.199,"title":"Pete Denetclaw","fileData":null,"uploadDate":"2/3/2026","clientName":"Pete Denetclaw","companyName":"Freeport-McMoRan","email":"pdenetclaw24@gmail.com","phone":"+1(520) 539-4589","dealValue":"","notes":"Electrical and Instrumental Supervisor with extensive experience in mining operations. Expertise in motors, switchgear, instrumentation, PLCs, and control systems (24v-13kv). Skilled in DCS systems (Emerson Delta V, Rockwell RSLogix), SCADA, and process control. Strong background in preventative maintenance, team supervision (20+ members), and electrical troubleshooting. Holds Journeyman Electrician license and MSHA certification. Willing to relocate anywhere.","followUpDate":"","status":"Screened","isPriority":false},{"id":1770134874668.4731,"title":"Blayde Guidry","fileData":null,"uploadDate":"2/3/2026","clientName":"Blayde Guidry","companyName":"CMC America","email":"b.michael.guidry@gmail.com","phone":"+1 337 342 7373","dealValue":"","notes":"Site Lead Machine Technician with expertise in PLC programming (Siemens S7-1200/TIA Portal), electrical/mechanical maintenance, robotics and automation. Experienced with industrial equipment installation, NDT testing, and quality control. Strong background in manufacturing, construction, carpentry, and facilities maintenance. Holds multiple certifications including OSHA 10/30, NDT Level II, forklift, CPR/First Aid, and TWIC card. Over 10 years of heavy equipment operation and safety-focused work environments. Bilingual in Spanish (expert level) with intermediate French and ASL. Currently working at Amazon facility maintaining automated systems.","followUpDate":"","status":"Screened","isPriority":false},{"id":1770129988510.8623,"title":"Sebastian Valerio","fileData":null,"uploadDate":"2/3/2026","clientName":"Sebastian Valerio","companyName":"Schneider Electric","email":"5b4cpp28qc@privaterelay.appleid.com","phone":"+1 945 358 5199","dealValue":"","notes":"Industrial Electrician with experience in switchgear, conduit installation, high/low voltage systems, and fiber optics. Military background as Avionics Technician in U.S. Air Force. Previous experience in underground drilling operations, heavy equipment operation, and electrical apprenticeship. Bilingual (Spanish/English). Holds OSHA 30, OSHA 10, electrical licenses, and various certifications. Currently pursuing Computer Science degree at Richland College. Willing to relocate anywhere and authorized to work in US.","followUpDate":"","status":"Screened","isPriority":false},{"id":1770222196792.7224,"title":"Irvin Martinez","fileData":null,"uploadDate":"2/4/2026","clientName":"Irvin Martinez","companyName":"Schneider Electric","email":"Irvinmartinez690@gmail.com","phone":"(915) 706-1094","notes":"Electrical tester at Schneider Electric since Dec 2023, inspecting and testing electrical systems with 480VAC/24VDC for switchboard lineups. Previously a wiring tech at Schneider Electric (Oct 2020\u2013present) and an HVAC/R service technician at Delta Air (March\u2013Oct 2020). Skilled in troubleshooting electrical components (7 yrs), reading schematics, PLC programming, welding, brazing with oxy acetylene torch, and working with live cables. Holds electrical certification, EPA certification, R-410A safety certification, and HVAC diploma from Vista College.","followUpDate":"","status":"Screened","isPriority":false},{"id":1770129905296.3513,"title":"Krishna Vijapuram","fileData":null,"uploadDate":"2/3/2026","clientName":"Krishna Vijapuram","companyName":"LyondellBasell","email":"krishnavijapuram@gmail.com","phone":"+1 (314) 669-5301","dealValue":"","notes":"Electrical Systems Engineer with 4+ years experience in LV/MV power distribution (480V-33kV) in manufacturing and industrial automation. Currently at LyondellBasell (Jan 2024-Present), previously at Siemens India. Expertise in electrical distribution systems, PLC/SCADA/DCS integration, preventive maintenance, arc flash studies, and compliance with NEC/NFPA 70E/IEEE standards. Proficient in ETAP, AutoCAD Electrical, MATLAB/Simulink. Master's in IT Management from Webster University (2024), Bachelor's in Electrical Engineering from Reva University (2021). Strong track record in reliability improvement, energy optimization, and safety compliance.","followUpDate":"","status":"Screened","isPriority":false}]}},"_order":1770237517974,"statusOptions":["New Lead","Contacted","Scheduled","Screened","2nd Attempt"]},"board_1770146016330":{"name":"NorCa District Manager","type":"recruitment","pinned":false,"statusOptions":["New Lead","Contacted","Qualified"],"columns":{"todo":{"title":"To Do","cards":[]},"screen":{"title":"VM/Email","cards":[{"id":1770146078823.9685,"title":"Martin Vizcaino","fileData":null,"uploadDate":"2/3/2026","clientName":"Martin Vizcaino","companyName":"Comfort Response Team / Indoor Climate Control","email":"martinv07@hotmail.com","phone":"(707) 934-7245","notes":"20+ years of HVAC and facilities/operations experience. Owner of HVAC company managing 15+ technicians and $500K annual budget. Previous roles as Journeyman Building Engineer and Lead Building Engineer at CBRE, and HVAC Service Technician and Lead O&M Specialist at Johnson Controls. Skilled in VFDs, VRF, BMS, refrigeration, controls, energy management, CMMS (Corrigo), preventative/predictive maintenance, and compliance (OSHA, EPA 608). Holds California C-20 contractor license, EPA 608 Universal, Local 39 Journeyman, and multiple VFD/VRF certifications.","followUpDate":"","status":"Contacted","isPriority":false},{"id":1770146085551.531,"title":"Phillip Manacop","fileData":null,"uploadDate":"2/3/2026","clientName":"Phillip Manacop","companyName":"Eos Energy","email":"phillipmanacop@hotmail.com","phone":"530-515-8791","notes":"Field Service Manager with 6 years of management experience in renewable energy (BESS) and electron microscopy industries. Led teams of up to 19 direct reports. Background includes U.S. Marine Corps F/A-18 electrical systems technician. Skills include team leadership, safety program management (NFPA70E, OSHA10, LOTO, NERC), budget management, cross-department collaboration, CRM/Salesforce, and continuous improvement initiatives.","followUpDate":"","status":"New Lead","isPriority":false},{"id":1770146092725.0627,"title":"Marc Normington","fileData":null,"uploadDate":"2/3/2026","clientName":"Marc Normington","companyName":"Bonney Plumbing, Heating and Air Conditioning","email":"Normingtonmarc@yahoo.com","phone":"916-337-2098","notes":"30+ years in HVAC and Plumbing industry. Current Regional General Manager overseeing 4 companies in northern California, tripling company revenue. Previous roles include Operations Manager at Bell Brothers (oversaw growth from $20M to $50M) and Service and Install Manager at ARS Beutler. Strong in leadership, employee development, strategic business planning, and training program creation. Proficient in Service Titan. Holds C20 license, NATE and BPI certifications.","followUpDate":"","status":"New Lead","isPriority":false}]},"inProgress":{"title":"In Progress","cards":[]},"done":{"title":"Done","cards":[]}},"_order":1770237517975},"board_1770129686892":{"name":"ERS Technician","type":"recruitment","pinned":false,"columns":{"todo":{"title":"To Do","cards":[]},"screen":{"title":"Screen","cards":[{"id":1770130007069.0334,"title":"Joel Meinhardt","fileData":null,"uploadDate":"2/3/2026","clientName":"Joel Meinhardt","companyName":"QUALITY ELECTRICAL SYSTEMS","email":"jmein0110@gmail.com","phone":"435.406.7639","dealValue":"","notes":"Experienced electrical and instrumentation professional with expertise in oil filled transformers, power distribution systems up to 15kV, PLCs/DCS, relay calibration, and electrical equipment reliability. Recent role as Manager Oil Filled Transformers. Strong background in data center electrical systems, preventive maintenance, troubleshooting, and safety compliance including NFPA 70E Arc Flash certification. 17+ years experience in power generation and industrial electrical systems.","followUpDate":"","status":"New Lead","isPriority":false},{"id":1770130021126.367,"title":"Kevin Ponce","fileData":null,"uploadDate":"2/3/2026","clientName":"Kevin Ponce","companyName":"Solve Energy","email":"Kevin-ponce@sbcglobal.net","phone":"9153302142","dealValue":"","notes":"Journeyman electrician with 13 years of experience in commercial, industrial, and renewable energy projects. Graduated from IEC electrical school in 2018. Expertise includes conduit installation, panel upgrades, blueprint reading, fire alarm systems, low voltage work, fiber optic cable installation, and solar farm BESS systems. Holds OSHA 30, CDL A license, CPR certification, and boom/lift certification. Bilingual in English and Spanish.","followUpDate":"","status":"New Lead","isPriority":false}]},"inProgress":{"title":"In Progress","cards":[]},"done":{"title":"Done","cards":[]}},"_order":1770237517976,"statusOptions":["New Lead","Contacted","Qualified","Proposal Sent","Negotiating","Closed Won","Closed Lost"]},"board_1770129611380":{"name":"Busbar","type":"recruitment","pinned":false,"columns":{"todo":{"title":"To Do","cards":[]},"screen":{"title":"Screen","cards":[]},"inProgress":{"title":"In Progress","cards":[]},"done":{"title":"Done","cards":[]}},"_order":1770237517977,"statusOptions":["New Lead","Contacted","Qualified","Proposal Sent","Negotiating","Closed Won","Closed Lost"]},"board_1770129620978":{"name":"HVAC Cooling Engineer","type":"recruitment","pinned":false,"columns":{"todo":{"title":"To Do","cards":[{"id":1770236807223.5134,"title":"Ryan Barriffe","fileData":null,"uploadDate":"2/4/2026","clientName":"Ryan Barriffe","companyName":"CBRE","email":"barrifferyan@gmail.com","phone":"919-995-8999","notes":"HVAC professional with 4+ years of experience. Current Building Engineer at CBRE. Holds EPA Universal Certification, NC Heating Group 2 Contractor License, and ACCA Light Commercial Design certification. Skills include general maintenance (5 years), HVAC (4 years), electrical (3 years), and refrigeration (2 years). Previous roles include Commercial HVAC Serviceman at Johnson Controls, Service Equipment Technician at Sheetz, Equipment Tech at Lifetime Fitness, and Commercial HVAC Technician at Element Mechanical Group.","followUpDate":"","status":"New Lead","isPriority":false},{"id":1770237242300.9458,"title":"Joshua Johnson","fileData":null,"uploadDate":"2/4/2026","clientName":"Joshua Johnson","companyName":"Napa Technology LLC","email":"Joshjohnson9724@yahoo.com","phone":"(702) 351-8317","notes":"Installation/Field Technician with over 9 years of experience specializing in field service and equipment installations for high-end clients. Skilled in troubleshooting hardware/software, electrical wiring, programming, soldering, blueprints/schematics, gas/liquid leak detection, solenoid and pressurized systems, and HVAC/R. Holds EPA 608 Universal certification and multiple TPC certifications. Previously worked as Assembly/Installation Technician at Vsr Industries and Sales Associate at Office Depot.","followUpDate":"","status":"New Lead","isPriority":false},{"id":1770237249774.3518,"title":"Brent Conner","fileData":null,"uploadDate":"2/4/2026","clientName":"Brent Conner","companyName":"Data Processing Air Corporation","email":"bk.7899@outlook.com","phone":"+1(702) 469-7265","notes":"20+ years HVAC/R service technician experience in critical environments and commercial settings. Skills include troubleshooting, diagnostics, maintenance, schematic reading, EPA Universal Certification, ductwork, blueprint reading, and customer service. Previous roles include commercial HVAC technician, facilities technician at In-N-Out Burger, and HVAC/R apprentice. Vocational training in HVAC/R from San Joaquin Valley College.","followUpDate":"","status":"New Lead","isPriority":false}]},"screen":{"title":"Screen","cards":[]},"inProgress":{"title":"In Progress","cards":[]},"done":{"title":"Done","cards":[{"id":1770131594268.5884,"title":"Jeramy Backus","fileData":null,"uploadDate":"2/3/2026","clientName":"Jeramy Backus","companyName":"Air Force One","email":"backushvac1@gmail.com","phone":"+1 740 641 4849","dealValue":"","notes":"Senior HVAC-R Technician with 20+ years of experience. Currently manages ODOT contract HVAC systems including boilers, chillers, cooling towers, and various air handling units. Oversees 12 technicians statewide. Extensive background in commercial/industrial HVAC-R for hospitals, medical facilities, and institutions. Expert in refrigeration systems (CO2, propane, glycol), building automation, and complex mechanical systems. Holds EPA Universal, RETA, HVAC Excellence, and multiple EPA certifications. Skilled in troubleshooting, preventative maintenance, and leadership.","followUpDate":"","status":"New Lead","isPriority":false}]}},"_order":1770237517978,"statusOptions":["New Lead","Contacted","Qualified","Proposal Sent","Negotiating","Closed Won","Closed Lost"]},"board_1770129641345":{"name":"HR Business Partner","type":"recruitment","pinned":false,"columns":{"todo":{"title":"To Do","cards":[]},"screen":{"title":"Screen","cards":[]},"inProgress":{"title":"In Progress","cards":[]},"done":{"title":"Done","cards":[]}},"_order":1770237517980,"statusOptions":["New Lead","Contacted","Qualified","Proposal Sent","Negotiating","Closed Won","Closed Lost"]},"board_1770133240824":{"name":"AC Power","type":"recruitment","pinned":false,"columns":{"todo":{"title":"To Do","cards":[]},"screen":{"title":"Screen","cards":[{"id":1770133245231.0786,"title":"Curtis+Hill+Resume-2026.pdf","fileData":null,"uploadDate":"2/3/2026","clientName":"","companyName":"","email":"","phone":"610.420.2585","dealValue":"","notes":"Error extracting data from resume","followUpDate":"","status":"New Lead","isPriority":false}]},"inProgress":{"title":"In Progress","cards":[]},"done":{"title":"Done","cards":[]}},"_order":1770237517981,"statusOptions":["New Lead","Contacted","Qualified","Proposal Sent","Negotiating","Closed Won","Closed Lost"]}},"currentBoardId":"board_1770129608301"};

export default function PDFKanban() {
  const [boards, setBoards] = useState(null);
  const [currentBoardId, setCurrentBoardId] = useState('board1');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showNewBoardModal, setShowNewBoardModal] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardType, setNewBoardType] = useState('recruitment');
  const [editingBoardId, setEditingBoardId] = useState(null);
  const [draggedCard, setDraggedCard] = useState(null);
  const [draggedFrom, setDraggedFrom] = useState(null);
  const [draggedColumn, setDraggedColumn] = useState(null);
  const [draggedBoardId, setDraggedBoardId] = useState(null);
  const [editingColumn, setEditingColumn] = useState(null);
  const [showCRMModal, setShowCRMModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [addCardColumn, setAddCardColumn] = useState(null);
  const [newCardData, setNewCardData] = useState({
    clientName: '',
    companyName: '',
    email: '',
    phone: '',
    notes: '',
    followUpDate: '',
    status: 'New Lead'
  });
  const [newCardFile, setNewCardFile] = useState(null);
  const [showAddColumnModal, setShowAddColumnModal] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [showStatusMenu, setShowStatusMenu] = useState(null);
  const [uploadNotification, setUploadNotification] = useState(null);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [cardToMove, setCardToMove] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [showStatusManager, setShowStatusManager] = useState(false);
  const [editingStatusIndex, setEditingStatusIndex] = useState(null);
  const [newStatusName, setNewStatusName] = useState('');
  const [showCSVImportModal, setShowCSVImportModal] = useState(false);
  const [csvData, setCsvData] = useState(null);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [fieldMapping, setFieldMapping] = useState({
    clientName: '',
    email: '',
    phone: '',
    companyName: '',
    notes: '',
    status: ''
  });
  const [importToColumn, setImportToColumn] = useState('todo');
  const [lastBackupTime, setLastBackupTime] = useState(null);
  const [changesSinceBackup, setChangesSinceBackup] = useState(0);
  const [showBackupReminder, setShowBackupReminder] = useState(false);
  const [boardMenuOpen, setBoardMenuOpen] = useState(null);
  const [boardToDelete, setBoardToDelete] = useState(null);

  const columns = boards?.[currentBoardId]?.columns || {};
  const currentBoardType = boards?.[currentBoardId]?.type || 'recruitment';
  
  const setColumns = (updater) => {
    setBoards(prev => ({
      ...prev,
      [currentBoardId]: {
        ...prev[currentBoardId],
        columns: typeof updater === 'function' ? updater(prev[currentBoardId].columns) : updater
      }
    }));
  };

  const statusOptions = boards?.[currentBoardId]?.statusOptions || [
    'New Lead',
    'Contacted',
    'Qualified',
    'Proposal Sent',
    'Negotiating',
    'Closed Won',
    'Closed Lost'
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        // Try to load from storage first - NEVER wipe existing data
        const result = { value: localStorage.getItem('recruitment-boards-data') };
        if (result && result.value) {
          const savedData = JSON.parse(result.value);
          
          // Check if saved data actually has content
          const hasContent = savedData.boards && Object.keys(savedData.boards).length > 0;
          
          if (hasContent) {
            setBoards(savedData.boards);
            setCurrentBoardId(savedData.currentBoardId);
            if (savedData.lastBackupTime) {
              setLastBackupTime(savedData.lastBackupTime);
            }
          } else {
            // Storage exists but is empty - use embedded backup
            setBoards(RESTORED_BACKUP.boards);
            setCurrentBoardId(RESTORED_BACKUP.currentBoardId);
          }
        } else {
          // No storage data at all - use embedded backup as starting point
          setBoards(RESTORED_BACKUP.boards);
          setCurrentBoardId(RESTORED_BACKUP.currentBoardId);
        }
      } catch (error) {
        console.log('Error loading, using backup:', error);
        setBoards(RESTORED_BACKUP.boards);
        setCurrentBoardId(RESTORED_BACKUP.currentBoardId);
      } finally {
        setHasLoaded(true);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!boards || !hasLoaded) return;

    const checkOracleData = () => {
      try {
        const oracleData = localStorage.getItem('vertiv_oracle_import');
        if (oracleData) {
          const candidateData = JSON.parse(oracleData);
          
          const oracleBoardId = Object.entries(boards).find(([id, board]) => 
            board.name === 'Oracle Imports'
          )?.[0];

          if (oracleBoardId) {
            const newCard = {
              id: Date.now(),
              title: candidateData.name || 'Oracle Import',
              clientName: candidateData.name || '',
              email: candidateData.email || '',
              phone: candidateData.phone || '',
              companyName: candidateData.company || '',
              notes: candidateData.notes || '',
              status: 'New Lead',
              followUpDate: '',
              uploadDate: new Date().toLocaleDateString(),
              fileData: candidateData.resumeData || '',
              isPriority: false
            };

            setBoards(prev => ({
              ...prev,
              [oracleBoardId]: {
                ...prev[oracleBoardId],
                columns: {
                  ...prev[oracleBoardId].columns,
                  todo: {
                    ...prev[oracleBoardId].columns.todo,
                    cards: [...prev[oracleBoardId].columns.todo.cards, newCard]
                  }
                }
              }
            }));

            setCurrentBoardId(oracleBoardId);

            localStorage.removeItem('vertiv_oracle_import');

            setUploadNotification(`✓ Imported ${candidateData.name} from Oracle ATS!`);
            setTimeout(() => setUploadNotification(null), 3000);
          }
        }
      } catch (error) {
        console.error('Error importing Oracle data:', error);
        localStorage.removeItem('vertiv_oracle_import');
      }
    };

    checkOracleData();
  }, [boards, hasLoaded]);

  useEffect(() => {
    const saveData = async () => {
      if (!hasLoaded || !boards) return;
      
      try {
        localStorage.setItem('recruitment-boards-data', JSON.stringify({
          boards,
          currentBoardId,
          lastBackupTime,
          timestamp: Date.now()
        }));
        console.log('Data saved successfully');
      } catch (error) {
        console.error('Error saving data:', error);
      }
    };
    
    if (boards && Object.keys(boards).length > 0 && hasLoaded) {
      saveData();
      
      if (hasLoaded) {
        setChangesSinceBackup(prev => {
          const newCount = prev + 1;
          if (newCount >= 10) {
            setShowBackupReminder(true);
          }
          return newCount;
        });
      }
    }
  }, [boards, currentBoardId, hasLoaded, lastBackupTime]);

  const extractResumeData = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      const base64 = btoa(
        uint8Array.reduce((data, byte) => data + String.fromCharCode(byte), '')
      );

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "document",
                  source: {
                    type: "base64",
                    media_type: "application/pdf",
                    data: base64
                  }
                },
                {
                  type: "text",
                  text: `Extract the following information from this resume and return ONLY a JSON object with no markdown formatting or preamble:
{
  "clientName": "full name",
  "email": "email address",
  "phone": "phone number",
  "companyName": "current or most recent company",
  "notes": "brief summary of experience and skills"
}

If any field is not found, use an empty string.`
                }
              ]
            }
          ]
        })
      });

      const data = await response.json();
      const text = data.content.find(item => item.type === "text")?.text || "{}";
      const cleanText = text.replace(/```json|```/g, "").trim();
      const extracted = JSON.parse(cleanText);

      return extracted;
    } catch (error) {
      console.error("Error extracting resume data:", error);
      return {
        clientName: '',
        email: '',
        phone: '',
        companyName: '',
        notes: 'Error extracting data from resume'
      };
    }
  };

  const handleResumeUpload = async (e) => {
    const files = Array.from(e.target.files).filter(f => f.type === 'application/pdf');
    
    if (files.length === 0) {
      alert('Please select PDF files only');
      return;
    }

    setIsProcessing(true);
    
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );

      const extractedData = await extractResumeData(file);

      const newCard = {
        id: Date.now() + Math.random(),
        title: extractedData.clientName || file.name,
        fileData: base64,
        uploadDate: new Date().toLocaleDateString(),
        clientName: extractedData.clientName || '',
        companyName: extractedData.companyName || '',
        email: extractedData.email || '',
        phone: extractedData.phone || '',
        notes: extractedData.notes || '',
        followUpDate: '',
        status: 'New Lead',
        isPriority: false
      };

      setBoards(prev => ({
        ...prev,
        [currentBoardId]: {
          ...prev[currentBoardId],
          columns: {
            ...prev[currentBoardId].columns,
            todo: {
              ...prev[currentBoardId].columns.todo,
              cards: [...prev[currentBoardId].columns.todo.cards, newCard]
            }
          }
        }
      }));

      setUploadNotification(`✓ ${file.name} uploaded and attached`);
      setTimeout(() => setUploadNotification(null), 3000);

      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setIsProcessing(false);
    e.target.value = '';
  };

  const handleDragStart = (card, columnId, e) => {
    e.stopPropagation();
    setDraggedCard(card);
    setDraggedFrom(columnId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (targetColumnId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggedCard || !draggedFrom) return;

    setBoards(prev => {
      const newColumns = { ...prev[currentBoardId].columns };
      
      newColumns[draggedFrom] = {
        ...newColumns[draggedFrom],
        cards: newColumns[draggedFrom].cards.filter(c => c.id !== draggedCard.id)
      };
      
      newColumns[targetColumnId] = {
        ...newColumns[targetColumnId],
        cards: [...newColumns[targetColumnId].cards, draggedCard]
      };
      
      return {
        ...prev,
        [currentBoardId]: {
          ...prev[currentBoardId],
          columns: newColumns
        }
      };
    });

    setDraggedCard(null);
    setDraggedFrom(null);
  };

  const handleColumnDragStart = (columnId) => {
    setDraggedColumn(columnId);
  };

  const handleColumnDragOver = (e) => {
    e.preventDefault();
  };

  const handleColumnDrop = (targetColumnId) => {
    if (!draggedColumn || draggedColumn === targetColumnId) {
      setDraggedColumn(null);
      return;
    }

    setBoards(prev => {
      const entries = Object.entries(prev[currentBoardId].columns);
      const draggedIndex = entries.findIndex(([id]) => id === draggedColumn);
      const targetIndex = entries.findIndex(([id]) => id === targetColumnId);
      
      const newEntries = [...entries];
      const [removed] = newEntries.splice(draggedIndex, 1);
      newEntries.splice(targetIndex, 0, removed);
      
      return {
        ...prev,
        [currentBoardId]: {
          ...prev[currentBoardId],
          columns: Object.fromEntries(newEntries)
        }
      };
    });

    setDraggedColumn(null);
  };

  const updateColumnTitle = (columnId, newTitle) => {
    setBoards(prev => ({
      ...prev,
      [currentBoardId]: {
        ...prev[currentBoardId],
        columns: {
          ...prev[currentBoardId].columns,
          [columnId]: {
            ...prev[currentBoardId].columns[columnId],
            title: newTitle
          }
        }
      }
    }));
    setEditingColumn(null);
  };

  const deleteCard = (columnId, cardId) => {
    setColumns(prev => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        cards: prev[columnId].cards.filter(c => c.id !== cardId)
      }
    }));
  };

  const openPDF = (base64Data, filename) => {
    if (!base64Data) return;
    const blob = new Blob(
      [Uint8Array.from(atob(base64Data), c => c.charCodeAt(0))],
      { type: 'application/pdf' }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const openCRMModal = (card, columnId) => {
    setSelectedCard({ ...card, columnId });
    setShowCRMModal(true);
  };

  const updateCardCRM = () => {
    const { columnId, _sourceBoardId, _sourceColumnId, ...cardData } = selectedCard;
    
    const targetBoardId = _sourceBoardId || currentBoardId;
    const targetColumnId = _sourceColumnId || columnId;
    
    if (!boards[targetBoardId] || !boards[targetBoardId].columns[targetColumnId]) {
      setUploadNotification('✗ Error: Source board or column not found');
      setTimeout(() => setUploadNotification(null), 2000);
      setShowCRMModal(false);
      setSelectedCard(null);
      return;
    }
    
    setBoards(prev => ({
      ...prev,
      [targetBoardId]: {
        ...prev[targetBoardId],
        columns: {
          ...prev[targetBoardId].columns,
          [targetColumnId]: {
            ...prev[targetBoardId].columns[targetColumnId],
            cards: prev[targetBoardId].columns[targetColumnId].cards.map(c => 
              c.id === cardData.id ? cardData : c
            )
          }
        }
      }
    }));
    
    setShowCRMModal(false);
    setSelectedCard(null);
  };

  const fullBackup = () => {
    try {
      // Count all cards across all boards
      let totalCards = 0;
      let totalBoards = Object.keys(boards).length;
      
      Object.values(boards).forEach(board => {
        Object.values(board.columns || {}).forEach(col => {
          totalCards += (col.cards?.length || 0);
        });
      });

      const backupData = {
        boards,
        currentBoardId,
        lastBackupTime: Date.now(),
        backupVersion: '2.0',
        exportedAt: new Date().toISOString()
      };

      const dataStr = JSON.stringify(backupData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pipeline-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setLastBackupTime(Date.now());
      setChangesSinceBackup(0);
      setShowBackupReminder(false);
      
      setUploadNotification(`✓ Full backup complete! ${totalBoards} boards, ${totalCards} cards`);
      setTimeout(() => setUploadNotification(null), 3000);
    } catch (error) {
      console.error('Backup error:', error);
      setUploadNotification('✗ Backup failed');
      setTimeout(() => setUploadNotification(null), 2000);
    }
  };

  const exportData = () => {
    fullBackup();
  };

  const exportToCSV = () => {
    try {
      const allCards = [];
      Object.entries(columns).forEach(([columnId, column]) => {
        column.cards.forEach(card => {
          allCards.push({
            'Candidate Name': card.clientName || card.title || '',
            'Email': card.email || '',
            'Phone': card.phone || '',
            'Company': card.companyName || '',
            'Status': card.status || '',
            'Follow-up Date': card.followUpDate || '',
            'Notes': card.notes || '',
            'Column': column.title,
            'Upload Date': card.uploadDate || '',
            'Priority': card.isPriority ? 'Yes' : 'No'
          });
        });
      });

      if (allCards.length === 0) {
        setUploadNotification('✗ No cards to export');
        setTimeout(() => setUploadNotification(null), 2000);
        return;
      }

      const csv = Papa.unparse(allCards);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `vertiv-candidates-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setLastBackupTime(Date.now());
      setChangesSinceBackup(0);
      setShowBackupReminder(false);

      setUploadNotification(`✓ Exported ${allCards.length} candidates to CSV!`);
      setTimeout(() => setUploadNotification(null), 2000);
    } catch (error) {
      console.error('CSV export error:', error);
      setUploadNotification('✗ CSV export failed');
      setTimeout(() => setUploadNotification(null), 2000);
    }
  };

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data.length === 0) {
          setUploadNotification('✗ CSV file is empty');
          setTimeout(() => setUploadNotification(null), 2000);
          return;
        }

        setCsvData(results.data);
        setCsvHeaders(Object.keys(results.data[0]));
        setShowCSVImportModal(true);
      },
      error: (error) => {
        console.error('CSV parse error:', error);
        setUploadNotification('✗ Failed to parse CSV file');
        setTimeout(() => setUploadNotification(null), 2000);
      }
    });

    e.target.value = '';
  };

  const importCSVData = () => {
    if (!csvData || csvData.length === 0) return;

    const newCards = csvData.map((row, index) => ({
      id: Date.now() + index,
      title: row[fieldMapping.clientName] || `Candidate ${index + 1}`,
      clientName: row[fieldMapping.clientName] || '',
      email: row[fieldMapping.email] || '',
      phone: row[fieldMapping.phone] || '',
      companyName: row[fieldMapping.companyName] || '',
      notes: row[fieldMapping.notes] || '',
      status: row[fieldMapping.status] || 'New Lead',
      followUpDate: '',
      uploadDate: new Date().toLocaleDateString(),
      fileData: '',
      isPriority: false
    }));

    setBoards(prev => ({
      ...prev,
      [currentBoardId]: {
        ...prev[currentBoardId],
        columns: {
          ...prev[currentBoardId].columns,
          [importToColumn]: {
            ...prev[currentBoardId].columns[importToColumn],
            cards: [...prev[currentBoardId].columns[importToColumn].cards, ...newCards]
          }
        }
      }
    }));

    setUploadNotification(`✓ Imported ${newCards.length} candidates from CSV!`);
    setTimeout(() => setUploadNotification(null), 3000);
    
    setShowCSVImportModal(false);
    setCsvData(null);
    setCsvHeaders([]);
    setFieldMapping({
      clientName: '',
      email: '',
      phone: '',
      companyName: '',
      notes: '',
      status: ''
    });
  };

  const getTimeSinceBackup = () => {
    if (!lastBackupTime) return 'Never';
    
    const now = Date.now();
    const diff = now - lastBackupTime;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getFollowUpCards = () => {
    if (currentBoardType !== 'followup' || !boards) return { overdue: [], today: [], tomorrow: [], thisWeek: [] };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
    
    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const followUpCards = {
      overdue: [],
      today: [],
      tomorrow: [],
      thisWeek: []
    };

    Object.entries(boards).forEach(([boardId, board]) => {
      if (board.type === 'followup') return;
      
      Object.entries(board.columns || {}).forEach(([columnId, column]) => {
        (column.cards || []).forEach(card => {
          if (!card.followUpDate) return;

          const dateParts = card.followUpDate.split('-');
          const followUpDate = new Date(
            parseInt(dateParts[0]), 
            parseInt(dateParts[1]) - 1, 
            parseInt(dateParts[2])
          );

          const cardWithSource = {
            ...card,
            _sourceBoardId: boardId,
            _sourceBoardName: board.name,
            _sourceColumnId: columnId
          };

          if (followUpDate < today) {
            followUpCards.overdue.push(cardWithSource);
          } else if (followUpDate >= today && followUpDate < tomorrow) {
            followUpCards.today.push(cardWithSource);
          } else if (followUpDate >= tomorrow && followUpDate < dayAfterTomorrow) {
            followUpCards.tomorrow.push(cardWithSource);
          } else if (followUpDate >= dayAfterTomorrow && followUpDate < weekEnd) {
            followUpCards.thisWeek.push(cardWithSource);
          }
        });
      });
    });

    return followUpCards;
  };

  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (imported.boards) {
          const boardsWithDefaults = Object.fromEntries(
            Object.entries(imported.boards).map(([id, board]) => {
              const boardType = board.type || 'recruitment';
              const defaultStatuses = boardType === 'todo' 
                ? ['Low', 'Medium', 'High']
                : [
                    'New Lead',
                    'Contacted',
                    'Qualified',
                    'Proposal Sent',
                    'Negotiating',
                    'Closed Won',
                    'Closed Lost'
                  ];
              
              return [
                id,
                { 
                  ...board, 
                  type: boardType,
                  pinned: board.pinned || false,
                  statusOptions: board.statusOptions || defaultStatuses
                }
              ];
            })
          );
          setBoards(boardsWithDefaults);
          setCurrentBoardId(imported.currentBoardId || Object.keys(boardsWithDefaults)[0]);
        } else {
          setBoards({
            board1: {
              name: 'Imported Board',
              type: 'recruitment',
              pinned: false,
              statusOptions: [
                'New Lead',
                'Contacted',
                'Qualified',
                'Proposal Sent',
                'Negotiating',
                'Closed Won',
                'Closed Lost'
              ],
              columns: imported
            }
          });
          setCurrentBoardId('board1');
        }
      } catch (error) {
        alert('Error importing file. Please ensure it is a valid JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const clearAllData = async () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      setBoards({
        board1: {
          name: 'Main Board',
          type: 'recruitment',
          pinned: false,
          statusOptions: [
            'New Lead',
            'Contacted',
            'Qualified',
            'Proposal Sent',
            'Negotiating',
            'Closed Won',
            'Closed Lost'
          ],
          columns: {
            todo: { title: 'To Do', cards: [] },
            screen: { title: 'Screen', cards: [] },
            inProgress: { title: 'In Progress', cards: [] },
            done: { title: 'Done', cards: [] }
          }
        }
      });
      setCurrentBoardId('board1');
      try {
        localStorage.removeItem('recruitment-boards-data');
      } catch (error) {
        console.error('Error clearing storage:', error);
      }
    }
  };

  const createNewBoard = () => {
    if (!newBoardName.trim()) {
      alert('Please enter a board name');
      return;
    }

    const boardId = 'board_' + Date.now();
    
    let defaultColumns, defaultStatusOptions;
    
    if (newBoardType === 'followup') {
      defaultColumns = {
        overdue: { title: 'Overdue', cards: [] },
        today: { title: 'Today', cards: [] },
        tomorrow: { title: 'Tomorrow', cards: [] },
        thisWeek: { title: 'This Week', cards: [] }
      };
      defaultStatusOptions = [
        'New Lead',
        'Contacted',
        'Qualified',
        'Proposal Sent',
        'Negotiating',
        'Closed Won',
        'Closed Lost'
      ];
    } else if (newBoardType === 'todo') {
      defaultColumns = {
        todo: { title: 'To Do', cards: [] },
        inProgress: { title: 'In Progress', cards: [] },
        done: { title: 'Done', cards: [] }
      };
      defaultStatusOptions = ['Low', 'Medium', 'High'];
    } else {
      defaultColumns = {
        todo: { title: 'To Do', cards: [] },
        screen: { title: 'Screen', cards: [] },
        inProgress: { title: 'In Progress', cards: [] },
        done: { title: 'Done', cards: [] }
      };
      defaultStatusOptions = [
        'New Lead',
        'Contacted',
        'Qualified',
        'Proposal Sent',
        'Negotiating',
        'Closed Won',
        'Closed Lost'
      ];
    }

    setBoards(prev => ({
      ...prev,
      [boardId]: {
        name: newBoardName,
        type: newBoardType,
        pinned: false,
        statusOptions: defaultStatusOptions,
        columns: defaultColumns
      }
    }));
    setCurrentBoardId(boardId);
    setShowNewBoardModal(false);
    setNewBoardName('');
    setNewBoardType('recruitment');
  };

  const deleteBoard = (boardId, e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    if (Object.keys(boards).length === 1) {
      setUploadNotification('✗ Cannot delete the last board');
      setTimeout(() => setUploadNotification(null), 2000);
      return;
    }

    setBoardToDelete(boardId);
  };

  const confirmDeleteBoard = () => {
    if (!boardToDelete) return;

    const boardName = boards[boardToDelete]?.name || 'this board';

    if (currentBoardId === boardToDelete) {
      const nextBoardId = Object.keys(boards).find(id => id !== boardToDelete);
      setCurrentBoardId(nextBoardId);
    }

    setBoards(prev => {
      const newBoards = { ...prev };
      delete newBoards[boardToDelete];
      return newBoards;
    });

    setUploadNotification(`✓ Deleted "${boardName}"`);
    setTimeout(() => setUploadNotification(null), 2000);
    
    setBoardToDelete(null);
  };

  const renameBoard = (boardId, newName) => {
    if (!newName.trim()) return;
    
    setBoards(prev => ({
      ...prev,
      [boardId]: {
        ...prev[boardId],
        name: newName
      }
    }));
    setEditingBoardId(null);
  };

  const togglePinBoard = (boardId) => {
    setBoards(prev => ({
      ...prev,
      [boardId]: {
        ...prev[boardId],
        pinned: !prev[boardId].pinned
      }
    }));
  };

  const getSortedBoards = () => {
    return Object.entries(boards).sort((a, b) => {
      const [idA, boardA] = a;
      const [idB, boardB] = b;
      
      if (boardA.pinned && !boardB.pinned) return -1;
      if (!boardA.pinned && boardB.pinned) return 1;
      
      if (boardA._order && boardB._order) {
        return boardA._order - boardB._order;
      }
      
      return 0;
    });
  };

  const handleBoardDragStart = (boardId, e) => {
    e.stopPropagation();
    setDraggedBoardId(boardId);
  };

  const handleBoardDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleBoardDrop = (targetBoardId, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedBoardId || draggedBoardId === targetBoardId) {
      setDraggedBoardId(null);
      return;
    }

    const sortedBoards = getSortedBoards();
    const draggedIndex = sortedBoards.findIndex(([id]) => id === draggedBoardId);
    const targetIndex = sortedBoards.findIndex(([id]) => id === targetBoardId);
    
    const newSortedBoards = [...sortedBoards];
    const [removed] = newSortedBoards.splice(draggedIndex, 1);
    newSortedBoards.splice(targetIndex, 0, removed);
    
    const now = Date.now();
    const boardsWithOrder = Object.fromEntries(
      newSortedBoards.map(([id, board], index) => [
        id,
        { ...board, _order: now + index }
      ])
    );

    setBoards(boardsWithOrder);
    setDraggedBoardId(null);
  };

  const openAddCardModal = (columnId) => {
    setAddCardColumn(columnId);
    setShowAddCardModal(true);
    setNewCardData({
      clientName: '',
      companyName: '',
      email: '',
      phone: '',
      notes: '',
      followUpDate: '',
      status: 'New Lead'
    });
    setNewCardFile(null);
  };

  const handleNewCardFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== 'application/pdf') {
      alert('Please select a PDF file');
      return;
    }
    setNewCardFile(file);
  };

  const addNewCard = async () => {
    const boardType = boards[currentBoardId]?.type || 'recruitment';

    if (boardType === 'todo') {
      if (!newCardData.clientName.trim()) {
        alert('Please enter a task title');
        return;
      }

      const newCard = {
        id: Date.now() + Math.random(),
        title: newCardData.clientName,
        description: newCardData.notes || '',
        dueDate: newCardData.followUpDate || '',
        priority: newCardData.status || 'Medium',
        completed: false,
        isPriority: false,
        subtasks: []
      };

      setBoards(prev => ({
        ...prev,
        [currentBoardId]: {
          ...prev[currentBoardId],
          columns: {
            ...prev[currentBoardId].columns,
            [addCardColumn]: {
              ...prev[currentBoardId].columns[addCardColumn],
              cards: [...prev[currentBoardId].columns[addCardColumn].cards, newCard]
            }
          }
        }
      }));
    } else {
      if (!newCardData.clientName.trim()) {
        alert('Please enter a candidate name');
        return;
      }

      let fileData = '';
      if (newCardFile) {
        const arrayBuffer = await newCardFile.arrayBuffer();
        fileData = btoa(
          new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
      }

      const newCard = {
        id: Date.now() + Math.random(),
        title: newCardData.clientName,
        fileData: fileData,
        uploadDate: new Date().toLocaleDateString(),
        ...newCardData,
        isPriority: false
      };

      setBoards(prev => ({
        ...prev,
        [currentBoardId]: {
          ...prev[currentBoardId],
          columns: {
            ...prev[currentBoardId].columns,
            [addCardColumn]: {
              ...prev[currentBoardId].columns[addCardColumn],
              cards: [...prev[currentBoardId].columns[addCardColumn].cards, newCard]
            }
          }
        }
      }));
    }

    setShowAddCardModal(false);
    setAddCardColumn(null);
    setNewCardFile(null);
  };

  const addNewColumn = () => {
    if (!newColumnTitle.trim()) {
      alert('Please enter a column title');
      return;
    }

    const columnId = 'col_' + Date.now();
    setBoards(prev => ({
      ...prev,
      [currentBoardId]: {
        ...prev[currentBoardId],
        columns: {
          ...prev[currentBoardId].columns,
          [columnId]: {
            title: newColumnTitle,
            cards: []
          }
        }
      }
    }));

    setShowAddColumnModal(false);
    setNewColumnTitle('');
  };

  const deleteColumn = (columnId) => {
    const column = columns[columnId];
    if (column.cards.length > 0) {
      if (!window.confirm(`Delete "${column.title}" column? This will also delete ${column.cards.length} card(s).`)) {
        return;
      }
    }

    setBoards(prev => {
      const newColumns = { ...prev[currentBoardId].columns };
      delete newColumns[columnId];
      return {
        ...prev,
        [currentBoardId]: {
          ...prev[currentBoardId],
          columns: newColumns
        }
      };
    });
  };

  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setUploadNotification(`✓ ${label} copied!`);
      setTimeout(() => setUploadNotification(null), 2000);
    } catch (err) {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setUploadNotification(`✓ ${label} copied!`);
        setTimeout(() => setUploadNotification(null), 2000);
      } catch (fallbackErr) {
        console.error('Failed to copy:', err, fallbackErr);
        setUploadNotification(`✗ Failed to copy ${label}`);
        setTimeout(() => setUploadNotification(null), 2000);
      }
    }
  };

  const moveCardToBoard = (targetBoardId, targetColumnId) => {
    if (!cardToMove) return;

    const { card, sourceBoardId, sourceColumnId } = cardToMove;

    setBoards(prev => {
      const newBoards = { ...prev };

      newBoards[sourceBoardId] = {
        ...newBoards[sourceBoardId],
        columns: {
          ...newBoards[sourceBoardId].columns,
          [sourceColumnId]: {
            ...newBoards[sourceBoardId].columns[sourceColumnId],
            cards: newBoards[sourceBoardId].columns[sourceColumnId].cards.filter(c => c.id !== card.id)
          }
        }
      };

      newBoards[targetBoardId] = {
        ...newBoards[targetBoardId],
        columns: {
          ...newBoards[targetBoardId].columns,
          [targetColumnId]: {
            ...newBoards[targetBoardId].columns[targetColumnId],
            cards: [...newBoards[targetBoardId].columns[targetColumnId].cards, card]
          }
        }
      };

      return newBoards;
    });

    setShowMoveModal(false);
    setCardToMove(null);
    setShowCRMModal(false);
    setUploadNotification(`✓ Moved to ${boards[targetBoardId].name}`);
    setTimeout(() => setUploadNotification(null), 3000);
  };

  const openMoveModal = (card, columnId) => {
    setCardToMove({
      card,
      sourceBoardId: currentBoardId,
      sourceColumnId: columnId
    });
    setShowMoveModal(true);
  };

  const getCompatibleBoards = () => {
    const currentType = boards[currentBoardId]?.type;
    return Object.entries(boards).filter(([id, board]) => 
      id !== currentBoardId && board.type === currentType
    );
  };

  const addStatus = () => {
    if (!newStatusName.trim()) return;
    
    setBoards(prev => ({
      ...prev,
      [currentBoardId]: {
        ...prev[currentBoardId],
        statusOptions: [...(prev[currentBoardId].statusOptions || []), newStatusName.trim()]
      }
    }));
    setNewStatusName('');
  };

  const updateStatus = (index, newName) => {
    if (!newName.trim()) return;
    
    const oldStatus = statusOptions[index];
    
    setBoards(prev => {
      const newBoards = { ...prev };
      
      newBoards[currentBoardId].statusOptions[index] = newName.trim();
      
      Object.keys(newBoards[currentBoardId].columns).forEach(colId => {
        newBoards[currentBoardId].columns[colId].cards = 
          newBoards[currentBoardId].columns[colId].cards.map(card => 
            card.status === oldStatus ? { ...card, status: newName.trim() } : card
          );
      });
      
      return newBoards;
    });
    
    setEditingStatusIndex(null);
  };

  const deleteStatus = (index) => {
    const statusToDelete = statusOptions[index];
    const hasCardsWithStatus = Object.values(columns).some(col => 
      col.cards.some(card => card.status === statusToDelete)
    );
    
    if (hasCardsWithStatus) {
      if (!window.confirm(`Some cards use the status "${statusToDelete}". Delete anyway? Cards will keep their status value.`)) {
        return;
      }
    }
    
    setBoards(prev => ({
      ...prev,
      [currentBoardId]: {
        ...prev[currentBoardId],
        statusOptions: prev[currentBoardId].statusOptions.filter((_, i) => i !== index)
      }
    }));
  };

  const togglePriority = (columnId, cardId) => {
    setColumns(prev => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        cards: prev[columnId].cards.map(c => 
          c.id === cardId ? { ...c, isPriority: !c.isPriority } : c
        )
      }
    }));
  };

  const sortCardsByPriority = (cards) => {
    return [...cards].sort((a, b) => {
      if (a.isPriority && !b.isPriority) return -1;
      if (!a.isPriority && b.isPriority) return 1;
      return 0;
    });
  };

  const updateCardStatus = (columnId, cardId, newStatus) => {
    setColumns(prev => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        cards: prev[columnId].cards.map(c => 
          c.id === cardId ? { ...c, status: newStatus } : c
        )
      }
    }));
    setShowStatusMenu(null);
  };

  const filterCards = (cards) => {
    return cards.filter(card => {
      const matchesSearch = searchQuery === '' || 
        card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (card.clientName && card.clientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (card.email && card.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (card.companyName && card.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (card.notes && card.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (card.description && card.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = filterStatus === 'all' || 
        (card.status === filterStatus) ||
        (card.priority === filterStatus);

      return matchesSearch && matchesStatus;
    });
  };

  const renderTodoCard = (card, columnId) => (
    <div
      key={card.id}
      draggable
      onDragStart={(e) => handleDragStart(card, columnId, e)}
      onClick={() => openCRMModal(card, columnId)}
      className="group relative"
      style={{ cursor: 'pointer' }}
    >
      <div
        className="bg-white rounded-lg shadow hover:shadow-lg transition-all border-l-4"
        style={{
          padding: '10px 12px',
          borderLeftColor: card.isPriority ? '#FFD700' : '#E84E26'
        }}
      >
        <div className="flex items-start justify-between mb-2">
          <h3 className="flex-1 text-sm font-bold text-gray-900 leading-tight">
            {card.title}
          </h3>
          <div className="flex items-center gap-1 ml-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePriority(columnId, card.id);
              }}
              className="text-gray-400 hover:text-yellow-500 transition-all flex-shrink-0"
              title={card.isPriority ? "Remove priority" : "Mark as priority"}
            >
              <Star 
                className="w-4 h-4" 
                fill={card.isPriority ? '#FFD700' : 'none'}
                stroke={card.isPriority ? '#FFD700' : 'currentColor'}
              />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); deleteCard(columnId, card.id); }}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 flex-shrink-0 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {card.description && (
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">{card.description}</p>
        )}

        <div className="space-y-1.5">
          {card.dueDate && (
            <div className="flex items-center gap-1.5 text-xs text-orange-600">
              <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{card.dueDate}</span>
            </div>
          )}
          {card.priority && (
            <div className="inline-block px-2 py-0.5 rounded text-xs font-semibold" style={{
              backgroundColor: card.priority === 'High' ? '#FEE2E2' : card.priority === 'Medium' ? '#FEF3C7' : '#DBEAFE',
              color: card.priority === 'High' ? '#991B1B' : card.priority === 'Medium' ? '#92400E' : '#1E40AF'
            }}>
              {card.priority}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end mt-3 pt-2 border-t border-gray-100">
          <button
            onClick={(e) => { e.stopPropagation(); openCRMModal(card, columnId); }}
            className="text-xs font-semibold flex items-center gap-1 transition-colors hover:text-orange-600"
            style={{ color: '#E84E26' }}
          >
            <Edit2 className="w-3 h-3" />
            Edit
          </button>
        </div>
      </div>
    </div>
  );

  const renderRecruitmentCard = (card, columnId) => (
    <div
      key={card.id}
      draggable
      onDragStart={(e) => handleDragStart(card, columnId, e)}
      onClick={() => openCRMModal(card, columnId)}
      className="group relative"
      style={{ cursor: 'pointer' }}
    >
      <div
        className="bg-white rounded-lg shadow hover:shadow-lg transition-all border-l-4"
        style={{
          padding: '10px 12px',
          borderLeftColor: card.isPriority ? '#FFD700' : '#E84E26'
        }}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {card.fileData && (
              <FileText 
                className="w-4 h-4 flex-shrink-0 text-orange-600" 
                title="Resume attached"
              />
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (card.fileData) openPDF(card.fileData, card.title);
              }}
              className="flex-1 text-left"
              disabled={!card.fileData}
            >
              <h3 className={`text-sm font-bold text-gray-900 leading-tight transition-colors ${card.fileData ? 'hover:text-orange-600 cursor-pointer' : ''}`}>
                {card.title}
              </h3>
            </button>
          </div>
          <div className="flex items-center gap-1 ml-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePriority(columnId, card.id);
              }}
              className="text-gray-400 hover:text-yellow-500 transition-all flex-shrink-0"
              title={card.isPriority ? "Remove priority" : "Mark as priority"}
            >
              <Star 
                className="w-4 h-4" 
                fill={card.isPriority ? '#FFD700' : 'none'}
                stroke={card.isPriority ? '#FFD700' : 'currentColor'}
              />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); deleteCard(columnId, card.id); }}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 flex-shrink-0 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          {card.uploadDate && card.fileData && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500 italic">
              <FileText className="w-3 h-3 flex-shrink-0" />
              <span>Uploaded {card.uploadDate}</span>
            </div>
          )}
          {card.companyName && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <Building className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#E84E26' }} />
              <span className="truncate">{card.companyName}</span>
            </div>
          )}
          {card.email && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <Mail className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#E84E26' }} />
              <a
                href={`mailto:${card.email}?subject=${encodeURIComponent('Opportunity at Vertiv')}`}
                onClick={(e) => e.stopPropagation()}
                className="truncate flex-1 hover:text-orange-600 hover:underline transition-colors"
                title="Send email"
              >
                {card.email}
              </a>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(card.email, 'Email');
                }}
                className="text-gray-400 hover:text-indigo-600 transition-all p-0.5 flex-shrink-0"
                title="Copy email"
                type="button"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
          )}
          {card.phone && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <Phone className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#E84E26' }} />
              <span className="truncate flex-1">{card.phone}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(card.phone, 'Phone');
                }}
                className="text-gray-400 hover:text-indigo-600 transition-all p-0.5 flex-shrink-0"
                title="Copy phone"
                type="button"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
          )}
          {card.followUpDate && (
            <div className="flex items-center gap-1.5 text-xs text-orange-600">
              <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{card.followUpDate}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {card.status && (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowStatusMenu(showStatusMenu === card.id ? null : card.id);
                  }}
                  className="inline-block px-2 py-0.5 rounded text-xs font-semibold hover:opacity-80 transition-opacity"
                  style={{
                    backgroundColor: '#FFF3F0',
                    color: '#E84E26'
                  }}
                >
                  {card.status}
                </button>
                
                {showStatusMenu === card.id && (
                  <div className="absolute bottom-full left-0 mb-1 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 min-w-[150px]">
                    {statusOptions.map(status => (
                      <button
                        key={status}
                        onClick={(e) => {
                          e.stopPropagation();
                          updateCardStatus(columnId, card.id, status);
                        }}
                        className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 transition-colors"
                        style={{
                          color: card.status === status ? '#E84E26' : '#374151',
                          fontWeight: card.status === status ? '600' : '400'
                        }}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            {card.fileData && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openPDF(card.fileData, card.title);
                }}
                className="text-xs font-semibold flex items-center gap-1 transition-colors hover:text-orange-600 text-gray-600"
                title="Download resume"
              >
                <Download className="w-3 h-3" />
                Resume
              </button>
            )}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); openCRMModal(card, columnId); }}
            className="text-xs font-semibold flex items-center gap-1 ml-auto transition-colors hover:text-orange-600"
            style={{ color: '#E84E26' }}
          >
            <Edit2 className="w-3 h-3" />
            Edit
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' }}>
      {!boards ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-white text-lg font-semibold">Loading your data...</div>
          </div>
        </div>
      ) : (
        <>
      {showStatusMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowStatusMenu(null)}
        />
      )}

      {uploadNotification && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <FileText className="w-5 h-5" />
          <span className="font-medium">{uploadNotification}</span>
        </div>
      )}
      
      <div className="px-6 py-4 flex items-center justify-between border-b" style={{ backgroundColor: '#000000', borderColor: '#333333' }}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-white hover:bg-white hover:bg-opacity-10 p-2 rounded transition-colors"
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded flex items-center justify-center font-bold text-white text-xl" style={{ backgroundColor: '#E84E26' }}>
              V
            </div>
            <h1 className="text-xl font-bold text-white">Vertiv Screening Pipeline</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={fullBackup}
            className="inline-flex items-center gap-2 px-4 py-2 rounded transition-all text-sm font-semibold text-white shadow-lg hover:opacity-90"
            style={{ backgroundColor: '#E84E26' }}
            title="Full Backup - All Boards & Cards"
          >
            <Download className="w-4 h-4" />
            Backup All
          </button>

          <div className="px-3 py-2 rounded bg-white bg-opacity-10 text-white text-xs font-medium">
            Last backup: {getTimeSinceBackup()}
          </div>

          <div className="w-px h-6 bg-white bg-opacity-20"></div>

          <button
            onClick={exportToCSV}
            className="inline-flex items-center gap-2 px-3 py-2 rounded hover:bg-white hover:bg-opacity-10 transition-all text-sm font-semibold text-white"
            title="Export Current Board to CSV"
          >
            <FileSpreadsheet className="w-4 h-4" />
            CSV
          </button>

          <label className="inline-flex items-center gap-2 px-3 py-2 rounded hover:bg-white hover:bg-opacity-10 transition-all cursor-pointer text-sm font-semibold text-white" title="Import CSV">
            <FileSpreadsheet className="w-4 h-4" />
            Import CSV
            <input
              type="file"
              accept=".csv"
              onChange={handleCSVUpload}
              className="hidden"
            />
          </label>

          <label className="inline-flex items-center px-3 py-2 rounded hover:bg-white hover:bg-opacity-10 transition-all cursor-pointer text-sm font-semibold text-white" title="Import JSON Data">
            <Upload className="w-4 h-4" />
            <input
              type="file"
              accept="application/json"
              onChange={importData}
              className="hidden"
            />
          </label>

          <button
            onClick={clearAllData}
            className="inline-flex items-center px-3 py-2 rounded hover:bg-white hover:bg-opacity-10 transition-all text-sm font-semibold text-white"
            title="Clear All Data"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {currentBoardType === 'recruitment' && (
            <label className="inline-flex items-center px-4 py-2 rounded hover:opacity-90 transition-all cursor-pointer text-sm font-semibold text-white shadow-lg" style={{ backgroundColor: '#E84E26' }}>
              <User className="w-4 h-4 mr-2" />
              {isProcessing ? 'Processing...' : 'Upload Resume'}
              <input
                type="file"
                multiple
                accept="application/pdf"
                onChange={handleResumeUpload}
                disabled={isProcessing}
                className="hidden"
              />
            </label>
          )}

          {currentBoardType === 'followup' && (
            <div className="px-4 py-2 rounded text-sm font-medium text-white bg-white bg-opacity-10">
              📞 Auto-updated call list from all boards
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div 
          className="border-r transition-all duration-300 flex flex-col"
          style={{ 
            width: sidebarCollapsed ? '0px' : '280px',
            backgroundColor: '#1a1a1a',
            borderColor: '#333333',
            overflow: 'hidden'
          }}
        >
          <div className="p-4 border-b" style={{ borderColor: '#333333' }}>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Boards</h2>
            <button
              onClick={() => setShowNewBoardModal(true)}
              className="w-full px-3 py-2 text-sm font-semibold text-white rounded transition-colors flex items-center justify-center gap-2 hover:opacity-90"
              style={{ backgroundColor: '#E84E26' }}
            >
              <span className="text-lg">+</span>
              New Board
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {getSortedBoards().map(([boardId, board], index, array) => {
              const isPinned = board.pinned;
              const nextBoard = array[index + 1];
              const showDivider = isPinned && nextBoard && !nextBoard[1].pinned;
              
              return (
                <>
                  <div
                    key={boardId}
                    draggable
                    onDragStart={(e) => handleBoardDragStart(boardId, e)}
                    onDragOver={handleBoardDragOver}
                    onDrop={(e) => handleBoardDrop(boardId, e)}
                    className={`group mb-1 rounded-lg transition-all ${
                      currentBoardId === boardId 
                        ? 'bg-white bg-opacity-10' 
                        : 'hover:bg-white hover:bg-opacity-5'
                    }`}
                    style={{
                      opacity: draggedBoardId === boardId ? 0.5 : 1,
                      cursor: draggedBoardId === boardId ? 'grabbing' : 'grab'
                    }}
                  >
                    {editingBoardId === boardId ? (
                      <input
                        type="text"
                        defaultValue={board.name}
                        autoFocus
                        onBlur={(e) => renameBoard(boardId, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            renameBoard(boardId, e.target.value);
                          } else if (e.key === 'Escape') {
                            setEditingBoardId(null);
                          }
                        }}
                        className="w-full px-3 py-2 bg-transparent text-white text-sm font-medium outline-none border-b-2"
                        style={{ borderColor: '#E84E26' }}
                        onClick={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <div className="flex items-center justify-between px-3 py-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <GripVertical className="w-4 h-4 text-gray-500 flex-shrink-0" />
                          {board.pinned && (
                            <Pin 
                              className="w-3.5 h-3.5 flex-shrink-0" 
                              fill="#E84E26"
                              stroke="#E84E26"
                            />
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentBoardId(boardId);
                            }}
                            className="flex-1 text-left text-sm font-medium text-white truncate"
                          >
                            {board.name}
                          </button>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setBoardMenuOpen(boardMenuOpen === boardId ? null : boardId);
                              }}
                              className="p-1 text-gray-400 hover:text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Board options"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                            
                            {boardMenuOpen === boardId && (
                              <>
                                <div 
                                  className="fixed inset-0 z-40" 
                                  onClick={() => setBoardMenuOpen(null)}
                                />
                                <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 min-w-[160px]">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setBoardMenuOpen(null);
                                      togglePinBoard(boardId);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors flex items-center gap-2 text-gray-700"
                                  >
                                    <Pin className="w-4 h-4" />
                                    {board.pinned ? 'Unpin Board' : 'Pin Board'}
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setBoardMenuOpen(null);
                                      setEditingBoardId(boardId);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors flex items-center gap-2 text-gray-700"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                    Rename Board
                                  </button>
                                  {Object.keys(boards).length > 1 && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setBoardMenuOpen(null);
                                        deleteBoard(boardId, e);
                                      }}
                                      className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 transition-colors flex items-center gap-2 text-red-600"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                      Delete Board
                                    </button>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {showDivider && (
                    <div key={`divider-${boardId}`} className="my-2 mx-3 border-t border-gray-700" />
                  )}
                </>
              );
            })}
          </div>

          <div className="p-4 border-t" style={{ borderColor: '#333333' }}>
            <div className="text-xs text-gray-400 space-y-1">
              <div>{Object.keys(boards).length} {Object.keys(boards).length === 1 ? 'board' : 'boards'}</div>
              {Object.values(boards).filter(b => b.pinned).length > 0 && (
                <div className="flex items-center gap-1">
                  <Pin className="w-3 h-3" style={{ color: '#E84E26' }} />
                  <span>{Object.values(boards).filter(b => b.pinned).length} pinned</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 py-3 flex items-center gap-4" style={{ backgroundColor: '#1a1a1a', borderBottom: '1px solid #333333' }}>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search candidates by name, email, company, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black bg-opacity-30 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-black bg-opacity-30 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors"
            >
              <option value="all">All {currentBoardType === 'todo' ? 'Priorities' : 'Statuses'}</option>
              {currentBoardType === 'todo' ? (
                <>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </>
              ) : (
                statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))
              )}
            </select>

            {currentBoardType === 'recruitment' && (
              <button
                onClick={() => setShowStatusManager(true)}
                className="px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors flex items-center gap-2 hover:opacity-90"
                style={{ backgroundColor: '#E84E26' }}
                title="Manage status options"
              >
                <Edit2 className="w-4 h-4" />
                Manage Statuses
              </button>
            )}

            {(searchQuery || filterStatus !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterStatus('all');
                }}
                className="px-4 py-2 text-sm font-semibold text-white hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>

          <div className="flex-1 overflow-x-auto overflow-y-hidden px-6 py-4">
            <div className="flex gap-4 h-full">
              {currentBoardType === 'followup' ? (
                Object.entries({ overdue: 'Overdue', today: 'Today', tomorrow: 'Tomorrow', thisWeek: 'This Week' }).map(([columnId, columnTitle]) => {
                  const followUpCards = getFollowUpCards();
                  const columnCards = followUpCards[columnId] || [];
                  const filteredCards = filterCards(columnCards);

                  return (
                    <div
                      key={columnId}
                      className="flex-shrink-0 w-72 flex flex-col"
                    >
                      <div className="px-3 py-2.5 flex items-center justify-between mb-2 rounded-t-lg" style={{ backgroundColor: '#1a1a1a' }}>
                        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                          {columnTitle}
                        </h2>
                        <span className="text-xs text-white px-2 py-1 rounded font-semibold" style={{ backgroundColor: columnId === 'overdue' ? '#DC2626' : '#E84E26' }}>
                          {filteredCards.length}
                        </span>
                      </div>

                      <div
                        className="flex-1 px-2 py-2 overflow-y-auto rounded-lg space-y-2.5"
                        style={{ 
                          backgroundColor: '#262626',
                          minHeight: '100px'
                        }}
                      >
                        {filteredCards.length === 0 && (searchQuery || filterStatus !== 'all') ? (
                          <div className="text-center py-8 text-gray-500 text-sm">
                            No matching candidates
                          </div>
                        ) : filteredCards.length === 0 ? (
                          <div className="text-center py-8 text-gray-500 text-sm">
                            No follow-ups scheduled
                          </div>
                        ) : (
                          sortCardsByPriority(filteredCards).map(card => {
                            return (
                              <div 
                                key={`${card._sourceBoardId}-${card.id}`} 
                                className="relative cursor-pointer"
                                onClick={() => openCRMModal(card, card._sourceColumnId)}
                              >
                                <div className="absolute top-2 right-2 z-10">
                                  <div className="text-xs px-2 py-1 rounded font-semibold text-white" style={{ backgroundColor: '#1a1a1a' }}>
                                    {card._sourceBoardName}
                                  </div>
                                </div>
                                <div className="pointer-events-none">
                                  {renderRecruitmentCard(card, card._sourceColumnId)}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                Object.entries(columns).map(([columnId, column]) => {
                  const filteredCards = filterCards(column.cards);
                  return (
                    <div
                      key={columnId}
                      draggable
                      onDragStart={() => handleColumnDragStart(columnId)}
                      onDragOver={handleColumnDragOver}
                      onDrop={() => handleColumnDrop(columnId)}
                      className="flex-shrink-0 w-72 flex flex-col"
                      style={{
                        opacity: draggedColumn === columnId ? 0.5 : 1
                      }}
                    >
                      <div className="px-3 py-2.5 flex items-center justify-between mb-2 rounded-t-lg cursor-move" style={{ backgroundColor: '#1a1a1a' }}>
                        {editingColumn === columnId ? (
                          <input
                            type="text"
                            defaultValue={column.title}
                            autoFocus
                            onBlur={(e) => updateColumnTitle(columnId, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                updateColumnTitle(columnId, e.target.value);
                              } else if (e.key === 'Escape') {
                                setEditingColumn(null);
                              }
                            }}
                            className="text-sm font-bold text-white uppercase tracking-wider bg-transparent border-b-2 outline-none px-1"
                            style={{ borderColor: '#E84E26' }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <h2 
                            className="text-sm font-bold text-white uppercase tracking-wider cursor-pointer hover:text-gray-300"
                            onClick={() => setEditingColumn(columnId)}
                          >
                            {column.title}
                          </h2>
                        )}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-white px-2 py-1 rounded font-semibold" style={{ backgroundColor: '#E84E26' }}>
                            {filteredCards.length}
                          </span>
                          <button 
                            onClick={() => deleteColumn(columnId)}
                            className="text-gray-400 hover:text-red-400 rounded p-1 hover:bg-white hover:bg-opacity-10"
                            title="Delete Column"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(columnId, e)}
                        className="flex-1 px-2 py-2 overflow-y-auto rounded-lg space-y-2.5"
                        style={{ 
                          backgroundColor: '#262626',
                          minHeight: '100px'
                        }}
                      >
                        {filteredCards.length === 0 && (searchQuery || filterStatus !== 'all') ? (
                          <div className="text-center py-8 text-gray-500 text-sm">
                            No matching candidates
                          </div>
                        ) : (
                          sortCardsByPriority(filteredCards).map(card => 
                            currentBoardType === 'todo'
                              ? renderTodoCard(card, columnId)
                              : renderRecruitmentCard(card, columnId)
                          )
                        )}
                      </div>

                      <button 
                        onClick={() => openAddCardModal(columnId)}
                        className="mt-2 px-3 py-2 text-sm text-gray-400 hover:text-white rounded-lg transition-colors text-left font-medium hover:bg-white hover:bg-opacity-5"
                      >
                        + Add a card
                      </button>
                    </div>
                  );
                })
              )}

              {currentBoardType !== 'followup' && (
                <div className="flex-shrink-0 w-72">
                  <button
                    onClick={() => setShowAddColumnModal(true)}
                    className="w-full px-4 py-3 text-white bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg transition-colors font-semibold text-sm flex items-center justify-center gap-2"
                  >
                    <span className="text-xl">+</span>
                    Add Column
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add remaining modals here - I'll continue in next message if needed */}
      
      {/* New Board Modal */}
      {showNewBoardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="px-6 py-4 flex items-center justify-between border-b-4" style={{ borderBottomColor: '#E84E26' }}>
              <h2 className="text-xl font-bold text-gray-800">Create New Board</h2>
              <button
                onClick={() => {
                  setShowNewBoardModal(false);
                  setNewBoardName('');
                  setNewBoardType('recruitment');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Board Name</label>
                <input
                  type="text"
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  placeholder="e.g., Data Center Technicians"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none text-sm"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') createNewBoard();
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Board Type</label>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => setNewBoardType('recruitment')}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      newBoardType === 'recruitment' 
                        ? 'border-orange-500 bg-orange-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-800">📋 Recruitment Pipeline</div>
                    <div className="text-xs text-gray-500 mt-1">Track candidates through your hiring process</div>
                  </button>
                  
                  <button
                    onClick={() => setNewBoardType('todo')}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      newBoardType === 'todo' 
                        ? 'border-orange-500 bg-orange-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-800">✅ To-Do List</div>
                    <div className="text-xs text-gray-500 mt-1">Simple task management with priorities</div>
                  </button>
                  
                  <button
                    onClick={() => setNewBoardType('followup')}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      newBoardType === 'followup' 
                        ? 'border-orange-500 bg-orange-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-800">📞 Follow-Up Dashboard</div>
                    <div className="text-xs text-gray-500 mt-1">See all candidates with follow-up dates from all boards</div>
                  </button>
                </div>
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  onClick={createNewBoard}
                  className="flex-1 py-3 px-4 rounded-lg font-bold text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: '#E84E26' }}
                >
                  Create Board
                </button>
                <button
                  onClick={() => {
                    setShowNewBoardModal(false);
                    setNewBoardName('');
                    setNewBoardType('recruitment');
                  }}
                  className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Status Manager Modal */}
      {showStatusManager && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 flex items-center justify-between border-b-4" style={{ borderBottomColor: '#E84E26' }}>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Manage Statuses</h2>
                <p className="text-sm text-gray-500 mt-0.5">For {boards[currentBoardId]?.name}</p>
              </div>
              <button
                onClick={() => {
                  setShowStatusManager(false);
                  setEditingStatusIndex(null);
                  setNewStatusName('');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-2 mb-4">
                {statusOptions.map((status, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    {editingStatusIndex === index ? (
                      <input
                        type="text"
                        defaultValue={status}
                        autoFocus
                        className="flex-1 px-3 py-1 border rounded text-sm"
                        onBlur={(e) => {
                          if (e.target.value.trim() && e.target.value !== status) {
                            const newBoards = { ...boards };
                            newBoards[currentBoardId].statusOptions[index] = e.target.value.trim();
                            // Update cards with old status
                            Object.values(newBoards[currentBoardId].columns).forEach(col => {
                              col.cards.forEach(card => {
                                if (card.status === status) {
                                  card.status = e.target.value.trim();
                                }
                              });
                            });
                            setBoards(newBoards);
                          }
                          setEditingStatusIndex(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') e.target.blur();
                          if (e.key === 'Escape') setEditingStatusIndex(null);
                        }}
                      />
                    ) : (
                      <>
                        <span className="flex-1 text-sm font-medium text-gray-700">{status}</span>
                        <button
                          onClick={() => setEditingStatusIndex(index)}
                          className="p-1 hover:bg-gray-200 rounded"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4 text-gray-500" />
                        </button>
                        <button
                          onClick={() => {
                            const indexToDelete = index;
                            setBoards(prev => ({
                              ...prev,
                              [currentBoardId]: {
                                ...prev[currentBoardId],
                                statusOptions: prev[currentBoardId].statusOptions.filter((_, i) => i !== indexToDelete)
                              }
                            }));
                          }}
                          className="p-1 hover:bg-red-100 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newStatusName}
                  onChange={(e) => setNewStatusName(e.target.value)}
                  placeholder="New status name..."
                  className="flex-1 px-3 py-2 border rounded-lg text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newStatusName.trim()) {
                      setBoards(prev => ({
                        ...prev,
                        [currentBoardId]: {
                          ...prev[currentBoardId],
                          statusOptions: [...(prev[currentBoardId].statusOptions || []), newStatusName.trim()]
                        }
                      }));
                      setNewStatusName('');
                    }
                  }}
                />
                <button
                  onClick={() => {
                    if (newStatusName.trim()) {
                      setBoards(prev => ({
                        ...prev,
                        [currentBoardId]: {
                          ...prev[currentBoardId],
                          statusOptions: [...(prev[currentBoardId].statusOptions || []), newStatusName.trim()]
                        }
                      }));
                      setNewStatusName('');
                    }
                  }}
                  className="px-4 py-2 text-white rounded-lg font-semibold text-sm"
                  style={{ backgroundColor: '#E84E26' }}
                >
                  Add
                </button>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t bg-gray-50">
              <button
                onClick={() => {
                  setShowStatusManager(false);
                  setEditingStatusIndex(null);
                  setNewStatusName('');
                }}
                className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold text-gray-700 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* CRM Edit Modal */}
      {showCRMModal && selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 flex items-center justify-between border-b-4" style={{ borderBottomColor: '#E84E26' }}>
              <h2 className="text-xl font-bold text-gray-800">Edit Record</h2>
              <button
                onClick={() => {
                  setShowCRMModal(false);
                  setSelectedCard(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Name / Title</label>
                <input
                  type="text"
                  value={selectedCard.title || ''}
                  onChange={(e) => setSelectedCard({...selectedCard, title: e.target.value})}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={selectedCard.email || ''}
                    onChange={(e) => setSelectedCard({...selectedCard, email: e.target.value})}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={selectedCard.phone || ''}
                    onChange={(e) => setSelectedCard({...selectedCard, phone: e.target.value})}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Company</label>
                  <input
                    type="text"
                    value={selectedCard.companyName || ''}
                    onChange={(e) => setSelectedCard({...selectedCard, companyName: e.target.value})}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                  <select
                    value={selectedCard.status || ''}
                    onChange={(e) => setSelectedCard({...selectedCard, status: e.target.value})}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                  >
                    <option value="">Select status</option>
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Follow-up Date</label>
                <input
                  type="date"
                  value={selectedCard.followUpDate || ''}
                  onChange={(e) => setSelectedCard({...selectedCard, followUpDate: e.target.value})}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
                <textarea
                  value={selectedCard.notes || ''}
                  onChange={(e) => setSelectedCard({...selectedCard, notes: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none resize-none"
                />
              </div>

              {selectedCard._sourceBoardName && (
                <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                  From board: <span className="font-semibold">{selectedCard._sourceBoardName}</span>
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 border-t bg-gray-50 flex gap-3">
              <button
                onClick={() => openMoveModal(selectedCard, selectedCard.columnId)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-gray-700 flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Move
              </button>
              <button
                onClick={updateCardCRM}
                className="flex-1 py-2 px-4 rounded-lg font-bold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: '#E84E26' }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {boardToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="px-6 py-4 flex items-center justify-between border-b-4" style={{ borderBottomColor: '#E84E26' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-100">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Delete Board?</h2>
                  <p className="text-sm text-gray-500 mt-0.5">This action cannot be undone</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  You are about to delete <span className="font-bold">"{boards[boardToDelete]?.name}"</span>.
                </p>
                {boards[boardToDelete] && Object.values(boards[boardToDelete].columns || {}).reduce((sum, col) => sum + (col.cards?.length || 0), 0) > 0 && (
                  <p className="text-sm text-gray-700 mt-2">
                    This board contains <span className="font-bold">{Object.values(boards[boardToDelete].columns || {}).reduce((sum, col) => sum + (col.cards?.length || 0), 0)} card(s)</span> which will also be deleted.
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={confirmDeleteBoard}
                  className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-all font-bold flex items-center justify-center gap-2 shadow-lg"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Board
                </button>
                <button
                  onClick={() => setBoardToDelete(null)}
                  className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}