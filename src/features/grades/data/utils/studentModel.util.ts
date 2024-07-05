import { StudentType } from "@fcai-sis/shared-models";

export const studentLocalizedFields: {
  [key in keyof Omit<StudentType, "user" | "bylaw">]: {
    ar: string;
    en: string;
  };
} = {
  address: {
    ar: "العنوان",
    en: "Address",
  },
  administration: {
    ar: "الادارة",
    en: "Administration",
  },
  birthDay: {
    ar: "يوم الميلاد",
    en: "Birth Day",
  },
  birthMonth: {
    ar: "شهر الميلاد",
    en: "Birth Month",
  },
  birthPlace: {
    ar: "محل الميلاد",
    en: "Birth Place",
  },
  birthYear: {
    ar: "سنة الميلاد",
    en: "Birth Year",
  },
  directorate: {
    ar: "المديرية",
    en: "Directorate",
  },
  educationType: {
    ar: "نوع التعليم",
    en: "Education Type",
  },
  fullName: {
    ar: "الاسم الكامل",
    en: "Full Name",
  },
  gender: {
    ar: "الجنس",
    en: "Gender",
  },
  governorateId: {
    ar: "رقم المحافظة",
    en: "Governorate ID",
  },
  nationalId: {
    ar: "الرقم القومي",
    en: "National ID",
  },
  nationality: {
    ar: "الجنسية",
    en: "Nationality",
  },
  phoneNumber: {
    ar: "رقم الهاتف",
    en: "Phone Number",
  },
  religion: {
    ar: "الديانة",
    en: "Religion",
  },
  scientificDivision: {
    ar: "الشعبة العلمية",
    en: "Scientific Division",
  },
  studentId: {
    ar: "رقم الطالب",
    en: "Student ID",
  },
};
