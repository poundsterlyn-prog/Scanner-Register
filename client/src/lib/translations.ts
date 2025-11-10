export type Language = "en" | "nl";

export const translations = {
  en: {
    // Login
    loginTitle: "Scanner Tracker",
    loginSubtitle: "Delivery Scanner Management System",
    username: "Username",
    password: "Password",
    enterUsername: "Enter your username",
    enterPassword: "Enter your password",
    login: "Login",
    
    // TopBar
    logout: "Logout",
    
    // Dashboard
    allScanners: "All Scanners",
    
    // Scanner Status
    available: "Available",
    assigned: "Assigned",
    returned: "Returned",
    overdue: "Overdue",
    pending: "Pending",
    
    // Summary Cards
    totalAssigned: "Total Assigned",
    totalReturned: "Total Returned",
    pendingReturns: "Pending Returns",
    
    // Quick Actions
    quickActions: "Quick Actions",
    assignScanner: "Assign Scanner",
    scanToAssign: "Scan to assign to driver",
    returnScanner: "Return Scanner",
    scanToReturn: "Scan to mark as returned",
    registerScanner: "Register Scanner",
    addNewScanner: "Add new scanner",
    viewReport: "View Report",
    dailySummary: "Daily summary",
    manageDrivers: "Manage Drivers",
    addOrRemoveDrivers: "Add or remove drivers",
    manageScannersButton: "Manage Scanners",
    deleteOrAddNotes: "Delete scanners or add notes",
    
    // Barcode Scanner
    scanBarcode: "Scan Barcode",
    pointCameraOrManual: "Point camera at barcode or enter manually",
    scanScannerToAssign: "Scan Scanner to Assign",
    scanWithZebraOrCamera: "Scan with Zebra scanner or use camera",
    enterScannerId: "Enter Scanner ID",
    scannerIdPlaceholder: "Enter scanner ID or scan with Zebra scanner",
    typeOrUseZebra: "Type or use your Zebra DS3678 scanner",
    confirm: "Confirm",
    useCamera: "Use Camera",
    manualInput: "Manual Input",
    registerNewScanner: "Register New Scanner",
    scanToAddToInventory: "Scan with Zebra scanner or use camera to add to inventory",
    
    // Driver Management
    assignToDriver: "Assign to Driver",
    selectDriver: "Select a driver",
    addNewDriver: "Add New Driver",
    enterDriverName: "Enter driver name",
    chooseFromList: "Choose from List",
    confirmAssignment: "Confirm Assignment",
    cancel: "Cancel",
    addDriver: "Add Driver",
    currentDrivers: "Current Drivers",
    noDriversYet: "No drivers added yet",
    add: "Add",
    
    // Batch Return
    returnMultipleScanners: "Return Multiple Scanners",
    scanMultipleToReturn: "Scan multiple scanners to mark as returned",
    scanScannerIds: "Scan Scanner IDs",
    scanWithZebraOrType: "Scan with Zebra scanner or type manually",
    pressEnterToAdd: "Press Enter or scan to add each scanner",
    scannedItems: "Scanned Items",
    successful: "successful",
    total: "total",
    alreadyScanned: "Already scanned",
    scannerMarkedForReturn: "Scanner marked for return",
    scannerNotFoundInSystem: "Scanner not found in system",
    notCurrentlyAssigned: "Not currently assigned",
    completeReturn: "Complete Return",
    
    // Report
    dailyReport: "Daily Report",
    downloadPdf: "Download PDF",
    backToDashboard: "Back to Dashboard",
    scannerId: "Scanner ID",
    driver: "Driver",
    assignedTime: "Assigned",
    returnedTime: "Returned",
    status: "Status",
    noAssignmentsToday: "No assignments today",
    
    // Toast Messages
    loginSuccessful: "Login Successful",
    welcomeBack: "Welcome back",
    loggedOut: "Logged Out",
    sessionEndedSuccessfully: "Session ended successfully",
    scannerNotFound: "Scanner Not Found",
    scannerNotRegistered: "is not registered in the system",
    alreadyAssigned: "Already Assigned",
    alreadyAssignedTo: "is already assigned to",
    assignmentSuccessful: "Assignment Successful",
    assignedTo: "assigned to",
    returnSuccessful: "Return Successful",
    scannersMarkedReturned: "scanner(s) marked as returned",
    alreadyRegistered: "Already Registered",
    alreadyInSystem: "is already in the system",
    scannerRegistered: "Scanner Registered",
    addedToInventory: "added to inventory",
    reportGenerated: "Report Generated",
    pdfDownloaded: "PDF report has been downloaded",
    driverAdded: "Driver Added",
    addedToDriverList: "has been added to the driver list",
    driverRemoved: "Driver Removed",
    removedFromDriverList: "has been removed from the driver list",
    
    // PDF Report
    dailyScannerReport: "Daily Scanner Report",
    
    // Times
    returnedPrefix: "Returned",
    
    // Loading
    loading: "Loading",
    
    // Scanner Management
    manageScanners: "Manage Scanners",
    registeredScanners: "Registered Scanners",
    noScannersYet: "No scanners registered yet",
    registered: "Registered",
    scannerNotes: "Scanner Notes / Issues",
    addNotesPlaceholder: "Add notes about issues, repairs, or status...",
    save: "Save",
    notes: "Notes",
    noNotes: "No notes",
    scannerDeleted: "Scanner Deleted",
    scannerRemovedFromSystem: "has been removed from the system",
    notesUpdated: "Notes Updated",
    scannerNotesUpdated: "Scanner notes have been updated",
  },
  nl: {
    // Login
    loginTitle: "Scanner Tracker",
    loginSubtitle: "Bezorgscanner Beheersysteem",
    username: "Gebruikersnaam",
    password: "Wachtwoord",
    enterUsername: "Voer uw gebruikersnaam in",
    enterPassword: "Voer uw wachtwoord in",
    login: "Inloggen",
    
    // TopBar
    logout: "Uitloggen",
    
    // Dashboard
    allScanners: "Alle Scanners",
    
    // Scanner Status
    available: "Beschikbaar",
    assigned: "Toegewezen",
    returned: "Ingeleverd",
    overdue: "Te laat",
    pending: "Wachtend",
    
    // Summary Cards
    totalAssigned: "Totaal Toegewezen",
    totalReturned: "Totaal Ingeleverd",
    pendingReturns: "Wachtend op Inlevering",
    
    // Quick Actions
    quickActions: "Snelle Acties",
    assignScanner: "Scanner Toewijzen",
    scanToAssign: "Scan om chauffeur toe te wijzen",
    returnScanner: "Scanner Inleveren",
    scanToReturn: "Scan om als ingeleverd te markeren",
    registerScanner: "Scanner Registreren",
    addNewScanner: "Nieuwe scanner toevoegen",
    viewReport: "Rapport Bekijken",
    dailySummary: "Dagelijkse samenvatting",
    manageDrivers: "Chauffeurs Beheren",
    addOrRemoveDrivers: "Chauffeurs toevoegen of verwijderen",
    manageScannersButton: "Scanners Beheren",
    deleteOrAddNotes: "Scanners verwijderen of notities toevoegen",
    
    // Barcode Scanner
    scanBarcode: "Scan Barcode",
    pointCameraOrManual: "Richt camera op barcode of voer handmatig in",
    scanScannerToAssign: "Scan Scanner om Toe te Wijzen",
    scanWithZebraOrCamera: "Scan met Zebra scanner of gebruik camera",
    enterScannerId: "Voer Scanner ID in",
    scannerIdPlaceholder: "Voer scanner ID in of scan met Zebra scanner",
    typeOrUseZebra: "Typ of gebruik uw Zebra DS3678 scanner",
    confirm: "Bevestigen",
    useCamera: "Gebruik Camera",
    manualInput: "Handmatig Invoeren",
    registerNewScanner: "Nieuwe Scanner Registreren",
    scanToAddToInventory: "Scan met Zebra scanner of gebruik camera om toe te voegen aan inventaris",
    
    // Driver Management
    assignToDriver: "Toewijzen aan Chauffeur",
    selectDriver: "Selecteer een chauffeur",
    addNewDriver: "+ Nieuwe Chauffeur Toevoegen",
    enterDriverName: "Voer naam chauffeur in",
    chooseFromList: "Kies uit Lijst",
    confirmAssignment: "Toewijzing Bevestigen",
    cancel: "Annuleren",
    addDriver: "Chauffeur Toevoegen",
    currentDrivers: "Huidige Chauffeurs",
    noDriversYet: "Nog geen chauffeurs toegevoegd",
    add: "Toevoegen",
    
    // Batch Return
    returnMultipleScanners: "Meerdere Scanners Inleveren",
    scanMultipleToReturn: "Scan meerdere scanners om als ingeleverd te markeren",
    scanScannerIds: "Scan Scanner IDs",
    scanWithZebraOrType: "Scan met Zebra scanner of typ handmatig",
    pressEnterToAdd: "Druk op Enter of scan om elke scanner toe te voegen",
    scannedItems: "Gescande Items",
    successful: "succesvol",
    total: "totaal",
    alreadyScanned: "Al gescand",
    scannerMarkedForReturn: "Scanner gemarkeerd voor inlevering",
    scannerNotFoundInSystem: "Scanner niet gevonden in systeem",
    notCurrentlyAssigned: "Niet momenteel toegewezen",
    completeReturn: "Inlevering Voltooien",
    
    // Report
    dailyReport: "Dagelijks Rapport",
    downloadPdf: "Download PDF",
    backToDashboard: "Terug naar Dashboard",
    scannerId: "Scanner ID",
    driver: "Chauffeur",
    assignedTime: "Toegewezen",
    returnedTime: "Ingeleverd",
    status: "Status",
    noAssignmentsToday: "Geen toewijzingen vandaag",
    
    // Toast Messages
    loginSuccessful: "Inloggen Succesvol",
    welcomeBack: "Welkom terug",
    loggedOut: "Uitgelogd",
    sessionEndedSuccessfully: "Sessie succesvol beëindigd",
    scannerNotFound: "Scanner Niet Gevonden",
    scannerNotRegistered: "is niet geregistreerd in het systeem",
    alreadyAssigned: "Al Toegewezen",
    alreadyAssignedTo: "is al toegewezen aan",
    assignmentSuccessful: "Toewijzing Succesvol",
    assignedTo: "toegewezen aan",
    returnSuccessful: "Inlevering Succesvol",
    scannersMarkedReturned: "scanner(s) gemarkeerd als ingeleverd",
    alreadyRegistered: "Al Geregistreerd",
    alreadyInSystem: "is al in het systeem",
    scannerRegistered: "Scanner Geregistreerd",
    addedToInventory: "toegevoegd aan inventaris",
    reportGenerated: "Rapport Gegenereerd",
    pdfDownloaded: "PDF rapport is gedownload",
    driverAdded: "Chauffeur Toegevoegd",
    addedToDriverList: "is toegevoegd aan de chauffeurlijst",
    driverRemoved: "Chauffeur Verwijderd",
    removedFromDriverList: "is verwijderd van de chauffeurlijst",
    
    // PDF Report
    dailyScannerReport: "Dagelijks Scanner Rapport",
    
    // Times
    returnedPrefix: "Ingeleverd",
    
    // Loading
    loading: "Laden",
    
    // Scanner Management
    manageScanners: "Scanners Beheren",
    registeredScanners: "Geregistreerde Scanners",
    noScannersYet: "Nog geen scanners geregistreerd",
    registered: "Geregistreerd",
    scannerNotes: "Scanner Notities / Problemen",
    addNotesPlaceholder: "Voeg notities toe over problemen, reparaties of status...",
    save: "Opslaan",
    notes: "Notities",
    noNotes: "Geen notities",
    scannerDeleted: "Scanner Verwijderd",
    scannerRemovedFromSystem: "is verwijderd uit het systeem",
    notesUpdated: "Notities Bijgewerkt",
    scannerNotesUpdated: "Scanner notities zijn bijgewerkt",
  },
};

export type TranslationKey = keyof typeof translations.en;
