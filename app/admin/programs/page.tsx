import { getAdminPrograms } from "@/app/admin/programs/actions";
import ProgramsClient from "@/components/admin/programs/ProgramsClient";
import { Metadata } from "next";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Manage Programs | Smart In English Admin",
  description: "Manage programs and sub-programs.",
};

export const dynamic = "force-dynamic";

export default async function ProgramsAdminPage() {
  const programs = await getAdminPrograms();
  
  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Kelola Program</h1>
            <p className="text-sm text-slate-500">
              Atur data program dan sub program SMART in ENGLISH
            </p>
          </div>
        </div>
      </div>
      <ProgramsClient initialPrograms={programs} />
    </div>
  );
}
