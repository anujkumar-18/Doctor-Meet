import PageHeader from "@/components/page-header";
import { Stethoscope } from "lucide-react";
import React, { Children } from "react";

export const metdata = {
  title: "Doctor Dashboard - DocMeet",
  description: "Manage your appointments and availability",
};

const DoctorDashboardLayout = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader icon={<Stethoscope/>} title={"Doctor Dashboard"}/>

      {Children}
    </div>
  );
};

export default DoctorDashboardLayout;