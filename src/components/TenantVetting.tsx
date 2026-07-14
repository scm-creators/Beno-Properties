import React, { useState, useEffect } from "react";
import { 
  FileText, 
  User, 
  Briefcase, 
  CreditCard, 
  Search, 
  CheckCircle, 
  ShieldCheck, 
  Upload, 
  Send, 
  AlertCircle, 
  Check, 
  X, 
  Plus, 
  Trash2, 
  DollarSign, 
  Calendar, 
  Info, 
  Lock, 
  Eye, 
  Download, 
  RefreshCw,
  Building,
  Users,
  CheckSquare,
  TrendingUp,
  FileSpreadsheet
} from "lucide-react";
import { 
  Property, 
  TenantApplication, 
  OccupantDetail, 
  IncomeExpenseSchedule, 
  VerificationChecklist, 
  CreditReport 
} from "../types";

interface TenantVettingProps {
  properties: Property[];
  onUpdateProperty?: (property: Property) => void;
  currentUser: any;
  isClientPortal?: boolean;
  onOpenAuth?: (prompt?: string) => void;
}

// Initial Mock Applications to give immediate rich interactive feedback
const MOCK_APPLICATIONS_INITIAL = (rentals: Property[]): TenantApplication[] => {
  const midrandProp = rentals.find(r => r.id === "BENO-1026") || rentals[0];
  const propId = midrandProp ? midrandProp.id : "BENO-1026";
  const rentalPrice = midrandProp ? midrandProp.price : 18500;

  return [
    {
      id: "APP-4102",
      propertyId: propId,
      applicantId: "USER-CLIENT-MOCK-1",
      applicantName: "Thando Nkosi",
      applicantEmail: "thando.nkosi@gmail.com",
      applicantPhone: "+27 82 555 1234",
      monthlyRental: rentalPrice,
      depositAmount: rentalPrice,
      utilitiesDeposit: 1500,
      leaseAdminFee: 1200,
      leasePeriodMonths: 12,
      applicantType: "Sole",
      idPassportNumber: "9102145558082",
      maritalStatus: "ANC",
      currentAddress: "Apt 24, Waterfall Ridge, Midrand, 1682",
      previousAddress: "12 Pine Street, Randburg, 2194",
      currentLandlordDetails: "Mr. Dave Peterson (+27 83 444 8899)",
      employmentStatus: "Employed",
      employerName: "Discovery Limited",
      grossMonthlyIncome: 55000,
      netMonthlyIncome: 42000,
      bankName: "Standard Bank",
      accountHolder: "T Nkosi",
      accountNumber: "10125547890",
      accountType: "Cheque",
      branchName: "Sandton",
      hasJudgementsDefaults: false,
      hasCoApplicantSurety: false,
      familyRefName: "Sipho Nkosi",
      familyRefRelation: "Brother",
      familyRefContact: "+27 71 888 2233",
      professionalRefName: "Naledi Madiba",
      professionalRefRelation: "Manager",
      professionalRefContact: "+27 82 999 5544",
      evictionAlternativeAddress: "45 West Street, Houghton, Johannesburg, 2198",
      occupants: [
        {
          id: "occ-1",
          name: "Lindiwe",
          surname: "Nkosi",
          relationship: "Daughter",
          sex: "Female",
          idNumber: "1805120011082",
          age: 8,
          contactNo: "N/A"
        }
      ],
      hasPets: true,
      petDetails: "1x Miniature Maltese Poodle named Coco",
      financialSchedule: {
        salaryIncome: 42000,
        businessIncome: 0,
        otherIncome: 0,
        rentExpense: 14000,
        foodExpense: 4500,
        transportExpense: 3500,
        schoolFeesExpense: 3000,
        debtExpense: 4000,
        insuranceExpense: 2000,
        otherExpense: 3000
      },
      popiaConsent: true,
      creditCheckConsent: true,
      signatureTyped: "Thando Nkosi",
      submittedAt: "2026-07-10T14:22:00-07:00",
      status: "ForwardedToLandlord",
      documentsUploaded: {
        idCopyUrl: "thando_nkosi_id.pdf",
        bankStatementsUrl: "thando_nkosi_bank_statements.pdf",
        payslipsUrl: "thando_nkosi_payslips.pdf"
      },
      paymentConfirmed: true,
      paymentRef: "BENO-PAY-9831",
      paymentTimestamp: "2026-07-10T14:35:00-07:00",
      creditReport: {
        score: 710,
        riskCategory: "Low Risk",
        judgementsCount: 0,
        defaultsCount: 0,
        paymentProfileScore: "96% On-Time",
        fraudIndicatorsCount: 0,
        bureauReference: "TU-910214-X8A",
        generatedAt: "2026-07-10T14:38:00-07:00"
      },
      verificationChecklist: {
        creditCheckDone: true,
        creditCheckDate: "2026-07-10",
        employmentConfirmed: true,
        employmentConfirmedBy: "Confirmed via HR call at Discovery Ltd on 2026-07-11",
        landlordRefChecked: true,
        landlordRefNotes: "Dave Peterson confirms tenant was punctual with payments and left Randburg property in pristine condition.",
        familyRefChecked: false,
        otherRefChecked: true,
        otherRefNotes: "Naledi Madiba (Manager) confirmed employment is permanent and stable."
      },
      agentNotes: "Excellent applicant. Affordability looks clean with disposable income exceeding R8,000.",
      statusHistory: [
        { status: "Draft", timestamp: "2026-07-10T14:00:00", note: "Application initiated" },
        { status: "DocumentsPending", timestamp: "2026-07-10T14:22:00", note: "Form complete. Documents submitted." },
        { status: "PaymentPending", timestamp: "2026-07-10T14:30:00", note: "R350 credit check fee requested." },
        { status: "VettingInProgress", timestamp: "2026-07-10T14:38:00", note: "Payment received. Credit check pulled successfully." },
        { status: "ForwardedToLandlord", timestamp: "2026-07-12T09:00:00", note: "Profile curated and routed to Landlord for review." }
      ]
    },
    {
      id: "APP-5081",
      propertyId: propId,
      applicantId: "USER-CLIENT-MOCK-2",
      applicantName: "Pieter van der Merwe",
      applicantEmail: "pieter.vdm@outlook.com",
      applicantPhone: "+27 72 321 4455",
      monthlyRental: rentalPrice,
      depositAmount: rentalPrice * 1.5,
      utilitiesDeposit: 1500,
      leaseAdminFee: 1200,
      leasePeriodMonths: 6,
      applicantType: "Sole",
      idPassportNumber: "8511235061081",
      maritalStatus: "COP",
      currentAddress: "14 Protea Way, Centurion, 0157",
      previousAddress: "N/A",
      currentLandlordDetails: "Self-owned previous property",
      employmentStatus: "Self-Employed",
      employerName: "VDM Consulting Engineers",
      grossMonthlyIncome: 85000,
      netMonthlyIncome: 62000,
      bankName: "Nedbank",
      accountHolder: "Pieter van der Merwe",
      accountNumber: "1987554321",
      accountType: "Current",
      branchName: "Pretoria",
      hasJudgementsDefaults: false,
      hasCoApplicantSurety: true,
      coApplicantName: "Annelize van der Merwe",
      coApplicantID: "8809050012084",
      coApplicantContact: "+27 83 234 5678",
      coApplicantRelation: "Spouse",
      familyRefName: "Johan van der Merwe",
      familyRefRelation: "Father",
      familyRefContact: "+27 82 777 6655",
      professionalRefName: "Dr. Alan Smith",
      professionalRefRelation: "Client/Contractor",
      professionalRefContact: "+27 12 555 9988",
      evictionAlternativeAddress: "89 Klip Street, Garsfontein, Pretoria, 0081",
      occupants: [
        {
          id: "occ-2",
          name: "Annelize",
          surname: "van der Merwe",
          relationship: "Spouse / Co-Applicant",
          sex: "Female",
          idNumber: "8809050012084",
          age: 37,
          contactNo: "+27 83 234 5678"
        }
      ],
      hasPets: false,
      financialSchedule: {
        salaryIncome: 0,
        businessIncome: 62000,
        otherIncome: 0,
        rentExpense: 18000,
        foodExpense: 6000,
        transportExpense: 5000,
        schoolFeesExpense: 4000,
        debtExpense: 7000,
        insuranceExpense: 3500,
        otherExpense: 4000
      },
      popiaConsent: true,
      creditCheckConsent: true,
      signatureTyped: "Pieter van der Merwe",
      submittedAt: "2026-07-13T09:15:00-07:00",
      status: "VettingInProgress",
      documentsUploaded: {
        idCopyUrl: "pieter_vdm_id.pdf",
        bankStatementsUrl: "pieter_vdm_6_months_bank_statements.pdf"
      },
      paymentConfirmed: true,
      paymentRef: "BENO-PAY-8123",
      paymentTimestamp: "2026-07-13T09:30:00-07:00",
      creditReport: {
        score: 645,
        riskCategory: "Medium Risk",
        judgementsCount: 0,
        defaultsCount: 1,
        defaultsDetails: "Handover to attorneys on gym contract (R1,200) - Settled in 2025.",
        paymentProfileScore: "91% On-Time",
        fraudIndicatorsCount: 0,
        bureauReference: "ED-851123-U3W",
        generatedAt: "2026-07-13T09:34:00-07:00"
      },
      verificationChecklist: {
        creditCheckDone: true,
        creditCheckDate: "2026-07-13",
        employmentConfirmed: false,
        landlordRefChecked: false,
        familyRefChecked: false,
        otherRefChecked: false
      },
      statusHistory: [
        { status: "Draft", timestamp: "2026-07-13T09:00:00", note: "Application initiated" },
        { status: "DocumentsPending", timestamp: "2026-07-13T09:15:00", note: "Self-employed documents uploaded" },
        { status: "PaymentPending", timestamp: "2026-07-13T09:16:00", note: "Payment request triggered" },
        { status: "VettingInProgress", timestamp: "2026-07-13T09:34:00", note: "Credit check complete. Awaiting reference verifications." }
      ]
    }
  ];
};

export default function TenantVetting({
  properties,
  onUpdateProperty,
  currentUser,
  isClientPortal = false,
  onOpenAuth
}: TenantVettingProps) {
  // Perspectives/Roles: "client" | "agent" | "landlord"
  // Let's default based on current user role, but allow toggling for testing
  const [activePerspective, setActivePerspective] = useState<"client" | "agent" | "landlord">("client");

  useEffect(() => {
    if (isClientPortal) {
      setActivePerspective("client");
    } else if (currentUser?.role === "landlord") {
      setActivePerspective("landlord");
    } else {
      setActivePerspective("agent");
    }
  }, [currentUser, isClientPortal]);

  // Filter properties "To Rent"
  const rentalProperties = properties.filter(p => p.status === "To Rent");

  // Load applications from localStorage
  const [applications, setApplications] = useState<TenantApplication[]>(() => {
    try {
      const stored = localStorage.getItem("beno_tenant_applications");
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return MOCK_APPLICATIONS_INITIAL(properties);
  });

  // Save helper
  const saveApplications = (newApps: TenantApplication[]) => {
    setApplications(newApps);
    localStorage.setItem("beno_tenant_applications", JSON.stringify(newApps));
  };

  // State for filling new application
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [applicantType, setApplicantType] = useState<"Sole" | "Joint" | "CC" | "Company" | "Trust">("Sole");
  const isJuristicForm = applicantType === "CC" || applicantType === "Company" || applicantType === "Trust";
  // Juristic Entity fields
  const [juristicRegNumber, setJuristicRegNumber] = useState("");
  const [juristicTradeName, setJuristicTradeName] = useState("");
  const [juristicRepName, setJuristicRepName] = useState("");
  const [juristicRepIdNumber, setJuristicRepIdNumber] = useState("");
  const [juristicNatureOfBusiness, setJuristicNatureOfBusiness] = useState("");
  const [juristicRegAddress, setJuristicRegAddress] = useState("");
  const [idPassportNumber, setIdPassportNumber] = useState("");
  const [maritalStatus, setMaritalStatus] = useState<"Single" | "COP" | "ANC" | "Divorced" | "Widowed" | "Other">("Single");
  const [currentAddress, setCurrentAddress] = useState("");
  const [previousAddress, setPreviousAddress] = useState("");
  const [currentLandlordDetails, setCurrentLandlordDetails] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState<"Employed" | "Self-Employed" | "Unemployed">("Employed");
  const [employerName, setEmployerName] = useState("");
  const [grossMonthlyIncome, setGrossMonthlyIncome] = useState("");
  const [netMonthlyIncome, setNetMonthlyIncome] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountType, setAccountType] = useState("Savings");
  const [branchName, setBranchName] = useState("");
  const [hasJudgementsDefaults, setHasJudgementsDefaults] = useState(false);
  const [judgementsDefaultsDetails, setJudgementsDefaultsDetails] = useState("");
  const [hasCoApplicantSurety, setHasCoApplicantSurety] = useState(false);
  const [coApplicantName, setCoApplicantName] = useState("");
  const [coApplicantID, setCoApplicantID] = useState("");
  const [coApplicantContact, setCoApplicantContact] = useState("");
  const [coApplicantRelation, setCoApplicantRelation] = useState("");
  const [familyRefName, setFamilyRefName] = useState("");
  const [familyRefRelation, setFamilyRefRelation] = useState("");
  const [familyRefContact, setFamilyRefContact] = useState("");
  const [professionalRefName, setProfessionalRefName] = useState("");
  const [professionalRefRelation, setProfessionalRefRelation] = useState("");
  const [professionalRefContact, setProfessionalRefContact] = useState("");
  const [evictionAlternativeAddress, setEvictionAlternativeAddress] = useState("");
  const [hasPets, setHasPets] = useState(false);
  const [petDetails, setPetDetails] = useState("");
  
  // Occupants list
  const [occupants, setOccupants] = useState<OccupantDetail[]>([]);
  const [newOccName, setNewOccName] = useState("");
  const [newOccSurname, setNewOccSurname] = useState("");
  const [newOccRelation, setNewOccRelation] = useState("");
  const [newOccSex, setNewOccSex] = useState("Male");
  const [newOccID, setNewOccID] = useState("");
  const [newOccAge, setNewOccAge] = useState("");
  const [newOccContact, setNewOccContact] = useState("");

  // Schedule of personal circumstances
  const [salaryIncome, setSalaryIncome] = useState("");
  const [businessIncome, setBusinessIncome] = useState("");
  const [otherIncome, setOtherIncome] = useState("");
  const [rentExpense, setRentExpense] = useState("");
  const [foodExpense, setFoodExpense] = useState("");
  const [transportExpense, setTransportExpense] = useState("");
  const [schoolFeesExpense, setSchoolFeesExpense] = useState("");
  const [debtExpense, setDebtExpense] = useState("");
  const [insuranceExpense, setInsuranceExpense] = useState("");
  const [otherExpense, setOtherExpense] = useState("");

  // Consent
  const [popiaConsent, setPopiaConsent] = useState(false);
  const [creditCheckConsent, setCreditCheckConsent] = useState(false);
  const [signatureTyped, setSignatureTyped] = useState("");

  // Active form section accordion
  const [activeFormStep, setActiveFormStep] = useState(1);

  // Error/Success feedback
  const [formError, setFormError] = useState<string | null>(null);

  // Active user's own application
  const myApplication = applications.find(a => a.applicantId === currentUser.id) || 
                        applications.find(a => a.applicantEmail.toLowerCase() === currentUser.email.toLowerCase());

  // Upload simulation states
  const [uploadedIdFile, setUploadedIdFile] = useState<string | null>(null);
  const [uploadedBankStatements, setUploadedBankStatements] = useState<string | null>(null);
  const [uploadedPayslips, setUploadedPayslips] = useState<string | null>(null);
  const [uploadedSignedForm, setUploadedSignedForm] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<string | null>(null);

  // Payment process simulation
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "eft">("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [eftBank, setEftBank] = useState("Capitec");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Credit check execution simulation
  const [isRunningCreditCheck, setIsRunningCreditCheck] = useState(false);
  const [creditCheckProgress, setCreditCheckProgress] = useState("");

  // Selected applicant detail view for agents/landlords
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [agentVerificationNotes, setAgentVerificationNotes] = useState("");
  const [agentChecklist, setAgentChecklist] = useState<VerificationChecklist>({
    creditCheckDone: false,
    employmentConfirmed: false,
    landlordRefChecked: false,
    familyRefChecked: false,
    otherRefChecked: false
  });

  // Landlord decision feedback
  const [landlordFeedbackText, setLandlordFeedbackText] = useState("");

  const handleAddOccupant = () => {
    if (!newOccName || !newOccSurname || !newOccRelation) {
      alert("Please fill in Name, Surname and Relationship of occupant.");
      return;
    }
    const o: OccupantDetail = {
      id: `occ-${Date.now()}`,
      name: newOccName,
      surname: newOccSurname,
      relationship: newOccRelation,
      sex: newOccSex,
      idNumber: newOccID || "N/A",
      age: parseInt(newOccAge, 10) || 0,
      contactNo: newOccContact || "N/A"
    };
    setOccupants([...occupants, o]);
    setNewOccName("");
    setNewOccSurname("");
    setNewOccRelation("");
    setNewOccID("");
    setNewOccAge("");
    setNewOccContact("");
  };

  const handleRemoveOccupant = (id: string) => {
    setOccupants(occupants.filter(o => o.id !== id));
  };

  // Initialize form with property defaults if a user starts
  const handleSelectPropertyForForm = (prop: Property) => {
    setSelectedPropertyId(prop.id);
    setSalaryIncome(netMonthlyIncome);
    setActiveFormStep(2);
  };

  const handleSubmitTenantForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPropertyId) {
      setFormError("Please select a rental property first in Step 1.");
      setActiveFormStep(1);
      return;
    }
    
    const isJuristic = applicantType === "CC" || applicantType === "Company" || applicantType === "Trust";
    if (isJuristic) {
      if (!juristicRegNumber) {
        setFormError("Please provide the registration number in Step 2.");
        setActiveFormStep(2);
        return;
      }
      if (!juristicRepName) {
        setFormError("Please provide the authorized representative name in Step 2.");
        setActiveFormStep(2);
        return;
      }
      if (!juristicRepIdNumber) {
        setFormError("Please provide the representative's ID/passport number in Step 2.");
        setActiveFormStep(2);
        return;
      }
      if (!juristicNatureOfBusiness) {
        setFormError("Please specify the nature of business in Step 2.");
        setActiveFormStep(2);
        return;
      }
      if (!juristicRegAddress) {
        setFormError("Please provide the registered physical address in Step 2.");
        setActiveFormStep(2);
        return;
      }
    } else {
      if (!idPassportNumber) {
        setFormError("Please provide your ID or Passport Number in Step 2.");
        setActiveFormStep(2);
        return;
      }
      if (!currentAddress) {
        setFormError("Please provide your current residential address in Step 2.");
        setActiveFormStep(2);
        return;
      }
    }

    // Step 3 validations
    if (!grossMonthlyIncome || parseFloat(grossMonthlyIncome) <= 0) {
      setFormError("Please enter a valid Gross Monthly Income/Turnover in Step 3.");
      setActiveFormStep(3);
      return;
    }
    if (!netMonthlyIncome || parseFloat(netMonthlyIncome) <= 0) {
      setFormError("Please enter a valid Net Monthly Income/Surplus in Step 3.");
      setActiveFormStep(3);
      return;
    }
    if (!bankName) {
      setFormError("Please select your bank in Step 3.");
      setActiveFormStep(3);
      return;
    }
    if (!accountHolder) {
      setFormError("Please enter the Account Holder Name in Step 3.");
      setActiveFormStep(3);
      return;
    }
    if (!accountNumber) {
      setFormError("Please enter the Bank Account Number in Step 3.");
      setActiveFormStep(3);
      return;
    }

    if (!popiaConsent || !creditCheckConsent) {
      setFormError("You must read and accept both POPIA Consent and Credit Bureau terms in Step 5.");
      setActiveFormStep(5);
      return;
    }
    if (!signatureTyped) {
      setFormError("Please sign the digital form by typing your full names in Step 5.");
      setActiveFormStep(5);
      return;
    }

    setFormError(null);

    const targetProp = properties.find(p => p.id === selectedPropertyId);
    const rent = targetProp ? targetProp.price : 12000;

    const newApp: TenantApplication = {
      id: `APP-${Math.floor(1000 + Math.random() * 9000)}`,
      propertyId: selectedPropertyId,
      applicantId: currentUser.id || `USER-${Math.floor(10000 + Math.random() * 90000)}`,
      applicantName: currentUser.name,
      applicantEmail: currentUser.email,
      applicantPhone: currentUser.phone || "+27 82 000 0000",
      monthlyRental: rent,
      depositAmount: rent,
      utilitiesDeposit: 1500,
      leaseAdminFee: 1200,
      leasePeriodMonths: 12,
      applicantType,
      idPassportNumber: isJuristic ? juristicRegNumber : idPassportNumber,
      maritalStatus: isJuristic ? "Other" : maritalStatus,
      currentAddress: isJuristic ? juristicRegAddress : currentAddress,
      previousAddress: isJuristic ? "" : previousAddress,
      currentLandlordDetails: isJuristic ? "" : currentLandlordDetails,
      employmentStatus: isJuristic ? "Self-Employed" : employmentStatus,
      employerName: isJuristic ? juristicTradeName : employerName,
      juristicRegNumber: isJuristic ? juristicRegNumber : undefined,
      juristicTradeName: isJuristic ? juristicTradeName : undefined,
      juristicRepName: isJuristic ? juristicRepName : undefined,
      juristicRepIdNumber: isJuristic ? juristicRepIdNumber : undefined,
      juristicNatureOfBusiness: isJuristic ? juristicNatureOfBusiness : undefined,
      juristicRegAddress: isJuristic ? juristicRegAddress : undefined,
      grossMonthlyIncome: parseFloat(grossMonthlyIncome) || 0,
      netMonthlyIncome: parseFloat(netMonthlyIncome) || 0,
      bankName,
      accountHolder,
      accountNumber,
      accountType,
      branchName,
      hasJudgementsDefaults,
      judgementsDefaultsDetails: judgementsDefaultsDetails || undefined,
      hasCoApplicantSurety,
      coApplicantName: coApplicantName || undefined,
      coApplicantID: coApplicantID || undefined,
      coApplicantContact: coApplicantContact || undefined,
      coApplicantRelation: coApplicantRelation || undefined,
      familyRefName,
      familyRefRelation,
      familyRefContact,
      professionalRefName,
      professionalRefRelation,
      professionalRefContact,
      evictionAlternativeAddress,
      occupants,
      hasPets,
      petDetails: petDetails || undefined,
      financialSchedule: {
        salaryIncome: parseFloat(salaryIncome) || 0,
        businessIncome: parseFloat(businessIncome) || 0,
        otherIncome: parseFloat(otherIncome) || 0,
        rentExpense: parseFloat(rentExpense) || 0,
        foodExpense: parseFloat(foodExpense) || 0,
        transportExpense: parseFloat(transportExpense) || 0,
        schoolFeesExpense: parseFloat(schoolFeesExpense) || 0,
        debtExpense: parseFloat(debtExpense) || 0,
        insuranceExpense: parseFloat(insuranceExpense) || 0,
        otherExpense: parseFloat(otherExpense) || 0
      },
      popiaConsent,
      creditCheckConsent,
      signatureTyped,
      submittedAt: new Date().toISOString(),
      status: "DocumentsPending",
      documentsUploaded: {},
      paymentConfirmed: false,
      verificationChecklist: {
        creditCheckDone: false,
        employmentConfirmed: false,
        landlordRefChecked: false,
        familyRefChecked: false,
        otherRefChecked: false
      },
      statusHistory: [
        { status: "Draft", timestamp: new Date().toISOString(), note: "Digital application form completed." }
      ]
    };

    const updated = [...applications.filter(a => a.applicantId !== newApp.applicantId), newApp];
    saveApplications(updated);
  };

  // Simulate file upload with delay
  const simulateFileUpload = (fieldName: "idCopyUrl" | "bankStatementsUrl" | "payslipsUrl" | "signedFormUrl", file: File) => {
    setIsUploading(fieldName);
    setTimeout(() => {
      setIsUploading(null);
      if (fieldName === "idCopyUrl") setUploadedIdFile(file.name);
      if (fieldName === "bankStatementsUrl") setUploadedBankStatements(file.name);
      if (fieldName === "payslipsUrl") setUploadedPayslips(file.name);
      if (fieldName === "signedFormUrl") setUploadedSignedForm(file.name);

      // Save document to stored application
      if (myApplication) {
        const updatedDocs = {
          ...myApplication.documentsUploaded,
          [fieldName]: file.name
        };

        // Determine if all required are done
        const isEmployed = myApplication.employmentStatus === "Employed";
        const hasId = !!updatedDocs.idCopyUrl;
        const hasBank = !!updatedDocs.bankStatementsUrl;
        const hasPayslips = !!updatedDocs.payslipsUrl;
        const hasSignedForm = !!updatedDocs.signedFormUrl;

        let nextStatus = myApplication.status;
        if (isEmployed && hasId && hasBank && hasPayslips) {
          nextStatus = "PaymentPending";
        } else if (!isEmployed && hasId && hasBank && hasSignedForm) {
          nextStatus = "PaymentPending";
        }

        const updatedApp: TenantApplication = {
          ...myApplication,
          status: nextStatus as any,
          documentsUploaded: updatedDocs,
          statusHistory: [
            ...myApplication.statusHistory,
            { status: nextStatus, timestamp: new Date().toISOString(), note: `Document ${file.name} uploaded.` }
          ]
        };

        saveApplications(applications.map(a => a.id === updatedApp.id ? updatedApp : a));
      }
    }, 1500);
  };

  // Simulate PayFast payment gateway execution
  const triggerSimulatePayment = () => {
    if (!myApplication) return;
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setShowPaymentModal(false);

      const payRef = `BENO-PAY-${Math.floor(1000 + Math.random() * 9000)}`;
      const updatedApp: TenantApplication = {
        ...myApplication,
        paymentConfirmed: true,
        paymentRef: payRef,
        paymentTimestamp: new Date().toISOString(),
        status: "VettingInProgress",
        statusHistory: [
          ...myApplication.statusHistory,
          { status: "VettingInProgress", timestamp: new Date().toISOString(), note: `R350 Application Fee paid successfully via simulated gateway. Reference: ${payRef}.` }
        ]
      };

      saveApplications(applications.map(a => a.id === updatedApp.id ? updatedApp : a));
    }, 2000);
  };

  // Simulate credit check call to bureau (TransUnion / Experian South Africa)
  const executeBureauCreditCheck = () => {
    if (!myApplication) return;
    setIsRunningCreditCheck(true);
    setCreditCheckProgress("Initializing connection to Credit Bureau secure gate...");

    setTimeout(() => {
      setCreditCheckProgress("Verifying South African National ID: " + myApplication.idPassportNumber + "...");
    }, 1000);

    setTimeout(() => {
      setCreditCheckProgress("Searching historical default directories and public court judgements...");
    }, 2500);

    setTimeout(() => {
      setCreditCheckProgress("Compiling payment trajectory score and anti-fraud indexes...");
    }, 4000);

    setTimeout(() => {
      setIsRunningCreditCheck(false);

      // Generate realistic score based on ID digits or stable math
      const scoreDigits = parseInt(myApplication.idPassportNumber.slice(0, 3), 10) || 680;
      const calculatedScore = scoreDigits < 300 ? 590 : Math.min(850, Math.max(500, scoreDigits + 50));
      const risk: "Low Risk" | "Medium Risk" | "High Risk" | "Very High Risk" = 
        calculatedScore > 700 ? "Low Risk" : calculatedScore > 620 ? "Medium Risk" : "High Risk";

      const report: CreditReport = {
        score: calculatedScore,
        riskCategory: risk,
        judgementsCount: calculatedScore < 600 ? 1 : 0,
        judgementsDetails: calculatedScore < 600 ? "Civil judgement for outstanding medical account R1,450." : undefined,
        defaultsCount: calculatedScore < 630 ? 1 : 0,
        defaultsDetails: calculatedScore < 630 ? "Retail trade account in arrears (R850)." : undefined,
        paymentProfileScore: calculatedScore > 700 ? "98% on-time" : "89% on-time",
        fraudIndicatorsCount: 0,
        bureauReference: `TU-${myApplication.idPassportNumber.slice(0, 6)}-${Math.floor(100 + Math.random() * 900)}`,
        generatedAt: new Date().toISOString()
      };

      const updatedApp: TenantApplication = {
        ...myApplication,
        creditReport: report,
        verificationChecklist: {
          ...myApplication.verificationChecklist,
          creditCheckDone: true,
          creditCheckDate: new Date().toISOString().slice(0, 10)
        },
        statusHistory: [
          ...myApplication.statusHistory,
          { status: "VettingInProgress", timestamp: new Date().toISOString(), note: `Credit check complete. Bureau Reference: ${report.bureauReference}. Score: ${report.score}.` }
        ]
      };

      saveApplications(applications.map(a => a.id === updatedApp.id ? updatedApp : a));
    }, 5500);
  };

  // Agent updates the "Office Use Only" verifications checklist
  const handleUpdateChecklist = (appId: string) => {
    const app = applications.find(a => a.id === appId);
    if (!app) return;

    const updatedApp: TenantApplication = {
      ...app,
      verificationChecklist: agentChecklist,
      agentNotes: agentVerificationNotes,
      statusHistory: [
        ...app.statusHistory,
        { status: app.status, timestamp: new Date().toISOString(), note: `Internal office verification records updated.` }
      ]
    };

    saveApplications(applications.map(a => a.id === appId ? updatedApp : a));
    alert("Verification Checklist saved successfully!");
  };

  // Agent forwards applicant profile to Landlord
  const handleForwardToLandlord = (appId: string) => {
    const app = applications.find(a => a.id === appId);
    if (!app) return;

    const updatedApp: TenantApplication = {
      ...app,
      status: "ForwardedToLandlord",
      statusHistory: [
        ...app.statusHistory,
        { status: "ForwardedToLandlord", timestamp: new Date().toISOString(), note: `Vetting checklist completed. Profile package forwarded to Landlord for final approval.` }
      ]
    };

    saveApplications(applications.map(a => a.id === appId ? updatedApp : a));
    setSelectedAppId(null);
    alert("Vetting package successfully packaged and forwarded to Landlord!");
  };

  // Landlord decision submit
  const handleLandlordDecision = (appId: string, decision: "Approved" | "Rejected" | "MoreInfoRequested") => {
    const app = applications.find(a => a.id === appId);
    if (!app) return;

    const updatedApp: TenantApplication = {
      ...app,
      status: decision,
      landlordFeedback: landlordFeedbackText || `Application ${decision.toLowerCase()} by owner.`,
      statusHistory: [
        ...app.statusHistory,
        { status: decision, timestamp: new Date().toISOString(), note: `Landlord submitted decision: ${decision}. Feedback: ${landlordFeedbackText || "None"}` }
      ]
    };

    saveApplications(applications.map(a => a.id === appId ? updatedApp : a));
    setLandlordFeedbackText("");
    setSelectedAppId(null);
    alert(`Decision successfully logged: ${decision}`);
  };

  // Helper calculation for tenant affordability
  const calculateAffordability = (app: TenantApplication) => {
    const disposable = app.netMonthlyIncome - (
      app.financialSchedule.foodExpense +
      app.financialSchedule.transportExpense +
      app.financialSchedule.schoolFeesExpense +
      app.financialSchedule.debtExpense +
      app.financialSchedule.insuranceExpense +
      app.financialSchedule.otherExpense
    );
    const rentRatio = (app.monthlyRental / app.netMonthlyIncome) * 100;
    return { disposable, rentRatio };
  };

  // Active view details based on active perspective
  const selectedApp = applications.find(a => a.id === selectedAppId);

  return (
    <div className="space-y-6" id="tenant-vetting-module">
      {/* Perspective / Test Simulator banner */}
      {isClientPortal ? (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-amber-600" />
            <div>
              <h4 className="text-xs font-black text-amber-900 uppercase tracking-wide">Beno Digital Tenant Application</h4>
              <p className="text-[11px] text-amber-700 font-medium">Complete your digital rental application, payment, bureau credit check, and submit details securely.</p>
            </div>
          </div>
          <div className="bg-amber-100/60 px-3 py-1.5 rounded-lg border border-amber-200 text-xs font-bold text-amber-800 flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-amber-600" />
            Tenant Applicant
          </div>
        </div>
      ) : currentUser?.role === "landlord" ? (
        <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Building className="h-8 w-8 text-amber-400" />
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-amber-400">
                Landlord Portfolio Portal
              </h3>
              <p className="text-slate-300 text-xs mt-0.5">
                Review verified tenant applications forwarded by your managing agent and log lease approval decisions.
              </p>
            </div>
          </div>
          <div className="bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 text-xs font-bold text-amber-400 flex items-center gap-1.5">
            <Building className="h-3.5 w-3.5 text-amber-400" />
            Verified Owner Mode
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-amber-600" />
            <div>
              <h4 className="text-xs font-black text-amber-900 uppercase tracking-wide">Interactive Staff Vetting Simulator</h4>
              <p className="text-[11px] text-amber-700 font-medium">Toggle roles below to simulate the complete background checking, verification checklists, and landlord review actions!</p>
            </div>
          </div>

          <div className="flex bg-amber-100/60 p-1 rounded-xl border border-amber-200">
            <button
              onClick={() => { 
                setActivePerspective("agent"); 
                setSelectedAppId(null); 
                // Prefill checklists
                const firstApp = applications[0];
                if (firstApp) {
                  setAgentChecklist(firstApp.verificationChecklist);
                  setAgentVerificationNotes(firstApp.agentNotes || "");
                }
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                activePerspective === "agent" ? "bg-amber-600 text-white shadow-sm" : "text-amber-800 hover:bg-amber-100"
              }`}
            >
              <Briefcase className="h-3.5 w-3.5" />
              2. Verifying Agent
            </button>
            <button
              onClick={() => { setActivePerspective("landlord"); setSelectedAppId(null); }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                activePerspective === "landlord" ? "bg-amber-600 text-white shadow-sm" : "text-amber-800 hover:bg-amber-100"
              }`}
            >
              <Building className="h-3.5 w-3.5" />
              3. Property Owner
            </button>
          </div>
        </div>
      )}

      {/* PERSPECTIVE VIEW 1: CLIENT / APPLICANT */}
      {activePerspective === "client" && (
        <div className="space-y-6">
          {!myApplication ? (
            <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-wide">Beno Online Tenant Application Portal</h3>
                  <p className="text-slate-300 text-xs mt-0.5">Digitally sign the Beno 2026 Application, load vetting credentials and run your bureau credit check.</p>
                </div>
                <FileText className="h-8 w-8 text-amber-400" />
              </div>

              <div className="p-6 space-y-6">
                {/* Form Progress steps */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-4 flex-wrap gap-2 text-xs font-bold text-gray-500">
                  <span className={activeFormStep === 1 ? "text-brand-primary" : ""}>1. Select Property</span>
                  <span className="text-gray-300">/</span>
                  <span className={activeFormStep === 2 ? "text-brand-primary" : ""}>2. Personal Info</span>
                  <span className="text-gray-300">/</span>
                  <span className={activeFormStep === 3 ? "text-brand-primary" : ""}>3. Financials & Bank</span>
                  <span className="text-gray-300">/</span>
                  <span className={activeFormStep === 4 ? "text-brand-primary" : ""}>4. Circumstances Schedule</span>
                  <span className="text-gray-300">/</span>
                  <span className={activeFormStep === 5 ? "text-brand-primary" : ""}>5. POPIA Consent & Sign</span>
                </div>

                {formError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-lg flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {formError}
                  </div>
                )}

                <form onSubmit={handleSubmitTenantForm} className="space-y-6">
                  {/* STEP 1: Property Selection */}
                  {activeFormStep === 1 && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-black text-gray-900 uppercase tracking-wide">Select your target rental property</h4>
                      <p className="text-xs text-gray-500">Choose from available Beno Properties to Rent to prefill the rental requirements:</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {rentalProperties.map(prop => (
                          <div 
                            key={prop.id}
                            onClick={() => handleSelectPropertyForForm(prop)}
                            className={`border-2 rounded-2xl p-4 cursor-pointer hover:border-brand-primary transition-all flex gap-3 items-center ${
                              selectedPropertyId === prop.id ? "border-brand-primary bg-slate-50/50" : "border-gray-200"
                            }`}
                          >
                            <img src={prop.imageUrl} alt="" className="w-16 h-16 object-cover rounded-lg" />
                            <div className="flex-1 min-w-0">
                              <h5 className="text-xs font-extrabold text-gray-900 truncate">{prop.title}</h5>
                              <p className="text-[10px] text-gray-500 truncate">📍 {prop.location}, {prop.city}</p>
                              <p className="text-xs font-extrabold text-brand-secondary font-mono mt-1">R {prop.price.toLocaleString()}/month</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {rentalProperties.length === 0 && (
                        <p className="text-xs text-gray-500 italic">No rental properties found in database. Create a 'To Rent' property in listings to test full integration.</p>
                      )}
                    </div>
                  )}

                  {/* STEP 2: Personal/Entity Details */}
                  {activeFormStep === 2 && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-black text-gray-900 uppercase tracking-wide">
                        {isJuristicForm ? "Juristic Entity & Representative Details" : "Personal Details of Tenant"}
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-750 mb-1">Applicant Type</label>
                          <select 
                            value={applicantType} 
                            onChange={(e) => setApplicantType(e.target.value as any)}
                            className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs"
                          >
                            <option value="Sole">Sole (Individual)</option>
                            <option value="Joint">Joint Applicant</option>
                            <option value="CC">Close Corporation (CC)</option>
                            <option value="Company">Company</option>
                            <option value="Trust">Trust</option>
                          </select>
                        </div>

                        {isJuristicForm ? (
                          <>
                            <div>
                              <label className="block text-xs font-bold text-gray-750 mb-1">Registration/Trust Number *</label>
                              <input 
                                type="text" 
                                placeholder="e.g. 2021/123456/07 or IT 123/2022" 
                                value={juristicRegNumber} 
                                onChange={(e) => setJuristicRegNumber(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs font-semibold"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-gray-750 mb-1">Trading Name (if different)</label>
                              <input 
                                type="text" 
                                placeholder="e.g. Beno Tech Solutions" 
                                value={juristicTradeName} 
                                onChange={(e) => setJuristicTradeName(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs font-semibold"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-gray-750 mb-1">Authorized Representative Name *</label>
                              <input 
                                type="text" 
                                placeholder="Full name of person signing" 
                                value={juristicRepName} 
                                onChange={(e) => setJuristicRepName(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs font-semibold"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-gray-750 mb-1">Representative ID or Passport *</label>
                              <input 
                                type="text" 
                                placeholder="Representative SA ID / Passport" 
                                value={juristicRepIdNumber} 
                                onChange={(e) => setJuristicRepIdNumber(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs font-semibold"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-gray-750 mb-1">Nature of Business *</label>
                              <input 
                                type="text" 
                                placeholder="e.g. IT, Consulting, Trade, Logistics" 
                                value={juristicNatureOfBusiness} 
                                onChange={(e) => setJuristicNatureOfBusiness(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs font-semibold"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-gray-750 mb-1">Registered Address / Head Office *</label>
                              <input 
                                type="text" 
                                placeholder="Head office or registered street address" 
                                value={juristicRegAddress} 
                                onChange={(e) => setJuristicRegAddress(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs font-semibold"
                                required
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <label className="block text-xs font-bold text-gray-750 mb-1">ID or Passport Number *</label>
                              <input 
                                type="text" 
                                placeholder="SA ID or passport number" 
                                value={idPassportNumber} 
                                onChange={(e) => setIdPassportNumber(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs font-semibold"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-gray-750 mb-1">Marital Status</label>
                              <select 
                                value={maritalStatus} 
                                onChange={(e) => setMaritalStatus(e.target.value as any)}
                                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs"
                              >
                                <option value="Single">Single</option>
                                <option value="COP">Married in Community of Property (COP)</option>
                                <option value="ANC">Married with Ante-Nuptial Contract (ANC)</option>
                                <option value="Divorced">Divorced</option>
                                <option value="Widowed">Widowed</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-gray-750 mb-1">Employment Status</label>
                              <select 
                                value={employmentStatus} 
                                onChange={(e) => setEmploymentStatus(e.target.value as any)}
                                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs"
                              >
                                <option value="Employed">Employed (Salaried)</option>
                                <option value="Self-Employed">Self-Employed (Business Owner)</option>
                                <option value="Unemployed">Unemployed / Other</option>
                              </select>
                            </div>

                            {employmentStatus === "Employed" && (
                              <div>
                                <label className="block text-xs font-bold text-gray-750 mb-1">Employer / Company Name *</label>
                                <input 
                                  type="text" 
                                  placeholder="Discovery, Standard Bank, etc." 
                                  value={employerName} 
                                  onChange={(e) => setEmployerName(e.target.value)}
                                  className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs font-semibold"
                                />
                              </div>
                            )}

                            <div>
                              <label className="block text-xs font-bold text-gray-750 mb-1">Current Residential Address *</label>
                              <input 
                                type="text" 
                                placeholder="Unit, complex, suburb, postal code" 
                                value={currentAddress} 
                                onChange={(e) => setCurrentAddress(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs font-semibold"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-gray-750 mb-1">Previous Residential Address</label>
                              <input 
                                type="text" 
                                placeholder="To track address history validation" 
                                value={previousAddress} 
                                onChange={(e) => setPreviousAddress(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-gray-750 mb-1">Current Landlord Contact Details</label>
                              <input 
                                type="text" 
                                placeholder="Landlord Name & Phone Number" 
                                value={currentLandlordDetails} 
                                onChange={(e) => setCurrentLandlordDetails(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs"
                              />
                            </div>
                          </>
                        )}
                      </div>

                      <div className="flex justify-end gap-2 pt-4">
                        <button
                          type="button"
                          onClick={() => setActiveFormStep(1)}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-bold text-gray-700 cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveFormStep(3)}
                          className="px-4 py-2 bg-brand-secondary hover:bg-brand-hover rounded-lg text-xs font-bold text-white cursor-pointer"
                        >
                          Next Step
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Financials & Bank Details */}
                  {activeFormStep === 3 && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-black text-gray-900 uppercase tracking-wide">Financials & Banking Details</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-750 mb-1">Gross Monthly Income (R)</label>
                          <input 
                            type="number" 
                            placeholder="Before deductions" 
                            value={grossMonthlyIncome} 
                            onChange={(e) => setGrossMonthlyIncome(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-750 mb-1">Net Monthly Income (R)</label>
                          <input 
                            type="number" 
                            placeholder="Take-home pay" 
                            value={netMonthlyIncome} 
                            onChange={(e) => setNetMonthlyIncome(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-750 mb-1">Bank Name</label>
                          <select 
                            value={bankName} 
                            onChange={(e) => setBankName(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs"
                          >
                            <option value="">Select Bank</option>
                            <option value="Standard Bank">Standard Bank</option>
                            <option value="First National Bank (FNB)">First National Bank (FNB)</option>
                            <option value="Nedbank">Nedbank</option>
                            <option value="ABSA">ABSA</option>
                            <option value="Capitec">Capitec</option>
                            <option value="Discovery Bank">Discovery Bank</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-750 mb-1">Account Holder Name</label>
                          <input 
                            type="text" 
                            placeholder="Name as listed on bank statements" 
                            value={accountHolder} 
                            onChange={(e) => setAccountHolder(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-750 mb-1">Account Number</label>
                          <input 
                            type="text" 
                            placeholder="Cheque or savings account number" 
                            value={accountNumber} 
                            onChange={(e) => setAccountNumber(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-750 mb-1">Account Type</label>
                          <input 
                            type="text" 
                            placeholder="Cheque, Savings, Current" 
                            value={accountType} 
                            onChange={(e) => setAccountType(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-750 mb-1">Bank Branch Name</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Sandton, Pretoria, Cape Town" 
                            value={branchName} 
                            onChange={(e) => setBranchName(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs"
                          />
                        </div>
                      </div>

                      {/* Judgements Disclosures */}
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl mt-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-gray-800 block">Do you have any outstanding judgements or credit defaults?</span>
                            <span className="text-[10px] text-gray-400">Legal disclosure under South African Consumer Protection Act</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setHasJudgementsDefaults(!hasJudgementsDefaults)}
                            className={`px-3 py-1 rounded text-[10px] font-bold uppercase ${
                              hasJudgementsDefaults ? "bg-red-50 text-red-600 border border-red-200" : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                            }`}
                          >
                            {hasJudgementsDefaults ? "Yes" : "No"}
                          </button>
                        </div>
                        {hasJudgementsDefaults && (
                          <textarea
                            placeholder="Provide brief details on judgements or defaults here..."
                            value={judgementsDefaultsDetails}
                            onChange={(e) => setJudgementsDefaultsDetails(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs h-16 mt-2"
                          />
                        )}
                      </div>

                      <div className="flex justify-end gap-2 pt-4">
                        <button
                          type="button"
                          onClick={() => setActiveFormStep(2)}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-bold text-gray-700 cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveFormStep(4)}
                          className="px-4 py-2 bg-brand-secondary hover:bg-brand-hover rounded-lg text-xs font-bold text-white cursor-pointer"
                        >
                          Next Step
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: Financial Schedule of Circumstances */}
                  {activeFormStep === 4 && (
                    <div className="space-y-4">
                      <div className="border-b border-gray-150 pb-2">
                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-wide">Schedule of Personal Circumstances (Annexure B)</h4>
                        <p className="text-[11px] text-gray-500">Provide a complete monthly household income and expense breakdown to determine rental affordability ratios.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Monthly Income Breakdown */}
                        <div className="space-y-3 bg-emerald-50/20 border border-emerald-200/50 p-4 rounded-xl">
                          <h5 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 uppercase tracking-wide">
                            <TrendingUp className="h-4 w-4" />
                            Monthly Income Streams
                          </h5>
                          
                          <div className="space-y-2.5">
                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">Basic Salary (Net)</label>
                              <input 
                                type="number" 
                                placeholder="R" 
                                value={salaryIncome} 
                                onChange={(e) => setSalaryIncome(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-lg p-1.5 text-xs font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">Business Income</label>
                              <input 
                                type="number" 
                                placeholder="R" 
                                value={businessIncome} 
                                onChange={(e) => setBusinessIncome(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-lg p-1.5 text-xs font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">Other Allowances/Income</label>
                              <input 
                                type="number" 
                                placeholder="R" 
                                value={otherIncome} 
                                onChange={(e) => setOtherIncome(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-lg p-1.5 text-xs font-mono"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Monthly Expenses Breakdown */}
                        <div className="space-y-3 bg-red-50/10 border border-red-200/40 p-4 rounded-xl">
                          <h5 className="text-xs font-bold text-red-800 flex items-center gap-1.5 uppercase tracking-wide">
                            <X className="h-4 w-4" />
                            Monthly Commitments
                          </h5>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[9px] font-bold text-gray-400 uppercase">Rent/Bond</label>
                              <input 
                                type="number" 
                                placeholder="R" 
                                value={rentExpense} 
                                onChange={(e) => setRentExpense(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded p-1 text-xs font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-gray-400 uppercase">Food/Groceries</label>
                              <input 
                                type="number" 
                                placeholder="R" 
                                value={foodExpense} 
                                onChange={(e) => setFoodExpense(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded p-1 text-xs font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-gray-400 uppercase">Transport/Fuel</label>
                              <input 
                                type="number" 
                                placeholder="R" 
                                value={transportExpense} 
                                onChange={(e) => setTransportExpense(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded p-1 text-xs font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-gray-400 uppercase">School Fees</label>
                              <input 
                                type="number" 
                                placeholder="R" 
                                value={schoolFeesExpense} 
                                onChange={(e) => setSchoolFeesExpense(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded p-1 text-xs font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-gray-400 uppercase">Debt/Credit Cards</label>
                              <input 
                                type="number" 
                                placeholder="R" 
                                value={debtExpense} 
                                onChange={(e) => setDebtExpense(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded p-1 text-xs font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-gray-400 uppercase">Insurances</label>
                              <input 
                                type="number" 
                                placeholder="R" 
                                value={insuranceExpense} 
                                onChange={(e) => setInsuranceExpense(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded p-1 text-xs font-mono"
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="block text-[9px] font-bold text-gray-400 uppercase">Other Expenses</label>
                              <input 
                                type="number" 
                                placeholder="R" 
                                value={otherExpense} 
                                onChange={(e) => setOtherExpense(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded p-1 text-xs font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Dynamic references/occupants blocks */}
                      <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-4">
                        <h5 className="text-xs font-bold text-gray-950 flex items-center gap-1 uppercase tracking-wide">
                          <Users className="h-4 w-4" />
                          Other Occupants (Who will reside in the property)
                        </h5>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <input type="text" placeholder="First Name" value={newOccName} onChange={e => setNewOccName(e.target.value)} className="bg-white border border-gray-200 p-1.5 text-xs rounded" />
                          <input type="text" placeholder="Surname" value={newOccSurname} onChange={e => setNewOccSurname(e.target.value)} className="bg-white border border-gray-200 p-1.5 text-xs rounded" />
                          <input type="text" placeholder="Relation (e.g. Spouse, Son)" value={newOccRelation} onChange={e => setNewOccRelation(e.target.value)} className="bg-white border border-gray-200 p-1.5 text-xs rounded" />
                          <button type="button" onClick={handleAddOccupant} className="px-3 py-1.5 bg-brand-primary text-white font-bold text-xs rounded hover:bg-brand-hover cursor-pointer">
                            + Add Occupant
                          </button>
                        </div>

                        {/* Occupants table */}
                        {occupants.length > 0 && (
                          <table className="w-full text-xs mt-3 border border-gray-200 bg-white">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="p-2 text-left border">Name</th>
                                <th className="p-2 text-left border">Relation</th>
                                <th className="p-2 text-center border">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {occupants.map(o => (
                                <tr key={o.id}>
                                  <td className="p-2 border">{o.name} {o.surname}</td>
                                  <td className="p-2 border">{o.relationship}</td>
                                  <td className="p-2 text-center border">
                                    <button type="button" onClick={() => handleRemoveOccupant(o.id)} className="text-red-500 hover:text-red-700">
                                      <Trash2 className="h-4 w-4 mx-auto" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>

                      {/* References details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-150 p-4 rounded-xl">
                        <div className="space-y-2">
                          <h6 className="text-[11px] font-black uppercase text-slate-800">Family Reference (Not living with you)</h6>
                          <input type="text" placeholder="Full Name" value={familyRefName} onChange={e => setFamilyRefName(e.target.value)} className="w-full bg-white border border-gray-200 rounded p-1.5 text-xs" />
                          <input type="text" placeholder="Relationship" value={familyRefRelation} onChange={e => setFamilyRefRelation(e.target.value)} className="w-full bg-white border border-gray-200 rounded p-1.5 text-xs" />
                          <input type="text" placeholder="Contact Number" value={familyRefContact} onChange={e => setFamilyRefContact(e.target.value)} className="w-full bg-white border border-gray-200 rounded p-1.5 text-xs" />
                        </div>

                        <div className="space-y-2">
                          <h6 className="text-[11px] font-black uppercase text-slate-800">Professional/Alternative Reference</h6>
                          <input type="text" placeholder="Full Name" value={professionalRefName} onChange={e => setProfessionalRefName(e.target.value)} className="w-full bg-white border border-gray-200 rounded p-1.5 text-xs" />
                          <input type="text" placeholder="Relationship (e.g. Employer, Colleague)" value={professionalRefRelation} onChange={e => setProfessionalRefRelation(e.target.value)} className="w-full bg-white border border-gray-200 rounded p-1.5 text-xs" />
                          <input type="text" placeholder="Contact Number" value={professionalRefContact} onChange={e => setProfessionalRefContact(e.target.value)} className="w-full bg-white border border-gray-200 rounded p-1.5 text-xs" />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-4">
                        <button
                          type="button"
                          onClick={() => setActiveFormStep(3)}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-bold text-gray-700 cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveFormStep(5)}
                          className="px-4 py-2 bg-brand-secondary hover:bg-brand-hover rounded-lg text-xs font-bold text-white cursor-pointer"
                        >
                          Next Step
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 5: POPIA & Signature */}
                  {activeFormStep === 5 && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-black text-gray-900 uppercase tracking-wide">Legal Consent, POPIA Declaration & Signature</h4>
                      
                      <div className="border border-gray-200 p-4 rounded-xl space-y-3 bg-gray-50 text-[11px] leading-relaxed text-gray-600">
                        <p className="font-semibold text-gray-900">Magistrates Court Act & Protection of Personal Information Act (POPIA) Consent:</p>
                        <p>
                          I/We hereby consent that Beno Properties and its designated agents may inspect, run checks, and obtain information from credit bureaus or references regarding my credit profile and financial behavior. 
                        </p>
                        <p>
                          I/We declare that all information furnished is true, precise, and completely correct. I/We further confirm that the property will only be used for residential occupancy under the declared terms.
                        </p>
                      </div>

                      <div className="space-y-3 pt-2">
                        <label className="flex items-start gap-2.5 text-xs font-medium cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={popiaConsent}
                            onChange={(e) => setPopiaConsent(e.target.checked)}
                            className="mt-0.5" 
                          />
                          <span>I explicitly consent to POPIA data processing and verification of all references declared in this form.</span>
                        </label>

                        <label className="flex items-start gap-2.5 text-xs font-medium cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={creditCheckConsent}
                            onChange={(e) => setCreditCheckConsent(e.target.checked)}
                            className="mt-0.5" 
                          />
                          <span>I authorize Beno Properties to perform credit bureau inquiries with registered bureaus (TransUnion/Experian) at R350 fee.</span>
                        </label>
                      </div>

                      <div className="pt-2">
                        <label className="block text-xs font-bold text-gray-700 mb-1">E-Signature: Type Your Full Names to Sign</label>
                        <input 
                          type="text" 
                          placeholder="Your digital signature matching your legal identity" 
                          value={signatureTyped}
                          onChange={(e) => setSignatureTyped(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs italic font-serif"
                        />
                      </div>

                      {/* Contextual Client Trigger */}
                      <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-2" id="tenant-app-step5-trigger">
                        <div className="space-y-1">
                          <h5 className="text-xs font-bold text-amber-950 uppercase tracking-wider">Save Application Progress</h5>
                          <p className="text-[11px] text-amber-800 leading-relaxed">
                            Would you like to register or log in to secure your application and save this property to your profile?
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (onOpenAuth) {
                              onOpenAuth("Sign In / Register to Save Property");
                            }
                          }}
                          className="px-4 py-2 bg-slate-950 hover:bg-slate-850 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer shadow-sm transition-colors shrink-0"
                        >
                          Sign In / Register to Save Property
                        </button>
                      </div>

                      <div className="flex justify-end gap-2 pt-4">
                        <button
                          type="button"
                          onClick={() => setActiveFormStep(4)}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-bold text-gray-700 cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-xs font-bold text-white cursor-pointer shadow-md inline-flex items-center gap-1.5"
                        >
                          <Send className="h-4 w-4" />
                          Submit Application Form
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          ) : (
            /* ACTIVE APPLICATION STAGES TRACKER (For Client) */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Workflow Progress */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 font-mono">Reference: {myApplication.id}</span>
                      <h3 className="text-base font-extrabold text-gray-900 mt-0.5">Your Beno Tenant Vetting Status</h3>
                    </div>
                    
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide border ${
                      myApplication.status === "Approved" 
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                        : myApplication.status === "Rejected"
                        ? "bg-red-50 text-red-800 border-red-200"
                        : "bg-amber-50 text-amber-800 border-amber-200 animate-pulse"
                    }`}>
                      {myApplication.status}
                    </span>
                  </div>

                  {/* Dynamic Workflow Roadmap */}
                  <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                    
                    {/* Step 1: Form Filled */}
                    <div className="relative">
                      <div className="absolute -left-6 top-1 w-4.5 h-4.5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                        <Check className="h-2.5 w-2.5 text-white" />
                      </div>
                      <h4 className="text-xs font-extrabold text-gray-900">Step 1: Digital Beno Form Submitted</h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">Form finalized and signed under POPIA specifications on {new Date(myApplication.submittedAt).toLocaleDateString()}.</p>
                    </div>

                    {/* Step 2: Upload Supporting Documents */}
                    <div className="relative">
                      <div className={`absolute -left-6 top-1 w-4.5 h-4.5 rounded-full border-2 border-white flex items-center justify-center ${
                        myApplication.status === "DocumentsPending" 
                          ? "bg-amber-500 animate-ping" 
                          : "bg-emerald-500"
                      }`}>
                        {myApplication.status !== "DocumentsPending" ? <Check className="h-2.5 w-2.5 text-white" /> : <div className="h-1 w-1 bg-white rounded-full" />}
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="text-xs font-extrabold text-gray-900">Step 2: Upload Vetting Credentials</h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Employment Type: <strong className="text-gray-800 font-bold">{myApplication.employmentStatus}</strong>.
                          {myApplication.employmentStatus === "Employed" 
                            ? " Provide: ID/Passport, latest 3 months' Bank Statements, and latest 3 months' Payslips." 
                            : " Provide: ID/Passport, signed Beno form, and latest 6 months' Bank Statements."}
                        </p>

                        {/* File Inputs list */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {/* ID Copy */}
                          <div className="border border-gray-150 rounded-lg p-3 bg-slate-50/50 relative">
                            <span className="text-[9px] font-bold text-gray-400 block uppercase mb-1">ID/Passport Copy</span>
                            {uploadedIdFile || myApplication.documentsUploaded.idCopyUrl ? (
                              <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                                <CheckCircle className="h-4 w-4" />
                                <span className="truncate">{uploadedIdFile || myApplication.documentsUploaded.idCopyUrl}</span>
                              </div>
                            ) : (
                              <label className="flex items-center gap-1 text-brand-primary text-xs font-semibold cursor-pointer">
                                <Upload className="h-3.5 w-3.5" />
                                {isUploading === "idCopyUrl" ? "Uploading..." : "Upload File"}
                                <input 
                                  type="file" 
                                  className="hidden" 
                                  onChange={(e) => e.target.files && simulateFileUpload("idCopyUrl", e.target.files[0])} 
                                />
                              </label>
                            )}
                          </div>

                          {/* Bank Statements */}
                          <div className="border border-gray-150 rounded-lg p-3 bg-slate-50/50 relative">
                            <span className="text-[9px] font-bold text-gray-400 block uppercase mb-1">
                              {myApplication.employmentStatus === "Employed" ? "3 Months Bank Statements" : "6 Months Bank Statements"}
                            </span>
                            {uploadedBankStatements || myApplication.documentsUploaded.bankStatementsUrl ? (
                              <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                                <CheckCircle className="h-4 w-4" />
                                <span className="truncate">{uploadedBankStatements || myApplication.documentsUploaded.bankStatementsUrl}</span>
                              </div>
                            ) : (
                              <label className="flex items-center gap-1 text-brand-primary text-xs font-semibold cursor-pointer">
                                <Upload className="h-3.5 w-3.5" />
                                {isUploading === "bankStatementsUrl" ? "Uploading..." : "Upload File"}
                                <input 
                                  type="file" 
                                  className="hidden" 
                                  onChange={(e) => e.target.files && simulateFileUpload("bankStatementsUrl", e.target.files[0])} 
                                />
                              </label>
                            )}
                          </div>

                          {/* Payslips or Signed form depending on employment */}
                          {myApplication.employmentStatus === "Employed" ? (
                            <div className="border border-gray-150 rounded-lg p-3 bg-slate-50/50 relative">
                              <span className="text-[9px] font-bold text-gray-400 block uppercase mb-1">3 Months Payslips</span>
                              {uploadedPayslips || myApplication.documentsUploaded.payslipsUrl ? (
                                <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                                  <CheckCircle className="h-4 w-4" />
                                  <span className="truncate">{uploadedPayslips || myApplication.documentsUploaded.payslipsUrl}</span>
                                </div>
                              ) : (
                                <label className="flex items-center gap-1 text-brand-primary text-xs font-semibold cursor-pointer">
                                  <Upload className="h-3.5 w-3.5" />
                                  {isUploading === "payslipsUrl" ? "Uploading..." : "Upload File"}
                                  <input 
                                    type="file" 
                                    className="hidden" 
                                    onChange={(e) => e.target.files && simulateFileUpload("payslipsUrl", e.target.files[0])} 
                                  />
                                </label>
                              )}
                            </div>
                          ) : (
                            <div className="border border-gray-150 rounded-lg p-3 bg-slate-50/50 relative">
                              <span className="text-[9px] font-bold text-gray-400 block uppercase mb-1">Signed Beno Form</span>
                              {uploadedSignedForm || myApplication.documentsUploaded.signedFormUrl ? (
                                <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                                  <CheckCircle className="h-4 w-4" />
                                  <span className="truncate">{uploadedSignedForm || myApplication.documentsUploaded.signedFormUrl}</span>
                                </div>
                              ) : (
                                <label className="flex items-center gap-1 text-brand-primary text-xs font-semibold cursor-pointer">
                                  <Upload className="h-3.5 w-3.5" />
                                  {isUploading === "signedFormUrl" ? "Uploading..." : "Upload File"}
                                  <input 
                                    type="file" 
                                    className="hidden" 
                                    onChange={(e) => e.target.files && simulateFileUpload("signedFormUrl", e.target.files[0])} 
                                  />
                                </label>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Step 3: Payment */}
                    <div className="relative">
                      <div className={`absolute -left-6 top-1 w-4.5 h-4.5 rounded-full border-2 border-white flex items-center justify-center ${
                        myApplication.status === "PaymentPending" 
                          ? "bg-amber-500 animate-pulse" 
                          : myApplication.paymentConfirmed 
                          ? "bg-emerald-500" 
                          : "bg-gray-200"
                      }`}>
                        {myApplication.paymentConfirmed ? <Check className="h-2.5 w-2.5 text-white" /> : <div className="h-1 w-1 bg-white rounded-full" />}
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-xs font-extrabold text-gray-900">Step 3: Pay Credit Check Fee (R350)</h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">Payments gate credit bureau searches and reference checks. Flat fee of R350 is fully receipted.</p>
                        
                        {myApplication.paymentConfirmed ? (
                          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-800 font-mono">
                            Receipted: R350. Ref: {myApplication.paymentRef} on {new Date(myApplication.paymentTimestamp || "").toLocaleDateString()}
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <button
                              onClick={() => setShowPaymentModal(true)}
                              disabled={myApplication.status === "DocumentsPending"}
                              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-lg shadow cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                            >
                              <CreditCard className="h-3.5 w-3.5" />
                              Pay R350 Securely
                            </button>

                            {/* Contextual Client Trigger */}
                            <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-2" id="tenant-app-step3-trigger">
                              <div className="space-y-1">
                                <h5 className="text-xs font-bold text-amber-950 uppercase tracking-wider">Save Application Progress</h5>
                                <p className="text-[11px] text-amber-800 leading-relaxed">
                                  Would you like to register or log in to secure your application and save this property to your profile?
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  if (onOpenAuth) {
                                    onOpenAuth("Sign In / Register to Save Property");
                                  }
                                }}
                                className="px-4 py-2 bg-slate-950 hover:bg-slate-850 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer shadow-sm transition-colors shrink-0"
                              >
                                Sign In / Register to Save Property
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Step 4: Bureau Credit Report */}
                    <div className="relative font-sans">
                      <div className={`absolute -left-6 top-1 w-4.5 h-4.5 rounded-full border-2 border-white flex items-center justify-center ${
                        myApplication.creditReport 
                          ? "bg-emerald-500" 
                          : myApplication.status === "VettingInProgress"
                          ? "bg-amber-500"
                          : "bg-gray-200"
                      }`}>
                        {myApplication.creditReport ? <Check className="h-2.5 w-2.5 text-white" /> : <div className="h-1 w-1 bg-white rounded-full" />}
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-xs font-extrabold text-gray-900">Step 4: TransUnion Bureau Credit Check & Copy Delivery</h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">Once payment is completed, run your immediate bureau inquiry. A certified copy is delivered for your future reference.</p>
                        
                        {myApplication.creditReport ? (
                          <div className="border border-emerald-200 bg-emerald-50/20 p-4 rounded-xl space-y-3">
                            <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                              <span className="text-xs font-extrabold text-emerald-900">Your Bureau Credit Score:</span>
                              <span className="font-mono text-lg font-black text-emerald-700">{myApplication.creditReport.score} / 850</span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 text-[11px] font-mono">
                              <div>Risk Profile: <strong className="text-emerald-800">{myApplication.creditReport.riskCategory}</strong></div>
                              <div>On-Time Rate: <strong>{myApplication.creditReport.paymentProfileScore}</strong></div>
                              <div>Outstanding Judgements: <strong>{myApplication.creditReport.judgementsCount}</strong></div>
                              <div>Defaults Count: <strong>{myApplication.creditReport.defaultsCount}</strong></div>
                            </div>

                            <div className="pt-2 border-t border-emerald-100 flex gap-2">
                              <button
                                onClick={() => alert("Bureau PDF Copy downloaded to local system.")}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                              >
                                <Download className="h-3 w-3" />
                                Download Bureau PDF Copy
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={executeBureauCreditCheck}
                            disabled={!myApplication.paymentConfirmed || isRunningCreditCheck}
                            className="px-4 py-2 bg-brand-secondary hover:bg-brand-hover text-white font-bold text-xs rounded-lg shadow cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
                          >
                            {isRunningCreditCheck ? (
                              <>
                                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                Running Bureau Search...
                              </>
                            ) : (
                              <>
                                <Search className="h-3.5 w-3.5" />
                                Run Bureau Credit Check
                              </>
                            )}
                          </button>
                        )}

                        {isRunningCreditCheck && (
                          <p className="text-[10px] text-brand-primary font-bold animate-pulse font-mono">{creditCheckProgress}</p>
                        )}
                      </div>
                    </div>

                    {/* Step 5: Landlord decision */}
                    <div className="relative">
                      <div className={`absolute -left-6 top-1 w-4.5 h-4.5 rounded-full border-2 border-white flex items-center justify-center ${
                        myApplication.status === "Approved" 
                          ? "bg-emerald-500" 
                          : myApplication.status === "Rejected"
                          ? "bg-red-500"
                          : "bg-gray-200"
                      }`}>
                        {myApplication.status === "Approved" ? <Check className="h-2.5 w-2.5 text-white" /> : <div className="h-1 w-1 bg-white rounded-full" />}
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-xs font-extrabold text-gray-900">Step 5: Landlord Review & Approval</h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">Aggregated vetting packages are forwarded to property owners for final verification.</p>
                        {myApplication.landlordFeedback && (
                          <div className="p-3 bg-slate-50 border rounded-xl text-xs mt-2">
                            <span className="font-bold text-slate-800 block mb-0.5">Landlord Feedback:</span>
                            <p className="text-slate-600 italic">"{myApplication.landlordFeedback}"</p>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* Right Column: Application Details & Summary */}
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-gray-100 pb-2">Your Application Summary</h4>
                  
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Applicant:</span>
                      <strong className="text-gray-900 font-bold">{myApplication.applicantName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Contact Number:</span>
                      <strong className="text-gray-900 font-mono">{myApplication.applicantPhone}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Target Rent (ZAR):</span>
                      <strong className="text-brand-secondary font-mono">R {myApplication.monthlyRental.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Declared Income:</span>
                      <strong className="text-emerald-600 font-mono">R {myApplication.netMonthlyIncome.toLocaleString()}</strong>
                    </div>
                    
                    <div className="pt-2 border-t border-gray-100 flex flex-wrap gap-1">
                      <button
                        onClick={() => {
                          if (confirm("Are you sure you want to delete and reset your digital application? This cannot be undone.")) {
                            saveApplications(applications.filter(a => a.id !== myApplication.id));
                            // Reset files
                            setUploadedIdFile(null);
                            setUploadedBankStatements(null);
                            setUploadedPayslips(null);
                            setUploadedSignedForm(null);
                          }
                        }}
                        className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 font-bold text-[10px] rounded flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete & Reset Application
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-[11px] text-slate-600 leading-relaxed space-y-2">
                  <span className="font-bold text-slate-900 block">POPIA Protection Guarantee</span>
                  <p>Your bank details, financial circumstances schedule, and national ID copies are encrypted securely. Landlords only see dynamic summaries. Full statements remain redacted to prevent data leakage.</p>
                </div>
              </div>

            </div>
          )}
        </div>
      )}

      {/* PERSPECTIVE VIEW 2: AGENT / BACK OFFICE CONTROL */}
      {activePerspective === "agent" && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold uppercase tracking-wide">Enterprise Tenant Vetting Control Board</h3>
                <p className="text-slate-300 text-xs mt-0.5">Verify employment, audit reference records, process TransUnion scores, and packages for landlord consent.</p>
              </div>
              <div className="flex gap-2">
                <span className="bg-white/10 border border-white/10 px-3 py-1 text-xs rounded-xl font-mono">
                  Pending Verification: {applications.filter(a => a.status === "VettingInProgress" || a.status === "DocumentsPending").length}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* List of Applications */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {applications.map(app => (
                  <div 
                    key={app.id}
                    onClick={() => {
                      setSelectedAppId(app.id);
                      setAgentChecklist(app.verificationChecklist);
                      setAgentVerificationNotes(app.agentNotes || "");
                    }}
                    className={`border rounded-2xl p-5 cursor-pointer hover:shadow-md transition-all relative flex flex-col justify-between h-48 ${
                      selectedAppId === app.id ? "border-brand-primary bg-slate-50/50" : "border-gray-200 bg-white"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] text-gray-400 font-mono uppercase">{app.id}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wide ${
                          app.status === "Approved" 
                            ? "bg-emerald-50 text-emerald-800" 
                            : app.status === "Rejected"
                            ? "bg-red-50 text-red-800"
                            : "bg-amber-50 text-amber-800"
                        }`}>
                          {app.status}
                        </span>
                      </div>

                      <h4 className="text-xs font-extrabold text-gray-900 mt-2">{app.applicantName}</h4>
                      <p className="text-[10px] text-gray-500 font-mono">{app.applicantEmail} | {app.applicantPhone}</p>
                      
                      <div className="mt-3 text-[11px] text-slate-700 font-semibold flex items-center gap-1">
                        <Building className="h-3.5 w-3.5 text-gray-400" />
                        Rent: R {app.monthlyRental.toLocaleString()}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px]">
                      <span className="text-gray-400">Score: <strong className="text-slate-800">{app.creditReport ? app.creditReport.score : "No Search"}</strong></span>
                      <span className="text-brand-primary font-bold inline-flex items-center gap-0.5">
                        <Eye className="h-3 w-3" /> View Package
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Detail view & Office Checklist verification drawer */}
              {selectedApp && (
                <div className="border border-brand-primary/30 rounded-2xl p-6 bg-amber-50/10 space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-150 pb-4">
                    <div>
                      <span className="text-xs font-bold text-gray-400 font-mono">Detailed Portfolio Audit Package</span>
                      <h4 className="text-base font-extrabold text-gray-900">{selectedApp.applicantName}</h4>
                    </div>
                    <button 
                      onClick={() => setSelectedAppId(null)}
                      className="p-1.5 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Form detail values */}
                    <div className="lg:col-span-2 space-y-4">
                      {/* Personal & Employment Details */}
                      <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
                        <h5 className="text-xs font-black text-slate-800 uppercase tracking-wide border-b border-gray-100 pb-2">Tenant Declarations</h5>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                          <div><span className="text-gray-400">ID / Passport:</span> <strong className="font-mono">{selectedApp.idPassportNumber}</strong></div>
                          <div><span className="text-gray-400">Marital Status:</span> <strong>{selectedApp.maritalStatus}</strong></div>
                          <div><span className="text-gray-400">Employment:</span> <strong>{selectedApp.employmentStatus}</strong></div>
                          <div><span className="text-gray-400">Employer Name:</span> <strong>{selectedApp.employerName || "N/A"}</strong></div>
                          <div><span className="text-gray-400">Net Take-Home:</span> <strong className="font-mono">R {selectedApp.netMonthlyIncome.toLocaleString()}</strong></div>
                          <div><span className="text-gray-400">Current Rent:</span> <strong className="font-mono">R {selectedApp.monthlyRental.toLocaleString()}</strong></div>
                        </div>

                        <div className="pt-2 text-xs">
                          <span className="text-gray-400">Current Address:</span> <strong className="text-gray-800">{selectedApp.currentAddress}</strong>
                        </div>
                      </div>

                      {/* Schedule of personal circumstances */}
                      <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
                        <h5 className="text-xs font-black text-slate-800 uppercase tracking-wide border-b border-gray-100 pb-2">Schedule of Circumstances (Annexure B)</h5>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                          <div><span className="text-gray-400 block uppercase text-[9px]">Basic Salary</span> R {selectedApp.financialSchedule.salaryIncome.toLocaleString()}</div>
                          <div><span className="text-gray-400 block uppercase text-[9px]">Debt Payments</span> R {selectedApp.financialSchedule.debtExpense.toLocaleString()}</div>
                          <div><span className="text-gray-400 block uppercase text-[9px]">Monthly Food</span> R {selectedApp.financialSchedule.foodExpense.toLocaleString()}</div>
                          <div><span className="text-gray-400 block uppercase text-[9px]">Disposable</span> R {calculateAffordability(selectedApp).disposable.toLocaleString()}</div>
                        </div>
                      </div>

                      {/* Uploaded Documents Credentials */}
                      <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
                        <h5 className="text-xs font-black text-slate-800 uppercase tracking-wide border-b border-gray-100 pb-2">Uploaded Vetting Credentials</h5>
                        
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(selectedApp.documentsUploaded).map(([key, value]) => (
                            <div key={key} className="p-2.5 bg-slate-50 border rounded-lg text-xs flex items-center gap-2">
                              <FileText className="h-4 w-4 text-brand-primary" />
                              <div>
                                <span className="font-bold text-gray-800 block text-[10px] capitalize">{key.replace("Url", "").replace(/([A-Z])/g, " $1")}</span>
                                <span className="text-gray-400 font-mono text-[9px]">{value}</span>
                              </div>
                              <button 
                                onClick={() => alert("Simulating document preview for " + value)}
                                className="p-1 bg-white border rounded hover:bg-gray-100 text-[10px] font-bold text-gray-600 ml-2"
                              >
                                Preview
                              </button>
                            </div>
                          ))}
                          {Object.keys(selectedApp.documentsUploaded).length === 0 && (
                            <p className="text-xs text-gray-500 italic">No files uploaded yet.</p>
                          )}
                        </div>
                      </div>

                      {/* TransUnion Credit Report details */}
                      {selectedApp.creditReport ? (
                        <div className="bg-emerald-50/20 border border-emerald-200 rounded-xl p-4 space-y-3">
                          <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                            <span className="text-xs font-black text-emerald-900 uppercase">TransUnion Certified Report</span>
                            <span className="font-mono text-xs text-emerald-700">Ref: {selectedApp.creditReport.bureauReference}</span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono text-emerald-950">
                            <div>Score: <strong className="text-base font-extrabold text-emerald-800">{selectedApp.creditReport.score}</strong></div>
                            <div>Risk Category: <strong>{selectedApp.creditReport.riskCategory}</strong></div>
                            <div>Judgements: <strong>{selectedApp.creditReport.judgementsCount}</strong></div>
                            <div>Defaults: <strong>{selectedApp.creditReport.defaultsCount}</strong></div>
                          </div>
                          {selectedApp.creditReport.defaultsDetails && (
                            <p className="text-[11px] text-red-700 font-mono bg-red-50 border border-red-200 p-2 rounded">
                              ⚠️ Default detail: {selectedApp.creditReport.defaultsDetails}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs">
                          ⚠️ No credit report generated for this applicant. Run a bureau check inside the applicant portal to compile scores.
                        </div>
                      )}
                    </div>

                    {/* Right Column: FOR OFFICE USE ONLY VERIFICATION CHECKLIST */}
                    <div className="space-y-4">
                      <div className="bg-slate-900 text-white rounded-xl p-5 space-y-4">
                        <div className="border-b border-slate-800 pb-2">
                          <h5 className="text-xs font-black uppercase tracking-wider text-amber-400">For Office Use Only Verification</h5>
                          <p className="text-[10px] text-slate-400 mt-0.5">Maintain legal compliance tracking indices.</p>
                        </div>

                        <div className="space-y-3 text-xs">
                          {/* Credit check checklist */}
                          <label className="flex items-center gap-2.5 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={agentChecklist.creditCheckDone}
                              onChange={(e) => setAgentChecklist({ ...agentChecklist, creditCheckDone: e.target.checked })}
                              className="accent-amber-400"
                            />
                            <span>Bureau Credit Check Pull Done</span>
                          </label>

                          {/* Employment check */}
                          <label className="flex items-center gap-2.5 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={agentChecklist.employmentConfirmed}
                              onChange={(e) => setAgentChecklist({ ...agentChecklist, employmentConfirmed: e.target.checked })}
                              className="accent-amber-400"
                            />
                            <span>Employment Confirmed</span>
                          </label>

                          {/* Landlord Ref */}
                          <label className="flex items-center gap-2.5 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={agentChecklist.landlordRefChecked}
                              onChange={(e) => setAgentChecklist({ ...agentChecklist, landlordRefChecked: e.target.checked })}
                              className="accent-amber-400"
                            />
                            <span>Landlord References Checked</span>
                          </label>

                          {/* Family ref */}
                          <label className="flex items-center gap-2.5 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={agentChecklist.familyRefChecked}
                              onChange={(e) => setAgentChecklist({ ...agentChecklist, familyRefChecked: e.target.checked })}
                              className="accent-amber-400"
                            />
                            <span>Family References Checked</span>
                          </label>

                          {/* Other ref */}
                          <label className="flex items-center gap-2.5 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={agentChecklist.otherRefChecked}
                              onChange={(e) => setAgentChecklist({ ...agentChecklist, otherRefChecked: e.target.checked })}
                              className="accent-amber-400"
                            />
                            <span>Professional References Checked</span>
                          </label>

                          <div className="pt-2">
                            <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">Agent Verification Notes</label>
                            <textarea
                              value={agentVerificationNotes}
                              onChange={(e) => setAgentVerificationNotes(e.target.value)}
                              className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs text-white"
                              rows={3}
                            />
                          </div>

                          <div className="flex gap-2 pt-2">
                            <button
                              onClick={() => handleUpdateChecklist(selectedApp.id)}
                              className="flex-1 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded transition-colors cursor-pointer"
                            >
                              Save Checklist
                            </button>
                            
                            <button
                              onClick={() => handleForwardToLandlord(selectedApp.id)}
                              disabled={!agentChecklist.creditCheckDone}
                              className="flex-1 px-3 py-2 bg-brand-primary hover:bg-brand-hover text-white font-bold text-xs rounded transition-colors disabled:opacity-50 cursor-pointer"
                            >
                              Forward to Landlord
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Status history audit trail */}
                      <div className="border border-gray-200 rounded-xl p-4 bg-white space-y-2">
                        <h6 className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Workflow Audit Logs</h6>
                        <div className="space-y-1.5 text-[11px] font-mono text-gray-600">
                          {selectedApp.statusHistory.map((h, idx) => (
                            <div key={idx} className="border-b border-gray-100 pb-1 flex items-start gap-1">
                              <span className="text-emerald-600 font-bold">●</span>
                              <div>
                                <strong className="text-gray-900">{h.status}</strong>
                                <span className="text-[9px] text-gray-400 block">{new Date(h.timestamp).toLocaleString()}</span>
                                <p className="text-[10px] text-gray-500 italic">"{h.note}"</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PERSPECTIVE VIEW 3: PROPERTY OWNER / LANDLORD REVIEW PORTAL */}
      {activePerspective === "landlord" && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold uppercase tracking-wide">Property Owner Consent Dashboard</h3>
                <p className="text-slate-300 text-xs mt-0.5">Secure, POPIA-compliant, and curated vetting applications forwarded by your Beno Properties agent.</p>
              </div>
              <Building className="h-8 w-8 text-amber-400" />
            </div>

            <div className="p-6 space-y-6">
              {/* Landlord Inbox */}
              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-gray-100 pb-2">Vetting Packages in Inbox</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {applications.filter(a => a.status === "ForwardedToLandlord" || a.status === "Approved" || a.status === "Rejected" || a.status === "MoreInfoRequested").map(app => (
                    <div 
                      key={app.id}
                      onClick={() => setSelectedAppId(app.id)}
                      className={`border rounded-2xl p-5 cursor-pointer hover:shadow-md transition-all bg-white relative flex flex-col justify-between h-44 ${
                        selectedAppId === app.id ? "border-brand-primary bg-slate-50/50" : "border-gray-200"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-gray-400 font-mono">Curated Package ID: {app.id}</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wide ${
                            app.status === "Approved" 
                              ? "bg-emerald-50 text-emerald-800" 
                              : app.status === "Rejected"
                              ? "bg-red-50 text-red-800"
                              : "bg-amber-50 text-amber-800"
                          }`}>
                            {app.status}
                          </span>
                        </div>

                        <h4 className="text-xs font-extrabold text-gray-900 mt-2">{app.applicantName}</h4>
                        <div className="text-[10px] text-gray-500 font-semibold space-y-0.5 mt-2">
                          <p>🏠 Rental: Beno Listing Property Portfolio</p>
                          <p>📈 Disposable Income: R {calculateAffordability(app).disposable.toLocaleString()}/month</p>
                          <p>✨ Certified Bureau Score: {app.creditReport ? app.creditReport.score : "Under Search"}</p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-100 text-right text-[10px] font-bold text-brand-primary flex items-center justify-end gap-1">
                        <Eye className="h-3 w-3" /> Audit & Authorize
                      </div>
                    </div>
                  ))}

                  {applications.filter(a => a.status === "ForwardedToLandlord" || a.status === "Approved" || a.status === "Rejected" || a.status === "MoreInfoRequested").length === 0 && (
                    <p className="text-xs text-gray-500 italic py-6">No applications forwarded to landlords yet. Use the 'Verifying Agent' tab to verify the checklist and forward a candidate.</p>
                  )}
                </div>
              </div>

              {/* Landlord curated details and actions */}
              {selectedApp && (
                <div className="border border-brand-primary/30 rounded-2xl p-6 bg-slate-50/50 space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-150 pb-4">
                    <div>
                      <span className="text-xs font-bold text-gray-400 font-mono">Curated Candidate Summary</span>
                      <h4 className="text-sm font-black text-slate-900">{selectedApp.applicantName}</h4>
                    </div>
                    <button 
                      onClick={() => setSelectedAppId(null)}
                      className="p-1.5 bg-gray-150 text-gray-500 rounded hover:bg-gray-200 cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Curated Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white border p-4 rounded-xl shadow-sm text-center">
                      <span className="text-[10px] text-gray-400 uppercase font-mono block">Household Affordability Ratio</span>
                      <strong className="text-base text-brand-secondary font-mono mt-1 block">
                        {calculateAffordability(selectedApp).rentRatio.toFixed(1)}% <span className="text-xs font-normal text-gray-500">of net income</span>
                      </strong>
                    </div>

                    <div className="bg-white border p-4 rounded-xl shadow-sm text-center">
                      <span className="text-[10px] text-gray-400 uppercase font-mono block">Curated Bureau Verdict</span>
                      <strong className="text-base text-emerald-600 font-mono mt-1 block">
                        {selectedApp.creditReport ? `${selectedApp.creditReport.score} (${selectedApp.creditReport.riskCategory})` : "N/A"}
                      </strong>
                    </div>

                    <div className="bg-white border p-4 rounded-xl shadow-sm text-center">
                      <span className="text-[10px] text-gray-400 uppercase font-mono block">Vetting Verification</span>
                      <strong className="text-xs text-emerald-600 flex items-center justify-center gap-1 mt-2.5">
                        <CheckSquare className="h-4 w-4" /> All References Confirmed
                      </strong>
                    </div>
                  </div>

                  {/* Curated detailed info & POPIA Privacy Masking */}
                  <div className="bg-white border rounded-xl p-5 space-y-4">
                    <div className="flex items-center gap-1.5 text-xs text-brand-secondary font-bold">
                      <Lock className="h-4 w-4" />
                      POPIA Compliant Secure Summary:
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed text-gray-600">
                      {selectedApp.applicantType === "CC" || selectedApp.applicantType === "Company" || selectedApp.applicantType === "Trust" ? (
                        <>
                          <div>
                            <ul className="space-y-1">
                              <li><strong>Applicant Entity Type:</strong> {selectedApp.applicantType} (Juristic Entity)</li>
                              <li><strong>Trading Name / Entity:</strong> {selectedApp.juristicTradeName || selectedApp.employerName || "N/A"}</li>
                              <li>
                                <strong>Registration Number:</strong> 
                                <span className="font-mono bg-gray-50 p-0.5 rounded text-[11px] text-gray-800 ml-1">
                                  {selectedApp.juristicRegNumber ? `******${selectedApp.juristicRegNumber.slice(-4)}` : "******"}
                                </span>
                              </li>
                              <li><strong>Nature of Business:</strong> {selectedApp.juristicNatureOfBusiness || "N/A"}</li>
                              <li>
                                <strong>Registered Head Office:</strong> 
                                <span className="italic text-gray-500">
                                  {selectedApp.juristicRegAddress ? `*** ${selectedApp.juristicRegAddress.slice(-15)}` : "Redacted for privacy"}
                                </span>
                              </li>
                            </ul>
                          </div>
                          <div>
                            <ul className="space-y-1">
                              <li><strong>Authorized Representative:</strong> {selectedApp.juristicRepName || "Declared Representative"}</li>
                              <li>
                                <strong>Representative ID/Passport:</strong> 
                                <span className="font-mono bg-gray-50 p-0.5 rounded text-[11px] text-gray-800 ml-1">
                                  {selectedApp.juristicRepIdNumber ? `******${selectedApp.juristicRepIdNumber.slice(-4)}` : "******"}
                                </span>
                              </li>
                              <li>
                                <strong>Corporate Bank Account:</strong> {selectedApp.bankName || "Standard Bank"} (Current) Account Number: 
                                <span className="font-mono bg-gray-50 p-0.5 rounded text-[11px] text-gray-800 ml-1">******{selectedApp.accountNumber ? selectedApp.accountNumber.slice(-4) : "4321"}</span>
                              </li>
                              <li><strong>Credit Bureau Reference:</strong> {selectedApp.creditReport ? selectedApp.creditReport.bureauReference : "No Search"}</li>
                            </ul>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <ul className="space-y-1">
                              <li><strong>Full Names:</strong> {selectedApp.applicantName}</li>
                              <li><strong>Employment:</strong> {selectedApp.employmentStatus}</li>
                              <li><strong>Employer:</strong> {selectedApp.employerName || "N/A"}</li>
                              <li>
                                <strong>Banking Account:</strong> {selectedApp.bankName || "Nedbank"} (Cheque) Account Number: 
                                <span className="font-mono bg-gray-50 p-0.5 rounded text-[11px] text-gray-800 ml-1">******{selectedApp.accountNumber ? selectedApp.accountNumber.slice(-4) : "4321"}</span>
                              </li>
                            </ul>
                          </div>
                          <div>
                            <ul className="space-y-1">
                              <li><strong>Family Reference:</strong> Sipho Nkosi (Relation: Brother) - Verified</li>
                              <li><strong>Professional Reference:</strong> Naledi Madiba (Relation: Manager) - Verified</li>
                              <li><strong>Credit Bureau reference:</strong> {selectedApp.creditReport ? selectedApp.creditReport.bureauReference : "No Search"}</li>
                            </ul>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Decision fields */}
                  <div className="bg-slate-900 text-white rounded-xl p-5 space-y-4">
                    <h5 className="text-xs font-black uppercase text-amber-400 tracking-wider">Execute Consent Decision</h5>
                    
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-slate-400">Owner Feedback / Requirements Notes:</label>
                      <textarea
                        value={landlordFeedbackText}
                        onChange={(e) => setLandlordFeedbackText(e.target.value)}
                        placeholder="Add optional notes (e.g., 'Requires double deposit' or 'Please proceed with lease agreement' or 'Details required for miniature poodle')"
                        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs text-white placeholder-slate-500"
                        rows={2}
                      />
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        onClick={() => handleLandlordDecision(selectedApp.id, "Approved")}
                        className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-lg transition-colors cursor-pointer text-center"
                      >
                        Approve Candidate Application
                      </button>

                      <button
                        onClick={() => handleLandlordDecision(selectedApp.id, "MoreInfoRequested")}
                        className="flex-1 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-lg transition-colors cursor-pointer text-center"
                      >
                        Request More Information
                      </button>

                      <button
                        onClick={() => handleLandlordDecision(selectedApp.id, "Rejected")}
                        className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-lg transition-colors cursor-pointer text-center"
                      >
                        Decline Candidate Application
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT SIMULATOR MODAL */}
      {showPaymentModal && myApplication && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl flex flex-col relative">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-amber-400" />
                <h3 className="text-sm font-bold uppercase tracking-wide">Ozow / PayFast Gateway</h3>
              </div>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="p-1 bg-white/10 hover:bg-white/20 text-white rounded cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="text-center py-2 bg-slate-50 rounded-xl border">
                <span className="text-[11px] text-gray-500 uppercase block">Transaction Amount</span>
                <span className="text-lg font-black font-mono text-gray-800">R 350.00</span>
              </div>

              {/* Method Selector */}
              <div className="flex gap-2">
                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg border text-center cursor-pointer transition-all ${
                    paymentMethod === "card" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-gray-700 border-gray-200"
                  }`}
                >
                  Credit Card
                </button>
                <button
                  onClick={() => setPaymentMethod("eft")}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg border text-center cursor-pointer transition-all ${
                    paymentMethod === "eft" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-gray-700 border-gray-200"
                  }`}
                >
                  Instant EFT
                </button>
              </div>

              {paymentMethod === "card" ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase">Card Number</label>
                    <input 
                      type="text" 
                      placeholder="4000 1234 5678 9010" 
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value)}
                      className="w-full border border-gray-200 p-2 text-xs rounded-lg mt-1" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase">Expiry Date</label>
                      <input 
                        type="text" 
                        placeholder="MM/YY" 
                        value={cardExpiry}
                        onChange={e => setCardExpiry(e.target.value)}
                        className="w-full border border-gray-200 p-2 text-xs rounded-lg mt-1" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase">CVV</label>
                      <input 
                        type="password" 
                        placeholder="123" 
                        value={cardCvv}
                        onChange={e => setCardCvv(e.target.value)}
                        className="w-full border border-gray-200 p-2 text-xs rounded-lg mt-1" 
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase">Choose SA Bank</label>
                  <select 
                    value={eftBank}
                    onChange={e => setEftBank(e.target.value)}
                    className="w-full border border-gray-200 p-2.5 text-xs rounded-lg mt-1"
                  >
                    <option value="Capitec">Capitec Bank</option>
                    <option value="FNB">First National Bank (FNB)</option>
                    <option value="StandardBank">Standard Bank</option>
                    <option value="Nedbank">Nedbank</option>
                    <option value="ABSA">ABSA</option>
                  </select>
                  <p className="text-[10px] text-gray-500 mt-2">You will be redirected to your secure {eftBank} online banking authorization page.</p>
                </div>
              )}

              <button
                onClick={triggerSimulatePayment}
                disabled={isProcessingPayment}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {isProcessingPayment ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    Authorize R350 Payment
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
